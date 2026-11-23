// CMS/database readiness; response contains no connection or account details.
try {
  const response = await fetch(
    `http://127.0.0.1:${process.env.PORT || "3000"}/api/health`,
    {
      redirect: "manual",
      signal: AbortSignal.timeout(5000),
    },
  );
  await response.body?.cancel();
  process.exitCode = response.status === 200 ? 0 : 1;
} catch {
  process.exitCode = 1;
}
