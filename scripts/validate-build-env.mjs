import { validateProductionEnvironment } from "./lib/ops.mjs";
// Build is independent of DB and runtime secrets. CMS routes render dynamically.
if (validateProductionEnvironment(process.env, false).length) {
  console.error("[BUILD_ENV_ERROR] SITE_URL production kök adresi olmalı.");
  process.exitCode = 1;
}
