import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react';
import { storage, formatDate } from '../utils/localStorage';
import { getCurrentUser } from '../utils/auth';
import { PERMISSIONS, USER_ROLES } from '../constants/roles';
import { ROOMS, ROOM_STATUS } from '../constants/rooms';

const Contracts = () => {
  const [contracts, setContracts] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingContract, setEditingContract] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    contractCode: '',
    signDate: '',
    startDate: '',
    endDate: '',
    roomId: '',
    signerId: '',
    signerRole: 'room_leader', // 'contract_signer' hoặc 'room_leader'
    deposit: '',
    monthlyRent: '',
    hasInternet: false,
    hasDiscount: false, // Có ưu đãi hay không
    discountMonths: '', // Số tháng ưu đãi
    discountRent: '', // Tiền thuê trong thời gian ưu đãi
    roommates: [], // Danh sách khách thuê khác trong phòng
    status: 'pending' // Mặc định là pending, sẽ chuyển thành active khi đến ngày bắt đầu
  });

  const [availableRoommates, setAvailableRoommates] = useState([]);
  const [showRoommateModal, setShowRoommateModal] = useState(false);

  const currentUser = getCurrentUser();
  const permissions = PERMISSIONS[currentUser?.role] || {};

  useEffect(() => {
    loadData();
    // Kiểm tra và cập nhật trạng thái hợp đồng
    updateContractStatuses();
  }, []);

  // Cập nhật trạng thái hợp đồng tự động
  const updateContractStatuses = () => {
    const allContracts = storage.getContracts();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let hasUpdates = false;
    const updatedContracts = allContracts.map(contract => {
      const startDate = new Date(contract.startDate);
      const endDate = new Date(contract.endDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      
      let newStatus = contract.status;
      
      // Chuyển từ pending sang active khi đến ngày bắt đầu
      if (contract.status === 'pending' && today >= startDate) {
        newStatus = 'active';
        hasUpdates = true;
        
        // Cập nhật trạng thái phòng thành occupied
        const roomDetails = storage.getRoomDetails();
        if (roomDetails[contract.roomId]) {
          roomDetails[contract.roomId].status = ROOM_STATUS.OCCUPIED;
          storage.setRoomDetails(roomDetails);
        }
      }
      
      // Chuyển từ active sang expired khi hết hạn
      if (contract.status === 'active' && today > endDate) {
        newStatus = 'expired';
        hasUpdates = true;
        
        // Cập nhật trạng thái phòng về available
        const roomDetails = storage.getRoomDetails();
        if (roomDetails[contract.roomId]) {
          roomDetails[contract.roomId].status = ROOM_STATUS.AVAILABLE;
          storage.setRoomDetails(roomDetails);
        }
      }
      
      return { ...contract, status: newStatus };
    });
    
    if (hasUpdates) {
      storage.setContracts(updatedContracts);
    }
  };

  const loadData = () => {
    const allContracts = storage.getContracts();
    const allTenants = storage.getTenants();
    
    // Nếu là tenant, chỉ xem hợp đồng của mình
    if (currentUser?.role === USER_ROLES.TENANT) {
      const userContracts = allContracts.filter(c => {
        const tenant = allTenants.find(t => t.id === c.signerId);
        return tenant?.email === currentUser.email; // Giả sử tenant login bằng email
      });
      setContracts(userContracts);
    } else {
      setContracts(allContracts);
    }
    setTenants(allTenants);
    updateAvailableRoommates(allTenants, allContracts);
  };

  // Tạo mã hợp đồng tự động dựa trên ngày ký
  const generateContractCode = (signDate = null) => {
    const contractYear = signDate ? new Date(signDate).getFullYear() : new Date().getFullYear();
    const existingContracts = storage.getContracts();
    
    // Lọc hợp đồng trong năm của ngày ký
    const yearContracts = existingContracts.filter(contract => {
      if (!contract.contractCode) return false;
      return contract.contractCode.includes(contractYear.toString());
    });
    
    // Tìm số hợp đồng cao nhất trong năm
    let maxNumber = 0;
    yearContracts.forEach(contract => {
      const match = contract.contractCode.match(/^(\d{3})/);
      if (match) {
        const number = parseInt(match[1]);
        if (number > maxNumber) {
          maxNumber = number;
        }
      }
    });
    
    const nextNumber = (maxNumber + 1).toString().padStart(3, '0');
    return `${nextNumber}/HĐTCH - ${contractYear}`;
  };

  // Cập nhật mã hợp đồng khi thay đổi ngày ký
  const handleSignDateChange = (signDate) => {
    const newContractCode = generateContractCode(signDate);
    setFormData({
      ...formData,
      signDate: signDate,
      contractCode: newContractCode
    });
  };

  // Lấy danh sách phòng có thể thuê trong khoảng thời gian hợp đồng
  const getAvailableRooms = () => {
    if (!formData.startDate || !formData.endDate) {
      return ROOMS;
    }

    const roomDetails = storage.getRoomDetails();
    const existingContracts = storage.getContracts();
    
    return ROOMS.filter(room => {
      const roomDetail = roomDetails[room.id];
      
      // Phòng trống
      if (!roomDetail || roomDetail.status === ROOM_STATUS.AVAILABLE) {
        return true;
      }
      
      // Phòng đã đặt cọc
      if (roomDetail.status === ROOM_STATUS.DEPOSITED) {
        return true;
      }
      
      // Kiểm tra xem phòng có bị trùng thời gian với hợp đồng khác không
      const conflictingContract = existingContracts.find(contract => {
        if (contract.roomId !== room.id || contract.status !== 'active') return false;
        
        const contractStart = new Date(contract.startDate);
        const contractEnd = new Date(contract.endDate);
        const newStart = new Date(formData.startDate);
        const newEnd = new Date(formData.endDate);
        
        // Kiểm tra trùng lặp thời gian
        return (newStart <= contractEnd && newEnd >= contractStart);
      });
      
      return !conflictingContract;
    });
  };

  // Hàm kiểm tra và tự động điền thông tin người đặt cọc
  const handleRoomSelect = (roomId) => {
    const roomDetails = storage.getRoomDetails();
    const roomDetail = roomDetails[roomId];
    
    if (roomDetail && roomDetail.status === ROOM_STATUS.DEPOSITED && roomDetail.depositInfo.depositorId) {
      // Tự động chọn tenant từ thông tin người đặt cọc
      const depositorTenant = tenants.find(t => t.id === roomDetail.depositInfo.depositorId);
      
      if (depositorTenant) {
        setFormData({
          ...formData,
          roomId: roomId,
          signerId: depositorTenant.id,
          monthlyRent: ROOMS.find(r => r.id === roomId)?.price || '',
          deposit: roomDetail.depositInfo.depositAmount || ''
        });
      } else {
        // Nếu không tìm thấy tenant (có thể đã bị xóa)
        setFormData({
          ...formData,
          roomId: roomId,
          monthlyRent: ROOMS.find(r => r.id === roomId)?.price || '',
          suggestedTenantName: 'Người đặt cọc không tồn tại'
        });
      }
    } else {
      const room = ROOMS.find(r => r.id === roomId);
      setFormData({
        ...formData,
        roomId: roomId,
        monthlyRent: room ? room.price : ''
      });
    }
  };

  // Cập nhật danh sách khách thuê có thể thêm vào phòng
  const updateAvailableRoommates = (allTenants, allContracts) => {
    // Lấy danh sách khách thuê đã có hợp đồng hiệu lực hoặc chờ hiệu lực
    const occupiedTenants = new Set();
    
    allContracts.forEach(contract => {
      if (contract.status === 'active' || contract.status === 'pending') {
        // Thêm người ký hợp đồng nếu là trưởng phòng
        if (contract.signerRole === 'room_leader') {
          occupiedTenants.add(contract.signerId);
        }
        // Thêm tất cả roommates
        if (contract.roommates) {
          contract.roommates.forEach(roommateId => {
            occupiedTenants.add(roommateId);
          });
        }
      }
    });
    
    // Lọc ra những khách thuê chưa thuộc phòng nào
    const available = allTenants.filter(tenant => !occupiedTenants.has(tenant.id));
    setAvailableRoommates(available);
  };

  // Thêm khách thuê vào danh sách roommates
  const handleAddRoommate = (tenantId) => {
    const currentRoommates = formData.roommates || [];
    if (!currentRoommates.includes(tenantId)) {
      setFormData({
        ...formData,
        roommates: [...currentRoommates, tenantId]
      });
    }
    setShowRoommateModal(false);
  };

  // Xóa khách thuê khỏi danh sách roommates
  const handleRemoveRoommate = (tenantId) => {
    const currentRoommates = formData.roommates || [];
    setFormData({
      ...formData,
      roommates: currentRoommates.filter(id => id !== tenantId)
    });
  };

  // Lấy danh sách khách thuê có thể thêm (chưa thuộc phòng nào và chưa được chọn)
  const getAvailableTenantsForRoom = () => {
    const currentRoommates = formData.roommates || [];
    return availableRoommates.filter(tenant => 
      tenant.id !== formData.signerId && 
      !currentRoommates.includes(tenant.id)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const contractData = {
      ...formData,
      id: editingContract ? editingContract.id : Date.now().toString(),
      contractCode: formData.contractCode || generateContractCode(),
      createdAt: editingContract ? editingContract.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const allContracts = storage.getContracts();
    const updatedContracts = editingContract
      ? allContracts.map(c => c.id === editingContract.id ? contractData : c)
      : [...allContracts, contractData];

    storage.setContracts(updatedContracts);
    
    // Cập nhật room assignment
    if (!editingContract) {
      const roomAssignments = storage.getRoomAssignments();
      roomAssignments[formData.roomId] = {
        signerId: formData.signerId,
        contractId: contractData.id,
        roommates: formData.roommates || []
      };
      storage.setRoomAssignments(roomAssignments);
      
      // Chỉ cập nhật thông tin phòng, không thay đổi trạng thái
      const roomDetails = storage.getRoomDetails();
      if (!roomDetails[formData.roomId]) {
        roomDetails[formData.roomId] = {
          status: ROOM_STATUS.AVAILABLE, // Giữ nguyên trạng thái, sẽ tự động chuyển khi đến ngày bắt đầu
          hasInternet: formData.hasInternet,
          depositInfo: { depositorName: '', depositAmount: formData.deposit, contractDate: formData.signDate },
          maintenanceNote: ''
        };
      } else {
        roomDetails[formData.roomId].hasInternet = formData.hasInternet;
        // Không thay đổi status ở đây
      }
      storage.setRoomDetails(roomDetails);
    }
    
    loadData();
    resetForm();
  };

  const handleEdit = (contract) => {
    setEditingContract(contract);
    setFormData({
      ...contract,
      roommates: contract.roommates || []
    });
    setShowModal(true);
  };

  const handleDelete = (contractId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hợp đồng này?')) {
      const allContracts = storage.getContracts();
      const updatedContracts = allContracts.filter(c => c.id !== contractId);
      storage.setContracts(updatedContracts);
      
      // Xóa room assignment và cập nhật trạng thái phòng
      const contract = allContracts.find(c => c.id === contractId);
      if (contract) {
        const roomAssignments = storage.getRoomAssignments();
        delete roomAssignments[contract.roomId];
        storage.setRoomAssignments(roomAssignments);
        
        // Chuyển trạng thái phòng về trống
        const roomDetails = storage.getRoomDetails();
        if (roomDetails[contract.roomId]) {
          roomDetails[contract.roomId].status = ROOM_STATUS.AVAILABLE;
          storage.setRoomDetails(roomDetails);
        }
      }
      
      loadData();
    }
  };

  const resetForm = () => {
    setFormData({
      contractCode: '',
      signDate: '',
      startDate: '',
      endDate: '',
      roomId: '',
      signerId: '',
      signerRole: 'room_leader',
      deposit: '',
      monthlyRent: '',
      hasInternet: false,
      hasDiscount: false,
      discountMonths: '',
      discountRent: '',
      roommates: [],
      status: 'pending'
    });
    setEditingContract(null);
    setShowModal(false);
    setShowRoommateModal(false);
  };

  // Mở modal và tạo mã hợp đồng mới
  const handleCreateContract = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      ...formData,
      contractCode: generateContractCode(today),
      signDate: today
    });
    setShowModal(true);
  };

  const getSignerName = (signerId) => {
    const signer = tenants.find(t => t.id === signerId);
    return signer ? signer.fullName : 'N/A';
  };

  const getRoomNumber = (roomId) => {
    const room = ROOMS.find(r => r.id === roomId);
    return room ? room.number : 'N/A';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusLabel = (status) => {
    const statusLabels = {
      pending: 'Chờ hiệu lực',
      active: 'Hiệu lực',
      expired: 'Hết hạn',
      terminated: 'Đã chấm dứt'
    };
    return statusLabels[status] || status;
  };

  const filteredContracts = contracts.filter(contract => {
    const signer = tenants.find(t => t.id === contract.signerId);
    const room = ROOMS.find(r => r.id === contract.roomId);
    
    return (
      signer?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room?.number.includes(searchTerm) ||
      contract.contractCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.id.includes(searchTerm)
    );
  });

  return (
    <div className="contracts-page">
      <div className="page-header">
        <h1>Quản lý hợp đồng</h1>
        <div className="page-actions">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm hợp đồng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {permissions.canCreate && (
            <button 
              className="btn btn-primary"
              onClick={handleCreateContract}
            >
              <Plus size={20} />
              Tạo hợp đồng
            </button>
          )}
        </div>
      </div>

      <div className="contracts-table">
        <table>
          <thead>
            <tr>
              <th>Mã HĐ</th>
              <th>Người ký HĐ</th>
              <th>Vai trò</th>
              <th>Phòng</th>
              <th>Ngày ký</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Tiền thuê</th>
              <th>Ưu đãi</th>
              <th>Internet</th>
              {(permissions.canUpdate || permissions.canDelete) && <th>Thao tác</th>}
            </tr>
          </thead>
          <tbody>
            {filteredContracts.map((contract) => (
              <tr key={contract.id}>
                <td>{contract.contractCode || `HD${contract.id}`}</td>
                <td>{getSignerName(contract.signerId)}</td>
                <td>{contract.signerRole === 'room_leader' ? 'Trưởng phòng' : 'Người ký hợp đồng'}</td>
                <td>Phòng {getRoomNumber(contract.roomId)}</td>
                <td>{formatDate(contract.signDate)}</td>
                <td>{formatDate(contract.startDate)}</td>
                <td>{formatDate(contract.endDate)}</td>
                <td>{formatCurrency(contract.monthlyRent)}</td>
                <td>
                  {contract.hasDiscount ? (
                    <span className="discount-info">
                      {contract.discountMonths} tháng<br/>
                      <small>{formatCurrency(contract.discountRent)}</small>
                    </span>
                  ) : (
                    <span className="no-discount">Không</span>
                  )}
                </td>
                <td>
                  {contract.hasInternet ? (
                    <span className="internet-yes">Internet</span>
                  ) : (
                    <span className="internet-no">-</span>
                  )}
                </td>
                {(permissions.canUpdate || permissions.canDelete) && (
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-sm btn-secondary"
                        title="Xem chi tiết"
                      >
                        <Eye size={16} />
                      </button>
                      {permissions.canUpdate && (
                        <button 
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleEdit(contract)}
                        >
                          <Edit size={16} />
                        </button>
                      )}
                      {permissions.canDelete && (
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(contract.id)}
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
          <div className="modal">
            <div className="modal-header">
              <h2>{editingContract ? 'Sửa hợp đồng' : 'Tạo hợp đồng mới'}</h2>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Mã hợp đồng *</label>
                  <input
                    type="text"
                    value={formData.contractCode}
                    onChange={(e) => setFormData({...formData, contractCode: e.target.value})}
                    placeholder="000/HĐTCH - 2025"
                    required
                  />
                  <small>Format: 000/HĐTCH - 2025 (năm tính theo ngày ký hợp đồng)</small>
                </div>

                <div className="form-group">
                  <label>Ngày ký hợp đồng *</label>
                  <input
                    type="date"
                    value={formData.signDate}
                    onChange={(e) => handleSignDateChange(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Ngày bắt đầu hợp đồng *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Ngày kết thúc hợp đồng *</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Chọn phòng *</label>
                  <select
                    value={formData.roomId}
                    onChange={(e) => handleRoomSelect(e.target.value)}
                    required
                  >
                    <option value="">Chọn phòng</option>
                    {getAvailableRooms().map(room => {
                      const roomDetails = storage.getRoomDetails();
                      const roomDetail = roomDetails[room.id];
                      const isDeposited = roomDetail?.status === ROOM_STATUS.DEPOSITED;
                      
                      return (
                        <option key={room.id} value={room.id}>
                          Phòng {room.number} - {formatCurrency(room.price)}
                          {isDeposited ? ' (Đã đặt cọc)' : ' (Trống)'}
                        </option>
                      );
                    })}
                  </select>
                  {formData.suggestedTenantName && (
                    <div className="suggestion-note">
                      <small>Gợi ý: Phòng này đã được đặt cọc bởi "{formData.suggestedTenantName}"</small>
                    </div>
                  )}
                </div>
                
                <div className="form-group">
                  <label>Người ký hợp đồng *</label>
                  <select
                    value={formData.signerId}
                    onChange={(e) => {
                      const newSignerId = e.target.value;
                      // Xóa người ký cũ khỏi roommates nếu có
                      const updatedRoommates = formData.roommates.filter(id => id !== newSignerId);
                      setFormData({
                        ...formData, 
                        signerId: newSignerId,
                        roommates: updatedRoommates
                      });
                    }}
                    required
                  >
                    <option value="">Chọn người ký hợp đồng</option>
                    {tenants.map(tenant => (
                      <option key={tenant.id} value={tenant.id}>
                        {tenant.fullName} - {tenant.phone}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Vai trò *</label>
                  <select
                    value={formData.signerRole}
                    onChange={(e) => setFormData({...formData, signerRole: e.target.value})}
                    required
                  >
                    <option value="room_leader">Trưởng phòng</option>
                    <option value="contract_signer">Người ký hợp đồng</option>
                  </select>
                  <small>
                    Trưởng phòng: Được tính là khách ở trong phòng<br/>
                    Người ký hợp đồng: Không được tính là khách ở trong phòng
                  </small>
                </div>
                
                <div className="form-group">
                  <label>Tiền cọc</label>
                  <input
                    type="number"
                    value={formData.deposit}
                    onChange={(e) => setFormData({...formData, deposit: e.target.value})}
                    placeholder="Nhập số tiền cọc"
                  />
                </div>
                
                <div className="form-group">
                  <label>Tiền thuê hàng tháng *</label>
                  <div className="rent-input-group">
                    <input
                      type="number"
                      value={formData.monthlyRent}
                      onChange={(e) => setFormData({...formData, monthlyRent: e.target.value})}
                      required
                      placeholder="Tiền thuê sẽ tự động điền khi chọn phòng"
                    />
                    <label className="discount-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.hasDiscount}
                        onChange={(e) => setFormData({...formData, hasDiscount: e.target.checked})}
                      />
                      Ưu đãi
                    </label>
                  </div>
                </div>

              </div>

              {/* Phần ưu đãi - dòng riêng */}
              {formData.hasDiscount && (
                <div className="discount-section">
                  <div className="discount-fields">
                    <div className="form-group">
                      <label>Thời gian ưu đãi (tháng) *</label>
                      <input
                        type="number"
                        value={formData.discountMonths}
                        onChange={(e) => setFormData({...formData, discountMonths: e.target.value})}
                        placeholder="Số tháng được ưu đãi"
                        min="1"
                        required={formData.hasDiscount}
                      />
                    </div>

                    <div className="form-group">
                      <label>Tiền thuê ưu đãi *</label>
                      <input
                        type="number"
                        value={formData.discountRent}
                        onChange={(e) => setFormData({...formData, discountRent: e.target.value})}
                        placeholder="Tiền thuê trong thời gian ưu đãi"
                        required={formData.hasDiscount}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="form-grid-continue">

              </div>

              {/* Internet checkbox - dòng riêng */}
              <div className="internet-section">
                <label className="internet-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.hasInternet}
                    onChange={(e) => setFormData({...formData, hasInternet: e.target.checked})}
                  />
                  Internet
                </label>
              </div>

              {/* Danh sách khách thuê khác trong phòng */}
              <div className="roommates-section">
                <div className="roommates-header">
                  <h3>Danh sách khách thuê khác trong phòng</h3>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-primary"
                    onClick={() => setShowRoommateModal(true)}
                    disabled={getAvailableTenantsForRoom().length === 0}
                  >
                    <Plus size={16} />
                    Thêm khách thuê
                  </button>
                </div>
                
                <div className="selected-roommates-list">
                  {formData.roommates.length === 0 ? (
                    <div className="no-roommates">
                      <small>Chưa có khách thuê nào được thêm vào phòng</small>
                    </div>
                  ) : (
                    formData.roommates.map(roommateId => {
                      const roommate = tenants.find(t => t.id === roommateId);
                      return roommate ? (
                        <div key={roommateId} className="selected-roommate-item">
                          <span className="roommate-info">
                            {roommate.fullName} - {roommate.phone}
                          </span>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => handleRemoveRoommate(roommateId)}
                            title="Xóa khỏi danh sách"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ) : null;
                    })
                  )}
                </div>
                
                {formData.roommates.length > 0 && (
                  <div className="roommates-summary">
                    <small>
                      Đã chọn {formData.roommates.length} khách thuê khác
                    </small>
                  </div>
                )}
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingContract ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal chọn khách thuê */}
      {showRoommateModal && (
        <div className="modal-overlay">
          <div className="modal roommate-modal">
            <div className="modal-header">
              <h2>Thêm khách thuê vào phòng</h2>
              <button className="close-btn" onClick={() => setShowRoommateModal(false)}>×</button>
            </div>
            
            <div className="modal-content">
              <p>Chọn khách thuê để thêm vào phòng (chỉ hiển thị khách chưa thuộc phòng nào):</p>
              
              <div className="available-tenants-list">
                {getAvailableTenantsForRoom().length === 0 ? (
                  <div className="no-available-tenants">
                    <p>Không có khách thuê nào có thể thêm vào phòng.</p>
                    <small>Tất cả khách thuê đã thuộc phòng khác hoặc đã được chọn.</small>
                  </div>
                ) : (
                  getAvailableTenantsForRoom().map(tenant => (
                    <div key={tenant.id} className="available-tenant-item">
                      <div className="tenant-info">
                        <strong>{tenant.fullName}</strong>
                        <span>{tenant.phone}</span>
                        <small>{tenant.email}</small>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => handleAddRoommate(tenant.id)}
                      >
                        Thêm
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowRoommateModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contracts;