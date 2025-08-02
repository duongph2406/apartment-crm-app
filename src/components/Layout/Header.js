import React, { useState } from 'react';
import { ChevronDown, User, LogOut } from 'lucide-react';
import { logout } from '../../utils/auth';

const Header = ({ currentUser, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const getRoleLabel = (role) => {
    const roleLabels = {
      admin: 'Quản trị viên',
      manager: 'Quản lý',
      user: 'Nhân viên',
      tenant: 'Khách thuê'
    };
    return roleLabels[role] || role;
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-title">
          <h1>Hệ thống quản lý căn hộ</h1>
        </div>
        
        <div className="header-user">
          <div 
            className="user-dropdown"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="user-info">
              <span className="user-name">{currentUser?.fullName}</span>
              <span className="user-role">{getRoleLabel(currentUser?.role)}</span>
            </div>
            <ChevronDown size={16} />
            
            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-item">
                  <User size={16} />
                  <div>
                    <div className="dropdown-name">{currentUser?.fullName}</div>
                    <div className="dropdown-email">{currentUser?.email}</div>
                  </div>
                </div>
                <hr />
                <button 
                  className="dropdown-item logout-btn"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  <span>Đăng xuất</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;