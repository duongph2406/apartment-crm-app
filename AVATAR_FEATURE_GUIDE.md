# Hướng dẫn sử dụng tính năng Avatar

## Tổng quan
Tính năng Avatar cho phép người dùng tùy chỉnh hình đại diện cá nhân, hiển thị trên header và trang profile.

## Các tính năng chính

### 1. Hiển thị Avatar
- **Header**: Avatar hiển thị bên cạnh tên và vai trò trong dropdown
- **Profile**: Avatar lớn hiển thị trong trang thông tin cá nhân
- **Fallback**: Nếu không có avatar, hiển thị initials với màu nền tự động

### 2. Tạo Avatar tự động
- **Initials**: Lấy chữ cái đầu của họ và tên (tối đa 2 ký tự)
- **Màu nền**: Tự động tạo màu dựa trên tên người dùng
- **Consistent**: Cùng một tên sẽ luôn có cùng màu

### 3. Upload Avatar
- **Định dạng hỗ trợ**: JPG, PNG, GIF, WebP
- **Kích thước tối đa**: 5MB
- **Tự động resize**: Resize về 200x200px để tối ưu storage
- **Chất lượng**: Nén với chất lượng 80% để giảm dung lượng

### 4. Quản lý Avatar
- **Thay đổi**: Click nút camera để upload avatar mới
- **Xóa**: Click nút thùng rác để xóa avatar hiện tại
- **Preview**: Xem trước ngay lập tức sau khi upload

## Cách sử dụng

### Upload Avatar
1. Vào trang "Thông tin tài khoản"
2. Hover vào avatar để hiện các nút điều khiển
3. Click nút camera (📷) để chọn file
4. Chọn hình ảnh từ máy tính
5. Hệ thống sẽ tự động resize và lưu

### Xóa Avatar
1. Vào trang "Thông tin tài khoản"
2. Hover vào avatar để hiện các nút điều khiển
3. Click nút thùng rác (🗑️)
4. Xác nhận xóa trong dialog

### Xem Avatar
- Avatar hiển thị ở góc phải header
- Click vào dropdown để xem avatar trong menu
- Avatar cũng hiển thị trong trang profile

## Validation và giới hạn

### File Upload
- **Loại file**: Chỉ chấp nhận hình ảnh
- **Định dạng**: JPG, JPEG, PNG, GIF, WebP
- **Kích thước**: Tối đa 5MB
- **Dimensions**: Tự động resize về 200x200px

### Error Handling
- Hiển thị lỗi nếu file không hợp lệ
- Fallback về initials nếu image load lỗi
- Loading state khi đang upload

## Technical Details

### Avatar Component
```jsx
<Avatar 
  user={currentUser} 
  size={40} 
  className="custom-class"
  showOnlineStatus={false}
  onClick={handleClick}
/>
```

### Props
- **user**: Object chứa thông tin user (fullName, avatar)
- **size**: Kích thước avatar (default: 40px)
- **className**: CSS class tùy chỉnh
- **showOnlineStatus**: Hiển thị dot online (default: false)
- **onClick**: Handler khi click vào avatar

### Avatar Utils
- **generateAvatarFromName()**: Tạo initials từ tên
- **getAvatarColor()**: Tạo màu nền từ tên
- **isValidImageUrl()**: Kiểm tra URL hình ảnh hợp lệ
- **createTextAvatar()**: Tạo canvas avatar với text
- **resizeImage()**: Resize hình ảnh
- **validateImageFile()**: Validate file upload

## Storage

### Data Structure
```javascript
user: {
  id: '1',
  fullName: 'Nguyễn Văn A',
  avatar: 'data:image/jpeg;base64,/9j/4AAQ...' // Base64 string
  // ... other fields
}
```

### LocalStorage
- Avatar được lưu dưới dạng base64 string
- Tự động đồng bộ với current user
- Cập nhật realtime trên tất cả components

## Responsive Design

### Desktop
- Avatar size: 40px trong header, 80px trong profile
- Hover effects cho các nút điều khiển
- Smooth transitions và animations

### Mobile
- Avatar size tự động điều chỉnh
- Touch-friendly buttons
- Optimized layout cho màn hình nhỏ

## Performance

### Optimization
- Lazy loading cho Avatar component
- Automatic image compression
- Efficient re-renders với React.memo
- Canvas-based text avatar generation

### Caching
- Base64 images cached trong localStorage
- Consistent color generation
- Optimized file size với compression

## Accessibility

### Features
- Alt text cho images
- Keyboard navigation support
- Screen reader friendly
- High contrast support

### ARIA Labels
- Proper labeling cho buttons
- Descriptive titles
- Role attributes

## Browser Support

### Compatibility
- Modern browsers với Canvas support
- File API support required
- Base64 encoding support
- CSS3 features (border-radius, transitions)

### Fallbacks
- Graceful degradation cho older browsers
- Text-based fallback nếu không hỗ trợ images
- Basic styling nếu không có CSS3

## Security

### File Validation
- Client-side validation trước khi upload
- File type checking
- Size limitations
- Malicious file prevention

### Data Storage
- Base64 encoding cho security
- No external URLs by default
- Local storage only

## Troubleshooting

### Upload Issues
- **File quá lớn**: Giảm kích thước file xuống dưới 5MB
- **Định dạng không hỗ trợ**: Chỉ sử dụng JPG, PNG, GIF, WebP
- **Upload failed**: Kiểm tra localStorage space

### Display Issues
- **Avatar không hiển thị**: Kiểm tra base64 data integrity
- **Màu sắc không đúng**: Clear localStorage và reload
- **Responsive issues**: Kiểm tra CSS media queries

### Performance Issues
- **Slow loading**: Giảm chất lượng compression
- **Memory issues**: Clear old avatar data
- **Storage full**: Xóa avatar cũ không sử dụng

## Future Enhancements

### Planned Features
- Multiple avatar options
- Avatar templates
- Social media integration
- Gravatar support
- Avatar history/versions

### Improvements
- Better compression algorithms
- Cloud storage integration
- Real-time avatar sync
- Advanced editing tools
- Batch avatar management

## API Reference

### Avatar Component Methods
```javascript
// Generate initials
const initials = generateAvatarFromName('Nguyễn Văn A'); // 'NV'

// Get color
const color = getAvatarColor('Nguyễn Văn A'); // '#e74c3c'

// Validate file
const validation = validateImageFile(file);
// { isValid: true/false, errors: [] }

// Resize image
const resizedImage = await resizeImage(file, 200, 200, 0.8);
```

### Event Handlers
```javascript
// Upload handler
const handleAvatarUpload = async (event) => {
  const file = event.target.files[0];
  // ... validation and processing
};

// Remove handler
const handleRemoveAvatar = () => {
  // ... confirmation and removal
};
```