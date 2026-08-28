# Thiết lập Headless WordPress cho Fast Byte

## 1. Chuẩn bị biến môi trường Next.js

```powershell
Copy-Item .env.example .env.local
```

Đổi hai secret mẫu trong `.env.local`. Không commit `.env.local`. Development phải giữ `NEXT_PUBLIC_ALLOW_INDEXING=false`. `NEXT_PUBLIC_ASSET_BASE_URL` giữ riêng kho ảnh giao diện cũ để việc chuyển WordPress API sang local không làm hỏng logo/ảnh homepage.

Frontend hiện dùng Next.js 16.3.3, React 19.2.8 và Node.js từ 20.9 trở lên. Các lệnh kiểm tra là `npx tsc --noEmit`, `npm run lint` và `npm run build`.

## 2. Khởi động WordPress local

Yêu cầu Docker Desktop đang chạy.

```powershell
Copy-Item .env.wordpress.example .env.wordpress
docker compose --env-file .env.wordpress -f docker-compose.wordpress.yml up -d
docker compose --env-file .env.wordpress -f docker-compose.wordpress.yml ps
```

Mở `http://localhost:8080`, chọn ngôn ngữ và hoàn tất trình cài đặt. Dùng credential quản trị development riêng, không tái sử dụng password production. Sau đó:

1. Đăng nhập `http://localhost:8080/wp-admin/`.
2. Vào **Settings > Permalinks**, chọn **Post name**, lưu lại.
3. Vào **Settings > Reading**, bật **Discourage search engines from indexing this site** để frontend WordPress giữ noindex.
4. Tạo Category, Tag và một bài viết có excerpt, featured image, H2/H3; Publish.
5. Kiểm tra `http://localhost:8080/wp-json/wp/v2/posts?_embed`.

Docker Compose có thêm service profile `wordpress-cli` dành cho tác vụ quản trị không tương tác. Ví dụ kiểm tra WordPress đã cài:

```powershell
docker compose --env-file .env.wordpress -f docker-compose.wordpress.yml run --rm wordpress-cli wp core is-installed
```

Dừng container nhưng giữ dữ liệu:

```powershell
docker compose --env-file .env.wordpress -f docker-compose.wordpress.yml down
```

Chỉ dùng `down -v` khi chủ động muốn xóa toàn bộ database và file WordPress local.

## 3. Chạy Next.js

```powershell
npm install
npm run dev
```

Mở `http://localhost:3000/blog/`. WordPress không chạy sẽ tạo error state thân thiện, không tự chèn mock data.

## 4. Cài webhook plugin

Docker Compose đã mount `wordpress-plugin/fastbyte-headless` vào container. Kích hoạt **Fast Byte Headless**. Local ưu tiên hai biến trong `.env.wordpress`:

```env
FASTBYTE_HEADLESS_WEBHOOK_URL=http://host.docker.internal:3000/api/revalidate/wordpress
FASTBYTE_HEADLESS_WEBHOOK_SECRET=secret-giong-wordpress-revalidate-secret
```

Khi không dùng biến môi trường, có thể vào **Settings > Fast Byte Headless** và nhập:

- URL: `http://host.docker.internal:3000/api/revalidate/wordpress`
- Secret: cùng giá trị `WORDPRESS_REVALIDATE_SECRET` trong `.env.local`

Trong container, `localhost:3000` là container WordPress. `host.docker.internal:3000` mới trỏ tới Next.js đang chạy trên máy host.

Kiểm tra thủ công bằng PowerShell:

```powershell
$headers = @{ 'X-FastByte-Webhook-Secret' = 'secret-trong-env-local' }
$body = @{ postId = 123; slug = 'vps-la-gi'; status = 'publish'; postType = 'post' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri 'http://localhost:3000/api/revalidate/wordpress' -Headers $headers -ContentType 'application/json' -Body $body
```

Kiểm tra bằng cURL:

```bash
curl -i -X POST http://localhost:3000/api/revalidate/wordpress \
  -H "Content-Type: application/json" \
  -H "X-FastByte-Webhook-Secret: secret-trong-env-local" \
  -d '{"postId":123,"slug":"vps-la-gi","status":"publish","postType":"post"}'
```

Đổi secret sai phải nhận HTTP 401; payload sai phải nhận 400 hoặc 422.

## 5. Chuyển sang production

Cấu hình biến môi trường trên server, không sửa source:

```env
WORDPRESS_API_URL=https://cms.thuevpsgiare.vn/wp-json/wp/v2
WORDPRESS_SITE_URL=https://cms.thuevpsgiare.vn
NEXT_PUBLIC_SITE_URL=https://thuevpsgiare.vn
NEXT_PUBLIC_ASSET_BASE_URL=https://thuevpsgiare.vn
NEXT_PUBLIC_ALLOW_INDEXING=false
WORDPRESS_REVALIDATE_SECRET=secret-production-dai-va-ngau-nhien
WORDPRESS_PREVIEW_SECRET=preview-secret-production-dai-va-ngau-nhien
```

Giữ `NEXT_PUBLIC_ALLOW_INDEXING=false` trong lần deploy đầu. Tiếp theo:

1. Cập nhật **WordPress Address** và **Site Address** sang HTTPS của CMS.
2. Backup database rồi dùng công cụ search-replace an toàn cho serialized data nếu cần thay URL cũ.
3. Cấu hình DNS, TLS/HTTPS và redirect HTTP sang HTTPS.
4. Xác nhận hostname ảnh WordPress đúng với `WORDPRESS_SITE_URL`; `next.config.mjs` tự đọc hostname này khi build.
5. Đổi webhook URL trong plugin sang URL production của Next.js.
6. Xóa cache deploy cũ và chạy lại `npm ci && npm run build`.
7. Kiểm tra canonical, Open Graph, `robots.txt`, `sitemap.xml`, Schema và ảnh.
8. Giữ WordPress frontend noindex để tránh Google index đồng thời nội dung CMS và Next.js.
9. Chỉ đổi `NEXT_PUBLIC_ALLOW_INDEXING=true` và build/deploy lại sau khi toàn bộ kiểm tra đạt.

Không gửi sitemap localhost hoặc sitemap staging lên Google Search Console.

## 6. Preview draft

Draft Mode chưa được bật ở phiên bản cơ bản vì REST API draft cần credential server-side/Application Password. Khi triển khai giai đoạn 2, cần endpoint bật/tắt Draft Mode, secret riêng, request draft chỉ ở server và banner preview. Tuyệt đối không đưa Application Password hoặc `WORDPRESS_PREVIEW_SECRET` xuống client.

## 7. Checklist trước khi bật indexing

- WordPress REST API, blog list, post detail, category, author, search và phân trang hoạt động.
- Slug không tồn tại trả 404; WordPress downtime hiển thị error state.
- Title, description, canonical, OG/Twitter, published/modified time đúng.
- `BlogPosting` và `BreadcrumbList` hợp lệ.
- Featured image có alt, kích thước; bài thiếu ảnh dùng fallback.
- HTML Gutenberg không render script, iframe, event handler hoặc style nguy hiểm.
- Webhook đúng secret trả 200; sai secret trả 401.
- `robots.txt` chặn toàn bộ khi indexing=false và chỉ mở sau kiểm tra production.
- Sitemap chỉ xuất khi indexing=true và không chứa hostname localhost.
- WordPress frontend vẫn noindex; không có hai URL index cùng một bài.
- Homepage, subpage và luồng bảng giá được smoke test sau build.
