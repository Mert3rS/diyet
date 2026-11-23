import {
  loadProductionEnvironment,
  readJson,
  validateProductionEnvironment,
} from "./lib/ops.mjs";

try {
  const errors = validateProductionEnvironment(
    loadProductionEnvironment(),
    Boolean(readJson("package.json").dependencies?.payload),
  );
  if (errors.length) {
    for (const error of errors) console.error(`[ORTAM_HATASI] ${error}`);
    process.exitCode = 1;
  } else
    console.log(
      "Production ortam denetimi geçti. Bu sonuç yayın onayı değildir; launch:audit ayrıca çalıştırılmalı.",
    );
} catch {
  console.error(
    "[ORTAM_HATASI] Ortam dosyası veya proje yapılandırması okunamadı. Değerler güvenlik nedeniyle yazdırılmadı.",
  );
  process.exitCode = 1;
}
