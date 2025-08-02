import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { storage, formatDate } from '../utils/localStorage';
import { getCurrentUser } from '../utils/auth';
import { PERMISSIONS } from '../constants/roles';

const Tenants = () => {
  const [tenants, setTenants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    gender: 'male',
    phone: '',
    email: '',
    idType: 'cccd',
    // CCCD fields
    cccd: {
      number: '',
      nationality: 'Việt Nam',
      hometown: '',
      residence: '',
      issueDate: '',
      issuePlace: 'Cục Cảnh sát Quản lý Hành chính về Trật tự Xã hội',
      expiryDate: ''
    },
    // Passport fields
    passport: {
      number: '',
      type: '',
      code: '',
      nationality: '',
      birthPlace: '',
      cccdNumber: '',
      issueDate: '',
      issuePlace: 'Cục Quản lý xuất nhập cảnh',
      expiryDate: ''
    }
  });

  const currentUser = getCurrentUser();
  const permissions = PERMISSIONS[currentUser?.role] || {};

  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = () => {
    setTenants(storage.getTenants());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.idType === 'cccd' && !formData.cccd.number) {
      alert('Vui lòng nhập số CCCD!');
      return;
    }
    
    if (formData.idType === 'passport' && !formData.passport.number) {
      alert('Vui lòng nhập số hộ chiếu!');
      return;
    }
    
    const tenantData = {
      ...formData,
      id: editingTenant ? editingTenant.id : Date.now().toString(),
      createdAt: editingTenant ? editingTenant.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedTenants = editingTenant
      ? tenants.map(t => t.id === editingTenant.id ? tenantData : t)
      : [...tenants, tenantData];

    storage.setTenants(updatedTenants);
    setTenants(updatedTenants);
    resetForm();
  };

  const handleEdit = (tenant) => {
    setEditingTenant(tenant);
    
    // Migration for old data structure
    const migratedData = {
      fullName: tenant.fullName || '',
      birthDate: tenant.birthDate || '',
      gender: tenant.gender || 'male',
      phone: tenant.phone || '',
      email: tenant.email || '',
      idType: tenant.idType || 'cccd',
      cccd: tenant.cccd || {
        number: tenant.idCard || '', // Migrate old idCard field
        nationality: 'Việt Nam',
        hometown: tenant.address || '', // Migrate old address field
        residence: '',
        issueDate: '',
        issuePlace: 'Cục Cảnh sát Quản lý Hành chính về Trật tự Xã hội',
        expiryDate: ''
      },
      passport: tenant.passport || {
        number: '',
        type: '',
        code: '',
        nationality: '',
        birthPlace: '',
        cccdNumber: '',
        issueDate: '',
        issuePlace: 'Cục Quản lý xuất nhập cảnh',
        expiryDate: ''
      }
    };
    
    setFormData(migratedData);
    setShowModal(true);
  };

  const handleDelete = (tenantId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khách thuê này?')) {
      const updatedTenants = tenants.filter(t => t.id !== tenantId);
      storage.setTenants(updatedTenants);
      setTenants(updatedTenants);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      birthDate: '',
      gender: 'male',
      phone: '',
      email: '',
      idType: 'cccd',
      cccd: {
        number: '',
        nationality: 'Việt Nam',
        hometown: '',
        residence: '',
        issueDate: '',
        issuePlace: 'Cục Cảnh sát Quản lý Hành chính về Trật tự Xã hội',
        expiryDate: ''
      },
      passport: {
        number: '',
        type: '',
        code: '',
        nationality: '',
        birthPlace: '',
        cccdNumber: '',
        issueDate: '',
        issuePlace: 'Cục Quản lý xuất nhập cảnh',
        expiryDate: ''
      }
    });
    setEditingTenant(null);
    setShowModal(false);
  };

  const filteredTenants = tenants.filter(tenant => {
    const searchLower = searchTerm.toLowerCase();
    const idNumber = tenant.idType === 'cccd' ? tenant.cccd?.number : tenant.passport?.number;
    
    return tenant.fullName?.toLowerCase().includes(searchLower) ||
           tenant.phone?.includes(searchTerm) ||
           tenant.email?.toLowerCase().includes(searchLower) ||
           idNumber?.includes(searchTerm);
  });

  return (
    <div className="tenants-page">
      <div className="page-header">
        <h1>Quản lý khách thuê</h1>
        <div className="page-actions">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm khách thuê..."
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
              Thêm khách thuê
            </button>
          )}
        </div>
      </div>

      <div className="tenants-table">
        <table>
          <thead>
            <tr>
              <th>Họ tên</th>
              <th>Ngày sinh</th>
              <th>Giới tính</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Loại giấy tờ</th>
              <th>Số giấy tờ</th>
              <th>Ngày tạo</th>
              {(permissions.canUpdate || permissions.canDelete) && <th>Thao tác</th>}
            </tr>
          </thead>
          <tbody>
            {filteredTenants.map((tenant) => (
              <tr key={tenant.id}>
                <td>{tenant.fullName}</td>
                <td>{formatDate(tenant.birthDate)}</td>
                <td>{tenant.gender === 'male' ? 'Nam' : 'Nữ'}</td>
                <td>{tenant.phone}</td>
                <td>{tenant.email || 'N/A'}</td>
                <td>{tenant.idType === 'cccd' ? 'CCCD' : 'Hộ chiếu'}</td>
                <td>{tenant.idType === 'cccd' ? tenant.cccd?.number : tenant.passport?.number}</td>
                <td>{formatDate(tenant.createdAt)}</td>
                {(permissions.canUpdate || permissions.canDelete) && (
                  <td>
                    <div className="action-buttons">
                      {permissions.canUpdate && (
                        <button 
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleEdit(tenant)}
                        >
                          <Edit size={16} />
                        </button>
                      )}
                      {permissions.canDelete && (
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(tenant.id)}
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
          <div className="modal large-modal">
            <div className="modal-header">
              <h2>{editingTenant ? 'Sửa thông tin khách thuê' : 'Thêm khách thuê mới'}</h2>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Họ và tên *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Ngày tháng năm sinh *</label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Giới tính *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    required
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Số điện thoại *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Không bắt buộc"
                  />
                </div>
                
                <div className="form-group">
                  <label>Loại giấy tờ *</label>
                  <select
                    value={formData.idType}
                    onChange={(e) => setFormData({...formData, idType: e.target.value})}
                    required
                  >
                    <option value="cccd">CCCD</option>
                    <option value="passport">Hộ chiếu</option>
                  </select>
                </div>
              </div>

              {/* CCCD Fields */}
              {formData.idType === 'cccd' && (
                <div className="id-section">
                  <h3>Thông tin CCCD</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Số CCCD *</label>
                      <input
                        type="text"
                        value={formData.cccd.number}
                        onChange={(e) => setFormData({
                          ...formData,
                          cccd: {...formData.cccd, number: e.target.value}
                        })}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Quốc tịch</label>
                      <input
                        type="text"
                        value={formData.cccd.nationality}
                        onChange={(e) => setFormData({
                          ...formData,
                          cccd: {...formData.cccd, nationality: e.target.value}
                        })}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Quê quán</label>
                      <input
                        type="text"
                        value={formData.cccd.hometown}
                        onChange={(e) => setFormData({
                          ...formData,
                          cccd: {...formData.cccd, hometown: e.target.value}
                        })}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Nơi thường trú</label>
                      <input
                        type="text"
                        value={formData.cccd.residence}
                        onChange={(e) => setFormData({
                          ...formData,
                          cccd: {...formData.cccd, residence: e.target.value}
                        })}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Ngày cấp</label>
                      <input
                        type="date"
                        value={formData.cccd.issueDate}
                        onChange={(e) => setFormData({
                          ...formData,
                          cccd: {...formData.cccd, issueDate: e.target.value}
                        })}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Nơi cấp</label>
                      <input
                        type="text"
                        value={formData.cccd.issuePlace}
                        onChange={(e) => setFormData({
                          ...formData,
                          cccd: {...formData.cccd, issuePlace: e.target.value}
                        })}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Có giá trị đến</label>
                      <input
                        type="date"
                        value={formData.cccd.expiryDate}
                        onChange={(e) => setFormData({
                          ...formData,
                          cccd: {...formData.cccd, expiryDate: e.target.value}
                        })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Passport Fields */}
              {formData.idType === 'passport' && (
                <div className="id-section">
                  <h3>Thông tin Hộ chiếu</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Số Hộ chiếu *</label>
                      <input
                        type="text"
                        value={formData.passport.number}
                        onChange={(e) => setFormData({
                          ...formData,
                          passport: {...formData.passport, number: e.target.value}
                        })}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Loại</label>
                      <input
                        type="text"
                        value={formData.passport.type}
                        onChange={(e) => setFormData({
                          ...formData,
                          passport: {...formData.passport, type: e.target.value}
                        })}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Mã số</label>
                      <input
                        type="text"
                        value={formData.passport.code}
                        onChange={(e) => setFormData({
                          ...formData,
                          passport: {...formData.passport, code: e.target.value}
                        })}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Quốc tịch</label>
                      <input
                        type="text"
                        value={formData.passport.nationality}
                        onChange={(e) => setFormData({
                          ...formData,
                          passport: {...formData.passport, nationality: e.target.value}
                        })}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Nơi sinh</label>
                      <input
                        type="text"
                        value={formData.passport.birthPlace}
                        onChange={(e) => setFormData({
                          ...formData,
                          passport: {...formData.passport, birthPlace: e.target.value}
                        })}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Số CCCD</label>
                      <input
                        type="text"
                        value={formData.passport.cccdNumber}
                        onChange={(e) => setFormData({
                          ...formData,
                          passport: {...formData.passport, cccdNumber: e.target.value}
                        })}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Ngày cấp</label>
                      <input
                        type="date"
                        value={formData.passport.issueDate}
                        onChange={(e) => setFormData({
                          ...formData,
                          passport: {...formData.passport, issueDate: e.target.value}
                        })}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Nơi cấp</label>
                      <input
                        type="text"
                        value={formData.passport.issuePlace}
                        onChange={(e) => setFormData({
                          ...formData,
                          passport: {...formData.passport, issuePlace: e.target.value}
                        })}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Có giá trị đến</label>
                      <input
                        type="date"
                        value={formData.passport.expiryDate}
                        onChange={(e) => setFormData({
                          ...formData,
                          passport: {...formData.passport, expiryDate: e.target.value}
                        })}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTenant ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tenants;