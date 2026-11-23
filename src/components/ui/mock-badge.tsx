export function MockBadge({ enabled = true }: { enabled?: boolean }) {
  if (!enabled || process.env.NODE_ENV === "production") return null;
  return <span className="mock-badge">Örnek içerik</span>;
}
