# Linguaflash Firebase API

Tài liệu OpenAPI và bộ kiểm thử API cho dự án Linguaflash Firebase (`linguaflash-f5591`), gồm:

- **Firebase Authentication** (Identity Toolkit REST API)
- **Cloud Firestore** (REST API)

## Demo trực tuyến

Swagger UI đã được deploy bằng GitHub Pages:

**[Mở tài liệu API trên GitHub Pages](https://huyhuynh03.github.io/OpenAPI_test/)**

URL trực tiếp: `https://huyhuynh03.github.io/OpenAPI_test/`

## Cấu trúc dự án

- [`openapi.yaml`](openapi.yaml): file đặc tả OpenAPI chính, chỉnh sửa thủ công tại đây.
- [`openapi.json`](openapi.json): file JSON được sinh tự động từ đặc tả YAML.
- [`index.html`](index.html), [`js/app.js`](js/app.js), [`vendor/swagger-ui/`](vendor/swagger-ui/): giao diện Swagger UI.
- [`scripts/build.js`](scripts/build.js): kiểm tra đặc tả, sinh lại `openapi.json` và sao chép các tài nguyên Swagger UI.
- [`config/firebase.config.js`](config/firebase.config.js): cấu hình Firebase dùng cho ứng dụng và kiểm thử.
- [`tests/`](tests/): các bài kiểm thử Jest cho Firebase Auth và Firestore.
- [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml): workflow tự động build và deploy lên GitHub Pages.

## Cài đặt

```bash
npm install
```

Yêu cầu Node.js 18 trở lên.

## Sử dụng

```bash
npm run validate       # chỉ kiểm tra openapi.yaml
npm run build          # kiểm tra và sinh lại openapi.json
npm start              # chạy local tại http://localhost:8080
npm test               # chạy toàn bộ API test
npm run test:auth      # chỉ chạy test Firebase Auth
npm run test:firestore # chỉ chạy test Firestore
```

Sau khi chỉnh sửa [`openapi.yaml`](openapi.yaml), chạy `npm run build` trước khi commit. Website production được phục vụ qua GitHub Pages; không cần thêm cấu hình nhà cung cấp hosting khác.

## Deploy GitHub Pages

Workflow [`deploy-pages.yml`](.github/workflows/deploy-pages.yml) sẽ tự động chạy khi có commit lên nhánh `main`. Bạn cũng có thể chạy thủ công tại **GitHub → Actions → Deploy static site to GitHub Pages → Run workflow**.

Các bước deploy:

1. Cài dependencies bằng `npm ci`.
2. Chạy `npm run build` để tạo các file cần thiết.
3. Đóng gói thư mục `public`.
4. Upload artifact và deploy bằng GitHub Pages.

Sau khi workflow thành công, website được cung cấp tại:

**https://huyhuynh03.github.io/OpenAPI_test/**

Nếu cần xem lại URL deployment, vào **Repository → Settings → Pages** hoặc mở lần chạy thành công trong **Actions** và chọn môi trường `github-pages`.

## Ghi chú

- Các test chỉ sử dụng thông tin xác thực không hợp lệ hoặc không tồn tại; không tạo tài khoản thật và không ghi dữ liệu thật.
- Kết quả test Firestore phụ thuộc vào Security Rules của dự án.
- Đặc tả mô tả các REST endpoint công khai của Firebase, không phải đặc tả chính thức của Google.
