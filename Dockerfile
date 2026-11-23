# syntax=docker/dockerfile:1
# Verified official multi-platform Node 24 image, pinned for reproducible builds.
FROM node:24-bookworm-slim@sha256:dc26ae92c9fb15cf6b1d63e20f0944b2efe0f115b20e00be48fb23fceb061c54 AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS dependencies
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-fund --no-audit

FROM base AS development
ENV NODE_ENV=development HOSTNAME=0.0.0.0 PORT=3000
COPY --from=dependencies --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node . .
RUN mkdir -p /app/media && chown node:node /app /app/media
USER node
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0", "--port", "3000"]

FROM development AS tooling
ENV NODE_ENV=production
CMD ["/bin/sh", "/app/scripts/cms-init.sh"]

FROM base AS builder
ARG SITE_URL=https://gunayturan.com.tr
ENV NODE_ENV=production SITE_URL=${SITE_URL} NEXT_OUTPUT_STANDALONE=1
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN node scripts/validate-build-env.mjs && npm run build

FROM base AS runner
ENV NODE_ENV=production HOSTNAME=0.0.0.0 PORT=3000
LABEL org.opencontainers.image.source="https://github.com/Mert3rS/diyet"
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/src/migrations ./src/migrations
COPY --chown=node:node scripts/docker-entrypoint.sh scripts/docker-healthcheck.mjs scripts/validate-production-env.mjs ./scripts/
COPY --chown=node:node scripts/lib/ops.mjs ./scripts/lib/ops.mjs
RUN mkdir -p .next/cache media && chown node:node .next/cache media
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=6s --start-period=20s --retries=3 CMD ["node", "scripts/docker-healthcheck.mjs"]
CMD ["/bin/sh", "/app/scripts/docker-entrypoint.sh"]
