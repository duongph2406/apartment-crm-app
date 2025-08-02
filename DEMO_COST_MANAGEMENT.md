# Demo Trang Quản Lý Chi Phí

## Tính năng đã triển khai:

### 1. Cài đặt giá dịch vụ
- **Giá điện**: Có thể thay đổi giá điện/kWh (mặc định: 3,500 VNĐ)
- **Giá nước**: Có thể thay đổi giá nước/người (mặc định: 25,000 VNĐ)
- **Giá Internet**: Có thể thay đổi giá Internet/phòng (mặc định: 50,000 VNĐ)
- **Phí dịch vụ**: Có thể thay đổi phí dịch vụ/người (mặc định: 30,000 VNĐ)

### 2. Bảng chỉnh sửa giá phòng
- **Hiển thị tất cả phòng** với thông tin:
  - Số phòng và loại phòng (Studio/1PN)
  - Giá thuê hiện tại
  - Trạng thái Internet (có/không)
- **Chỉnh sửa từng phòng**:
  - Click nút "Edit" để chỉnh sửa
  - Thay đổi giá thuê
  - Tick/untick Internet cho phòng
  - Lưu hoặc hủy thay đổi

### 3. Giao diện thân thiện
- **Card dịch vụ** với icon màu sắc khác nhau:
  - Điện: Màu cam với icon tia chớp
  - Nước: Màu xanh dương với icon giọt nước
  - Internet: Màu tím với icon WiFi
  - Dịch vụ: Màu xanh lá với icon người dùng
- **Bảng phòng** responsive với:
  - Thông tin phòng rõ ràng
  - Trạng thái Internet trực quan
  - Nút chỉnh sửa dễ sử dụng

### 4. Lưu trữ dữ liệu
- **LocalStorage**: Tất cả thay đổi được lưu vào localStorage
- **Tự động khôi phục**: Dữ liệu được khôi phục khi reload trang
- **Đồng bộ**: Giá dịch vụ được sử dụng trong tính toán hóa đơn

## Cách sử dụng:

### Thay đổi giá dịch vụ:
1. Vào trang "Quản lý chi phí" từ menu bên trái
2. Trong phần "Cài đặt giá dịch vụ", thay đổi giá trị mong muốn
3. Click nút "Lưu giá dịch vụ" để lưu thay đổi

### Chỉnh sửa giá phòng:
1. Trong bảng "Bảng giá phòng", click nút "Edit" ở phòng muốn chỉnh sửa
2. Thay đổi giá thuê trong ô input
3. Tick/untick checkbox Internet nếu cần
4. Click nút "✓" để lưu hoặc "✗" để hủy

### Kiểm tra Internet cho phòng:
- Phòng có Internet sẽ hiển thị "Có Internet" với icon WiFi màu xanh
- Phòng không có Internet sẽ hiển thị "Không có Internet" màu đỏ
- Khi tạo hóa đơn, phòng có Internet sẽ được tính thêm phí Internet

## Tích hợp với hệ thống:

### Tính toán hóa đơn tự động:
- Giá điện từ cài đặt được sử dụng để tính tiền điện
- Giá nước được nhân với số người trong phòng
- Phí dịch vụ được nhân với số người trong phòng
- Phí Internet chỉ tính cho phòng có tick Internet

### Quyền truy cập:
- Chỉ Admin và Manager mới có quyền thay đổi giá
- User và Tenant chỉ có thể xem (nếu có quyền)

## Responsive Design:
- Giao diện tối ưu cho desktop, tablet và mobile
- Card dịch vụ tự động sắp xếp theo màn hình
- Bảng phòng có thể scroll ngang trên màn hình nhỏ

## Lưu ý kỹ thuật:
- Dữ liệu được lưu trong localStorage với key `crm_utility_prices` và `crm_room_prices`
- Tự động format tiền tệ theo chuẩn Việt Nam
- Validation input để đảm bảo dữ liệu hợp lệ
- Hover effects và transitions mượt mà

## Demo Data:
Hệ thống đã có sẵn dữ liệu mẫu:
- 11 phòng từ 102 đến 602
- Giá phòng từ 4,200,000 đến 5,200,000 VNĐ
- Phân loại Studio và 1PN
- Mặc định tất cả phòng có Internet

## Tương lai:
- Thêm lịch sử thay đổi giá
- Báo cáo chi phí theo tháng
- Import/Export cài đặt giá
- Thông báo khi thay đổi giá ảnh hưởng đến hóa đơn