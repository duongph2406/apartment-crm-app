import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Building, 
  Users, 
  FileText, 
  Receipt, 
  AlertTriangle, 
  MessageSquare, 
  DollarSign, 
  UserCog, 
  Settings 
} from 'lucide-react';
import { USER_ROLES } from '../../constants/roles';

const Sidebar = ({ currentUser }) => {
  const menuItems = [
    { path: '/', icon: Home, label: 'Trang chủ', roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.USER, USER_ROLES.TENANT] },
    { path: '/rooms', icon: Building, label: 'Quản lý phòng', roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.USER] },
    { path: '/tenants', icon: Users, label: 'Quản lý khách thuê', roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.USER] },
    { path: '/contracts', icon: FileText, label: 'Quản lý hợp đồng', roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.USER, USER_ROLES.TENANT] },
    { path: '/invoices', icon: Receipt, label: 'Quản lý hóa đơn', roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.USER, USER_ROLES.TENANT] },
    { path: '/incidents', icon: AlertTriangle, label: 'Báo cáo sự cố', roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.USER] },
    { path: '/feedback', icon: MessageSquare, label: 'Phản ánh', roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.USER] },
    { path: '/expenses', icon: DollarSign, label: 'Quản lý chi phí', roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.USER] },
    { path: '/accounts', icon: UserCog, label: 'Quản lý tài khoản', roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER] },
    { path: '/system', icon: Settings, label: 'Quản lý hệ thống', roles: [USER_ROLES.ADMIN] }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(currentUser?.role)
  );

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>CRM Căn Hộ</h2>
      </div>
      <nav className="sidebar-nav">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `sidebar-item ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;