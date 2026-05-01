# Node services: origin (GitHub upstream) and edge (cache). Same image, different command in Compose.
FROM node:22-alpine
RUN apk add --no-cache curl
WORKDIR /app

COPY package.json ./
COPY origin ./origin
COPY edge ./edge
