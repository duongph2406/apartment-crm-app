import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../utils/auth';
import Avatar from '../common/Avatar';

const Header = ({ currentUser, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setShowDropdown(false);
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
            ref={dropdownRef}
            className="user-dropdown"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <Avatar user={currentUser} size={36} />
            <div className="user-info">
              <span className="user-name">{currentUser?.fullName}</span>
              <span className="user-role">{getRoleLabel(currentUser?.role)}</span>
            </div>
            <ChevronDown size={16} />
            
            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-item user-info-item">
                  <Avatar user={currentUser} size={32} />
                  <div>
                    <div className="dropdown-name">{currentUser?.fullName}</div>
                    <div className="dropdown-email">{currentUser?.email}</div>
                  </div>
                </div>
                <hr />
                <button 
                  className="dropdown-item"
                  onClick={handleProfileClick}
                >
                  <Settings size={16} />
                  <span>Thông tin tài khoản</span>
                </button>
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