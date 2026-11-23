import { execFileSync } from "node:child_process";
import {
  existsSync,
  readFileSync,
  statSync,
  mkdirSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { repoRoot } from "./lib/ops.mjs";
import { findSecretSignatures } from "./lib/secret-signatures.mjs";

const options = {
  cwd: repoRoot,
  encoding: "utf8",
  stdio: ["pipe", "pipe", "pipe"],
  maxBuffer: 20 * 1024 * 1024,
};
function git(args) {
  return execFileSync("git", args, options);
}
function isText(file) {
  return (
    /\.(?:md|json|ya?ml|[cm]?js|tsx?|txt|ps1|sh|css|scss|toml|example)$/.test(
      file,
    ) || /^(?:\.env|Dockerfile$|\.dockerignore$)/.test(path.basename(file))
  );
}
try {
  const findings = [];
  const skipped = [];
  const files = git([
    "ls-files",
    "--cached",
    "--others",
    "--exclude-standard",
    "-z",
  ])
    .split("\0")
    .filter(Boolean);
  for (const file of files.filter(isText)) {
    const target = path.join(repoRoot, file);
    if (!existsSync(target) || !statSync(target).isFile()) continue;
    if (statSync(target).size > 2 * 1024 * 1024) {
      skipped.push(file);
      continue;
    }
    for (const finding of findSecretSignatures(readFileSync(target, "utf8")))
      findings.push({ location: "working_tree", file, ...finding });
  }
  const commits = git(["rev-list", "--all"]).split(/\r?\n/).filter(Boolean);
  const seen = new Set();
  for (const commit of commits) {
    const entries = git(["ls-tree", "-r", "-z", commit])
      .split("\0")
      .filter(Boolean);
    for (const entry of entries) {
      const match = entry.match(/^\d+ blob ([a-f0-9]+)\t(.+)$/s);
      if (!match || seen.has(match[1]) || !isText(match[2])) continue;
      seen.add(match[1]);
      const size = Number(git(["cat-file", "-s", match[1]]).trim());
      if (size > 2 * 1024 * 1024) {
        skipped.push(`history:${match[2]}`);
        continue;
      }
      for (const finding of findSecretSignatures(
        git(["cat-file", "blob", match[1]]),
      ))
        findings.push({
          location: "history",
          commit: commit.slice(0, 12),
          file: match[2],
          ...finding,
        });
    }
  }
  const report = {
    generatedAt: new Date().toISOString(),
    workingFiles: files.length,
    commits: commits.length,
    historyStatus: commits.length ? "scanned" : "not_done_no_commits",
    skipped,
    findings,
    limitation:
      "İmza tabanlı sınırlı taramadır; her sır türünü veya kişisel veriyi bulduğunu garanti etmez. Değerler rapora yazılmaz.",
  };
  mkdirSync(path.join(repoRoot, ".reports"), { recursive: true });
  writeFileSync(
    path.join(repoRoot, ".reports/secrets-audit.json"),
    JSON.stringify(report, null, 2),
  );
  for (const finding of findings)
    console.error(
      `[BULGU] ${finding.code}: ${finding.file}:${finding.line}; değer gizlendi.`,
    );
  console.log(
    `Sır imza taraması: ${files.length} çalışma dosyası, ${commits.length} commit, ${findings.length} bulgu, ${skipped.length} atlanan dosya. Commit yoksa geçmiş taraması yapılmış sayılmaz.`,
  );
  process.exitCode = findings.length || skipped.length ? 1 : 0;
} catch {
  console.error(
    "Sır taraması tamamlanamadı; Git/veri erişimini denetleyin. Hata ayrıntıları sır içerebileceği için yazdırılmadı.",
  );
  process.exitCode = 1;
}
