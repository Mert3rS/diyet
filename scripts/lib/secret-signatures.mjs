export function findSecretSignatures(text) {
  const findings = [];
  const signatures = [
    ["PRIVATE_KEY", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
    ["AWS_ACCESS_KEY", /\bAKIA[0-9A-Z]{16}\b/],
    [
      "GITHUB_TOKEN",
      /\b(?:gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{50,})\b/,
    ],
    ["API_TOKEN", /\bsk-[A-Za-z0-9]{32,}\b/],
  ];
  for (const [index, line] of text.split(/\r?\n/).entries()) {
    for (const [code, regex] of signatures)
      if (regex.test(line)) findings.push({ code, line: index + 1 });
    const assignment = line.match(
      /^\s*(?:export\s+)?(?:PAYLOAD_SECRET|DATABASE_URI|SMTP_PASSWORD|[A-Z_]*API_KEY)\s*=\s*["']?([^\r\n]+)$/,
    );
    if (
      assignment &&
      !/change|replace|example|placeholder|your_|^\s*$|^\s*#/i.test(
        assignment[1],
      )
    )
      findings.push({ code: "SECRET_ASSIGNMENT", line: index + 1 });
  }
  return findings;
}
