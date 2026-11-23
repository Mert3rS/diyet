import { test, expect } from "@playwright/test";
import {
  filterSocialLinks,
  getContactLinks,
} from "../../src/lib/site-settings";

test("sosyal bağlantı filtresi güvensiz, boş ve gizli kayıtları çıkarır; sırayı korur", () => {
  const links = filterSocialLinks([
    { platform: "x", url: "javascript:alert(1)", visible: true },
    { platform: "youtube", url: "http://example.invalid", visible: true },
    {
      platform: "tiktok",
      url: "https://example.invalid/hidden",
      visible: false,
    },
    { platform: "facebook", url: "", visible: true },
    {
      platform: "linkedin",
      url: "https://example.invalid/first",
      visible: true,
    },
    {
      platform: "instagram",
      url: "https://example.invalid/second",
      visible: true,
    },
  ]);
  expect(links.map((link) => link.platform)).toEqual(["linkedin", "instagram"]);
  expect(filterSocialLinks([])).toEqual([]);
});
test("örnek iletişim kaydı gerçek alıcıya yönlenmez", () => {
  expect(getContactLinks().available).toBe(false);
  expect(getContactLinks().whatsappBase).toBeNull();
  expect(getContactLinks().phone).toBe("#iletisim");
  expect(getContactLinks().email).toBe("#iletisim");
});
