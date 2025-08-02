import React from 'react';
import { Building, Users, FileText, Receipt } from 'lucide-react';
import { ROOMS } from '../constants/rooms';
import { storage } from '../utils/localStorage';

const Dashboard = () => {
  const tenants = storage.getTenants();
  const contracts = storage.getContracts();
  const invoices = storage.getInvoices();
  const roomAssignments = storage.getRoomAssignments();
  
  const occupiedRooms = Object.keys(roomAssignments).length;
  const availableRooms = ROOMS.length - occupiedRooms;
  const activeContracts = contracts.filter(c => c.status === 'active').length;
  const pendingInvoices = invoices.filter(i => i.status === 'pending').length;

  const stats = [
    {
      title: 'Tổng số phòng',
      value: ROOMS.length,
      icon: Building,
      color: 'blue'
    },
    {
      title: 'Phòng đã thuê',
      value: occupiedRooms,
      icon: Building,
      color: 'green'
    },
    {
      title: 'Phòng trống',
      value: availableRooms,
      icon: Building,
      color: 'orange'
    },
    {
      title: 'Khách thuê',
      value: tenants.length,
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Hợp đồng hiệu lực',
      value: activeContracts,
      icon: FileText,
      color: 'indigo'
    },
    {
      title: 'Hóa đơn chưa thanh toán',
      value: pendingInvoices,
      icon: Receipt,
      color: 'red'
    }
  ];

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Trang chủ</h1>
        <p>Tổng quan hệ thống quản lý căn hộ</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`stat-card ${stat.color}`}>
              <div className="stat-icon">
                <Icon size={24} />
              </div>
              <div className="stat-content">
                <h3>{stat.value}</h3>
                <p>{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <h2>Thông tin nhanh</h2>
          <div className="quick-info">
            <div className="info-item">
              <h4>Tỷ lệ lấp đầy</h4>
              <p>{((occupiedRooms / ROOMS.length) * 100).toFixed(1)}%</p>
            </div>
            <div className="info-item">
              <h4>Doanh thu tháng này</h4>
              <p>Đang cập nhật...</p>
            </div>
            <div className="info-item">
              <h4>Hợp đồng sắp hết hạn</h4>
              <p>Đang cập nhật...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;