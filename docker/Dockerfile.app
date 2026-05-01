# Node services: origin (GitHub + OG + HTML shell) and edge (cache). Same image, different command in Compose.
# Stage 1: production frontend build (origin serves frontend/dist for /u meta injection).
FROM node:22-alpine AS frontend-build
WORKDIR /build
COPY frontend/package.json frontend/package-lock.json ./frontend/
WORKDIR /build/frontend
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: runtime — glibc (Debian) so @resvg/resvg-js native bindings work reliably (Alpine/musl often 500s at render time).
FROM node:22-bookworm-slim
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl ca-certificates \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY origin ./origin
COPY edge ./edge
COPY --from=frontend-build /build/frontend/dist ./frontend/dist
