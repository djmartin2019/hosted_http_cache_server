# HTTP edge cache (lab)

A small **HTTP caching edge** in front of an **origin** that talks to the GitHub API, plus a **React** UI to look up public profiles. The point of the repo is to experiment with cache hits, TTL, and stale-while-refresh patterns—without a heavy framework.

If you are here to run it locally or ship it on a VPS, you are in the right place.

---

## What you get

| Piece | Role |
|--------|------|
| **Origin** | Node HTTP server on **port 4000**. Serves `GET /dev/:username` and returns a trimmed JSON payload from GitHub. |
| **Edge** | Node HTTP server on **port 3000**. Proxies to the origin, caches responses in memory, and can serve stale data while refreshing in the background. |
| **Frontend** | Vite + React app. Lookup on `/`, shareable “business card” profile on `/u/:username` (same `/dev/:username` API). |

Together they behave like a tiny “CDN-ish” stack you can reason about in one afternoon.

---

## How requests flow

```text
Browser  →  (dev: Vite proxy) /dev/:user  →  Edge :3000  →  Origin :4000  →  GitHub API
```

In production Docker, Nginx serves the static UI and forwards `/dev/*` to the edge service—same paths, same idea.

---

## Prerequisites

- **Node.js** 18+ (22 matches the Docker images)  
- **npm** for the frontend

There are no npm dependencies on the root `package.json`; the edge and origin servers use Node’s built-in `http` and `fetch`.

---

## Run it locally

You need **three terminals** (or tmux panes): origin first, then edge, then the UI.

**1. Origin**

```bash
npm run start:origin
```

**2. Edge** (in another shell)

```bash
npm run start:edge
```

**3. Frontend**

```bash
cd frontend
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). The dev server **proxies** `/dev/*` to `http://localhost:3000`, so you avoid CORS headaches while hacking on the UI.

Share a profile: open **`/u/octocat`** (or any username) for a centered card view with optional cache metadata from response headers.

**Link previews (Open Graph):** In production, **`GET /u/:username`** returns the SPA HTML with crawler-facing `og:*` / `twitter:*` tags, and **`GET /og/:username.png`** serves a generated 1200×630 PNG card (satori + resvg on the origin, edge-cached). Run `cd frontend && npm run build` before `npm run start:origin` so `frontend/dist/index.html` exists for meta injection.

---

## API shape

`GET /dev/:username` (through the edge, or directly on the origin in a pinch) returns JSON roughly like:

- `username`, `avatar_url`, `followers`, `following`, `public_repos`, `creation_date` (account age in years, as a string)

Errors come back as JSON with an `error` field when something goes wrong upstream.

---

## Docker on a VPS

For a **production-style** layout—Nginx + static build, edge, origin, healthchecks, and an internal Docker network—use:

```bash
docker compose up -d --build
```

The UI is published on **host port 8080** (so it plays nicely with Apache or anything else already on port 80). More detail, firewall notes, and optional **HTTPS** hints live in **[DOCKER.md](./DOCKER.md)**.

---

## Repository layout

```text
edge/          # Cache layer (port 3000 locally)
origin/        # GitHub-facing API (port 4000 locally)
frontend/      # React + Vite app
docker/        # Dockerfiles and Nginx config
docker-compose.yml
```

---

## Scripts (root)

| Command | What it does |
|---------|----------------|
| `npm run start:origin` | Starts the origin server |
| `npm run start:edge` | Starts the edge cache server |

Inside `frontend/`, use `npm run dev`, `npm run build`, and `npm run lint` as usual.

---

## Contributing mindset

Issues and PRs are welcome if you extend the cache behavior or harden the deployment story. Keep changes focused and easy to review—this project is intentionally small.

Enjoy the lab, and may your cache hit ratio make you smile.
