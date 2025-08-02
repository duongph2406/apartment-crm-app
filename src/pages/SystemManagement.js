import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Database, 
  Shield, 
  Users, 
  Activity, 
  HardDrive,
  Bell,
  FileText,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Info
} from 'lucide-react';
import { storage } from '../utils/localStorage';
import SystemInfoModal from '../components/SystemManagement/SystemInfoModal';
import SystemLogs from '../components/SystemManagement/SystemLogs';
import EmailSettings from '../components/SystemManagement/EmailSettings';
import '../components/SystemManagement/SystemManagement.css';

const SystemManagement = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [showSystemInfo, setShowSystemInfo] = useState(false);
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    totalRooms: 0,
    totalContracts: 0,
    storageUsed: '2.5 MB',
    lastBackup: new Date().toLocaleDateString('vi-VN')
  });
  const [settings, setSettings] = useState({
    siteName: 'Hệ thống quản lý chung cư',
    adminEmail: 'admin@example.com',
    autoBackup: true,
    emailNotifications: true,
    maintenanceMode: false,
    maxFileSize: '10',
    sessionTimeout: '30'
  });

  useEffect(() => {
    loadSystemStats();
    loadSettings();
  }, []);

  const loadSystemStats = () => {
    const users = storage.getUsers() || [];
    const rooms = storage.getRooms() || [];
    const contracts = storage.getContracts() || [];
    
    setSystemStats(prev => ({
      ...prev,
      totalUsers: users.length,
      totalRooms: rooms.length,
      totalContracts: contracts.length
    }));
  };

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('systemSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  };

  const saveSettings = () => {
    localStorage.setItem('systemSettings', JSON.stringify(settings));
    alert('Cài đặt đã được lưu thành công!');
  };

  const handleBackup = () => {
    const data = {
      users: storage.getUsers(),
      rooms: storage.getRooms(),
      tenants: storage.getTenants(),
      contracts: storage.getContracts(),
      invoices: storage.getInvoices(),
      incidents: storage.getIncidents(),
      feedbacks: storage.getFeedbacks(),
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setSystemStats(prev => ({
      ...prev,
      lastBackup: new Date().toLocaleDateString('vi-VN')
    }));
  };

  const handleRestore = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        if (window.confirm('Bạn có chắc chắn muốn khôi phục dữ liệu? Điều này sẽ ghi đè lên dữ liệu hiện tại.')) {
          Object.keys(data).forEach(key => {
            if (key !== 'timestamp' && Array.isArray(data[key])) {
              localStorage.setItem(key, JSON.stringify(data[key]));
            }
          });
          
          alert('Khôi phục dữ liệu thành công!');
          loadSystemStats();
        }
      } catch (error) {
        alert('File backup không hợp lệ!');
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ dữ liệu? Hành động này không thể hoàn tác!')) {
      if (window.confirm('Xác nhận lần cuối: Toàn bộ dữ liệu sẽ bị xóa vĩnh viễn!')) {
        const keysToKeep = ['systemSettings', 'users'];
        const allKeys = Object.keys(localStorage);
        
        allKeys.forEach(key => {
          if (!keysToKeep.includes(key)) {
            localStorage.removeItem(key);
          }
        });
        
        alert('Đã xóa toàn bộ dữ liệu!');
        loadSystemStats();
      }
    }
  };

  const tabs = [
    { id: 'general', label: 'Cài đặt chung', icon: Settings },
    { id: 'database', label: 'Cơ sở dữ liệu', icon: Database },
    { id: 'security', label: 'Bảo mật', icon: Shield },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
    { id: 'logs', label: 'Nhật ký', icon: FileText },
    { id: 'system', label: 'Hệ thống', icon: Activity }
  ];

  return (
    <div className="system-management">
      <div className="page-header">
        <h1>
          <Settings size={24} />
          Quản lý hệ thống
        </h1>
        <p>Cấu hình và quản lý hệ thống</p>
      </div>

      <div className="system-stats">
        <div className="stats-grid">
          <div className="stat-card">
            <Users size={24} />
            <div>
              <h3>{systemStats.totalUsers}</h3>
              <p>Người dùng</p>
            </div>
          </div>
          <div className="stat-card">
            <HardDrive size={24} />
            <div>
              <h3>{systemStats.totalRooms}</h3>
              <p>Phòng</p>
            </div>
          </div>
          <div className="stat-card">
            <FileText size={24} />
            <div>
              <h3>{systemStats.totalContracts}</h3>
              <p>Hợp đồng</p>
            </div>
          </div>
          <div className="stat-card">
            <Database size={24} />
            <div>
              <h3>{systemStats.storageUsed}</h3>
              <p>Dung lượng</p>
            </div>
          </div>
        </div>
      </div>

      <div className="system-tabs">
        <div className="tab-nav">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="tab-content">
          {activeTab === 'general' && (
            <div className="settings-section">
              <h3>Cài đặt chung</h3>
              <div className="form-group">
                <label>Tên hệ thống</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Email quản trị</label>
                <input
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) => setSettings({...settings, adminEmail: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Kích thước file tối đa (MB)</label>
                <input
                  type="number"
                  value={settings.maxFileSize}
                  onChange={(e) => setSettings({...settings, maxFileSize: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Thời gian hết phiên (phút)</label>
                <input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({...settings, sessionTimeout: e.target.value})}
                />
              </div>
              <button className="btn btn-primary" onClick={saveSettings}>
                Lưu cài đặt
              </button>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="settings-section">
              <h3>Quản lý cơ sở dữ liệu</h3>
              <div className="backup-section">
                <div className="backup-info">
                  <p>Sao lưu cuối: {systemStats.lastBackup}</p>
                </div>
                <div className="backup-actions">
                  <button className="btn btn-success" onClick={handleBackup}>
                    <Download size={18} />
                    Sao lưu dữ liệu
                  </button>
                  <label className="btn btn-warning">
                    <Upload size={18} />
                    Khôi phục dữ liệu
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleRestore}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <button className="btn btn-danger" onClick={clearAllData}>
                    <Trash2 size={18} />
                    Xóa toàn bộ dữ liệu
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-section">
              <h3>Cài đặt bảo mật</h3>
              <div className="security-options">
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.autoBackup}
                      onChange={(e) => setSettings({...settings, autoBackup: e.target.checked})}
                    />
                    Tự động sao lưu hàng ngày
                  </label>
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.maintenanceMode}
                      onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                    />
                    Chế độ bảo trì
                  </label>
                </div>
              </div>
              <button className="btn btn-primary" onClick={saveSettings}>
                Lưu cài đặt
              </button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h3>Cài đặt thông báo</h3>
              <div className="notification-options">
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                    />
                    Gửi thông báo qua email
                  </label>
                </div>
              </div>
              <button className="btn btn-primary" onClick={saveSettings}>
                Lưu cài đặt
              </button>
              
              <div style={{ marginTop: '30px' }}>
                <EmailSettings />
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <SystemLogs />
          )}

          {activeTab === 'system' && (
            <div className="settings-section">
              <h3>Thông tin hệ thống</h3>
              <div className="system-info">
                <div className="info-item">
                  <strong>Phiên bản:</strong> 1.0.0
                </div>
                <div className="info-item">
                  <strong>Trạng thái:</strong> 
                  <span className="status-online">Hoạt động</span>
                </div>
                <div className="info-item">
                  <strong>Thời gian hoạt động:</strong> 24/7
                </div>
                <div className="info-item">
                  <strong>Cập nhật cuối:</strong> {new Date().toLocaleDateString('vi-VN')}
                </div>
              </div>
              <div className="system-actions">
                <button className="btn btn-primary" onClick={() => setShowSystemInfo(true)}>
                  <Info size={18} />
                  Xem chi tiết
                </button>
                <button className="btn btn-secondary" onClick={() => window.location.reload()}>
                  <RefreshCw size={18} />
                  Tải lại hệ thống
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <SystemInfoModal 
        isOpen={showSystemInfo}
        onClose={() => setShowSystemInfo(false)}
      />
    </div>
  );
};

export default SystemManagement;