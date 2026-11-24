"use client";

import { useEffect } from "react";
import type {
  VisualField,
  VisualChange,
  EditorMedia,
} from "@/lib/visual-editor";

// This adapter runs only inside the visual editor's same-origin iframe.
// It changes that preview document; publishing always goes through Payload's API.
export function VisualPreviewBridge() {
  useEffect(() => {
    if (
      window.parent === window ||
      new URLSearchParams(location.search).get("editor") !== "1"
    )
      return;
    let fields: VisualField[] = [];
    let changes: VisualChange[] = [];
    let selected = "";
    let frame = 0;
    const patched = new Set<Element>();
    const originals = new Map<
      Element,
      { text: [Text, string][]; image?: string; markup?: string }
    >();
    document.documentElement.classList.add("visual-preview-mode");
    const send = (data: Record<string, unknown>) =>
      window.parent.postMessage(
        { source: "gunay-preview", ...data },
        location.origin,
      );
    const elements = (field: VisualField) =>
      field.selectors.flatMap((selector) => {
        if (field.type === "image")
          return Array.from(document.querySelectorAll<HTMLElement>(selector));
        const element = document.querySelector<HTMLElement>(selector);
        return element ? [element] : [];
      });
    function restore(element: Element) {
      const original = originals.get(element);
      if (!original) return;
      if (original.image !== undefined && element instanceof HTMLImageElement) {
        const attributes = JSON.parse(original.image) as Record<string, string>;
        for (const name of ["src", "srcset", "alt", "style"]) {
          if (attributes[name] === undefined) element.removeAttribute(name);
          else if (element.getAttribute(name) !== attributes[name])
            element.setAttribute(name, attributes[name]);
        }
      } else if (original.markup !== undefined) {
        if (element.innerHTML !== original.markup)
          element.innerHTML = original.markup;
      } else {
        for (const [node, value] of original.text)
          if (node.textContent !== value) node.textContent = value;
      }
    }
    function apply() {
      const patches = new Map(
        changes.map((change) => [change.field.id, change.value]),
      );
      for (const field of fields)
        for (const element of elements(field)) {
          if (
            element.dataset.editorField &&
            element.dataset.editorField !== field.id
          ) {
            originals.delete(element);
            patched.delete(element);
          }
          element.dataset.editorField = field.id;
          element.dataset.editorLabel = field.label;
          element.setAttribute(
            "title",
            `${field.label} · Düzenlemek için tıkla`,
          );
          element.toggleAttribute(
            "data-editor-selected",
            field.id === selected,
          );
          if (!originals.has(element)) {
            const text = Array.from(element.childNodes)
              .filter((node): node is Text => node.nodeType === Node.TEXT_NODE)
              .map((node): [Text, string] => [node, node.textContent ?? ""]);
            if (field.type === "image" && element instanceof HTMLImageElement)
              originals.set(element, {
                text,
                image: JSON.stringify(
                  Object.fromEntries(
                    Array.from(element.attributes)
                      .filter((a) =>
                        ["src", "srcset", "alt", "style"].includes(a.name),
                      )
                      .map((a) => [a.name, a.value]),
                  ),
                ),
              });
            else if (field.type === "image")
              originals.set(element, { text, markup: element.innerHTML });
            else originals.set(element, { text });
          }
          if (!patches.has(field.id)) {
            if (patched.has(element)) {
              restore(element);
              patched.delete(element);
            }
            continue;
          }
          const value = patches.get(field.id);
          patched.add(element);
          if (field.type === "text" && typeof value === "string") {
            const original = originals.get(element)!;
            if (!original.text.length) {
              const node = document.createTextNode("");
              element.prepend(node);
              original.text.push([node, ""]);
            }
            original.text.forEach(([node], index) => {
              const next = index === 0 ? value : "";
              if (node.textContent !== next) node.textContent = next;
            });
          } else if (
            field.type === "image" &&
            value &&
            typeof value === "object" &&
            "url" in value
          ) {
            const media = value as EditorMedia;
            const url = new URL(media.url, location.origin);
            if (url.origin !== location.origin) continue;
            let image =
              element instanceof HTMLImageElement
                ? element
                : element.querySelector("img");
            if (!image) {
              image = document.createElement("img");
              image.style.cssText =
                "position:absolute;inset:0;width:100%;height:100%;object-fit:cover";
              element.replaceChildren(image);
            }
            if (image.getAttribute("src") !== media.url) {
              image.removeAttribute("srcset");
              image.src = media.url;
              image.style.backgroundImage = "none";
            }
            if (image.alt !== media.alt) image.alt = media.alt;
          }
        }
    }
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(apply);
    };
    const receive = (event: MessageEvent) => {
      if (
        event.origin !== location.origin ||
        event.source !== window.parent ||
        event.data?.source !== "gunay-editor"
      )
        return;
      if (
        event.data.type === "update" &&
        Array.isArray(event.data.fields) &&
        Array.isArray(event.data.changes)
      ) {
        fields = event.data.fields;
        changes = event.data.changes;
        selected =
          typeof event.data.selected === "string" ? event.data.selected : "";
        apply();
      }
      if (event.data.type === "focus") {
        const field = fields.find((item) => item.id === event.data.id);
        if (!field) return;
        const slide = /data-sports-field="slides\.(\d+)\./.exec(
          field.selectors.join(" "),
        );
        if (slide)
          document
            .querySelectorAll<HTMLButtonElement>(".slide-tabs button")
            [Number(slide[1])]?.click();
        if (field.path.startsWith("recipes."))
          document
            .querySelectorAll<HTMLButtonElement>(".recipe-filters button")[0]
            ?.click();
        const audience = /data-sports-row="audiences\.(\d+)"/.exec(
          field.selectors.join(" "),
        );
        if (audience) {
          const button =
            document.querySelectorAll<HTMLButtonElement>(".audience-toggle")[
              Number(audience[1])
            ];
          if (button?.getAttribute("aria-expanded") !== "true") button?.click();
        }
        window.setTimeout(() => {
          const element = elements(field)[0];
          if (element) {
            element.closest("details")?.setAttribute("open", "");
            element.scrollIntoView({ block: "center", behavior: "instant" });
            selected = field.id;
            apply();
          }
        }, 220);
      }
    };
    const click = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const editable = target?.closest<HTMLElement>("[data-editor-field]");
      if (editable) {
        event.preventDefault();
        event.stopPropagation();
        selected = editable.dataset.editorField!;
        apply();
        send({ type: "select", id: selected });
      } else if (target?.closest('a[href]:not([href^="#"])')) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    window.addEventListener("message", receive);
    document.addEventListener("click", click, true);
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    send({ type: "ready" });
    return () => {
      window.removeEventListener("message", receive);
      document.removeEventListener("click", click, true);
      observer.disconnect();
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("visual-preview-mode");
    };
  }, []);
  return null;
}
