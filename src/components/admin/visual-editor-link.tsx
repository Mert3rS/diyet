import Link from "next/link";
import { MousePointer2 } from "lucide-react";

export function VisualEditorLink() {
  return (
    <Link className="admin-visual-nav" href="/admin/visual-editor">
      <MousePointer2 size={18} aria-hidden="true" /> Görsel düzenleyici
    </Link>
  );
}
