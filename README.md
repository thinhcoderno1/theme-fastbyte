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
npm run test:plans
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
NEXT_PUBLIC_ALLOW_INDEXING=true

WORDPRESS_API_URL=https://cms.example.com/wp-json/wp/v2
WORDPRESS_SITE_URL=https://cms.example.com
WORDPRESS_REVALIDATE_SECRET=replace-with-a-random-secret
```

Ba biến `WORDPRESS_*` ở trên chỉ là cấu hình runtime của Next.js cho blog và webhook xóa cache. Chúng không khởi tạo WordPress, PHP hoặc database trong repository này.

## Best Plans — VPS Platinum

Homepage lấy các gói Platinum từ [portal Black Friday 2026](https://id.thuevpsgiare.vn/store/promo-blackfriday26) ở phía server, bao gồm tên, giá theo chu kỳ, toàn bộ thông số/quyền lợi và URL đăng ký. Next.js cache dữ liệu và trang chủ trong 900 giây; lượt truy cập sau thời hạn này kích hoạt cập nhật nền. Đây không phải tác vụ cron hoặc cập nhật trực tiếp trong tab đang mở.

Tab **1 năm / 2 năm / 3 năm** hiển thị tổng tiền thực tế cho từng chu kỳ từ trang cấu hình của mỗi gói. Giá chu kỳ được cache theo URL sản phẩm trong 900 giây; liên kết đăng ký truyền `billingcycle=annually|biennially|triennially` để portal chọn sẵn chu kỳ. Không nhân giá năm để suy ra giá 2 hoặc 3 năm. Nếu không đọc được giá chu kỳ, chỉ dùng bản chụp của đúng sản phẩm khi giá năm hiện tại vẫn khớp; chu kỳ chưa có dữ liệu sẽ báo chưa có giá và khóa nút đăng ký.

Trang bán hàng công khai hiện cung cấp HTML. API `GetProducts` của WHMCS [yêu cầu xác thực](https://developers.whmcs.com/api-reference/getproducts/), nên tích hợp hiện tại đọc HTML công khai và không cần API key. Nếu portal đổi cấu trúc HTML, cần cập nhật bộ đọc trong `lib/api.ts`. Khi kết nối lỗi hoặc dữ liệu không hợp lệ, website dùng bản chụp 6 gói Platinum đã đối chiếu ngày 23/11/2026 và ghi cảnh báo phía server; giá dự phòng có thể cũ nếu portal thay đổi trong thời gian lỗi.

`npm run test:plans` kiểm tra dữ liệu portal mẫu, giá cả 3 chu kỳ, thay đổi giá/thông số/danh sách gói, redirect phiên riêng, thao tác tab bằng chuột/bàn phím, liên kết đặt hàng và các tình huống lỗi.

## Triển khai

Có thể chạy trực tiếp bằng Node.js/PM2 hoặc dùng Docker Compose. Xem [DEPLOYMENT.md](./DEPLOYMENT.md) cho quy trình Docker chỉ gồm Next.js và Nginx.
