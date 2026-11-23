#!/bin/sh
set -eu

# Standalone node server skips npm's prestart; enforce the same guard here.
node scripts/validate-production-env.mjs
exec node server.js
