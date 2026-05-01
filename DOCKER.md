# Docker deployment (Hostinger VPS)

## What runs

| Service | Role |
|--------|------|
| **web** | Nginx (container :80, published as host **:8080**): SPA + `/dev/*`, `/u/*`, `/og/*` → edge (share HTML + OG PNG are edge-cached) |
| **edge** | Cache layer on port 3000 (internal only) |
| **origin** | Fetches GitHub on port 4000 (internal only) |

The edge service reaches origin via `ORIGIN_URL` (set in `docker-compose.yml`), not `localhost`, so container networking works.

The origin/runtime image uses **Debian bookworm-slim** (not Alpine) so the **`@resvg/resvg-js` native bindings** used for `/og/*.png` work reliably; Alpine often surfaced as HTTP 500 on OG renders.

After fixing OG issues, **restart the stack** (or wait out TTL) so the edge cache does not keep serving an older error response for `/og/*`.

## On the VPS

1. Install [Docker Engine](https://docs.docker.com/engine/install/) and the Compose plugin (often `docker compose` is bundled).

2. Clone the repo and from the **repository root** run:

   ```bash
   docker compose up -d --build
   ```

3. Open **HTTP port 8080** in the Hostinger firewall (hPanel) and, if you use `ufw` on the VM:

   ```bash
   sudo ufw allow 8080/tcp
   sudo ufw reload
   ```

4. Visit `http://YOUR_SERVER_IP:8080` in a browser (port **8080** avoids conflict with Apache on host port 80).

## Optional: HTTPS

Put a reverse proxy with TLS in front (Caddy, Traefik, or Hostinger’s proxy), or terminate TLS on the host and proxy to this stack on port **8080**.

## Building for AMD64 from Apple Silicon

If the VPS is `linux/amd64` and you build on an M-series Mac, some Compose versions do not support `docker compose build --platform`. Use either:

```bash
export DOCKER_DEFAULT_PLATFORM=linux/amd64
docker compose build
docker compose up -d
```

Or run a one-off build with Buildx, then compose up (images must already exist with the right architecture).

To hit origin from your shell (no angle brackets—use the real name from `docker compose ps`):

```bash
docker compose exec origin curl -fsS http://localhost:4000/
```

## Changing the public port

Edit `docker-compose.yml` under `web` → `ports`, e.g. `"9090:80"` to publish the UI on 9090.
