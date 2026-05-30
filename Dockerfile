# syntax=docker/dockerfile:1

# ---- Base ----
# Node 22 = current LTS supported by Next 16 (which requires >=20.9.0).
# Node 20 reached end-of-life in April 2026, so it's avoided here.
FROM node:22-alpine AS base

# ---- Dependencies ----
# Install deps separately so this layer is cached unless package*.json change.
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- Build ----
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- Runtime ----
# Only the standalone output + static assets end up in the final image.
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Run as a non-root user.
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Public assets (served by the standalone server when present alongside it).
COPY --from=builder /app/public ./public

# The standalone server + the only node_modules it actually needs.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Static chunks (_next/static) are NOT in standalone by default — copy them in.
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# The container always listens on 3000 internally; the host port is mapped
# in docker-compose.yml. Keep this in sync with the EXPOSE/healthcheck.
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
