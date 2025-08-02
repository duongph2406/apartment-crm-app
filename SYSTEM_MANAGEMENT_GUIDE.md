# Hướng dẫn sử dụng trang Quản lý hệ thống

## Tổng quan
Trang Quản lý hệ thống cung cấp các công cụ để cấu hình, giám sát và bảo trì hệ thống quản lý chung cư.

## Các tính năng chính

### 1. Thống kê hệ thống
- **Người dùng**: Hiển thị tổng số người dùng trong hệ thống
- **Phòng**: Hiển thị tổng số phòng được quản lý
- **Hợp đồng**: Hiển thị tổng số hợp đồng đang hoạt động
- **Dung lượng**: Hiển thị dung lượng lưu trữ đã sử dụng

### 2. Cài đặt chung
- **Tên hệ thống**: Cấu hình tên hiển thị của hệ thống
- **Email quản trị**: Email của quản trị viên hệ thống
- **Kích thước file tối đa**: Giới hạn kích thước file upload (MB)
- **Thời gian hết phiên**: Thời gian tự động đăng xuất (phút)

### 3. Quản lý cơ sở dữ liệu
- **Sao lưu dữ liệu**: Xuất toàn bộ dữ liệu ra file JSON
- **Khôi phục dữ liệu**: Nhập dữ liệu từ file backup
- **Xóa toàn bộ dữ liệu**: Xóa tất cả dữ liệu (trừ cài đặt hệ thống và tài khoản)

### 4. Cài đặt bảo mật
- **Tự động sao lưu**: Bật/tắt tính năng sao lưu tự động hàng ngày
- **Chế độ bảo trì**: Bật/tắt chế độ bảo trì hệ thống

### 5. Cài đặt thông báo
- **Thông báo email**: Bật/tắt gửi thông báo qua email
- **Cấu hình SMTP**: Thiết lập máy chủ email
  - SMTP Host và Port
  - Username và Password
  - Email và tên người gửi
  - Tùy chọn SSL/TLS
- **Test email**: Gửi email thử nghiệm để kiểm tra cấu hình

### 6. Nhật ký hệ thống
- **Xem logs**: Hiển thị các sự kiện hệ thống
- **Lọc logs**: Lọc theo mức độ (Info, Warning, Error) và ngày
- **Xuất logs**: Xuất nhật ký ra file CSV
- **Xóa logs**: Xóa tất cả nhật ký

### 7. Thông tin hệ thống
- **Phiên bản**: Hiển thị phiên bản hiện tại
- **Trạng thái**: Trạng thái hoạt động của hệ thống
- **Thời gian hoạt động**: Thời gian hệ thống đã chạy
- **Cập nhật cuối**: Ngày cập nhật gần nhất
- **Xem chi tiết**: Modal hiển thị thông tin chi tiết và tính năng
- **Tải lại hệ thống**: Khởi động lại ứng dụng

## Cách sử dụng

### Truy cập trang quản lý hệ thống
1. Đăng nhập với tài khoản quản trị viên
2. Nhấp vào menu "Quản lý hệ thống" trong sidebar
3. Chọn tab tương ứng với chức năng cần sử dụng

### Sao lưu dữ liệu
1. Vào tab "Cơ sở dữ liệu"
2. Nhấp "Sao lưu dữ liệu"
3. File backup sẽ được tải xuống với tên `backup_YYYY-MM-DD.json`

### Khôi phục dữ liệu
1. Vào tab "Cơ sở dữ liệu"
2. Nhấp "Khôi phục dữ liệu"
3. Chọn file backup (.json)
4. Xác nhận khôi phục

### Cấu hình email
1. Vào tab "Thông báo"
2. Điền thông tin SMTP server
3. Nhập email test và nhấp "Test Email"
4. Nhấp "Lưu cấu hình" khi test thành công

### Xem nhật ký
1. Vào tab "Nhật ký"
2. Sử dụng bộ lọc để tìm logs cần thiết
3. Nhấp "Xuất logs" để tải về file CSV

## Lưu ý quan trọng

### Bảo mật
- Chỉ tài khoản quản trị viên mới có quyền truy cập
- Thường xuyên sao lưu dữ liệu
- Bảo mật thông tin SMTP

### Sao lưu
- Sao lưu dữ liệu trước khi thực hiện thay đổi lớn
- Lưu trữ file backup ở nơi an toàn
- Kiểm tra tính toàn vẹn của file backup

### Hiệu suất
- Thường xuyên xóa logs cũ để tối ưu hiệu suất
- Giám sát dung lượng lưu trữ
- Khởi động lại hệ thống khi cần thiết

## Khắc phục sự cố

### Không thể sao lưu
- Kiểm tra dung lượng ổ cứng
- Đảm bảo trình duyệt cho phép tải file

### Email không gửi được
- Kiểm tra cấu hình SMTP
- Đảm bảo tài khoản email cho phép ứng dụng bên thứ 3
- Sử dụng App Password cho Gmail

### Hệ thống chậm
- Xóa logs cũ
- Sao lưu và xóa dữ liệu không cần thiết
- Khởi động lại ứng dụng

## Liên hệ hỗ trợ
Nếu gặp vấn đề khi sử dụng, vui lòng liên hệ quản trị viên hệ thống.