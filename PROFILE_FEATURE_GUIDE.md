# Hướng dẫn sử dụng tính năng Thông tin tài khoản

## Tổng quan
Tính năng Thông tin tài khoản cho phép người dùng xem và chỉnh sửa thông tin cá nhân, cũng như thay đổi mật khẩu.

## Cách truy cập

### Từ dropdown menu
1. Nhấp vào tên người dùng ở góc phải trên navbar
2. Chọn "Thông tin tài khoản" từ dropdown menu

### Từ URL trực tiếp
- Truy cập: `/profile`

## Các tính năng chính

### 1. Xem thông tin cá nhân
- **Họ và tên**: Tên đầy đủ của người dùng
- **Email**: Địa chỉ email đăng nhập
- **Số điện thoại**: Số điện thoại liên hệ
- **Địa chỉ**: Địa chỉ cư trú
- **Ngày sinh**: Ngày tháng năm sinh
- **Vai trò**: Vai trò trong hệ thống (Admin, Manager, User, Tenant)

### 2. Chỉnh sửa thông tin
1. Nhấp nút "Chỉnh sửa" ở góc phải card thông tin
2. Các trường có thể chỉnh sửa:
   - Họ và tên (bắt buộc)
   - Email (bắt buộc, định dạng email hợp lệ)
   - Số điện thoại (tùy chọn, 10-11 số)
   - Địa chỉ (tùy chọn)
   - Ngày sinh (tùy chọn)
3. Nhấp "Lưu thay đổi" để cập nhật
4. Nhấp "Hủy" để bỏ qua thay đổi

### 3. Đổi mật khẩu
1. Nhấp nút "Đổi mật khẩu" trong section Đổi mật khẩu
2. Nhập thông tin:
   - **Mật khẩu hiện tại**: Mật khẩu đang sử dụng
   - **Mật khẩu mới**: Mật khẩu mới (tối thiểu 6 ký tự)
   - **Xác nhận mật khẩu mới**: Nhập lại mật khẩu mới
3. Sử dụng nút "mắt" để hiện/ẩn mật khẩu
4. Nhấp "Đổi mật khẩu" để cập nhật
5. Nhấp "Hủy" để bỏ qua

## Validation và lỗi

### Thông tin cá nhân
- **Họ tên**: Không được để trống
- **Email**: Không được để trống và phải đúng định dạng email
- **Số điện thoại**: Nếu nhập phải là 10-11 số

### Đổi mật khẩu
- **Mật khẩu hiện tại**: Phải đúng với mật khẩu đang sử dụng
- **Mật khẩu mới**: Tối thiểu 6 ký tự
- **Xác nhận mật khẩu**: Phải khớp với mật khẩu mới

## Giao diện

### Header Profile
- Avatar tròn với icon User
- Tên và vai trò người dùng
- Gradient background màu xanh-tím

### Thông tin cá nhân
- Layout 2 cột trên desktop, 1 cột trên mobile
- Icons cho từng trường thông tin
- Role badge với màu sắc theo vai trò:
  - **Admin**: Đỏ
  - **Manager**: Xanh dương
  - **User**: Xanh lá
  - **Tenant**: Tím

### Form đổi mật khẩu
- Layout dọc, tối đa 400px width
- Password toggle để hiện/ẩn mật khẩu
- Validation realtime

## Responsive Design

### Desktop (>768px)
- Layout 2 cột cho thông tin cá nhân
- Header ngang với avatar, info và actions

### Tablet/Mobile (≤768px)
- Layout 1 cột cho tất cả thông tin
- Header dọc, căn giữa
- Form actions full width

## Tích hợp với hệ thống

### Cập nhật dữ liệu
- Thông tin được lưu vào localStorage
- Cập nhật cả danh sách users và current user
- Đồng bộ với các component khác

### Bảo mật
- Xác thực mật khẩu hiện tại trước khi đổi
- Validation đầy đủ trước khi lưu
- Không hiển thị mật khẩu mặc định

### Navigation
- Dropdown menu tự động đóng khi chọn
- Click outside để đóng dropdown
- Responsive navigation

## Lưu ý kỹ thuật

### State Management
- Local state cho form data
- Separate state cho password form
- Error handling cho từng field

### Performance
- Lazy loading cho Profile page
- Optimized re-renders
- Efficient validation

### Accessibility
- Proper labels cho form fields
- Keyboard navigation support
- Screen reader friendly

## Troubleshooting

### Không thể lưu thông tin
- Kiểm tra validation errors
- Đảm bảo localStorage hoạt động
- Refresh trang và thử lại

### Dropdown không hoạt động
- Kiểm tra JavaScript console
- Đảm bảo không có conflict CSS
- Clear browser cache

### Responsive issues
- Kiểm tra viewport meta tag
- Test trên nhiều device sizes
- Verify CSS media queries

## Tương lai

### Planned Features
- Upload avatar
- Two-factor authentication
- Activity log
- Notification preferences
- Theme settings

### Improvements
- Better validation messages
- Auto-save drafts
- Password strength indicator
- Social login integration