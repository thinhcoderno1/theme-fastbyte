# Triển khai Next.js bằng Docker

Stack Docker chỉ gồm hai service:

- `nextjs`: build và chạy Next.js standalone trên port nội bộ `3000`.
- `nginx`: nhận HTTP/HTTPS và reverse proxy tới Next.js.

Repository không tạo WordPress, PHP hay database. Blog sử dụng một REST API bên ngoài được khai báo qua biến môi trường của Next.js.

## Chuẩn bị

```bash
cp .env.example .env
chmod 600 .env
```

Điền domain frontend, URL dịch vụ nội dung bên ngoài và secret revalidation trong `.env`.

Đặt chứng chỉ TLS vào:

```text
nginx/certs/app.crt
nginx/certs/app.key
```

Private key không được commit và nên có quyền `0600` trên Linux.

## Kiểm tra và khởi động

```bash
docker compose config --quiet
docker compose up -d --build
docker compose ps
docker compose logs --tail=100 nextjs nginx
```

## Kiểm tra sau triển khai

```bash
curl -I http://app.example.com
curl -I https://app.example.com
```

Kết quả cần xác nhận:

- HTTP chuyển hướng sang HTTPS.
- HTTPS trả phản hồi thành công từ Next.js.
- Chỉ port `80` và `443` được public.
- Homepage, các trang pháp lý và route blog hoạt động.
- Canonical, Open Graph, robots, sitemap và JSON-LD dùng đúng domain.

## Cập nhật phiên bản

```bash
git pull --ff-only
docker compose up -d --build
docker compose ps
```

Không xóa image/container đang chạy trước khi bản build mới hoàn tất. Luôn giữ commit hoặc release ổn định gần nhất để rollback.
