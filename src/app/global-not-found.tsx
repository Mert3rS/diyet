import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Sayfa bulunamadı · Günay Turan",
  robots: { index: false, follow: false },
};
export default function NotFound() {
  return (
    <html lang="tr">
      <body
        style={{
          margin: 0,
          background: "#f6f1e7",
          color: "#10261e",
          fontFamily: "system-ui,sans-serif",
        }}
      >
        <main style={{ maxWidth: 800, margin: "15vh auto", padding: "2rem" }}>
          <p>Sayfa bulunamadı</p>
          <h1
            style={{
              fontFamily: "Georgia,serif",
              fontSize: "clamp(2.5rem,6vw,4rem)",
            }}
          >
            Burada henüz
            <br />
            bir sayfa yok.
          </h1>
          <Link
            style={{
              display: "inline-block",
              padding: "1rem 1.5rem",
              background: "#10261e",
              color: "#f6f1e7",
              borderRadius: 50,
            }}
            href="/"
          >
            Ana sayfaya dön
          </Link>
        </main>
      </body>
    </html>
  );
}
