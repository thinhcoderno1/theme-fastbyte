# Fast Byte Demo - Tài liệu bàn giao và triển khai

Tài liệu này dành cho team Dev và Sysadmin triển khai website Fast Byte theo mô hình Headless WordPress. Không lưu mật khẩu, SSH credential, database password hoặc secret production trong repository.

## 1. Tổng quan hệ thống

Hệ thống gồm hai ứng dụng độc lập:

| Thành phần | Công nghệ | Domain demo | Runtime nội bộ |
| --- | --- | --- | --- |
| Frontend | Next.js 16.3.3, React 19.2.8 | `demo.truongthinhmedia.com` | PM2, `127.0.0.1:3100` |
| CMS | WordPress 6.8, PHP 8.3 Apache | `admin.truongthinhmedia.com` | Docker, `127.0.0.1:8080` |
| Database | MariaDB 11.4 | Không public | Docker network nội bộ |
| Reverse proxy | Nginx | HTTP/HTTPS | Port 80 và 443 |

Luồng truy cập:

```text
Người dùng
   |
   +-- demo.truongthinhmedia.com
   |      +-- Nginx -> Next.js/PM2 -> 127.0.0.1:3100
   |
   +-- admin.truongthinhmedia.com
          +-- Nginx -> WordPress Docker -> 127.0.0.1:8080
                                      +-- MariaDB Docker
```

Chỉ port `22`, `80` và `443` được phép public. Không public port `3100`, `8080` hoặc `3306`.

## 2. Phân công trách nhiệm

### Team Dev

- Bàn giao source code đầy đủ, `package-lock.json` và checksum của gói source.
- Kiểm tra `npm ci`, TypeScript và `npm run build` trước khi bàn giao.
- Cung cấp danh sách biến môi trường cần thiết nhưng không commit giá trị secret.
- Kiểm tra giao diện, responsive, URL, metadata, schema và luồng blog.
- Xác nhận release đủ điều kiện bật indexing.

### Team Sysadmin

- Cấp máy chủ, DNS, firewall, Node.js, PM2, Docker, Nginx và TLS.
- Quản lý secret bằng secret manager hoặc file quyền `0600` ngoài source.
- Triển khai theo release directory, lưu release cũ để rollback.
- Quản lý backup database và Docker volume của WordPress.
- Giám sát PM2, Docker, Nginx, dung lượng đĩa và chứng chỉ TLS.

## 3. Yêu cầu hệ thống

- Ubuntu 24.04 LTS hoặc môi trường Linux tương đương được team hạ tầng phê duyệt.
- Node.js từ `20.9` trở lên; khuyến nghị Node.js `22.x`.
- npm tương thích với Node.js 22.
- PM2 `7.x`.
- Docker Engine và Docker Compose plugin.
- Nginx và Certbot.
- DNS của hai domain đã trỏ về máy chủ trước khi cấp TLS.

Kiểm tra runtime:

```bash
node --version
npm --version
pm2 --version
docker version
docker compose version
nginx -v
```

## 4. Cấu trúc source quan trọng

```text
app/                              Next.js App Router
app/blog/                         Trang danh sách, chi tiết và taxonomy blog
app/api/revalidate/wordpress/     Webhook xóa cache khi cập nhật bài
components/                       Component giao diện
components/blog/                  Component blog
content/                          Nội dung trang chính sách
lib/wordpress/                    REST client, query, type và sanitizer
public/                           Static assets nội bộ
wordpress-plugin/fastbyte-headless/
                                  Plugin webhook WordPress
docker-compose.wordpress.yml      WordPress + MariaDB
.env.example                      Mẫu môi trường frontend
.env.wordpress.example            Mẫu môi trường WordPress
package.json
package-lock.json
```

Các thư mục/file không được đưa vào gói source:

```text
.git/
.next/
node_modules/
.env
.env.local
.env.wordpress
*.sql
*.sql.gz
```

## 5. Đóng gói source trên Windows

Chạy trong PowerShell tại máy Dev:

```powershell
Set-Location "D:\Theme-VPS-Gia-Re-FastByte-Demo"

$releaseTime = Get-Date -Format "yyyyMMdd-HHmm"
$sourcePackage = Join-Path $env:USERPROFILE "Downloads\fastbyte-source-$releaseTime.tar.gz"

tar `
  --exclude="./.git" `
  --exclude="./.next" `
  --exclude="./node_modules" `
  --exclude="./.env" `
  --exclude="./.env.local" `
  --exclude="./.env.wordpress" `
  --exclude="./*.tar.gz" `
  -czf $sourcePackage .

Get-Item -LiteralPath $sourcePackage
Get-FileHash -Algorithm SHA256 -LiteralPath $sourcePackage
```

Kiểm tra gói source:

```powershell
tar -tzf $sourcePackage |
  Select-String "package.json|app/blog|docker-compose.wordpress.yml|wordpress-plugin"
```

Team Dev cần gửi file `.tar.gz` và checksum SHA256 bằng hai kênh phù hợp. Không gửi file môi trường chứa secret trong gói source.

## 6. Biến môi trường frontend

Tạo file ngoài source tại:

```text
/var/www/fastbyte-demo/shared/.env.production
```

Nội dung mẫu:

```env
WORDPRESS_API_URL=https://admin.truongthinhmedia.com/wp-json/wp/v2
WORDPRESS_SITE_URL=https://admin.truongthinhmedia.com

NEXT_PUBLIC_SITE_URL=https://demo.truongthinhmedia.com
NEXT_PUBLIC_ASSET_BASE_URL=https://admin.truongthinhmedia.com

WORDPRESS_REVALIDATE_SECRET=REPLACE_WITH_RANDOM_64_CHAR_SECRET
WORDPRESS_PREVIEW_SECRET=REPLACE_WITH_ANOTHER_RANDOM_64_CHAR_SECRET

NEXT_PUBLIC_ALLOW_INDEXING=false
```

Tạo secret bằng:

```bash
openssl rand -hex 32
```

Quy định:

- `WORDPRESS_REVALIDATE_SECRET` phải giống `FASTBYTE_HEADLESS_WEBHOOK_SECRET` của WordPress.
- `WORDPRESS_PREVIEW_SECRET` phải là một secret khác.
- Lần deploy nghiệm thu giữ `NEXT_PUBLIC_ALLOW_INDEXING=false`.
- Chỉ đổi indexing thành `true` sau khi team SEO/Dev xác nhận domain production chính thức.
- Mọi thay đổi biến `NEXT_PUBLIC_*` yêu cầu build lại frontend.

## 7. Biến môi trường WordPress

File production đặt tại:

```text
/var/www/fastbyte-demo/wordpress/.env.wordpress
```

Nội dung mẫu:

```env
WORDPRESS_PORT=127.0.0.1:8080

WORDPRESS_DB_NAME=fastbyte_wordpress
WORDPRESS_DB_USER=fastbyte_wordpress
WORDPRESS_DB_PASSWORD=REPLACE_WITH_STRONG_DB_PASSWORD
WORDPRESS_DB_ROOT_PASSWORD=REPLACE_WITH_STRONG_ROOT_PASSWORD

WORDPRESS_ADMIN_USER=fastbyte_admin
WORDPRESS_ADMIN_PASSWORD=REPLACE_WITH_STRONG_ADMIN_PASSWORD
WORDPRESS_ADMIN_EMAIL=REPLACE_WITH_COMPANY_ADMIN_EMAIL
WORDPRESS_TITLE=Fast Byte CMS

FASTBYTE_HEADLESS_WEBHOOK_URL=https://demo.truongthinhmedia.com/api/revalidate/wordpress
FASTBYTE_HEADLESS_WEBHOOK_SECRET=SAME_AS_WORDPRESS_REVALIDATE_SECRET
```

Đặt quyền file:

```bash
sudo chown root:root /var/www/fastbyte-demo/wordpress/.env.wordpress
sudo chmod 0600 /var/www/fastbyte-demo/wordpress/.env.wordpress
```

## 8. Cấu trúc thư mục production

```text
/var/www/fastbyte-demo/
|-- current -> releases/<release-id>
|-- releases/
|   |-- <release-id-1>/
|   +-- <release-id-2>/
|-- shared/
|   +-- .env.production
|-- wordpress/
|   |-- docker-compose.wordpress.yml
|   |-- .env.wordpress
|   +-- wordpress-plugin/
+-- .pm2/
```

Khởi tạo:

```bash
APP_ROOT=/var/www/fastbyte-demo

sudo id fastbyte >/dev/null 2>&1 || \
  sudo useradd \
    --system \
    --create-home \
    --home-dir "$APP_ROOT" \
    --shell /usr/sbin/nologin \
    fastbyte

sudo install -d -o fastbyte -g fastbyte -m 0750 \
  "$APP_ROOT" \
  "$APP_ROOT/releases" \
  "$APP_ROOT/shared" \
  "$APP_ROOT/.pm2"

sudo install -d -o root -g root -m 0750 \
  "$APP_ROOT/wordpress" \
  "$APP_ROOT/wordpress/wordpress-plugin"
```

## 9. Triển khai frontend lần đầu hoặc release mới

Giả sử gói source đã được upload vào `/tmp/fastbyte-source.tar.gz`:

```bash
APP_ROOT=/var/www/fastbyte-demo
RELEASE_ID=$(date +%Y%m%d-%H%M%S)
RELEASE_DIR="$APP_ROOT/releases/$RELEASE_ID"

sudo install -d -o fastbyte -g fastbyte -m 0750 "$RELEASE_DIR"
sudo tar -xzf /tmp/fastbyte-source.tar.gz -C "$RELEASE_DIR"
sudo chown -R fastbyte:fastbyte "$RELEASE_DIR"

sudo -u fastbyte ln -s \
  "$APP_ROOT/shared/.env.production" \
  "$RELEASE_DIR/.env.local"

sudo -u fastbyte bash -c "
  cd '$RELEASE_DIR' &&
  npm ci &&
  npm run build
"

test -f "$RELEASE_DIR/.next/BUILD_ID" && echo BUILD_OK
```

Không chuyển symlink hoặc restart PM2 nếu build thất bại.

Kích hoạt release:

```bash
sudo ln -sfn "$RELEASE_DIR" "$APP_ROOT/current.next"
sudo mv -Tf "$APP_ROOT/current.next" "$APP_ROOT/current"

sudo -u fastbyte env \
  HOME="$APP_ROOT" \
  PM2_HOME="$APP_ROOT/.pm2" \
  pm2 delete fastbyte-demo 2>/dev/null || true

sudo -u fastbyte env \
  HOME="$APP_ROOT" \
  PM2_HOME="$APP_ROOT/.pm2" \
  pm2 start \
  "$RELEASE_DIR/node_modules/next/dist/bin/next" \
  --name fastbyte-demo \
  --cwd "$RELEASE_DIR" \
  -- start -H 127.0.0.1 -p 3100

sudo -u fastbyte env \
  HOME="$APP_ROOT" \
  PM2_HOME="$APP_ROOT/.pm2" \
  pm2 save
```

## 10. Build nhanh trên VPS demo

Chỉ dùng khi Dev đã chỉnh trực tiếp source qua SFTP trên VPS demo và cần cho khách xem nhanh. Không dùng quy trình này thay cho release deployment của production.

```bash
cd /var/www/fastbyte-demo/current && \
sudo -u fastbyte env \
  HOME=/var/www/fastbyte-demo \
  npm run build && \
sudo -u fastbyte env \
  HOME=/var/www/fastbyte-demo \
  PM2_HOME=/var/www/fastbyte-demo/.pm2 \
  pm2 restart fastbyte-demo --update-env
```

Kiểm tra:

```bash
sudo -u fastbyte env \
  HOME=/var/www/fastbyte-demo \
  PM2_HOME=/var/www/fastbyte-demo/.pm2 \
  pm2 list

curl -I https://demo.truongthinhmedia.com/
curl -I https://demo.truongthinhmedia.com/blog/
```

Nếu chỉ thay đổi source giao diện và không đổi `package.json` hoặc `package-lock.json`, không cần chạy lại `npm ci` trên VPS demo.

## 11. Khởi động WordPress

Copy cấu hình và plugin từ release sang thư mục ổn định:

```bash
APP_ROOT=/var/www/fastbyte-demo
RELEASE_DIR=$(readlink -f "$APP_ROOT/current")
WP_ROOT="$APP_ROOT/wordpress"

sudo install -m 0644 \
  "$RELEASE_DIR/docker-compose.wordpress.yml" \
  "$WP_ROOT/docker-compose.wordpress.yml"

sudo cp -a \
  "$RELEASE_DIR/wordpress-plugin/." \
  "$WP_ROOT/wordpress-plugin/"
```

Khởi động container:

```bash
cd /var/www/fastbyte-demo/wordpress

sudo docker compose \
  --env-file .env.wordpress \
  -f docker-compose.wordpress.yml \
  up -d

sudo docker compose \
  --env-file .env.wordpress \
  -f docker-compose.wordpress.yml \
  ps
```

Kích hoạt plugin webhook:

```bash
cd /var/www/fastbyte-demo/wordpress

sudo docker compose \
  --env-file .env.wordpress \
  -f docker-compose.wordpress.yml \
  run --rm wordpress-cli \
  wp plugin activate fastbyte-headless
```

Không chạy lệnh dưới đây trên production:

```bash
docker compose down -v
```

Tham số `-v` sẽ xóa Docker volumes chứa database và file WordPress.

## 12. Nginx

### Frontend

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name demo.truongthinhmedia.com;

    location / {
        proxy_pass http://127.0.0.1:3100;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }
}
```

### WordPress

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name admin.truongthinhmedia.com;
    client_max_body_size 128m;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;
    }
}
```

Sau khi cập nhật:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 13. Dữ liệu WordPress cần bàn giao riêng

Source code không chứa bài viết, database hoặc media production. Để dựng lại website đầy đủ cần thêm:

- Database dump dạng `.sql.gz`.
- `wp-content/uploads` hoặc toàn bộ `wp-content` dạng `.tar.gz`.
- Danh sách plugin ngoài source nếu có.
- Secret production gửi bằng kênh bảo mật.

Xuất database trên máy chủ cũ:

```bash
cd /var/www/fastbyte-demo/wordpress

sudo docker compose \
  --env-file .env.wordpress \
  -f docker-compose.wordpress.yml \
  exec -T wordpress-db sh -lc '
    mariadb-dump \
      -u"$MARIADB_USER" \
      -p"$MARIADB_PASSWORD" \
      "$MARIADB_DATABASE"
  ' | gzip > /tmp/fastbyte-wordpress.sql.gz
```

Xuất `wp-content`:

```bash
cd /var/www/fastbyte-demo/wordpress

sudo docker compose \
  --env-file .env.wordpress \
  -f docker-compose.wordpress.yml \
  exec -T wordpress \
  tar -czf - -C /var/www/html wp-content \
  > /tmp/fastbyte-wp-content.tar.gz
```

Trước mọi thao tác import hoặc ghi đè dữ liệu, Sysadmin phải backup trạng thái máy đích.

## 14. Kiểm tra sau deploy

### Service

```bash
sudo -u fastbyte env \
  HOME=/var/www/fastbyte-demo \
  PM2_HOME=/var/www/fastbyte-demo/.pm2 \
  pm2 list

cd /var/www/fastbyte-demo/wordpress

sudo docker compose \
  --env-file .env.wordpress \
  -f docker-compose.wordpress.yml \
  ps

sudo nginx -t
sudo systemctl status nginx --no-pager
```

### HTTP

```bash
curl -I https://demo.truongthinhmedia.com/
curl -I https://demo.truongthinhmedia.com/blog/
curl -I https://admin.truongthinhmedia.com/wp-admin/
curl -I "https://admin.truongthinhmedia.com/wp-json/wp/v2/posts?per_page=1"
```

### Port

```bash
sudo ss -lntp | grep -E ':80|:443|:3100|:8080|:3306'
```

Kết quả mong đợi:

- `3100` chỉ lắng nghe trên `127.0.0.1`.
- `8080` chỉ lắng nghe trên `127.0.0.1`.
- `3306` không public.
- `80` và `443` do Nginx tiếp nhận.

### QA ứng dụng

- Homepage và các trang pháp lý trả HTTP 200.
- `/blog/`, chi tiết bài, danh mục, tác giả, tìm kiếm và phân trang hoạt động.
- Tiêu đề/danh mục hiển thị đúng ký tự `&`, không hiện `&amp;`.
- Nội dung bài giữ inline style hợp lệ nhưng loại bỏ script, event handler và CSS nguy hiểm.
- Featured image, ảnh trong bài và ảnh fallback tải được.
- Canonical, Open Graph, robots, sitemap và JSON-LD dùng đúng domain.
- Webhook đúng secret trả 200; sai secret trả 401.
- WordPress frontend giữ noindex để tránh trùng nội dung với Next.js.
- Kiểm tra ít nhất các viewport 375, 768, 1024 và 1440 px.

## 15. Rollback frontend

Liệt kê release:

```bash
ls -lah /var/www/fastbyte-demo/releases
readlink -f /var/www/fastbyte-demo/current
```

Chọn release cũ đã xác nhận, sau đó:

```bash
APP_ROOT=/var/www/fastbyte-demo
ROLLBACK_RELEASE=/var/www/fastbyte-demo/releases/REPLACE_WITH_RELEASE_ID

test -f "$ROLLBACK_RELEASE/.next/BUILD_ID" || {
  echo "Release rollback không hợp lệ"
  exit 1
}

sudo ln -sfn "$ROLLBACK_RELEASE" "$APP_ROOT/current.next"
sudo mv -Tf "$APP_ROOT/current.next" "$APP_ROOT/current"

sudo -u fastbyte env \
  HOME="$APP_ROOT" \
  PM2_HOME="$APP_ROOT/.pm2" \
  pm2 delete fastbyte-demo

sudo -u fastbyte env \
  HOME="$APP_ROOT" \
  PM2_HOME="$APP_ROOT/.pm2" \
  pm2 start \
  "$ROLLBACK_RELEASE/node_modules/next/dist/bin/next" \
  --name fastbyte-demo \
  --cwd "$ROLLBACK_RELEASE" \
  -- start -H 127.0.0.1 -p 3100

sudo -u fastbyte env \
  HOME="$APP_ROOT" \
  PM2_HOME="$APP_ROOT/.pm2" \
  pm2 save
```

Rollback frontend không tự động rollback database WordPress. Nếu release có thay đổi schema hoặc dữ liệu, cần kế hoạch rollback database riêng.

## 16. Quy định bảo mật và vận hành

- Không gửi SSH password, database password hoặc secret trong email/chat thông thường.
- Không commit `.env.local` hoặc `.env.wordpress`.
- Không chạy ứng dụng Next.js bằng tài khoản `root`.
- Không dùng `pm2 save` trước khi kiểm tra danh sách process cần lưu.
- Không public port Docker hoặc PM2 ra Internet.
- Không chỉnh firewall/fail2ban nếu chưa có console/VNC hoặc kênh truy cập dự phòng.
- Không dùng `docker compose down -v` trên production.
- Backup database và `wp-content` trước khi import, update WordPress hoặc thay đổi plugin.
- Kiểm tra `nginx -t` trước mọi lần reload Nginx.
- Giữ tối thiểu một release frontend ổn định để rollback.

## 17. Tiêu chí nghiệm thu

Release chỉ được coi là hoàn tất khi:

1. `npm ci` và `npm run build` thành công.
2. PM2 có đúng một process `fastbyte-demo` ở trạng thái `online`.
3. WordPress và MariaDB đều healthy/running.
4. Nginx config hợp lệ và HTTPS hoạt động.
5. Homepage, blog, bài viết và WordPress REST API trả HTTP 200.
6. Không có port nội bộ bị public.
7. Database và media đã được backup.
8. Dev/QA xác nhận giao diện desktop và mobile.
9. SEO xác nhận trạng thái indexing phù hợp.
10. Sysadmin ghi nhận release ID và release rollback gần nhất.
