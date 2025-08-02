import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Eye, EyeOff } from 'lucide-react';
import { storage, formatDate } from '../utils/localStorage';
import { getCurrentUser } from '../utils/auth';
import { PERMISSIONS, USER_ROLES } from '../constants/roles';

const Accounts = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    role: USER_ROLES.USER
  });

  const currentUser = getCurrentUser();
  const permissions = PERMISSIONS[currentUser?.role] || {};

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setUsers(storage.getUsers());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Kiểm tra username đã tồn tại
    const existingUsers = storage.getUsers();
    const usernameExists = existingUsers.some(u => 
      u.username === formData.username && (!editingUser || u.id !== editingUser.id)
    );
    
    if (usernameExists) {
      alert('Tên đăng nhập đã tồn tại!');
      return;
    }
    
    const userData = {
      ...formData,
      id: editingUser ? editingUser.id : Date.now().toString(),
      createdAt: editingUser ? editingUser.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedUsers = editingUser
      ? existingUsers.map(u => u.id === editingUser.id ? userData : u)
      : [...existingUsers, userData];

    storage.setUsers(updatedUsers);
    setUsers(updatedUsers);
    resetForm();
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: user.password,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role
    });
    setShowModal(true);
  };

  const handleDelete = (userId) => {
    if (userId === currentUser.id) {
      alert('Không thể xóa tài khoản đang đăng nhập!');
      return;
    }
    
    if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
      const updatedUsers = users.filter(u => u.id !== userId);
      storage.setUsers(updatedUsers);
      setUsers(updatedUsers);
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      fullName: '',
      email: '',
      phone: '',
      role: USER_ROLES.USER
    });
    setEditingUser(null);
    setShowModal(false);
    setShowPassword(false);
  };

  const getRoleLabel = (role) => {
    const roleLabels = {
      [USER_ROLES.ADMIN]: 'Quản trị viên',
      [USER_ROLES.MANAGER]: 'Quản lý',
      [USER_ROLES.USER]: 'Nhân viên',
      [USER_ROLES.TENANT]: 'Khách thuê'
    };
    return roleLabels[role] || role;
  };

  const getRoleColor = (role) => {
    const roleColors = {
      [USER_ROLES.ADMIN]: 'red',
      [USER_ROLES.MANAGER]: 'blue',
      [USER_ROLES.USER]: 'green',
      [USER_ROLES.TENANT]: 'purple'
    };
    return roleColors[role] || 'gray';
  };

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  return (
    <div className="accounts-page">
      <div className="page-header">
        <h1>Quản lý tài khoản</h1>
        <div className="page-actions">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm tài khoản..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {permissions.canCreate && (
            <button 
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              <Plus size={20} />
              Thêm tài khoản
            </button>
          )}
        </div>
      </div>

      <div className="accounts-table">
        <table>
          <thead>
            <tr>
              <th>Tên đăng nhập</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Quyền hạn</th>
              <th>Ngày tạo</th>
              {(permissions.canUpdate || permissions.canDelete) && <th>Thao tác</th>}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <strong>{user.username}</strong>
                  {user.id === currentUser.id && (
                    <span className="current-user-badge">Bạn</span>
                  )}
                </td>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  <span className={`role-badge ${getRoleColor(user.role)}`}>
                    {getRoleLabel(user.role)}
                  </span>
                </td>
                <td>{formatDate(user.createdAt)}</td>
                {(permissions.canUpdate || permissions.canDelete) && (
                  <td>
                    <div className="action-buttons">
                      {permissions.canUpdate && (
                        <button 
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit size={16} />
                        </button>
                      )}
                      {permissions.canDelete && user.id !== currentUser.id && (
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingUser ? 'Sửa tài khoản' : 'Thêm tài khoản mới'}</h2>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Tên đăng nhập *</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    required
                    disabled={editingUser} // Không cho sửa username
                  />
                </div>
                
                <div className="form-group">
                  <label>Mật khẩu *</label>
                  <div className="password-input">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Họ tên *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Quyền hạn *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    required
                  >
                    <option value={USER_ROLES.USER}>Nhân viên</option>
                    <option value={USER_ROLES.MANAGER}>Quản lý</option>
                    {currentUser?.role === USER_ROLES.ADMIN && (
                      <option value={USER_ROLES.ADMIN}>Quản trị viên</option>
                    )}
                    <option value={USER_ROLES.TENANT}>Khách thuê</option>
                  </select>
                </div>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingUser ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;