import React, { useState, useEffect } from 'react';
import { FileText, Download, Trash2, Filter, Calendar } from 'lucide-react';

const SystemLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, filterLevel, filterDate]);

  const loadLogs = () => {
    // Tạo logs mẫu
    const sampleLogs = [
      {
        id: 1,
        timestamp: new Date().toISOString(),
        level: 'info',
        message: 'Hệ thống khởi động thành công',
        module: 'System'
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        level: 'info',
        message: 'Người dùng admin đăng nhập',
        module: 'Auth'
      },
      {
        id: 3,
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        level: 'warning',
        message: 'Dung lượng lưu trữ sắp đầy',
        module: 'Storage'
      },
      {
        id: 4,
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        level: 'error',
        message: 'Lỗi kết nối cơ sở dữ liệu',
        module: 'Database'
      },
      {
        id: 5,
        timestamp: new Date(Date.now() - 14400000).toISOString(),
        level: 'info',
        message: 'Sao lưu dữ liệu hoàn thành',
        module: 'Backup'
      }
    ];
    
    setLogs(sampleLogs);
  };

  const filterLogs = () => {
    let filtered = logs;

    if (filterLevel !== 'all') {
      filtered = filtered.filter(log => log.level === filterLevel);
    }

    if (filterDate) {
      const selectedDate = new Date(filterDate).toDateString();
      filtered = filtered.filter(log => 
        new Date(log.timestamp).toDateString() === selectedDate
      );
    }

    setFilteredLogs(filtered);
  };

  const exportLogs = () => {
    const logData = filteredLogs.map(log => ({
      timestamp: new Date(log.timestamp).toLocaleString('vi-VN'),
      level: log.level.toUpperCase(),
      module: log.module,
      message: log.message
    }));

    const csvContent = [
      ['Thời gian', 'Mức độ', 'Module', 'Thông điệp'],
      ...logData.map(log => [log.timestamp, log.level, log.module, log.message])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system_logs_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearLogs = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tất cả logs?')) {
      setLogs([]);
      setFilteredLogs([]);
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'error': return '#e74c3c';
      case 'warning': return '#f39c12';
      case 'info': return '#3498db';
      default: return '#666';
    }
  };

  const getLevelLabel = (level) => {
    switch (level) {
      case 'error': return 'Lỗi';
      case 'warning': return 'Cảnh báo';
      case 'info': return 'Thông tin';
      default: return level;
    }
  };

  return (
    <div className="system-logs">
      <div className="logs-header">
        <h3>
          <FileText size={18} />
          Nhật ký hệ thống
        </h3>
        <div className="logs-actions">
          <button className="btn btn-success btn-sm" onClick={exportLogs}>
            <Download size={16} />
            Xuất logs
          </button>
          <button className="btn btn-danger btn-sm" onClick={clearLogs}>
            <Trash2 size={16} />
            Xóa logs
          </button>
        </div>
      </div>

      <div className="logs-filters">
        <div className="filter-group">
          <Filter size={16} />
          <select 
            value={filterLevel} 
            onChange={(e) => setFilterLevel(e.target.value)}
          >
            <option value="all">Tất cả mức độ</option>
            <option value="info">Thông tin</option>
            <option value="warning">Cảnh báo</option>
            <option value="error">Lỗi</option>
          </select>
        </div>
        <div className="filter-group">
          <Calendar size={16} />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
      </div>

      <div className="logs-container">
        {filteredLogs.length === 0 ? (
          <div className="no-logs">
            <FileText size={48} />
            <p>Không có logs nào</p>
          </div>
        ) : (
          <div className="logs-list">
            {filteredLogs.map(log => (
              <div key={log.id} className="log-item">
                <div className="log-header">
                  <span 
                    className="log-level"
                    style={{ color: getLevelColor(log.level) }}
                  >
                    {getLevelLabel(log.level)}
                  </span>
                  <span className="log-module">{log.module}</span>
                  <span className="log-timestamp">
                    {new Date(log.timestamp).toLocaleString('vi-VN')}
                  </span>
                </div>
                <div className="log-message">
                  {log.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemLogs;