# Hướng dẫn đồng bộ cập nhật thông tin người dùng

## Vấn đề
Khi người dùng cập nhật thông tin (tên, avatar, v.v.) trong trang Profile, thông tin được lưu vào localStorage và cập nhật trong Profile component, nhưng Header vẫn hiển thị thông tin cũ vì App.js không biết về sự thay đổi này.

## Nguyên nhân
- **State isolation**: Profile component có state riêng (`currentUser`)
- **No communication**: Không có cơ chế thông báo từ Profile lên App.js
- **Stale data**: App.js vẫn giữ currentUser cũ trong state

## Giải pháp đã triển khai

### 1. Callback Pattern
Sử dụng callback function để thông báo từ child component (Profile) lên parent component (App.js):

```javascript
// App.js
const handleUserUpdate = (updatedUser) => {
  setCurrentUser(updatedUser);
};

// Truyền callback xuống Profile
<Route path="/profile" element={<Profile onUserUpdate={handleUserUpdate} />} />
```

### 2. Profile Component Updates
Profile component gọi callback sau mỗi lần cập nhật:

```javascript
// Profile.js
const Profile = ({ onUserUpdate }) => {
  const handleSaveProfile = () => {
    // ... validation và update logic
    
    updateUser(updatedUser);
    setCurrentUser(updatedUser);
    
    // Thông báo cho App.js
    if (onUserUpdate) {
      onUserUpdate(updatedUser);
    }
  };
};
```

### 3. Các điểm cập nhật
Callback được gọi tại các điểm sau:
- **Lưu thông tin cá nhân**: `handleSaveProfile()`
- **Đổi mật khẩu**: `handleChangePassword()`
- **Upload avatar**: `handleAvatarUpload()`
- **Xóa avatar**: `handleRemoveAvatar()`

## Luồng hoạt động

### Trước khi sửa:
1. User cập nhật thông tin trong Profile
2. Profile component cập nhật local state
3. localStorage được cập nhật
4. **Header vẫn hiển thị thông tin cũ** ❌

### Sau khi sửa:
1. User cập nhật thông tin trong Profile
2. Profile component cập nhật local state
3. localStorage được cập nhật
4. **Callback thông báo cho App.js**
5. **App.js cập nhật currentUser state**
6. **Header hiển thị thông tin mới** ✅

## Code Implementation

### App.js
```javascript
function App() {
  const [currentUser, setCurrentUser] = useState(null);
  
  // Callback để cập nhật currentUser
  const handleUserUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
  };
  
  return (
    <Router>
      <Layout currentUser={currentUser} onLogout={handleLogout}>
        <Routes>
          {/* Truyền callback xuống Profile */}
          <Route path="/profile" element={<Profile onUserUpdate={handleUserUpdate} />} />
        </Routes>
      </Layout>
    </Router>
  );
}
```

### Profile.js
```javascript
const Profile = ({ onUserUpdate }) => {
  const handleSaveProfile = () => {
    if (!validateForm()) return;

    try {
      const updatedUser = { ...currentUser, ...formData };
      
      updateUser(updatedUser);
      setCurrentUser(updatedUser);
      
      // Thông báo cho App.js cập nhật currentUser
      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }
      
      setIsEditing(false);
      alert('Cập nhật thông tin thành công!');
    } catch (error) {
      alert('Có lỗi xảy ra khi cập nhật thông tin!');
    }
  };
};
```

## Lợi ích của giải pháp

### 1. Real-time sync
- Thông tin được đồng bộ ngay lập tức
- Không cần refresh trang
- UX mượt mà và nhất quán

### 2. Maintainable
- Code rõ ràng và dễ hiểu
- Không phụ thuộc vào external libraries
- Dễ debug và test

### 3. Performance
- Không có polling hoặc watching
- Chỉ update khi cần thiết
- Minimal re-renders

## Alternative Solutions

### 1. Context API
```javascript
// UserContext.js
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  
  const updateCurrentUser = (user) => {
    setCurrentUser(user);
    updateUser(user); // Update localStorage
  };
  
  return (
    <UserContext.Provider value={{ currentUser, updateCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};
```

### 2. Custom Hook
```javascript
// useCurrentUser.js
export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  
  const updateCurrentUser = useCallback((user) => {
    setCurrentUser(user);
    updateUser(user);
    
    // Broadcast to other components
    window.dispatchEvent(new CustomEvent('userUpdated', { detail: user }));
  }, []);
  
  useEffect(() => {
    const handleUserUpdate = (event) => {
      setCurrentUser(event.detail);
    };
    
    window.addEventListener('userUpdated', handleUserUpdate);
    return () => window.removeEventListener('userUpdated', handleUserUpdate);
  }, []);
  
  return { currentUser, updateCurrentUser };
};
```

### 3. State Management (Redux/Zustand)
```javascript
// userStore.js (Zustand)
import { create } from 'zustand';

export const useUserStore = create((set) => ({
  currentUser: getCurrentUser(),
  updateCurrentUser: (user) => {
    updateUser(user);
    set({ currentUser: user });
  }
}));
```

## Khi nào sử dụng từng giải pháp

### Callback Pattern (Hiện tại)
- ✅ Ứng dụng nhỏ đến trung bình
- ✅ Ít components cần access user data
- ✅ Đơn giản và dễ hiểu

### Context API
- ✅ Nhiều components cần access user data
- ✅ Tránh prop drilling
- ❌ Có thể gây re-render không cần thiết

### Custom Hook
- ✅ Logic phức tạp
- ✅ Cần sync across tabs/windows
- ❌ Phức tạp hơn cho use case đơn giản

### State Management
- ✅ Ứng dụng lớn và phức tạp
- ✅ Nhiều global state
- ❌ Overkill cho ứng dụng nhỏ

## Testing

### Unit Tests
```javascript
// Profile.test.js
test('should call onUserUpdate when profile is saved', () => {
  const mockOnUserUpdate = jest.fn();
  const { getByText } = render(<Profile onUserUpdate={mockOnUserUpdate} />);
  
  // ... simulate form fill and save
  
  expect(mockOnUserUpdate).toHaveBeenCalledWith(expectedUser);
});
```

### Integration Tests
```javascript
// App.test.js
test('should update header when profile is changed', async () => {
  const { getByText, getByTestId } = render(<App />);
  
  // Navigate to profile
  fireEvent.click(getByText('Thông tin tài khoản'));
  
  // Update name
  const nameInput = getByTestId('fullName-input');
  fireEvent.change(nameInput, { target: { value: 'New Name' } });
  fireEvent.click(getByText('Lưu thay đổi'));
  
  // Check header is updated
  expect(getByText('New Name')).toBeInTheDocument();
});
```

## Troubleshooting

### Vấn đề thường gặp:

1. **Callback không được gọi**
   - Kiểm tra onUserUpdate có được truyền đúng không
   - Verify callback được gọi trong tất cả update functions

2. **Header không cập nhật**
   - Check App.js có implement handleUserUpdate đúng không
   - Verify currentUser state được update

3. **Data không consistent**
   - Đảm bảo localStorage và state được update cùng lúc
   - Check updateUser function hoạt động đúng

### Debug Tips:
```javascript
// Thêm logging để debug
const handleUserUpdate = (updatedUser) => {
  console.log('App.js: Updating currentUser', updatedUser);
  setCurrentUser(updatedUser);
};

// Trong Profile component
if (onUserUpdate) {
  console.log('Profile: Calling onUserUpdate', updatedUser);
  onUserUpdate(updatedUser);
}
```

## Kết luận

Giải pháp callback pattern đã được triển khai thành công để đồng bộ thông tin người dùng giữa Profile component và Header. Đây là giải pháp đơn giản, hiệu quả và phù hợp với quy mô ứng dụng hiện tại.

Bây giờ khi bạn cập nhật thông tin trong trang Profile, Header sẽ hiển thị thông tin mới ngay lập tức mà không cần refresh trang.