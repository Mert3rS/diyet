import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { parseEnv } from "node:util";
import path from "node:path";

const email = process.argv[process.argv.indexOf("--email") + 1];
if (
  !process.argv.includes("--email") ||
  !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)
) {
  console.error("--email ile ilk yönetici e-posta adresini belirtin.");
  process.exit(1);
}
const credentials = [];
for (const [environment, file, port] of [
  ["development", ".env.cms.local", 3001],
  ["production", ".env.cms.production", 3002],
]) {
  const target = path.resolve(file);
  if (!existsSync(target)) {
    const password = randomBytes(24).toString("hex");
    const values = {
      PAYLOAD_SECRET: randomBytes(48).toString("hex"),
      POSTGRES_USER: "diyet",
      POSTGRES_DB: "diyet",
      POSTGRES_PASSWORD: password,
      DATABASE_URI: `postgresql://diyet:${password}@db:5432/diyet`,
      CMS_ADMIN_EMAIL: email,
      CMS_ADMIN_PASSWORD: randomBytes(24).toString("base64url"),
      CMS_ENVIRONMENT: environment,
    };
    writeFileSync(
      target,
      Object.entries(values)
        .map(([key, value]) => `${key}=${value}`)
        .join("\n") + "\n",
      { mode: 0o600, flag: "wx" },
    );
  }
  const data = parseEnv(readFileSync(target, "utf8"));
  credentials.push(
    `Ortam: ${environment}\nPanel: http://localhost:${port}/admin\nE-posta: ${data.CMS_ADMIN_EMAIL}\nİlk şifre: ${data.CMS_ADMIN_PASSWORD}\n`,
  );
}
mkdirSync(".reports", { recursive: true });
writeFileSync(
  ".reports/admin-credentials.txt",
  `${credentials.join("\n")}\nİlk girişten sonra şifrenizi profilinizden değiştirin. Bu dosyayı paylaşmayın veya Git'e eklemeyin.\n`,
  { mode: 0o600 },
);
console.log(
  "CMS ortam dosyaları hazır. Giriş bilgileri: .reports/admin-credentials.txt (Git dışında). Mevcut ortam dosyaları değiştirilmedi.",
);
