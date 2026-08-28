# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS deps
WORKDIR /app

# Some native Node modules require glibc compatibility on Alpine.
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* values are embedded in browser bundles during `next build`.
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_ASSET_BASE_URL
ARG NEXT_PUBLIC_ALLOW_INDEXING=false
ARG WORDPRESS_API_URL
ARG WORDPRESS_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_ASSET_BASE_URL=$NEXT_PUBLIC_ASSET_BASE_URL \
    NEXT_PUBLIC_ALLOW_INDEXING=$NEXT_PUBLIC_ALLOW_INDEXING \
    WORDPRESS_API_URL=$WORDPRESS_API_URL \
    WORDPRESS_SITE_URL=$WORDPRESS_SITE_URL

RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000

# The official Node image provides this unprivileged user (UID/GID 1000).
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node
EXPOSE 3000

CMD ["node", "server.js"]
