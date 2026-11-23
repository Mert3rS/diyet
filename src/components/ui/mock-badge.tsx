import { USE_MOCK_CONTENT } from "@/config/site";
export function MockBadge() {
  if (!USE_MOCK_CONTENT || process.env.NODE_ENV === "production") return null;
  return <span className="mock-badge">Örnek içerik</span>;
}
