import { test, expect } from "@playwright/test";
import {
  filterSocialLinks,
  contactLinks as getContactLinks,
} from "../../src/lib/contact";

test("sosyal bağlantı filtresi güvensiz, boş ve gizli kayıtları çıkarır; sırayı korur", () => {
  const links = filterSocialLinks([
    { platform: "instagram", url: "javascript:alert(1)", visible: true },
    { platform: "whatsapp", url: "http://example.invalid", visible: true },
    {
      platform: "instagram",
      url: "https://example.invalid/hidden",
      visible: false,
    },
    { platform: "whatsapp", url: "", visible: true },
    {
      platform: "whatsapp",
      url: "https://example.invalid/first",
      visible: true,
    },
    {
      platform: "instagram",
      url: "https://example.invalid/second",
      visible: true,
    },
  ]);
  expect(links.map((link) => link.platform)).toEqual(["whatsapp", "instagram"]);
  expect(filterSocialLinks([])).toEqual([]);
});
test("örnek iletişim kaydı gerçek alıcıya yönlenmez", () => {
  expect(getContactLinks().available).toBe(false);
  expect(getContactLinks().whatsappBase).toBeNull();
  expect(getContactLinks().phone).toBe("#iletisim");
  expect(getContactLinks().email).toBe("#iletisim");
});
