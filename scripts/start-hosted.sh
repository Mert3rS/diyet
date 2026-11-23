#!/bin/sh
set -eu

# Render Free has a 512 MB runtime. The build runs separately with its own heap.
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=320}"
node scripts/validate-production-env.mjs
npm run cms:migrate
npm run cms:seed
exec node node_modules/next/dist/bin/next start --hostname 0.0.0.0 --port "${PORT:-10000}"
