import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Edit3, 
  Save, 
  X,
  Eye,
  EyeOff,
  Key,
  Camera,
  Trash2
} from 'lucide-react';
import { getCurrentUser, updateUser } from '../utils/auth';
import Avatar from '../components/common/Avatar';
import { validateImageFile, resizeImage } from '../utils/avatar';

const Profile = ({ onUserUpdate }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    role: '',
    avatar: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        dateOfBirth: user.dateOfBirth || '',
        role: user.role || '',
        avatar: user.avatar || ''
      });
    }
  }, []);

  const getRoleLabel = (role) => {
    const roleLabels = {
      admin: 'Quản trị viên',
      manager: 'Quản lý',
      user: 'Nhân viên',
      tenant: 'Khách thuê'
    };
    return roleLabels[role] || role;
  };

  const getRoleBadgeClass = (role) => {
    const roleClasses = {
      admin: 'red',
      manager: 'blue',
      user: 'green',
      tenant: 'purple'
    };
    return roleClasses[role] || 'gray';
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ tên không được để trống';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự';
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = () => {
    if (!validateForm()) return;

    try {
      const updatedUser = {
        ...currentUser,
        ...formData
      };
      
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

  const handleChangePassword = () => {
    if (!validatePassword()) return;

    // Verify current password
    if (passwordData.currentPassword !== currentUser.password) {
      setErrors({ currentPassword: 'Mật khẩu hiện tại không đúng' });
      return;
    }

    try {
      const updatedUser = {
        ...currentUser,
        password: passwordData.newPassword
      };
      
      updateUser(updatedUser);
      setCurrentUser(updatedUser);
      
      // Thông báo cho App.js cập nhật currentUser
      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }
      
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      alert('Đổi mật khẩu thành công!');
    } catch (error) {
      alert('Có lỗi xảy ra khi đổi mật khẩu!');
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      fullName: currentUser.fullName || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
      address: currentUser.address || '',
      dateOfBirth: currentUser.dateOfBirth || '',
      role: currentUser.role || '',
      avatar: currentUser.avatar || ''
    });
    setIsEditing(false);
    setErrors({});
  };

  const handleCancelPasswordChange = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setIsChangingPassword(false);
    setErrors({});
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      alert(validation.errors.join('\n'));
      return;
    }

    setIsUploadingAvatar(true);
    
    try {
      const resizedImage = await resizeImage(file, 200, 200, 0.8);
      
      const updatedUser = {
        ...currentUser,
        avatar: resizedImage
      };
      
      updateUser(updatedUser);
      setCurrentUser(updatedUser);
      setFormData(prev => ({ ...prev, avatar: resizedImage }));
      
      // Thông báo cho App.js cập nhật currentUser
      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }
      
      alert('Cập nhật avatar thành công!');
    } catch (error) {
      alert('Có lỗi xảy ra khi tải lên avatar!');
    } finally {
      setIsUploadingAvatar(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveAvatar = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa avatar?')) {
      const updatedUser = {
        ...currentUser,
        avatar: ''
      };
      
      updateUser(updatedUser);
      setCurrentUser(updatedUser);
      setFormData(prev => ({ ...prev, avatar: '' }));
      
      // Thông báo cho App.js cập nhật currentUser
      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }
      
      alert('Đã xóa avatar thành công!');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!currentUser) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>
          <User size={24} />
          Thông tin tài khoản
        </h1>
        <p>Quản lý thông tin cá nhân và cài đặt tài khoản</p>
      </div>

      <div className="profile-container">
        {/* Profile Info Card */}
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar-section">
              <div className="profile-avatar-container">
                <Avatar user={currentUser} size={80} />
                <div className="avatar-overlay">
                  <button 
                    className="avatar-btn upload-btn"
                    onClick={triggerFileInput}
                    disabled={isUploadingAvatar}
                    title="Thay đổi avatar"
                  >
                    {isUploadingAvatar ? (
                      <div className="loading-spinner"></div>
                    ) : (
                      <Camera size={16} />
                    )}
                  </button>
                  {currentUser.avatar && (
                    <button 
                      className="avatar-btn remove-btn"
                      onClick={handleRemoveAvatar}
                      title="Xóa avatar"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                style={{ display: 'none' }}
              />
            </div>
            <div className="profile-info">
              <h2>{currentUser.fullName}</h2>
              <span className={`role-badge ${getRoleBadgeClass(currentUser.role)}`}>
                {getRoleLabel(currentUser.role)}
              </span>
            </div>
            <div className="profile-actions">
              {!isEditing && (
                <button 
                  className="btn btn-primary"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 size={16} />
                  Chỉnh sửa
                </button>
              )}
            </div>
          </div>

          <div className="profile-content">
            <div className="profile-section">
              <h3>Thông tin cá nhân</h3>
              <div className="profile-fields">
                <div className="field-group">
                  <label>
                    <User size={16} />
                    Họ và tên
                  </label>
                  {isEditing ? (
                    <div className="input-wrapper">
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className={errors.fullName ? 'error' : ''}
                      />
                      {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                    </div>
                  ) : (
                    <span>{currentUser.fullName}</span>
                  )}
                </div>

                <div className="field-group">
                  <label>
                    <Mail size={16} />
                    Email
                  </label>
                  {isEditing ? (
                    <div className="input-wrapper">
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={errors.email ? 'error' : ''}
                      />
                      {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>
                  ) : (
                    <span>{currentUser.email}</span>
                  )}
                </div>

                <div className="field-group">
                  <label>
                    <Phone size={16} />
                    Số điện thoại
                  </label>
                  {isEditing ? (
                    <div className="input-wrapper">
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Nhập số điện thoại"
                        className={errors.phone ? 'error' : ''}
                      />
                      {errors.phone && <span className="error-text">{errors.phone}</span>}
                    </div>
                  ) : (
                    <span>{currentUser.phone || 'Chưa cập nhật'}</span>
                  )}
                </div>

                <div className="field-group">
                  <label>
                    <MapPin size={16} />
                    Địa chỉ
                  </label>
                  {isEditing ? (
                    <div className="input-wrapper">
                      <textarea
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Nhập địa chỉ"
                        rows="2"
                      />
                    </div>
                  ) : (
                    <span>{currentUser.address || 'Chưa cập nhật'}</span>
                  )}
                </div>

                <div className="field-group">
                  <label>
                    <Calendar size={16} />
                    Ngày sinh
                  </label>
                  {isEditing ? (
                    <div className="input-wrapper">
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      />
                    </div>
                  ) : (
                    <span>
                      {currentUser.dateOfBirth 
                        ? new Date(currentUser.dateOfBirth).toLocaleDateString('vi-VN')
                        : 'Chưa cập nhật'
                      }
                    </span>
                  )}
                </div>

                <div className="field-group">
                  <label>
                    <Shield size={16} />
                    Vai trò
                  </label>
                  <span className={`role-badge ${getRoleBadgeClass(currentUser.role)}`}>
                    {getRoleLabel(currentUser.role)}
                  </span>
                </div>
              </div>

              {isEditing && (
                <div className="form-actions">
                  <button className="btn btn-primary" onClick={handleSaveProfile}>
                    <Save size={16} />
                    Lưu thay đổi
                  </button>
                  <button className="btn btn-secondary" onClick={handleCancelEdit}>
                    <X size={16} />
                    Hủy
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Password Change Card */}
        <div className="profile-card">
          <div className="profile-section">
            <div className="section-header">
              <h3>
                <Key size={18} />
                Đổi mật khẩu
              </h3>
              {!isChangingPassword && (
                <button 
                  className="btn btn-warning"
                  onClick={() => setIsChangingPassword(true)}
                >
                  <Key size={16} />
                  Đổi mật khẩu
                </button>
              )}
            </div>

            {isChangingPassword && (
              <div className="password-form">
                <div className="field-group">
                  <label>Mật khẩu hiện tại</label>
                  <div className="password-input">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      className={errors.currentPassword ? 'error' : ''}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.currentPassword && <span className="error-text">{errors.currentPassword}</span>}
                </div>

                <div className="field-group">
                  <label>Mật khẩu mới</label>
                  <div className="password-input">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      className={errors.newPassword ? 'error' : ''}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.newPassword && <span className="error-text">{errors.newPassword}</span>}
                </div>

                <div className="field-group">
                  <label>Xác nhận mật khẩu mới</label>
                  <div className="password-input">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      className={errors.confirmPassword ? 'error' : ''}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                </div>

                <div className="form-actions">
                  <button className="btn btn-warning" onClick={handleChangePassword}>
                    <Key size={16} />
                    Đổi mật khẩu
                  </button>
                  <button className="btn btn-secondary" onClick={handleCancelPasswordChange}>
                    <X size={16} />
                    Hủy
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;