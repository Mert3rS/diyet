import { DefaultTemplate } from "@payloadcms/next/templates";
import { redirect } from "next/navigation";
import type { AdminViewServerProps } from "payload";
import { VisualEditor } from "./visual-editor";

export function VisualEditorView(props: AdminViewServerProps) {
  const { req, permissions, visibleEntities, locale } = props.initPageResult;
  if (
    !req.user ||
    !("role" in req.user) ||
    req.user.role !== "admin" ||
    !permissions.canAccessAdmin
  ) {
    redirect("/admin/login?redirect=%2Fadmin%2Fvisual-editor");
  }
  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={props.params}
      payload={req.payload}
      permissions={permissions}
      req={req}
      searchParams={props.searchParams}
      user={req.user}
      visibleEntities={{
        collections: [...visibleEntities.collections],
        globals: [...visibleEntities.globals],
      }}
    >
      <VisualEditor />
    </DefaultTemplate>
  );
}
