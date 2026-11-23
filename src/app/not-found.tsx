import Link from "next/link";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <main id="ana-icerik" tabIndex={-1}>
      <Container className="not-found">
        <p className="eyebrow">Sayfa bulunamadı</p>
        <h1>
          Burada henüz
          <br />
          bir sayfa yok.
        </h1>
        <Link className="button" href="/">
          Ana sayfaya dön
        </Link>
      </Container>
    </main>
  );
}
