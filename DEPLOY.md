# Deployment — Docker + CI/CD to a VPS

How a push to `main` ends up live on the VPS:

```
git push main
   │
   ▼
GitHub Actions (.github/workflows/deploy.yml)
   ├─ build-and-push : docker build  →  push to ghcr.io/radovanrasha/portfolio-2026
   └─ deploy         : scp docker-compose.yml → VPS
                       ssh → docker login → docker compose pull → up -d
   │
   ▼
VPS: container "portfolio-2026" published on 127.0.0.1:2000
   │
   ▼
nginx (host) : your domain  →  proxy_pass 127.0.0.1:2000
```

The image is built **in GitHub Actions**, not on the VPS, so the server stays
light. The VPS only pulls a finished image and restarts.

---

## Which port goes in nginx? → **2000**

The container always listens on **3000** *internally*. `docker-compose.yml`
publishes that to **`127.0.0.1:2000`** on the VPS (mapping `2000:3000`,
localhost only — the public can't reach it directly; only nginx can). So the
host-facing port — the one nginx talks to — is **2000**:

```nginx
location / {
    proxy_pass http://127.0.0.1:2000;
}
```

A ready-to-use config is in [`deploy/nginx.conf.example`](deploy/nginx.conf.example).

Want a different host port? Set `HOST_PORT` on the VPS (e.g. in
`~/portfolio-2026/.env`: `HOST_PORT=8080`) and use the same number in nginx.
The internal `3000` never changes.

---

## One-time setup

### 1. GitHub repository secrets

Repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret         | Value                                                       |
| -------------- | ---------------------------------------------------------- |
| `VPS_HOST`     | VPS IP or hostname                                         |
| `VPS_USER`     | SSH user (e.g. `deploy` or `root`)                         |
| `VPS_SSH_KEY`  | **Private** SSH key whose public half is on the VPS        |
| `VPS_PORT`     | *(optional)* SSH port — defaults to `22`                  |

`GITHUB_TOKEN` is provided automatically; it pushes the image to GHCR and is
reused over SSH to authenticate the pull. No extra token needed.

Generate a deploy key (no passphrase):

```bash
ssh-keygen -t ed25519 -f deploy_key -N ""
# Public half → onto the VPS:
ssh-copy-id -i deploy_key.pub VPS_USER@VPS_HOST
# Private half (whole file incl. BEGIN/END lines) → paste into VPS_SSH_KEY
cat deploy_key
```

### 2. On the VPS (once)

```bash
# Docker + compose plugin
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker "$USER"   # then log out/in so `docker` works w/o sudo

# nginx
sudo apt update && sudo apt install -y nginx

# The deploy directory the workflow scps into
mkdir -p ~/portfolio-2026
```

The GHCR package is private by default. The workflow logs in over SSH with the
run's `GITHUB_TOKEN`, so pulls work without making the package public. (If you'd
rather not log in on every deploy, make the package public under
GitHub → your profile → Packages → portfolio-2026 → Package settings.)

### 3. nginx + domain + HTTPS

```bash
sudo cp deploy/nginx.conf.example /etc/nginx/sites-available/portfolio
# edit server_name to your real domain
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Point the domain's A record at the VPS IP, then:
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d radovanrasha.com -d www.radovanrasha.com
```

certbot rewrites the nginx file to add the `443`/TLS block and auto-renews.

---

## First deploy

Push to `main` (or run the workflow manually from the **Actions** tab via
*workflow_dispatch*). Watch it in **Actions**. When green, the container is
running on the VPS. Because port 2000 is bound to `127.0.0.1`, it is **not**
reachable at `http://VPS_IP:2000` from outside — that's intentional. It becomes
public only through nginx, on your domain, once DNS + certbot are done.

To sanity-check it on the VPS before nginx is set up, SSH in and run
`curl -I http://127.0.0.1:2000` — you should get `HTTP/1.1 200 OK`.

## Run the image locally (optional)

```bash
docker build -t portfolio-2026 .
docker run --rm -p 3000:3000 portfolio-2026
# → http://localhost:3000
```
