# Fast Byte Headless

Plugin WordPress tối giản dùng để gửi webhook revalidation tới frontend Next.js. Plugin không render frontend, không phụ thuộc theme, không sửa REST API và bỏ qua autosave/revision.

## Cài đặt

1. Copy thư mục `fastbyte-headless` vào `wp-content/plugins/` (Docker Compose của project đã mount sẵn thư mục này).
2. Vào **Plugins > Installed Plugins**, kích hoạt **Fast Byte Headless**.
3. Vào **Settings > Fast Byte Headless**.
4. Local: nhập `http://host.docker.internal:3000/api/revalidate/wordpress`.
5. Nhập secret giống `WORDPRESS_REVALIDATE_SECRET` trong `.env.local` của Next.js.

Trong Docker Compose, `FASTBYTE_HEADLESS_WEBHOOK_URL` và `FASTBYTE_HEADLESS_WEBHOOK_SECRET` từ `.env.wordpress` được ưu tiên hơn option trong trang Settings. Cách này giữ credential local ngoài source code.

`localhost:3000` bên trong container trỏ về chính container WordPress, không phải máy Windows đang chạy Next.js. `host.docker.internal:3000` là địa chỉ Docker cung cấp để container gọi dịch vụ trên máy host.

Plugin gửi `POST` không chặn quá trình lưu bài và đặt secret trong header `X-FastByte-Webhook-Secret`.
