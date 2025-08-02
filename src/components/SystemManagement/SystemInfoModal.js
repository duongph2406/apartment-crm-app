import React from 'react';
import { X, Info, Server, Clock, Cpu } from 'lucide-react';

const SystemInfoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const systemInfo = {
    version: '1.0.0',
    buildDate: '2025-02-08',
    environment: 'Production',
    database: 'LocalStorage',
    uptime: '24/7',
    lastUpdate: new Date().toLocaleDateString('vi-VN'),
    features: [
      'Quản lý phòng trọ',
      'Quản lý khách thuê',
      'Quản lý hợp đồng',
      'Quản lý hóa đơn',
      'Báo cáo sự cố',
      'Phản ánh khách hàng',
      'Quản lý chi phí',
      'Quản lý tài khoản'
    ],
    performance: {
      loadTime: '< 2s',
      responseTime: '< 100ms',
      availability: '99.9%'
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal system-info-modal">
        <div className="modal-header">
          <h2>
            <Info size={20} />
            Thông tin hệ thống
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-content">
          <div className="system-info-grid">
            <div className="info-section">
              <h3>
                <Server size={18} />
                Thông tin cơ bản
              </h3>
              <div className="info-list">
                <div className="info-row">
                  <span>Phiên bản:</span>
                  <strong>{systemInfo.version}</strong>
                </div>
                <div className="info-row">
                  <span>Ngày build:</span>
                  <strong>{systemInfo.buildDate}</strong>
                </div>
                <div className="info-row">
                  <span>Môi trường:</span>
                  <strong>{systemInfo.environment}</strong>
                </div>
                <div className="info-row">
                  <span>Cơ sở dữ liệu:</span>
                  <strong>{systemInfo.database}</strong>
                </div>
                <div className="info-row">
                  <span>Cập nhật cuối:</span>
                  <strong>{systemInfo.lastUpdate}</strong>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3>
                <Cpu size={18} />
                Hiệu suất
              </h3>
              <div className="info-list">
                <div className="info-row">
                  <span>Thời gian tải:</span>
                  <strong>{systemInfo.performance.loadTime}</strong>
                </div>
                <div className="info-row">
                  <span>Thời gian phản hồi:</span>
                  <strong>{systemInfo.performance.responseTime}</strong>
                </div>
                <div className="info-row">
                  <span>Độ khả dụng:</span>
                  <strong>{systemInfo.performance.availability}</strong>
                </div>
                <div className="info-row">
                  <span>Thời gian hoạt động:</span>
                  <strong>{systemInfo.uptime}</strong>
                </div>
              </div>
            </div>

            <div className="info-section full-width">
              <h3>
                <Clock size={18} />
                Tính năng hệ thống
              </h3>
              <div className="features-grid">
                {systemInfo.features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <span className="feature-dot"></span>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemInfoModal;