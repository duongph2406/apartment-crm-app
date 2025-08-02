# Demo Trang Tạo Hợp Đồng - Phiên bản cập nhật

## Các tính năng đã được triển khai:

### 1. Mã hợp đồng thông minh
- Format: `001/HĐTCH - 2025`
- Số hợp đồng tự động tăng dần từ 001
- **Năm tính theo ngày ký hợp đồng** (không phải năm hiện tại)
- **Có thể sửa thủ công** khi cần thiết
- Tự động cập nhật khi thay đổi ngày ký

### 2. Các trường thông tin hợp đồng
- **Mã hợp đồng**: Tự động tạo theo format
- **Ngày ký hợp đồng**: Mặc định là ngày hiện tại
- **Ngày bắt đầu hợp đồng**: Người dùng chọn
- **Ngày kết thúc hợp đồng**: Người dùng chọn
- **Chọn phòng**: Chỉ hiển thị phòng trống hoặc đã đặt cọc trong thời gian hợp đồng
- **Người ký hợp đồng**: Chọn từ danh sách khách thuê
- **Vai trò**: 
  - Trưởng phòng (mặc định): Được tính là khách ở trong phòng
  - Người ký hợp đồng: Không được tính là khách ở trong phòng
- **Tiền cọc**: Tự động điền nếu phòng đã đặt cọc
- **Tiền thuê**: Tự động điền khi chọn phòng
- **Tick internet**: Checkbox để chọn có internet hay không

### 3. Danh sách khách thuê khác trong phòng (Nâng cao)
- **Nút "Thêm khách thuê"** để mở modal chọn khách
- **Chỉ hiển thị khách chưa thuộc phòng nào** có hợp đồng hiệu lực
- **Loại trừ người ký hợp đồng** khỏi danh sách
- **Hiển thị danh sách đã chọn** với nút xóa từng người
- **Kiểm tra trạng thái hợp đồng** (active/pending) để lọc khách thuê

### 4. Tính năng ưu đãi tiền thuê
- **Checkbox ưu đãi** bên cạnh trường tiền thuê
- Khi tick ưu đãi sẽ hiển thị:
  - Thời gian ưu đãi (số tháng)
  - Tiền thuê trong thời gian ưu đãi
- Hiển thị thông tin ưu đãi trong bảng danh sách

### 5. Quản lý trạng thái tự động
- **Trạng thái không được chọn** khi tạo mới (mặc định: Chờ hiệu lực)
- **Tự động chuyển** sang "Hiệu lực" khi đến ngày bắt đầu
- **Tự động chuyển** sang "Hết hạn" khi qua ngày kết thúc
- Trạng thái phòng cũng được cập nhật tương ứng

### 6. Logic xử lý phòng thông minh
- Phòng đã đặt cọc: Tự động chọn người đặt cọc làm người ký hợp đồng
- Phòng trống: Cho phép chọn bất kỳ khách thuê nào
- Kiểm tra trùng lặp thời gian hợp đồng
- Chỉ hiển thị phòng có thể thuê trong khoảng thời gian đã chọn

### 7. Bảng hiển thị hợp đồng tối ưu
- Mã hợp đồng
- Người ký hợp đồng
- Vai trò (Trưởng phòng/Người ký hợp đồng)
- Phòng
- Ngày ký
- Ngày bắt đầu
- Ngày kết thúc
- Tiền thuê
- **Thông tin ưu đãi** (số tháng + giá ưu đãi)
- **Internet** (chỉ hiển thị chữ "Internet" nếu có)
- ~~Trạng thái~~ (đã bỏ để giao diện gọn hơn)

## Cách sử dụng:

1. **Tạo hợp đồng mới**:
   - Click nút "Tạo hợp đồng"
   - Mã hợp đồng tự động tạo theo ngày ký (có thể sửa thủ công)
   - Điền các thông tin cần thiết
   - Chọn phòng và người ký hợp đồng
   - **Tick ưu đãi** nếu có và điền thông tin ưu đãi
   - **Tick Internet** nếu phòng có internet
   - Chọn khách thuê khác nếu có
   - Click "Tạo mới"

2. **Xử lý ưu đãi tiền thuê**:
   - Tick checkbox "Ưu đãi" bên cạnh tiền thuê
   - Nhập số tháng được ưu đãi
   - Nhập giá thuê trong thời gian ưu đãi
   - Thông tin sẽ hiển thị trong bảng danh sách

3. **Quản lý trạng thái tự động**:
   - Hợp đồng mới tạo có trạng thái "Chờ hiệu lực"
   - Hệ thống tự động chuyển sang "Hiệu lực" khi đến ngày bắt đầu
   - Tự động chuyển sang "Hết hạn" khi qua ngày kết thúc
   - Trạng thái phòng cũng được cập nhật tương ứng

4. **Xử lý phòng đã đặt cọc**:
   - Khi chọn phòng đã đặt cọc, hệ thống sẽ tự động:
     - Chọn người đặt cọc làm người ký hợp đồng
     - Điền số tiền cọc
     - Hiển thị gợi ý

5. **Quản lý khách thuê trong phòng (Nâng cao)**:
   - Chọn vai trò cho người ký hợp đồng
   - **Click nút "Thêm khách thuê"** để mở modal
   - **Chọn từ danh sách khách chưa thuộc phòng nào**
   - **Xóa khách thuê** bằng nút xóa bên cạnh tên
   - Hệ thống tự động lọc khách đã có hợp đồng hiệu lực

## Responsive Design:
- Form responsive trên mobile
- Bảng có thể scroll ngang trên màn hình nhỏ
- Layout tối ưu cho các thiết bị khác nhau

## Các cải tiến mới:

### ✅ Mã hợp đồng thông minh
- Năm trong mã hợp đồng tính theo ngày ký (không phải năm hiện tại)
- Có thể chỉnh sửa thủ công khi cần
- Tự động cập nhật khi thay đổi ngày ký

### ✅ Quản lý ưu đãi
- Checkbox ưu đãi bên cạnh tiền thuê
- Nhập thời gian ưu đãi (tháng)
- Nhập giá thuê ưu đãi
- Hiển thị đầy đủ trong bảng

### ✅ Trạng thái tự động
- Không cho phép chọn trạng thái khi tạo mới
- Tự động chuyển trạng thái theo thời gian
- Cập nhật trạng thái phòng tương ứng

### ✅ Giao diện tối ưu
- Internet chỉ hiển thị chữ "Internet"
- Bảng responsive với nhiều cột hơn
- Form layout tối ưu cho các trường mới

## Lưu ý kỹ thuật:
- Hệ thống kiểm tra và cập nhật trạng thái mỗi khi load trang
- Trạng thái phòng được đồng bộ với trạng thái hợp đồng
- Dữ liệu được lưu trong localStorage với cấu trúc mở rộng
### 
✅ Quản lý khách thuê thông minh
- Nút "Thêm khách thuê" với modal chọn
- Chỉ hiển thị khách chưa thuộc phòng nào có hợp đồng hiệu lực
- Danh sách đã chọn với nút xóa từng người
- Tự động cập nhật khi thay đổi người ký hợp đồng
- Kiểm tra trạng thái hợp đồng (active/pending) để lọc

### ✅ Logic lọc khách thuê
- Loại trừ khách đã là trưởng phòng trong hợp đồng hiệu lực
- Loại trừ khách đã là thành viên phòng trong hợp đồng hiệu lực
- Loại trừ người ký hợp đồng hiện tại
- Chỉ hiển thị khách "tự do" có thể thêm vào phòng mới

### ✅ Giao diện người dùng
- Modal chọn khách thuê với thông tin đầy đủ
- Danh sách đã chọn dạng card với nút xóa
- Nút thêm bị disable khi không có khách nào có thể thêm
- Responsive design cho mobile### 
✅ Cải tiến giao diện form
- **Internet chuyển xuống dòng riêng** với background khác biệt
- **Bỏ mục trạng thái** khỏi form (tự động quản lý)
- **Bỏ cột trạng thái** khỏi bảng để giao diện gọn hơn
- Checkbox Internet được làm nổi bật hơn
- Layout form tối ưu và dễ nhìn hơn

### ✅ Tối ưu trải nghiệm người dùng
- Form ngắn gọn hơn, tập trung vào thông tin quan trọng
- Bảng ít cột hơn, dễ đọc trên màn hình nhỏ
- Internet được đặt ở vị trí riêng biệt, dễ chú ý
- Trạng thái được quản lý tự động, không cần người dùng can thiệp
### ✅ C
ải tiến layout form mới nhất
- **Phần ưu đãi chuyển xuống dòng riêng** với background vàng nổi bật
- **2 trường ưu đãi cùng hàng** (thời gian và giá thuê ưu đãi)
- **Internet ở dòng riêng** với background xám nhạt
- **Form grid tối ưu** cho trải nghiệm người dùng tốt hơn
- **Màu sắc phân biệt** giữa các section khác nhau

### ✅ Ưu điểm của layout mới
- **Dễ nhìn hơn**: Các phần được phân tách rõ ràng
- **Tiết kiệm không gian**: 2 trường ưu đãi cùng hàng
- **Nổi bật**: Background màu vàng cho phần ưu đãi
- **Responsive**: Tự động chuyển thành 1 cột trên mobile