import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, MessageSquare, Clock, CheckCircle, XCircle, Eye, Star, ThumbsUp, ThumbsDown, Calendar, User, MapPin, Filter, AlertCircle } from 'lucide-react';
import { storage, formatDate } from '../utils/localStorage';
import { getCurrentUser } from '../utils/auth';
import { PERMISSIONS, USER_ROLES } from '../constants/roles';
import { ROOMS } from '../constants/rooms';
import './Feedback.css';

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [viewingFeedback, setViewingFeedback] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'suggestion',
    rating: 5,
    roomId: '',
    submittedBy: '',
    contactInfo: '',
    status: 'pending',
    response: '',
    responseBy: '',
    priority: 'medium',
    category: 'service',
    isAnonymous: false
  });

  const currentUser = getCurrentUser();
  const permissions = PERMISSIONS[currentUser?.role] || {};

  // Loại phản ánh
  const feedbackTypes = {
    complaint: 'Khiếu nại',
    suggestion: 'Đề xuất',
    compliment: 'Khen ngợi',
    question: 'Câu hỏi',
    request: 'Yêu cầu'
  };

  // Danh mục phản ánh
  const categories = {
    service: 'Dịch vụ',
    facility: 'Cơ sở vật chất',
    management: 'Quản lý',
    security: 'An ninh',
    cleanliness: 'Vệ sinh',
    noise: 'Tiếng ồn',
    maintenance: 'Bảo trì',
    billing: 'Thanh toán',
    other: 'Khác'
  };

  // Mức độ ưu tiên
  const priorities = {
    low: 'Thấp',
    medium: 'Trung bình',
    high: 'Cao',
    urgent: 'Khẩn cấp'
  };

  // Trạng thái phản ánh
  const statuses = {
    pending: 'Chờ xử lý',
    reviewing: 'Đang xem xét',
    responded: 'Đã phản hồi',
    resolved: 'Đã giải quyết',
    closed: 'Đã đóng'
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allFeedbacks = storage.getFeedbacks() || [];
    const allTenants = storage.getTenants() || [];
    
    // Nếu là tenant, chỉ xem phản ánh do mình gửi
    if (currentUser?.role === USER_ROLES.TENANT) {
      const userFeedbacks = allFeedbacks.filter(feedback => 
        feedback.submittedByEmail === currentUser.email
      );
      setFeedbacks(userFeedbacks);
    } else {
      setFeedbacks(allFeedbacks);
    }
    
    setTenants(allTenants);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const feedbackData = {
      ...formData,
      id: editingFeedback ? editingFeedback.id : Date.now().toString(),
      submittedByEmail: currentUser?.role === USER_ROLES.TENANT ? currentUser.email : formData.submittedByEmail,
      createdAt: editingFeedback ? editingFeedback.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: editingFeedback ? 
        [...(editingFeedback.statusHistory || []), {
          status: formData.status,
          changedBy: currentUser?.email || 'system',
          changedAt: new Date().toISOString(),
          notes: formData.response
        }] : 
        [{
          status: formData.status,
          changedBy: currentUser?.email || 'system',
          changedAt: new Date().toISOString(),
          notes: 'Phản ánh được tạo'
        }]
    };

    const allFeedbacks = storage.getFeedbacks() || [];
    const updatedFeedbacks = editingFeedback
      ? allFeedbacks.map(f => f.id === editingFeedback.id ? feedbackData : f)
      : [...allFeedbacks, feedbackData];

    storage.setFeedbacks(updatedFeedbacks);
    loadData();
    resetForm();
  };

  const handleEdit = (feedback) => {
    setEditingFeedback(feedback);
    setFormData({
      ...feedback
    });
    setShowModal(true);
  };

  const handleView = (feedback) => {
    setViewingFeedback(feedback);
    setShowDetailModal(true);
  };

  const handleDelete = (feedbackId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phản ánh này?')) {
      const allFeedbacks = storage.getFeedbacks() || [];
      const updatedFeedbacks = allFeedbacks.filter(f => f.id !== feedbackId);
      storage.setFeedbacks(updatedFeedbacks);
      loadData();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'suggestion',
      rating: 5,
      roomId: '',
      submittedBy: '',
      contactInfo: '',
      status: 'pending',
      response: '',
      responseBy: '',
      priority: 'medium',
      category: 'service',
      isAnonymous: false
    });
    setEditingFeedback(null);
    setShowModal(false);
  };

  const getRoomInfo = (roomId) => {
    const room = ROOMS.find(r => r.id === roomId);
    return room ? `Phòng ${room.number}` : 'Khu vực chung';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="status-icon pending" />;
      case 'reviewing':
        return <Eye size={16} className="status-icon reviewing" />;
      case 'responded':
        return <MessageSquare size={16} className="status-icon responded" />;
      case 'resolved':
        return <CheckCircle size={16} className="status-icon resolved" />;
      case 'closed':
        return <XCircle size={16} className="status-icon closed" />;
      default:
        return <MessageSquare size={16} className="status-icon" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'complaint':
        return <AlertCircle size={16} className="type-icon complaint" />;
      case 'suggestion':
        return <MessageSquare size={16} className="type-icon suggestion" />;
      case 'compliment':
        return <ThumbsUp size={16} className="type-icon compliment" />;
      case 'question':
        return <MessageSquare size={16} className="type-icon question" />;
      case 'request':
        return <MessageSquare size={16} className="type-icon request" />;
      default:
        return <MessageSquare size={16} className="type-icon" />;
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? 'star filled' : 'star'}
        fill={index < rating ? 'currentColor' : 'none'}
      />
    ));
  };

  // Lọc phản ánh
  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = (
      feedback.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (feedback.submittedBy && feedback.submittedBy.toLowerCase().includes(searchTerm.toLowerCase())) ||
      getRoomInfo(feedback.roomId).toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesStatus = statusFilter === 'all' || feedback.status === statusFilter;
    const matchesType = typeFilter === 'all' || feedback.type === typeFilter;
    const matchesRating = ratingFilter === 'all' || feedback.rating.toString() === ratingFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesRating;
  });

  // Thống kê
  const stats = {
    total: feedbacks.length,
    pending: feedbacks.filter(f => f.status === 'pending').length,
    reviewing: feedbacks.filter(f => f.status === 'reviewing').length,
    responded: feedbacks.filter(f => f.status === 'responded').length,
    resolved: feedbacks.filter(f => f.status === 'resolved').length,
    avgRating: feedbacks.length > 0 ? 
      (feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbacks.length).toFixed(1) : 0
  };

  return (
    <div className="feedback-page">
      <div className="page-header">
        <h1>Phản ánh từ khách thuê</h1>
        <div className="page-actions">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm phản ánh..."
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
              Gửi phản ánh
            </button>
          )}
        </div>
      </div>

      {/* Thống kê */}
      <div className="feedback-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <MessageSquare size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Tổng phản ánh</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon pending">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.pending}</h3>
            <p>Chờ xử lý</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon reviewing">
            <Eye size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.reviewing}</h3>
            <p>Đang xem xét</p>
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
        
        <div className="stat-card">
          <div className="stat-icon rating">
            <Star size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.avgRating}</h3>
            <p>Đánh giá TB</p>
          </div>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="feedback-filters">
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
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">Tất cả loại</option>
            {Object.entries(feedbackTypes).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
          >
            <option value="all">Tất cả đánh giá</option>
            <option value="5">5 sao</option>
            <option value="4">4 sao</option>
            <option value="3">3 sao</option>
            <option value="2">2 sao</option>
            <option value="1">1 sao</option>
          </select>
        </div>
      </div>    
  {/* Danh sách phản ánh */}
      <div className="feedback-list">
        {filteredFeedbacks.length > 0 ? (
          <div className="feedback-grid">
            {filteredFeedbacks.map((feedback) => (
              <div key={feedback.id} className={`feedback-card ${feedback.type}`}>
                <div className="feedback-header">
                  <div className="feedback-title">
                    <div className="title-with-type">
                      {getTypeIcon(feedback.type)}
                      <h3>{feedback.title}</h3>
                    </div>
                    <span className="feedback-category">{categories[feedback.category]}</span>
                  </div>
                  <div className="feedback-rating">
                    {renderStars(feedback.rating)}
                  </div>
                </div>
                
                <div className="feedback-info">
                  <div className="info-item">
                    <MapPin size={16} />
                    <span>{getRoomInfo(feedback.roomId)}</span>
                  </div>
                  {!feedback.isAnonymous && (
                    <div className="info-item">
                      <User size={16} />
                      <span>{feedback.submittedBy}</span>
                    </div>
                  )}
                  <div className="info-item">
                    <Calendar size={16} />
                    <span>{formatDate(feedback.createdAt)}</span>
                  </div>
                </div>
                
                <div className="feedback-description">
                  <p>{feedback.description.length > 100 ? 
                    `${feedback.description.substring(0, 100)}...` : 
                    feedback.description}
                  </p>
                </div>
                
                {feedback.response && (
                  <div className="feedback-response">
                    <div className="response-header">
                      <MessageSquare size={14} />
                      <span>Phản hồi</span>
                    </div>
                    <p>{feedback.response.length > 80 ? 
                      `${feedback.response.substring(0, 80)}...` : 
                      feedback.response}
                    </p>
                  </div>
                )}
                
                <div className="feedback-footer">
                  <div className="feedback-status">
                    {getStatusIcon(feedback.status)}
                    <span>{statuses[feedback.status]}</span>
                  </div>
                  
                  <div className="feedback-actions">
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleView(feedback)}
                      title="Xem chi tiết"
                    >
                      <Eye size={16} />
                    </button>
                    {(permissions.canUpdate || 
                      (currentUser?.role === USER_ROLES.TENANT && feedback.submittedByEmail === currentUser.email)) && (
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => handleEdit(feedback)}
                        title="Chỉnh sửa"
                      >
                        <Edit size={16} />
                      </button>
                    )}
                    {(permissions.canDelete || 
                      (currentUser?.role === USER_ROLES.TENANT && feedback.submittedByEmail === currentUser.email)) && (
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(feedback.id)}
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
            <MessageSquare size={48} />
            <h3>Không có phản ánh nào</h3>
            <p>Chưa có phản ánh nào được gửi</p>
            {(permissions.canCreate || currentUser?.role === USER_ROLES.TENANT) && (
              <button 
                className="btn btn-primary"
                onClick={() => setShowModal(true)}
              >
                <Plus size={20} />
                Gửi phản ánh đầu tiên
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal tạo/sửa phản ánh */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal large-modal">
            <div className="modal-header">
              <h2>{editingFeedback ? 'Sửa phản ánh' : 'Gửi phản ánh mới'}</h2>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Tiêu đề phản ánh *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                    placeholder="Tóm tắt nội dung phản ánh"
                  />
                </div>
                
                <div className="form-group">
                  <label>Loại phản ánh *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    required
                  >
                    {Object.entries(feedbackTypes).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
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
                  <label>Đánh giá *</label>
                  <div className="rating-input">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        size={24}
                        className={index < formData.rating ? 'star filled clickable' : 'star clickable'}
                        fill={index < formData.rating ? 'currentColor' : 'none'}
                        onClick={() => setFormData({...formData, rating: index + 1})}
                      />
                    ))}
                    <span className="rating-text">({formData.rating}/5)</span>
                  </div>
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
                      <label>Người gửi *</label>
                      <input
                        type="text"
                        value={formData.submittedBy}
                        onChange={(e) => setFormData({...formData, submittedBy: e.target.value})}
                        required
                        placeholder="Tên người gửi phản ánh"
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
                    <input type="hidden" value={formData.submittedBy = currentUser.fullName || currentUser.email} />
                    <input type="hidden" value={formData.contactInfo = currentUser.email} />
                    
                    <div className="form-group full-width">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.isAnonymous}
                          onChange={(e) => setFormData({...formData, isAnonymous: e.target.checked})}
                        />
                        Gửi ẩn danh
                      </label>
                    </div>
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
                      <label>Mức độ ưu tiên</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({...formData, priority: e.target.value})}
                      >
                        {Object.entries(priorities).map(([key, label]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
                
                <div className="form-group full-width">
                  <label>Nội dung chi tiết *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="4"
                    required
                    placeholder="Mô tả chi tiết về vấn đề, đề xuất hoặc ý kiến của bạn..."
                  />
                </div>
                
                {permissions.canUpdate && (
                  <div className="form-group full-width">
                    <label>Phản hồi</label>
                    <textarea
                      value={formData.response}
                      onChange={(e) => setFormData({...formData, response: e.target.value})}
                      rows="3"
                      placeholder="Phản hồi từ ban quản lý..."
                    />
                  </div>
                )}
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingFeedback ? 'Cập nhật' : 'Gửi phản ánh'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal xem chi tiết */}
      {showDetailModal && viewingFeedback && (
        <div className="modal-overlay">
          <div className="modal large-modal">
            <div className="modal-header">
              <h2>Chi tiết phản ánh #{viewingFeedback.id}</h2>
              <button className="close-btn" onClick={() => setShowDetailModal(false)}>×</button>
            </div>
            
            <div className="feedback-detail">
              <div className="detail-header">
                <div className="detail-title">
                  <div className="title-with-type">
                    {getTypeIcon(viewingFeedback.type)}
                    <h3>{viewingFeedback.title}</h3>
                  </div>
                  <div className="detail-badges">
                    <span className={`type-badge ${viewingFeedback.type}`}>
                      {feedbackTypes[viewingFeedback.type]}
                    </span>
                    <span className="category-badge">
                      {categories[viewingFeedback.category]}
                    </span>
                  </div>
                </div>
                <div className="detail-status">
                  {getStatusIcon(viewingFeedback.status)}
                  <span>{statuses[viewingFeedback.status]}</span>
                </div>
              </div>
              
              <div className="detail-rating">
                <label>Đánh giá:</label>
                <div className="rating-display">
                  {renderStars(viewingFeedback.rating)}
                  <span>({viewingFeedback.rating}/5)</span>
                </div>
              </div>
              
              <div className="detail-info">
                <div className="info-grid">
                  <div className="info-item">
                    <label>Vị trí:</label>
                    <span>{getRoomInfo(viewingFeedback.roomId)}</span>
                  </div>
                  {!viewingFeedback.isAnonymous && (
                    <>
                      <div className="info-item">
                        <label>Người gửi:</label>
                        <span>{viewingFeedback.submittedBy}</span>
                      </div>
                      <div className="info-item">
                        <label>Liên hệ:</label>
                        <span>{viewingFeedback.contactInfo}</span>
                      </div>
                    </>
                  )}
                  {viewingFeedback.isAnonymous && (
                    <div className="info-item">
                      <label>Người gửi:</label>
                      <span className="anonymous">Ẩn danh</span>
                    </div>
                  )}
                  <div className="info-item">
                    <label>Ngày gửi:</label>
                    <span>{formatDate(viewingFeedback.createdAt)}</span>
                  </div>
                  {viewingFeedback.priority && (
                    <div className="info-item">
                      <label>Mức độ ưu tiên:</label>
                      <span className={`priority-text ${viewingFeedback.priority}`}>
                        {priorities[viewingFeedback.priority]}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="detail-description">
                <h4>Nội dung chi tiết</h4>
                <p>{viewingFeedback.description}</p>
              </div>
              
              {viewingFeedback.response && (
                <div className="detail-response">
                  <h4>Phản hồi từ ban quản lý</h4>
                  <div className="response-content">
                    <p>{viewingFeedback.response}</p>
                    {viewingFeedback.responseBy && (
                      <div className="response-by">
                        <span>Phản hồi bởi: {viewingFeedback.responseBy}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {viewingFeedback.statusHistory && viewingFeedback.statusHistory.length > 0 && (
                <div className="detail-history">
                  <h4>Lịch sử xử lý</h4>
                  <div className="history-timeline">
                    {viewingFeedback.statusHistory.map((history, index) => (
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
                (currentUser?.role === USER_ROLES.TENANT && viewingFeedback.submittedByEmail === currentUser.email)) && (
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => {
                    setShowDetailModal(false);
                    handleEdit(viewingFeedback);
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

export default Feedback;