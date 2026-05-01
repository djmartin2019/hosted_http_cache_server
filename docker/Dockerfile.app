# Node services: origin (GitHub + OG + HTML shell) and edge (cache). Same image, different command in Compose.
# Stage 1: production frontend build (origin serves frontend/dist for /u meta injection).
FROM node:22-alpine AS frontend-build
WORKDIR /build
COPY frontend/package.json frontend/package-lock.json ./frontend/
WORKDIR /build/frontend
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: runtime — install root deps (satori, resvg, react, fontsource), copy edge + origin + built SPA
FROM node:22-alpine
RUN apk add --no-cache curl
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY origin ./origin
COPY edge ./edge
COPY --from=frontend-build /build/frontend/dist ./frontend/dist
