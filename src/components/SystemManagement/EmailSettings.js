import React, { useState, useEffect } from 'react';
import { Mail, Send, TestTube } from 'lucide-react';

const EmailSettings = () => {
  const [emailConfig, setEmailConfig] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
    fromEmail: '',
    fromName: 'Hệ thống quản lý chung cư',
    enableSSL: true,
    enableNotifications: true
  });
  const [testEmail, setTestEmail] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    loadEmailConfig();
  }, []);

  const loadEmailConfig = () => {
    const savedConfig = localStorage.getItem('emailConfig');
    if (savedConfig) {
      setEmailConfig(JSON.parse(savedConfig));
    }
  };

  const saveEmailConfig = () => {
    localStorage.setItem('emailConfig', JSON.stringify(emailConfig));
    alert('Cấu hình email đã được lưu thành công!');
  };

  const testEmailConnection = async () => {
    if (!testEmail) {
      alert('Vui lòng nhập email để test!');
      return;
    }

    setIsTesting(true);
    
    // Simulate email test
    setTimeout(() => {
      setIsTesting(false);
      alert(`Email test đã được gửi đến ${testEmail}!\n\nLưu ý: Đây là demo, email thực tế sẽ không được gửi.`);
    }, 2000);
  };

  const handleInputChange = (field, value) => {
    setEmailConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="email-settings">
      <h3>
        <Mail size={18} />
        Cấu hình Email
      </h3>
      
      <div className="email-config-form">
        <div className="form-section">
          <h4>Cấu hình SMTP</h4>
          <div className="form-grid">
            <div className="form-group">
              <label>SMTP Host</label>
              <input
                type="text"
                value={emailConfig.smtpHost}
                onChange={(e) => handleInputChange('smtpHost', e.target.value)}
                placeholder="smtp.gmail.com"
              />
            </div>
            <div className="form-group">
              <label>SMTP Port</label>
              <input
                type="number"
                value={emailConfig.smtpPort}
                onChange={(e) => handleInputChange('smtpPort', e.target.value)}
                placeholder="587"
              />
            </div>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={emailConfig.smtpUser}
                onChange={(e) => handleInputChange('smtpUser', e.target.value)}
                placeholder="your-email@gmail.com"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={emailConfig.smtpPassword}
                onChange={(e) => handleInputChange('smtpPassword', e.target.value)}
                placeholder="App Password"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4>Thông tin người gửi</h4>
          <div className="form-grid">
            <div className="form-group">
              <label>Email người gửi</label>
              <input
                type="email"
                value={emailConfig.fromEmail}
                onChange={(e) => handleInputChange('fromEmail', e.target.value)}
                placeholder="noreply@yourcompany.com"
              />
            </div>
            <div className="form-group">
              <label>Tên người gửi</label>
              <input
                type="text"
                value={emailConfig.fromName}
                onChange={(e) => handleInputChange('fromName', e.target.value)}
                placeholder="Hệ thống quản lý chung cư"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4>Tùy chọn bảo mật</h4>
          <div className="checkbox-options">
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={emailConfig.enableSSL}
                  onChange={(e) => handleInputChange('enableSSL', e.target.checked)}
                />
                Sử dụng SSL/TLS
              </label>
            </div>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={emailConfig.enableNotifications}
                  onChange={(e) => handleInputChange('enableNotifications', e.target.checked)}
                />
                Bật thông báo email
              </label>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4>Test Email</h4>
          <div className="test-email-section">
            <div className="test-input-group">
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Nhập email để test"
              />
              <button 
                className="btn btn-primary"
                onClick={testEmailConnection}
                disabled={isTesting}
              >
                {isTesting ? (
                  <>
                    <TestTube size={16} />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Test Email
                  </>
                )}
              </button>
            </div>
            <small>
              Gửi email test để kiểm tra cấu hình SMTP
            </small>
          </div>
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" onClick={saveEmailConfig}>
            Lưu cấu hình
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailSettings;