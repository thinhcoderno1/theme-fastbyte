# Fast Byte Demo - Next.js

Ứng dụng frontend Fast Byte được xây dựng bằng Next.js 16 và React 19. Repository này chỉ chứa mã nguồn và cấu hình triển khai frontend; không còn container, database, plugin hay cấu hình vận hành WordPress nội bộ.

## Chạy local

Yêu cầu Node.js 20.9 trở lên, khuyến nghị Node.js 22.

```powershell
Copy-Item .env.example .env.local
npm ci
npm run dev
```

Điền các URL trong `.env.local` trước khi chạy. Phần blog của frontend hiện đọc dữ liệu từ một WordPress REST API bên ngoài; repository không cài đặt hoặc vận hành CMS đó.

## Kiểm tra source

```powershell
npm run lint
npm run build
```

## Cấu trúc chính

```text
app/                    Next.js App Router
components/             Component giao diện
content/                Nội dung trang chính sách
lib/wordpress/          REST client dùng bởi frontend blog
public/                 Static assets
nextjs/Dockerfile       Docker image cho Next.js
nginx/conf.d/app.conf   Reverse proxy chỉ cho frontend
docker-compose.yml      Next.js và Nginx
```

Không commit `.env`, `.env.local`, secret, private key, `.next` hoặc `node_modules`.

## Biến môi trường

```env
NEXT_PUBLIC_SITE_URL=https://app.example.com
NEXT_PUBLIC_ASSET_BASE_URL=https://cdn.example.com
NEXT_PUBLIC_ALLOW_INDEXING=false

WORDPRESS_API_URL=https://cms.example.com/wp-json/wp/v2
WORDPRESS_SITE_URL=https://cms.example.com
WORDPRESS_REVALIDATE_SECRET=replace-with-a-random-secret
```

Ba biến `WORDPRESS_*` ở trên chỉ là cấu hình runtime của Next.js cho blog và webhook xóa cache. Chúng không khởi tạo WordPress, PHP hoặc database trong repository này.

## Triển khai

Có thể chạy trực tiếp bằng Node.js/PM2 hoặc dùng Docker Compose. Xem [DEPLOYMENT.md](./DEPLOYMENT.md) cho quy trình Docker chỉ gồm Next.js và Nginx.
