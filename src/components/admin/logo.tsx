import { Activity } from "lucide-react";

export function AdminLogo() {
  return (
    <div className="admin-wordmark">
      <span className="admin-brand-symbol">
        <Activity size={27} aria-hidden="true" />
      </span>
      <div>
        Günay Turan <span>Beslenme & hareket</span>
      </div>
    </div>
  );
}
export function AdminIcon() {
  return (
    <span className="admin-monogram" role="img" aria-label="Günay Turan">
      <Activity size={22} aria-hidden="true" />
    </span>
  );
}
