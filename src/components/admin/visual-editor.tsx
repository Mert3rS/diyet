"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Gutter } from "@payloadcms/ui";
import {
  Check,
  ImagePlus,
  LoaderCircle,
  Monitor,
  MousePointer2,
  RotateCcw,
  Save,
  Smartphone,
  Sparkles,
  Upload,
} from "lucide-react";
import {
  editorSections,
  readEditorPath,
  visualFields,
  writeEditorPath,
  type EditorDocuments,
  type EditorGlobal,
  type EditorMedia,
  type VisualChange,
  type VisualField,
} from "@/lib/visual-editor";

type Changes = Record<string, VisualChange>;
const initialSelection = "homepage:copy.hero.first";
const globalLabels = {
  homepage: "Ana sayfa",
  "site-settings": "Site ayarları",
};
function mediaValue(value: unknown): EditorMedia | null {
  return value && typeof value === "object" && "id" in value && "url" in value
    ? (value as EditorMedia)
    : null;
}
async function responseData(response: Response) {
  const data = await response.json();
  if (!response.ok)
    throw new Error(
      data.errors?.[0]?.message ||
        data.message ||
        "İşlem tamamlanamadı. Lütfen yeniden deneyin.",
    );
  return data;
}

export function VisualEditor() {
  const [documents, setDocuments] = useState<EditorDocuments | null>(null);
  const [changes, setChanges] = useState<Changes>({});
  const [previewPatches, setPreviewPatches] = useState<Changes>({});
  const committed = useRef<Changes>({});
  const [selectedId, setSelectedId] = useState(initialSelection);
  const [mode, setMode] = useState<"desktop" | "mobile">("desktop");
  const [ready, setReady] = useState(0);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [media, setMedia] = useState<EditorMedia[]>([]);
  const [mediaPage, setMediaPage] = useState(1);
  const [hasMoreMedia, setHasMoreMedia] = useState(false);
  const [uploadAlt, setUploadAlt] = useState("");
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 660 });
  const iframe = useRef<HTMLIFrameElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const fields = useMemo(
    () => (documents ? visualFields(documents) : []),
    [documents],
  );
  const selected = fields.find((field) => field.id === selectedId);
  const dirtyCount = Object.keys(changes).length;
  const currentValue =
    selected && documents
      ? changes[selected.id]
        ? changes[selected.id].value
        : readEditorPath(documents[selected.global], selected.path)
      : "";
  const currentMedia = mediaValue(currentValue);
  const width = mode === "desktop" ? 1440 : 390;
  const scale = Math.min(1, Math.max(240, canvasSize.width - 32) / width);
  const height = Math.max(360, canvasSize.height - 32);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/media?limit=12&page=1&sort=-createdAt", {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(responseData)
      .then((data) => {
        setMedia(data.docs);
        setHasMoreMedia(data.hasNextPage);
      })
      .catch((reason) => {
        if (!controller.signal.aborted) setError(reason.message);
      });
    Promise.all(
      (["homepage", "site-settings"] as const).map(
        async (slug) =>
          [
            slug,
            await responseData(
              await fetch(`/api/globals/${slug}?depth=1`, {
                signal: controller.signal,
                cache: "no-store",
              }),
            ),
          ] as const,
      ),
    )
      .then((entries) =>
        setDocuments(Object.fromEntries(entries) as EditorDocuments),
      )
      .catch((reason) => {
        if (!controller.signal.aborted) setError(reason.message);
      });
    return () => controller.abort();
  }, []);

  const loadMedia = useCallback(async (page: number) => {
    try {
      const data = await responseData(
        await fetch(`/api/media?limit=12&page=${page}&sort=-createdAt`, {
          cache: "no-store",
        }),
      );
      setMedia((previous) =>
        page === 1 ? data.docs : [...previous, ...data.docs],
      );
      setMediaPage(page);
      setHasMoreMedia(data.hasNextPage);
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Görseller yüklenemedi.",
      );
    }
  }, []);
  useEffect(() => {
    if (!canvas.current) return;
    const observer = new ResizeObserver((entries) =>
      setCanvasSize({
        width: entries[0].contentRect.width,
        height: entries[0].contentRect.height,
      }),
    );
    observer.observe(canvas.current);
    return () => observer.disconnect();
  }, [documents]);
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (
        event.origin !== location.origin ||
        event.source !== iframe.current?.contentWindow ||
        event.data?.source !== "gunay-preview"
      )
        return;
      if (event.data.type === "ready") setReady((previous) => previous + 1);
      if (
        event.data.type === "select" &&
        fields.some((field) => field.id === event.data.id)
      )
        setSelectedId(event.data.id);
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [fields]);
  useEffect(() => {
    if (ready)
      iframe.current?.contentWindow?.postMessage(
        {
          source: "gunay-editor",
          type: "update",
          fields,
          changes: Object.values(previewPatches),
          selected: selectedId,
        },
        location.origin,
      );
  }, [ready, fields, previewPatches, selectedId]);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    if (dirtyCount) window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirtyCount]);

  function select(field: VisualField) {
    setSelectedId(field.id);
    setNotice("");
    iframe.current?.contentWindow?.postMessage(
      { source: "gunay-editor", type: "focus", id: field.id },
      location.origin,
    );
  }
  function update(field: VisualField, value: unknown) {
    if (!documents) return;
    const change = { field, value };
    const original = readEditorPath(documents[field.global], field.path);
    const same =
      field.type === "image"
        ? mediaValue(original)?.id === mediaValue(value)?.id
        : original === value;
    setChanges((previous) => {
      const next = { ...previous };
      if (same) delete next[field.id];
      else next[field.id] = change;
      return next;
    });
    setPreviewPatches((previous) => ({ ...previous, [field.id]: change }));
    setNotice("");
    setError("");
  }
  function resetField() {
    if (!selected) return;
    setChanges((previous) => {
      const next = { ...previous };
      delete next[selected.id];
      return next;
    });
    setPreviewPatches((previous) => {
      const next = { ...previous };
      if (committed.current[selected.id])
        next[selected.id] = committed.current[selected.id];
      else delete next[selected.id];
      return next;
    });
  }
  async function save() {
    if (!documents || !dirtyCount || saving) return;
    setSaving(true);
    setError("");
    setNotice("");
    const saved: string[] = [];
    try {
      for (const global of ["homepage", "site-settings"] as EditorGlobal[]) {
        const pending = Object.values(changes).filter(
          (change) => change.field.global === global,
        );
        if (!pending.length) continue;
        const latest = await responseData(
          await fetch(`/api/globals/${global}?depth=1`, { cache: "no-store" }),
        );
        if (latest.updatedAt !== documents[global].updatedAt)
          throw new Error(
            `${globalLabels[global]} başka bir sekmede değiştirildi. Çalışmanı korumak için kaydetme durduruldu. Güncel siteyi yeni sekmede kontrol et.`,
          );
        const draft = structuredClone(latest);
        for (const { field, value } of pending) {
          if (
            field.type === "text" &&
            (typeof value !== "string" ||
              /[<>\u0000-\u0008]/.test(value) ||
              value.length > (field.maxLength ?? 150))
          )
            throw new Error(
              `${field.label}: Düz metin kullanın ve karakter sınırını aşmayın.`,
            );
          writeEditorPath(
            draft,
            field.path,
            field.type === "image" ? (mediaValue(value)?.id ?? null) : value,
          );
        }
        const roots = [
          ...new Set(pending.map((change) => change.field.path.split(".")[0])),
        ];
        const body = Object.fromEntries(
          roots.map((root) => [root, draft[root]]),
        );
        if (body.photos)
          body.photos = Object.fromEntries(
            Object.entries(body.photos as Record<string, unknown>).map(
              ([key, value]) => [key, mediaValue(value)?.id ?? value],
            ),
          );
        await responseData(
          await fetch(`/api/globals/${global}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }),
        );
        const fresh = await responseData(
          await fetch(`/api/globals/${global}?depth=1`, { cache: "no-store" }),
        );
        setDocuments((previous) =>
          previous ? { ...previous, [global]: fresh } : previous,
        );
        for (const change of pending) {
          committed.current[change.field.id] = change;
          saved.push(change.field.id);
        }
        setChanges((previous) =>
          Object.fromEntries(
            Object.entries(previous).filter(([id]) => !saved.includes(id)),
          ),
        );
      }
      setNotice("Değişikliklerin kaydedildi ve sitede yayınlandı.");
    } catch (reason) {
      setError(
        `${saved.length ? `${saved.length} alan kaydedildi. ` : ""}${reason instanceof Error ? reason.message : "Kaydetme tamamlanamadı."}`,
      );
    } finally {
      setSaving(false);
    }
  }
  async function upload(file: File | undefined) {
    if (!file || !selected || selected.type !== "image") return;
    if (!uploadAlt.trim()) {
      setError("Fotoğrafı yüklemeden önce görsel açıklamasını yaz.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Görsel en fazla 8 MB olabilir.");
      return;
    }
    setUploading(true);
    setError("");
    const field = selected;
    try {
      const body = new FormData();
      body.append("_payload", JSON.stringify({ alt: uploadAlt.trim() }));
      body.append("file", file);
      const data = await responseData(
        await fetch("/api/media", { method: "POST", body }),
      );
      update(field, data.doc);
      setUploadAlt("");
      await loadMedia(1);
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Görsel yüklenemedi.",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <Gutter className="visual-editor">
      <div className="ve-heading">
        <div>
          <p className="admin-kicker">
            <Sparkles size={15} aria-hidden="true" /> TASARIMIN İÇİNDEN DÜZENLE
          </p>
          <h1>Gör, dokun, güncelle.</h1>
          <p>
            Yazıları ve fotoğrafları sitenin üzerinde seç. Değişikliklerini
            anında gör.
          </p>
        </div>
        <Link
          className="ve-back"
          href="/admin"
          onClick={(event) => {
            if (
              dirtyCount &&
              !window.confirm(
                "Kaydedilmemiş değişikliklerin var. Düzenleyiciden çıkılsın mı?",
              )
            )
              event.preventDefault();
          }}
        >
          Yönetim merkezine dön
        </Link>
      </div>
      <div className="ve-toolbar">
        <div
          className="ve-device-switch"
          role="group"
          aria-label="Önizleme boyutu"
        >
          <button
            type="button"
            aria-pressed={mode === "desktop"}
            onClick={() => setMode("desktop")}
          >
            <Monitor size={17} aria-hidden="true" /> Masaüstü
          </button>
          <button
            type="button"
            aria-pressed={mode === "mobile"}
            onClick={() => setMode("mobile")}
          >
            <Smartphone size={17} aria-hidden="true" /> Mobil
          </button>
        </div>
        <span className="ve-save-state" aria-live="polite">
          {dirtyCount
            ? `${dirtyCount} alan değiştirildi · Henüz yayınlanmadı`
            : "Değişiklikler kaydedildiğinde siteye yansır"}
        </span>
        <button
          type="button"
          className="ve-save"
          disabled={!dirtyCount || saving || uploading}
          onClick={() => void save()}
        >
          {saving ? (
            <LoaderCircle className="ve-spinner" size={18} aria-hidden="true" />
          ) : (
            <Save size={18} aria-hidden="true" />
          )}
          {saving ? "Kaydediliyor…" : "Değişiklikleri kaydet"}
        </button>
      </div>
      {error && (
        <div className="ve-message ve-message--error" role="alert">
          {error}
        </div>
      )}
      {notice && (
        <div className="ve-message ve-message--success" role="status">
          <Check size={18} aria-hidden="true" />
          {notice}
        </div>
      )}
      {!documents ? (
        <div className="ve-loading" role="status">
          <LoaderCircle className="ve-spinner" size={24} aria-hidden="true" />
          {error
            ? "İçerik yüklenemedi. Sayfayı yenileyerek tekrar deneyebilirsin."
            : "İçeriklerin hazırlanıyor…"}
        </div>
      ) : (
        <div className="ve-workspace">
          <div className="ve-preview-panel">
            <div className="ve-preview-caption">
              <MousePointer2 size={15} aria-hidden="true" />
              <span>Düzenlemek istediğin yazıya veya fotoğrafa tıkla</span>
              <a href="/" target="_blank" rel="noopener noreferrer">
                Siteyi aç
              </a>
            </div>
            <div className="ve-canvas" ref={canvas}>
              <div
                className={`ve-viewport ve-viewport--${mode}`}
                style={{ width: width * scale, height }}
              >
                <iframe
                  ref={iframe}
                  title="Düzenlenebilir site önizlemesi"
                  src="/?editor=1"
                  style={{
                    width,
                    height: height / scale,
                    transform: `scale(${scale})`,
                  }}
                  onLoad={() => setReady((previous) => previous + 1)}
                />
              </div>
            </div>
          </div>
          <aside
            className="ve-inspector"
            aria-label="Seçili alanı düzenle"
            aria-busy={saving || uploading}
          >
            <div className="ve-inspector-title">
              <span>
                <MousePointer2 size={17} aria-hidden="true" />
              </span>
              <div>
                <h2>Alanı düzenle</h2>
                <p>Sayfadan seç veya listeden bul.</p>
              </div>
            </div>
            <label htmlFor="ve-section">Bölüm</label>
            <select
              id="ve-section"
              value={selected?.section ?? "Açılış"}
              disabled={saving || uploading}
              onChange={(event) => {
                const field = fields.find(
                  (item) => item.section === event.target.value,
                );
                if (field) select(field);
              }}
            >
              {editorSections
                .filter((section) =>
                  fields.some((field) => field.section === section),
                )
                .map((section) => (
                  <option key={section}>{section}</option>
                ))}
            </select>
            <label htmlFor="ve-field">Düzenlenecek alan</label>
            <select
              id="ve-field"
              value={selectedId}
              disabled={saving || uploading}
              onChange={(event) => {
                const field = fields.find(
                  (item) => item.id === event.target.value,
                );
                if (field) select(field);
              }}
            >
              {fields
                .filter((field) => field.section === selected?.section)
                .map((field) => (
                  <option key={field.id} value={field.id}>
                    {field.label}
                  </option>
                ))}
            </select>
            {selected && (
              <div className="ve-field-editor" key={selected.id}>
                <div className="ve-field-heading">
                  <h3>{selected.label}</h3>
                  <span>
                    {selected.type === "image" ? "Fotoğraf" : "Metin"}
                  </span>
                </div>
                {selected.type === "text" ? (
                  <>
                    <label className="ve-sr-only" htmlFor="ve-text">
                      {selected.label}
                    </label>
                    <textarea
                      id="ve-text"
                      rows={7}
                      value={
                        typeof currentValue === "string" ? currentValue : ""
                      }
                      maxLength={selected.maxLength}
                      disabled={saving}
                      onChange={(event) => update(selected, event.target.value)}
                    />
                    <div className="ve-character-count">
                      {typeof currentValue === "string"
                        ? currentValue.length
                        : 0}{" "}
                      / {selected.maxLength}
                    </div>
                    <p className="ve-hint">
                      Yazdıkların yalnızca bu önizlemede değişir. Yayınlamak
                      için değişiklikleri kaydet.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="ve-current-photo">
                      {currentMedia ? (
                        <Image
                          src={currentMedia.url}
                          alt={currentMedia.alt}
                          width={300}
                          height={180}
                          unoptimized
                        />
                      ) : (
                        <div>
                          <ImagePlus size={32} aria-hidden="true" />
                          <span>Sitenin varsayılan görseli kullanılıyor.</span>
                        </div>
                      )}
                    </div>
                    {currentMedia && (
                      <p className="ve-hint">{currentMedia.alt}</p>
                    )}
                    <h4>Fotoğraflarından seç</h4>
                    <div className="ve-media-grid">
                      {media.map((image) => (
                        <button
                          key={image.id}
                          type="button"
                          aria-label={`${image.alt} görselini seç`}
                          aria-pressed={currentMedia?.id === image.id}
                          disabled={saving || uploading}
                          onClick={() => update(selected, image)}
                        >
                          <Image
                            src={image.url}
                            alt={image.alt}
                            width={140}
                            height={96}
                            unoptimized
                          />
                          {currentMedia?.id === image.id && (
                            <span>
                              <Check size={16} aria-hidden="true" />
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                    {!media.length && (
                      <p className="ve-hint">
                        Henüz fotoğraf yüklenmedi. İlk fotoğrafını aşağıdan
                        ekleyebilirsin.
                      </p>
                    )}
                    {hasMoreMedia && (
                      <button
                        className="ve-more"
                        type="button"
                        onClick={() => void loadMedia(mediaPage + 1)}
                      >
                        Daha fazla görsel göster
                      </button>
                    )}
                    <div className="ve-upload">
                      <h4>Yeni fotoğraf ekle</h4>
                      <label htmlFor="ve-alt">Görsel açıklaması</label>
                      <input
                        id="ve-alt"
                        type="text"
                        maxLength={240}
                        placeholder="Örn. Günay Turan portre fotoğrafı"
                        value={uploadAlt}
                        onChange={(event) => setUploadAlt(event.target.value)}
                        disabled={saving || uploading}
                      />
                      <label
                        className={`ve-upload-button ${saving || uploading ? "ve-upload-button--disabled" : ""}`}
                      >
                        <Upload size={17} aria-hidden="true" />
                        {uploading ? "Yükleniyor…" : "Fotoğraf yükle"}
                        <input
                          type="file"
                          aria-label="Yeni fotoğraf yükle"
                          accept="image/jpeg,image/png,image/webp,image/avif"
                          disabled={saving || uploading}
                          onChange={(event) => {
                            void upload(event.target.files?.[0]);
                            event.target.value = "";
                          }}
                        />
                      </label>
                      <p className="ve-hint">
                        JPG, PNG, WebP veya AVIF · En fazla 8 MB. Yüklenen
                        fotoğraf kütüphaneye eklenir; sayfadaki seçimin
                        kaydettiğinde yayınlanır.
                      </p>
                    </div>
                  </>
                )}
                <button
                  className="ve-reset"
                  type="button"
                  disabled={!changes[selected.id] || saving || uploading}
                  onClick={resetField}
                >
                  <RotateCcw size={15} aria-hidden="true" />
                  Bu alandaki değişikliği geri al
                </button>
              </div>
            )}
            <div className="ve-inspector-footer">
              <Check size={15} aria-hidden="true" />
              <p>
                Önizleme gerçek sitenin yerleşimini kullanır. Aynı görselin
                kullanıldığı diğer alanlar da birlikte güncellenir.
              </p>
            </div>
          </aside>
        </div>
      )}
    </Gutter>
  );
}
