# Docker production deployment

## Layout

```text
project-root/
├── app/                         # Existing Next.js App Router source
├── components/                  # Existing Next.js components
├── lib/                         # Existing application libraries
├── public/                      # Existing static assets
├── next.config.mjs              # Includes output: standalone
├── package.json
├── package-lock.json
├── nextjs/
│   └── Dockerfile
├── wordpress/
│   └── php.ini
├── nginx/
│   ├── conf.d/
│   │   └── app.conf
│   └── certs/
│       ├── app.crt              # Supplied by operator; not committed
│       ├── app.key              # Supplied by operator; not committed
│       ├── admin.crt            # Supplied by operator; not committed
│       └── admin.key            # Supplied by operator; not committed
├── .dockerignore
├── .env                         # Production secrets; not committed
├── .env.example
├── docker-compose.yml
└── DEPLOYMENT.md
```

## TLS certificates

Use full-chain PEM certificates. Save the frontend pair as
`nginx/certs/app.crt` and `nginx/certs/app.key`; save the WordPress pair as
`nginx/certs/admin.crt` and `nginx/certs/admin.key`. Compose mounts the whole
directory read-only at `/etc/nginx/certs`.

For local-only testing, create self-signed certificates from the project root:

```bash
mkdir -p nginx/certs
openssl req -x509 -nodes -newkey rsa:3072 -sha256 -days 30 \
  -keyout nginx/certs/app.key -out nginx/certs/app.crt \
  -subj "/CN=app.example.com" \
  -addext "subjectAltName=DNS:app.example.com"
openssl req -x509 -nodes -newkey rsa:3072 -sha256 -days 30 \
  -keyout nginx/certs/admin.key -out nginx/certs/admin.crt \
  -subj "/CN=admin.example.com" \
  -addext "subjectAltName=DNS:admin.example.com"
chmod 600 nginx/certs/*.key
```

Self-signed certificates cause browser warnings and must not be used in
production. Ensure the real certificate SANs match the two domains and renew
them before expiration.

## Deploy

1. Clone the repository and enter it:

   ```bash
   git clone <repository-url> fullstack-app
   cd fullstack-app
   ```

2. Create the environment file, replace every placeholder, and generate unique
   secrets. The WordPress database name/user/password must match MySQL:

   ```bash
   cp .env.example .env
   openssl rand -base64 48
   openssl rand -hex 32
   chmod 600 .env
   ${EDITOR:-vi} .env
   ```

3. Put the four certificate files in `nginx/certs/` as described above, then
   restrict the private keys:

   ```bash
   chmod 600 nginx/certs/*.key
   ```

4. Verify DNS for `APP_DOMAIN` and `ADMIN_DOMAIN` points to this host. Open only
   TCP ports 80 and 443 at the host firewall. Then validate and start the stack:

   ```bash
   docker compose config --quiet
   docker compose up -d --build
   ```

5. Confirm container health and inspect startup logs if anything is not healthy:

   ```bash
   docker compose ps
   docker compose logs --tail=100 mysql wordpress nextjs nginx
   curl -I http://app.example.com
   curl -I https://app.example.com
   curl -I https://admin.example.com/wp-admin/install.php
   ```

6. Open `https://admin.example.com/wp-admin/install.php` and complete the
   WordPress setup wizard. Use a unique administrator username (not `admin`), a
   strong password, and an operational administrator email address.

After WordPress is initialized, rebuild the Next.js image once so statically
generated blog content can be populated from the new CMS:

```bash
docker compose up -d --build nextjs nginx
```

## Operations and backups

Named volumes persist across `docker compose down` and container replacement.
Do not use `docker compose down -v` in production; `-v` deletes the database and
WordPress volumes. Back up the database, WordPress installation state, and media
independently:

```bash
docker compose exec -T mysql sh -c \
  'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" mysqldump -uroot --single-transaction --routines --triggers "$MYSQL_DATABASE"' \
  > wordpress-$(date +%F).sql

docker run --rm -v fullstack-app_wordpress_uploads:/data:ro \
  -v "$PWD/backups:/backup" alpine \
  tar -czf /backup/wordpress-uploads-$(date +%F).tar.gz -C /data .

docker run --rm -v fullstack-app_wordpress_data:/data:ro \
  -v "$PWD/backups:/backup" alpine \
  tar -czf /backup/wordpress-data-$(date +%F).tar.gz -C /data .
```

Test restores regularly. Pin the container images to reviewed immutable digests
in regulated environments and update them through a staged maintenance process.
