import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, AlertTriangle, Clock, CheckCircle, XCircle, Eye, MessageSquare, Calendar, User, MapPin, Filter } from 'lucide-react';
import { storage, formatDate } from '../utils/localStorage';
import { getCurrentUser } from '../utils/auth';
import { PERMISSIONS, USER_ROLES } from '../constants/roles';
import { ROOMS } from '../constants/rooms';
import './Incidents.css';

const Incidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingIncident, setEditingIncident] = useState(null);
  const [viewingIncident, setViewingIncident] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'maintenance',
    priority: 'medium',
    roomId: '',
    reportedBy: '',
    contactInfo: '',
    status: 'reported',
    assignedTo: '',
    estimatedCost: '',
    actualCost: '',
    notes: '',
    images: []
  });

  const currentUser = getCurrentUser();
  const permissions = PERMISSIONS[currentUser?.role] || {};

  // Danh mục sự cố
  const categories = {
    maintenance: 'Bảo trì',
    electrical: 'Điện',
    plumbing: 'Nước',
    internet: 'Internet',
    security: 'An ninh',
    cleaning: 'Vệ sinh',
    other: 'Khác'
  };

  // Mức độ ưu tiên
  const priorities = {
    low: 'Thấp',
    medium: 'Trung bình',
    high: 'Cao',
    urgent: 'Khẩn cấp'
  };

  // Trạng thái sự cố
  const statuses = {
    reported: 'Đã báo cáo',
    confirmed: 'Đã xác nhận',
    in_progress: 'Đang xử lý',
    resolved: 'Đã giải quyết',
    closed: 'Đã đóng'
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allIncidents = storage.getIncidents() || [];
    const allTenants = storage.getTenants() || [];
    
    // Nếu là tenant, chỉ xem sự cố do mình báo cáo
    if (currentUser?.role === USER_ROLES.TENANT) {
      const userIncidents = allIncidents.filter(incident => 
        incident.reportedByEmail === currentUser.email
      );
      setIncidents(userIncidents);
    } else {
      setIncidents(allIncidents);
    }
    
    setTenants(allTenants);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const incidentData = {
      ...formData,
      id: editingIncident ? editingIncident.id : Date.now().toString(),
      reportedByEmail: currentUser?.role === USER_ROLES.TENANT ? currentUser.email : formData.reportedByEmail,
      createdAt: editingIncident ? editingIncident.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: editingIncident ? 
        [...(editingIncident.statusHistory || []), {
          status: formData.status,
          changedBy: currentUser?.email || 'system',
          changedAt: new Date().toISOString(),
          notes: formData.notes
        }] : 
        [{
          status: formData.status,
          changedBy: currentUser?.email || 'system',
          changedAt: new Date().toISOString(),
          notes: 'Sự cố được tạo'
        }]
    };

    const allIncidents = storage.getIncidents() || [];
    const updatedIncidents = editingIncident
      ? allIncidents.map(i => i.id === editingIncident.id ? incidentData : i)
      : [...allIncidents, incidentData];

    storage.setIncidents(updatedIncidents);
    loadData();
    resetForm();
  };

  const handleEdit = (incident) => {
    setEditingIncident(incident);
    setFormData({
      ...incident,
      images: incident.images || []
    });
    setShowModal(true);
  };

  const handleView = (incident) => {
    setViewingIncident(incident);
    setShowDetailModal(true);
  };

  const handleDelete = (incidentId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa báo cáo sự cố này?')) {
      const allIncidents = storage.getIncidents() || [];
      const updatedIncidents = allIncidents.filter(i => i.id !== incidentId);
      storage.setIncidents(updatedIncidents);
      loadData();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'maintenance',
      priority: 'medium',
      roomId: '',
      reportedBy: '',
      contactInfo: '',
      status: 'reported',
      assignedTo: '',
      estimatedCost: '',
      actualCost: '',
      notes: '',
      images: []
    });
    setEditingIncident(null);
    setShowModal(false);
  };

  const getRoomInfo = (roomId) => {
    const room = ROOMS.find(r => r.id === roomId);
    return room ? `Phòng ${room.number}` : 'Khu vực chung';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'reported':
        return <AlertTriangle size={16} className="status-icon reported" />;
      case 'confirmed':
        return <Eye size={16} className="status-icon confirmed" />;
      case 'in_progress':
        return <Clock size={16} className="status-icon in-progress" />;
      case 'resolved':
        return <CheckCircle size={16} className="status-icon resolved" />;
      case 'closed':
        return <XCircle size={16} className="status-icon closed" />;
      default:
        return <AlertTriangle size={16} className="status-icon" />;
    }
  };

  const getPriorityClass = (priority) => {
    return `priority-${priority}`;
  };

  // Lọc sự cố
  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = (
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getRoomInfo(incident.roomId).toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesStatus = statusFilter === 'all' || incident.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || incident.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || incident.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  // Thống kê
  const stats = {
    total: incidents.length,
    reported: incidents.filter(i => i.status === 'reported').length,
    inProgress: incidents.filter(i => i.status === 'in_progress').length,
    resolved: incidents.filter(i => i.status === 'resolved').length,
    urgent: incidents.filter(i => i.priority === 'urgent').length
  };

  return (
    <div className="incidents-page">
      <div className="page-header">
        <h1>Báo cáo sự cố</h1>
        <div className="page-actions">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm sự cố..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {(permissions.canCreate || currentUser?.role === USER_ROLES.TENANT) && (
            <button 
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              <Plus size={20} />
              Báo cáo sự cố
            </button>
          )}
        </div>
      </div>

      {/* Thống kê */}
      <div className="incidents-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Tổng sự cố</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon reported">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.reported}</h3>
            <p>Chờ xử lý</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon in-progress">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.inProgress}</h3>
            <p>Đang xử lý</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon resolved">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.resolved}</h3>
            <p>Đã giải quyết</p>
          </div>
        </div>
        
        {stats.urgent > 0 && (
          <div className="stat-card">
            <div className="stat-icon urgent">
              <AlertTriangle size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.urgent}</h3>
              <p>Khẩn cấp</p>
            </div>
          </div>
        )}
      </div>

      {/* Bộ lọc */}
      <div className="incidents-filters">
        <div className="filter-group">
          <Filter size={20} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            {Object.entries(statuses).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">Tất cả mức độ</option>
            {Object.entries(priorities).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">Tất cả danh mục</option>
            {Object.entries(categories).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Danh sách sự cố */}
      <div className="incidents-list">
        {filteredIncidents.length > 0 ? (
          <div className="incidents-grid">
            {filteredIncidents.map((incident) => (
              <div key={incident.id} className={`incident-card ${getPriorityClass(incident.priority)}`}>
                <div className="incident-header">
                  <div className="incident-title">
                    <h3>{incident.title}</h3>
                    <span className="incident-category">{categories[incident.category]}</span>
                  </div>
                  <div className="incident-priority">
                    <span className={`priority-badge ${incident.priority}`}>
                      {priorities[incident.priority]}
                    </span>
                  </div>
                </div>
                
                <div className="incident-info">
                  <div className="info-item">
                    <MapPin size={16} />
                    <span>{getRoomInfo(incident.roomId)}</span>
                  </div>
                  <div className="info-item">
                    <User size={16} />
                    <span>{incident.reportedBy}</span>
                  </div>
                  <div className="info-item">
                    <Calendar size={16} />
                    <span>{formatDate(incident.createdAt)}</span>
                  </div>
                </div>
                
                <div className="incident-description">
                  <p>{incident.description.length > 100 ? 
                    `${incident.description.substring(0, 100)}...` : 
                    incident.description}
                  </p>
                </div>
                
                <div className="incident-footer">
                  <div className="incident-status">
                    {getStatusIcon(incident.status)}
                    <span>{statuses[incident.status]}</span>
                  </div>
                  
                  <div className="incident-actions">
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleView(incident)}
                      title="Xem chi tiết"
                    >
                      <Eye size={16} />
                    </button>
                    {(permissions.canUpdate || 
                      (currentUser?.role === USER_ROLES.TENANT && incident.reportedByEmail === currentUser.email)) && (
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => handleEdit(incident)}
                        title="Chỉnh sửa"
                      >
                        <Edit size={16} />
                      </button>
                    )}
                    {(permissions.canDelete || 
                      (currentUser?.role === USER_ROLES.TENANT && incident.reportedByEmail === currentUser.email)) && (
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(incident.id)}
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">
            <AlertTriangle size={48} />
            <h3>Không có sự cố nào</h3>
            <p>Chưa có báo cáo sự cố nào được ghi nhận</p>
            {(permissions.canCreate || currentUser?.role === USER_ROLES.TENANT) && (
              <button 
                className="btn btn-primary"
                onClick={() => setShowModal(true)}
              >
                <Plus size={20} />
                Báo cáo sự cố đầu tiên
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal tạo/sửa sự cố */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal large-modal">
            <div className="modal-header">
              <h2>{editingIncident ? 'Sửa báo cáo sự cố' : 'Báo cáo sự cố mới'}</h2>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Tiêu đề sự cố *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                    placeholder="Mô tả ngắn gọn về sự cố"
                  />
                </div>
                
                <div className="form-group">
                  <label>Danh mục *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                  >
                    {Object.entries(categories).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Mức độ ưu tiên *</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    required
                  >
                    {Object.entries(priorities).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Vị trí</label>
                  <select
                    value={formData.roomId}
                    onChange={(e) => setFormData({...formData, roomId: e.target.value})}
                  >
                    <option value="">Khu vực chung</option>
                    {ROOMS.map(room => (
                      <option key={room.id} value={room.id}>
                        Phòng {room.number}
                      </option>
                    ))}
                  </select>
                </div>
                
                {currentUser?.role !== USER_ROLES.TENANT && (
                  <>
                    <div className="form-group">
                      <label>Người báo cáo *</label>
                      <input
                        type="text"
                        value={formData.reportedBy}
                        onChange={(e) => setFormData({...formData, reportedBy: e.target.value})}
                        required
                        placeholder="Tên người báo cáo"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Thông tin liên hệ</label>
                      <input
                        type="text"
                        value={formData.contactInfo}
                        onChange={(e) => setFormData({...formData, contactInfo: e.target.value})}
                        placeholder="Số điện thoại hoặc email"
                      />
                    </div>
                  </>
                )}
                
                {currentUser?.role === USER_ROLES.TENANT && (
                  <>
                    <input type="hidden" value={formData.reportedBy = currentUser.fullName || currentUser.email} />
                    <input type="hidden" value={formData.contactInfo = currentUser.email} />
                  </>
                )}
                
                {permissions.canUpdate && (
                  <>
                    <div className="form-group">
                      <label>Trạng thái</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                      >
                        {Object.entries(statuses).map(([key, label]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Phân công xử lý</label>
                      <input
                        type="text"
                        value={formData.assignedTo}
                        onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                        placeholder="Tên người được phân công"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Chi phí ước tính</label>
                      <input
                        type="number"
                        value={formData.estimatedCost}
                        onChange={(e) => setFormData({...formData, estimatedCost: e.target.value})}
                        placeholder="VNĐ"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Chi phí thực tế</label>
                      <input
                        type="number"
                        value={formData.actualCost}
                        onChange={(e) => setFormData({...formData, actualCost: e.target.value})}
                        placeholder="VNĐ"
                      />
                    </div>
                  </>
                )}
                
                <div className="form-group full-width">
                  <label>Mô tả chi tiết *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="4"
                    required
                    placeholder="Mô tả chi tiết về sự cố, vị trí cụ thể, mức độ nghiêm trọng..."
                  />
                </div>
                
                <div className="form-group full-width">
                  <label>Ghi chú</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows="3"
                    placeholder="Ghi chú thêm, cập nhật tiến độ xử lý..."
                  />
                </div>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingIncident ? 'Cập nhật' : 'Báo cáo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal xem chi tiết */}
      {showDetailModal && viewingIncident && (
        <div className="modal-overlay">
          <div className="modal large-modal">
            <div className="modal-header">
              <h2>Chi tiết sự cố #{viewingIncident.id}</h2>
              <button className="close-btn" onClick={() => setShowDetailModal(false)}>×</button>
            </div>
            
            <div className="incident-detail">
              <div className="detail-header">
                <div className="detail-title">
                  <h3>{viewingIncident.title}</h3>
                  <div className="detail-badges">
                    <span className={`priority-badge ${viewingIncident.priority}`}>
                      {priorities[viewingIncident.priority]}
                    </span>
                    <span className="category-badge">
                      {categories[viewingIncident.category]}
                    </span>
                  </div>
                </div>
                <div className="detail-status">
                  {getStatusIcon(viewingIncident.status)}
                  <span>{statuses[viewingIncident.status]}</span>
                </div>
              </div>
              
              <div className="detail-info">
                <div className="info-grid">
                  <div className="info-item">
                    <label>Vị trí:</label>
                    <span>{getRoomInfo(viewingIncident.roomId)}</span>
                  </div>
                  <div className="info-item">
                    <label>Người báo cáo:</label>
                    <span>{viewingIncident.reportedBy}</span>
                  </div>
                  <div className="info-item">
                    <label>Liên hệ:</label>
                    <span>{viewingIncident.contactInfo}</span>
                  </div>
                  <div className="info-item">
                    <label>Ngày báo cáo:</label>
                    <span>{formatDate(viewingIncident.createdAt)}</span>
                  </div>
                  {viewingIncident.assignedTo && (
                    <div className="info-item">
                      <label>Phân công:</label>
                      <span>{viewingIncident.assignedTo}</span>
                    </div>
                  )}
                  {viewingIncident.estimatedCost && (
                    <div className="info-item">
                      <label>Chi phí ước tính:</label>
                      <span>{new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(viewingIncident.estimatedCost)}</span>
                    </div>
                  )}
                  {viewingIncident.actualCost && (
                    <div className="info-item">
                      <label>Chi phí thực tế:</label>
                      <span>{new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(viewingIncident.actualCost)}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="detail-description">
                <h4>Mô tả chi tiết</h4>
                <p>{viewingIncident.description}</p>
              </div>
              
              {viewingIncident.notes && (
                <div className="detail-notes">
                  <h4>Ghi chú</h4>
                  <p>{viewingIncident.notes}</p>
                </div>
              )}
              
              {viewingIncident.statusHistory && viewingIncident.statusHistory.length > 0 && (
                <div className="detail-history">
                  <h4>Lịch sử xử lý</h4>
                  <div className="history-timeline">
                    {viewingIncident.statusHistory.map((history, index) => (
                      <div key={index} className="history-item">
                        <div className="history-status">
                          {getStatusIcon(history.status)}
                          <span>{statuses[history.status]}</span>
                        </div>
                        <div className="history-info">
                          <div className="history-time">
                            {formatDate(history.changedAt)}
                          </div>
                          <div className="history-user">
                            {history.changedBy}
                          </div>
                          {history.notes && (
                            <div className="history-notes">
                              {history.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="modal-actions">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowDetailModal(false)}
              >
                Đóng
              </button>
              {(permissions.canUpdate || 
                (currentUser?.role === USER_ROLES.TENANT && viewingIncident.reportedByEmail === currentUser.email)) && (
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => {
                    setShowDetailModal(false);
                    handleEdit(viewingIncident);
                  }}
                >
                  <Edit size={16} />
                  Chỉnh sửa
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Incidents;