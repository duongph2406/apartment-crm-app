# Hệ thống CRM Quản lý Căn hộ

Hệ thống quản lý căn hộ được xây dựng bằng React với 4 cấp độ quyền hạn khác nhau.

## Tính năng chính

### 🏢 Quản lý Phòng
- Hiển thị danh sách 11 phòng cố định (102, 201, 202, 301, 302, 401, 402, 501, 502, 601, 602)
- Theo dõi trạng thái phòng (trống, đã thuê, bảo trì)
- Xem thông tin khách thuê và hợp đồng

### 👥 Quản lý Khách thuê
- Thêm, sửa, xóa thông tin khách thuê
- Lưu trữ thông tin liên hệ, CMND/CCCD
- Tìm kiếm khách thuê

### 📋 Quản lý Hợp đồng
- Tạo hợp đồng thuê phòng
- Theo dõi thời hạn hợp đồng
- Quản lý trạng thái hợp đồng

### 💰 Quản lý Hóa đơn
- Tạo hóa đơn hàng tháng
- Tính toán tiền thuê, điện, nước, dịch vụ
- Theo dõi trạng thái thanh toán

### 👤 Quản lý Tài khoản
- Thêm, sửa, xóa tài khoản người dùng
- Phân quyền theo vai trò
- Bảo mật mật khẩu

## Phân quyền hệ thống

### 🔴 Admin
- Toàn quyền: thêm, sửa, xóa mọi thông tin
- Quản lý tài khoản và hệ thống
- Truy cập tất cả tính năng

### 🔵 Manager
- Thêm tài khoản, tạo khách thuê, hợp đồng, hóa đơn
- Không thể xóa dữ liệu quan trọng
- Không truy cập quản lý hệ thống

### 🟢 User
- Chỉ xem thông tin
- Không thể thêm, sửa, xóa
- Không truy cập quản lý tài khoản

### 🟣 Tenant
- Chỉ xem thông tin hợp đồng, phòng và hóa đơn của mình
- Không truy cập các tính năng quản lý

## Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js 14+
- npm hoặc yarn

### Cài đặt
```bash
npm install
```

### Chạy ứng dụng
```bash
npm start
```

Ứng dụng sẽ chạy tại http://localhost:3000

## Tài khoản demo

### Admin
- **Username:** admin
- **Password:** admin123

### Manager  
- **Username:** manager
- **Password:** manager123

### User
- **Username:** user
- **Password:** user123

## Cấu trúc dự án

```
src/
├── components/          # Components tái sử dụng
│   ├── Auth/           # Đăng nhập
│   └── Layout/         # Layout chính
├── pages/              # Các trang chính
├── constants/          # Dữ liệu cố định
├── utils/              # Utilities
└── App.js             # Component chính
```

## Công nghệ sử dụng

- **React 19** - Framework chính
- **React Router** - Điều hướng
- **Lucide React** - Icons
- **LocalStorage** - Lưu trữ dữ liệu tạm thời
- **CSS3** - Styling

## Tính năng đang phát triển

- 🚧 Báo cáo sự cố
- 🚧 Phản ánh khách hàng  
- 🚧 Quản lý chi phí
- 🚧 Quản lý hệ thống

## Lưu ý

- Tất cả dữ liệu được lưu trong LocalStorage
- Dữ liệu sẽ mất khi xóa cache trình duyệt
- Đây là phiên bản demo, không dùng cho production

## Liên hệ

Nếu có thắc mắc hoặc góp ý, vui lòng liên hệ qua email hoặc tạo issue trên GitHub.

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
