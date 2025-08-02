import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, DollarSign, Calendar, TrendingUp, FileText, Clock, CalendarPlus } from 'lucide-react';
import { storage, formatDate } from '../utils/localStorage';
import { getCurrentUser } from '../utils/auth';
import { PERMISSIONS, USER_ROLES } from '../constants/roles';
import { ROOMS } from '../constants/rooms';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showMonthlyModal, setShowMonthlyModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Bộ lọc theo tháng
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  
  const [formData, setFormData] = useState({
    contractId: '',
    month: '',
    year: '',
    rentAmount: '',
    electricityAmount: '',
    waterAmount: '',
    serviceAmount: '',
    otherAmount: '',
    totalAmount: '',
    dueDate: '',
    status: 'pending',
    notes: ''
  });

  const currentUser = getCurrentUser();
  const permissions = PERMISSIONS[currentUser?.role] || {};

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allInvoices = storage.getInvoices();
    const allContracts = storage.getContracts();
    const allTenants = storage.getTenants();
    
    // Nếu là tenant, chỉ xem hóa đơn của mình
    if (currentUser?.role === USER_ROLES.TENANT) {
      const userContracts = allContracts.filter(c => {
        const tenant = allTenants.find(t => t.id === c.tenantId);
        return tenant?.email === currentUser.email;
      });
      const userContractIds = userContracts.map(c => c.id);
      const userInvoices = allInvoices.filter(i => userContractIds.includes(i.contractId));
      setInvoices(userInvoices);
      setContracts(userContracts);
    } else {
      setInvoices(allInvoices);
      setContracts(allContracts);
    }
    
    setTenants(allTenants);
  };

  const calculateTotal = (data) => {
    const rent = parseFloat(data.rentAmount) || 0;
    const electricity = parseFloat(data.electricityAmount) || 0;
    const water = parseFloat(data.waterAmount) || 0;
    const service = parseFloat(data.serviceAmount) || 0;
    const other = parseFloat(data.otherAmount) || 0;
    return rent + electricity + water + service + other;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const totalAmount = calculateTotal(formData);
    const invoiceData = {
      ...formData,
      totalAmount,
      id: editingInvoice ? editingInvoice.id : Date.now().toString(),
      createdAt: editingInvoice ? editingInvoice.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const allInvoices = storage.getInvoices();
    const updatedInvoices = editingInvoice
      ? allInvoices.map(i => i.id === editingInvoice.id ? invoiceData : i)
      : [...allInvoices, invoiceData];

    storage.setInvoices(updatedInvoices);
    loadData();
    resetForm();
  };

  const handleEdit = (invoice) => {
    setEditingInvoice(invoice);
    setFormData(invoice);
    setShowModal(true);
  };

  const handleDelete = (invoiceId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hóa đơn này?')) {
      const allInvoices = storage.getInvoices();
      const updatedInvoices = allInvoices.filter(i => i.id !== invoiceId);
      storage.setInvoices(updatedInvoices);
      loadData();
    }
  };

  const resetForm = () => {
    setFormData({
      contractId: '',
      month: selectedMonth.toString(),
      year: selectedYear.toString(),
      rentAmount: '',
      electricityAmount: '',
      waterAmount: '',
      serviceAmount: '',
      otherAmount: '',
      totalAmount: '',
      dueDate: '',
      status: 'pending',
      notes: ''
    });
    setEditingInvoice(null);
    setShowModal(false);
  };

  // State cho form tạo hóa đơn tháng
  const [monthlyFormData, setMonthlyFormData] = useState({
    // Công tơ tổng
    mainMeter1PhaseStart: '',
    mainMeter1PhaseEnd: '',
    mainMeter3PhaseStart: '',
    mainMeter3PhaseEnd: '',
    // Công tơ phòng
    roomMeters: {}
  });

  // Mở modal tạo hóa đơn tháng
  const handleCreateMonthlyInvoices = () => {
    // Khởi tạo dữ liệu công tơ phòng
    const roomMetersData = {};
    ROOMS.forEach(room => {
      roomMetersData[room.id] = {
        startReading: '',
        endReading: ''
      };
    });

    // Lấy dữ liệu tháng trước nếu có
    const previousMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
    const previousYear = selectedMonth === 1 ? selectedYear - 1 : selectedYear;
    const previousData = storage.getMonthlyElectricityData(`${previousMonth}-${previousYear}`);

    if (previousData) {
      setMonthlyFormData({
        mainMeter1PhaseStart: previousData.mainMeter1PhaseEnd || '',
        mainMeter1PhaseEnd: '',
        mainMeter3PhaseStart: previousData.mainMeter3PhaseEnd || '',
        mainMeter3PhaseEnd: '',
        roomMeters: Object.keys(roomMetersData).reduce((acc, roomId) => {
          acc[roomId] = {
            startReading: previousData.roomMeters?.[roomId]?.endReading || '',
            endReading: ''
          };
          return acc;
        }, {})
      });
    } else {
      setMonthlyFormData({
        mainMeter1PhaseStart: '',
        mainMeter1PhaseEnd: '',
        mainMeter3PhaseStart: '',
        mainMeter3PhaseEnd: '',
        roomMeters: roomMetersData
      });
    }

    setShowMonthlyModal(true);
  };

  // Tính toán điện chung và tạo hóa đơn
  const handleSubmitMonthlyInvoices = (e) => {
    e.preventDefault();
    
    // Lấy giá dịch vụ từ localStorage
    const utilityPrices = storage.getUtilityPrices();
    
    // Tính tổng điện sử dụng từ công tơ tổng
    const totalMainElectricity = 
      (parseFloat(monthlyFormData.mainMeter1PhaseEnd) - parseFloat(monthlyFormData.mainMeter1PhaseStart)) +
      (parseFloat(monthlyFormData.mainMeter3PhaseEnd) - parseFloat(monthlyFormData.mainMeter3PhaseStart));

    // Tính tổng điện các phòng
    let totalRoomElectricity = 0;
    Object.values(monthlyFormData.roomMeters).forEach(meter => {
      if (meter.startReading && meter.endReading) {
        totalRoomElectricity += parseFloat(meter.endReading) - parseFloat(meter.startReading);
      }
    });

    // Điện chung
    const commonElectricity = totalMainElectricity - totalRoomElectricity;

    // Đếm số người đang thuê (từ hợp đồng hiệu lực)
    const activeContracts = contracts.filter(contract => {
      const startDate = new Date(contract.startDate);
      const endDate = new Date(contract.endDate);
      const checkDate = new Date(selectedYear, selectedMonth - 1, 1);
      return startDate <= checkDate && endDate >= checkDate;
    });

    let totalTenants = 0;
    activeContracts.forEach(contract => {
      totalTenants += 1; // Người ký hợp đồng
      if (contract.roommates) {
        totalTenants += contract.roommates.length; // Người ở cùng
      }
    });

    // Điện chung/người
    const commonElectricityPerPerson = totalTenants > 0 ? commonElectricity / totalTenants : 0;

    // Tạo hóa đơn cho từng hợp đồng
    const allInvoices = storage.getInvoices();
    const newInvoices = [];

    activeContracts.forEach(contract => {
      // Kiểm tra đã có hóa đơn chưa
      const existingInvoice = allInvoices.find(invoice => 
        invoice.contractId === contract.id && 
        parseInt(invoice.month) === selectedMonth && 
        parseInt(invoice.year) === selectedYear
      );

      if (!existingInvoice) {
        const room = ROOMS.find(r => r.id === contract.roomId);
        const roomMeter = monthlyFormData.roomMeters[contract.roomId];
        
        // Tính điện phòng
        const roomElectricity = roomMeter && roomMeter.startReading && roomMeter.endReading 
          ? parseFloat(roomMeter.endReading) - parseFloat(roomMeter.startReading) 
          : 0;

        // Số người trong phòng
        const peopleInRoom = 1 + (contract.roommates ? contract.roommates.length : 0);

        // Tính toán chi phí sử dụng giá từ localStorage
        const rentAmount = parseFloat(contract.monthlyRent) || 0;
        const electricityAmount = (roomElectricity + (commonElectricityPerPerson * peopleInRoom)) * parseFloat(utilityPrices.electricityPrice);
        const waterAmount = parseFloat(utilityPrices.waterPrice) * peopleInRoom;
        const serviceAmount = parseFloat(utilityPrices.servicePrice) * peopleInRoom;
        const internetAmount = contract.hasInternet ? parseFloat(utilityPrices.internetPrice) : 0;
        
        const totalAmount = rentAmount + electricityAmount + waterAmount + serviceAmount + internetAmount;

        const newInvoice = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          contractId: contract.id,
          month: selectedMonth.toString(),
          year: selectedYear.toString(),
          rentAmount,
          electricityAmount,
          waterAmount,
          serviceAmount,
          otherAmount: internetAmount,
          totalAmount,
          dueDate: new Date(selectedYear, selectedMonth - 1, 15).toISOString().split('T')[0],
          status: 'pending',
          notes: `Hóa đơn tự động - Điện phòng: ${roomElectricity}kWh, Điện chung: ${(commonElectricityPerPerson * peopleInRoom).toFixed(2)}kWh`,
          electricityDetails: {
            roomElectricity,
            commonElectricity: commonElectricityPerPerson * peopleInRoom,
            peopleInRoom,
            electricityPrice: parseFloat(utilityPrices.electricityPrice)
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        newInvoices.push(newInvoice);
      }
    });

    // Lưu dữ liệu điện tháng này để dùng cho tháng sau
    const monthlyElectricityData = {
      month: selectedMonth,
      year: selectedYear,
      mainMeter1PhaseStart: parseFloat(monthlyFormData.mainMeter1PhaseStart),
      mainMeter1PhaseEnd: parseFloat(monthlyFormData.mainMeter1PhaseEnd),
      mainMeter3PhaseStart: parseFloat(monthlyFormData.mainMeter3PhaseStart),
      mainMeter3PhaseEnd: parseFloat(monthlyFormData.mainMeter3PhaseEnd),
      roomMeters: monthlyFormData.roomMeters,
      totalMainElectricity,
      totalRoomElectricity,
      commonElectricity,
      totalTenants,
      commonElectricityPerPerson
    };

    storage.setMonthlyElectricityData(`${selectedMonth}-${selectedYear}`, monthlyElectricityData);

    // Lưu hóa đơn
    if (newInvoices.length > 0) {
      const updatedInvoices = [...allInvoices, ...newInvoices];
      storage.setInvoices(updatedInvoices);
      loadData();
      alert(`Đã tạo thành công ${newInvoices.length} hóa đơn cho tháng ${selectedMonth}/${selectedYear}`);
    } else {
      alert(`Tất cả hợp đồng hiệu lực đã có hóa đơn cho tháng ${selectedMonth}/${selectedYear}`);
    }

    setShowMonthlyModal(false);
  };

  const getContractInfo = (contractId) => {
    const contract = contracts.find(c => c.id === contractId);
    if (!contract) return { tenant: 'N/A', room: 'N/A' };
    
    const tenant = tenants.find(t => t.id === contract.tenantId);
    const room = ROOMS.find(r => r.id === contract.roomId);
    
    return {
      tenant: tenant ? tenant.fullName : 'N/A',
      room: room ? room.number : 'N/A'
    };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusLabel = (status) => {
    const statusLabels = {
      pending: 'Chưa thanh toán',
      paid: 'Đã thanh toán',
      overdue: 'Quá hạn'
    };
    return statusLabels[status] || status;
  };

  // Lọc hóa đơn theo tháng/năm được chọn và tìm kiếm
  const filteredInvoices = invoices.filter(invoice => {
    const contractInfo = getContractInfo(invoice.contractId);
    const matchesMonth = parseInt(invoice.month) === selectedMonth && parseInt(invoice.year) === selectedYear;
    const matchesSearch = (
      contractInfo.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contractInfo.room.includes(searchTerm) ||
      invoice.id.includes(searchTerm)
    );
    return matchesMonth && matchesSearch;
  });

  // Tính toán thống kê theo tháng
  const monthlyStats = {
    totalInvoices: filteredInvoices.length,
    totalRevenue: filteredInvoices.reduce((sum, invoice) => sum + parseFloat(invoice.totalAmount || 0), 0),
    paidInvoices: filteredInvoices.filter(inv => inv.status === 'paid').length,
    pendingInvoices: filteredInvoices.filter(inv => inv.status === 'pending').length,
    overdueInvoices: filteredInvoices.filter(inv => inv.status === 'overdue').length
  };

  return (
    <div className="invoices-page">
      <div className="page-header">
        <h1>Quản lý hóa đơn</h1>
        <div className="page-actions">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm hóa đơn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {permissions.canCreate && (
            <>
              <button 
                className="btn btn-primary"
                onClick={() => setShowModal(true)}
              >
                <Plus size={20} />
                Tạo hóa đơn
              </button>
              <button 
                className="btn btn-success"
                onClick={handleCreateMonthlyInvoices}
                title={`Tạo hóa đơn cho tất cả hợp đồng hiệu lực trong tháng ${selectedMonth}/${selectedYear}`}
              >
                <CalendarPlus size={20} />
                Tạo hóa đơn tháng
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bộ lọc theo tháng */}
      <div className="month-filter">
        <div className="filter-controls">
          <div className="month-selector">
            <Calendar size={20} />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {Array.from({length: 12}, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Tháng {i + 1}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {Array.from({length: 6}, (_, i) => {
                const year = currentDate.getFullYear() - 2 + i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {/* Thống kê tháng */}
      <div className="monthly-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <h3>{monthlyStats.totalInvoices}</h3>
            <p>Tổng hóa đơn</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon revenue">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>{formatCurrency(monthlyStats.totalRevenue)}</h3>
            <p>Tổng doanh thu</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon paid">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <h3>{monthlyStats.paidInvoices}</h3>
            <p>Đã thanh toán</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon pending">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h3>{monthlyStats.pendingInvoices}</h3>
            <p>Chưa thanh toán</p>
          </div>
        </div>
        
        {monthlyStats.overdueInvoices > 0 && (
          <div className="stat-card">
            <div className="stat-icon overdue">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <h3>{monthlyStats.overdueInvoices}</h3>
              <p>Quá hạn</p>
            </div>
          </div>
        )}
      </div>

      <div className="invoices-table">
        {filteredInvoices.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Mã HĐ</th>
                <th>Khách thuê</th>
                <th>Phòng</th>
                <th>Tháng/Năm</th>
                <th>Tổng tiền</th>
                <th>Hạn thanh toán</th>
                <th>Trạng thái</th>
                {(permissions.canUpdate || permissions.canDelete) && <th>Thao tác</th>}
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => {
                const contractInfo = getContractInfo(invoice.contractId);
                return (
                  <tr key={invoice.id}>
                    <td>HD{invoice.id}</td>
                    <td>{contractInfo.tenant}</td>
                    <td>Phòng {contractInfo.room}</td>
                    <td>{invoice.month}/{invoice.year}</td>
                    <td>{formatCurrency(invoice.totalAmount)}</td>
                    <td>{formatDate(invoice.dueDate)}</td>
                    <td>
                      <span className={`status ${invoice.status}`}>
                        {getStatusLabel(invoice.status)}
                      </span>
                    </td>
                    {(permissions.canUpdate || permissions.canDelete) && (
                      <td>
                        <div className="action-buttons">
                          {permissions.canUpdate && (
                            <button 
                              className="btn btn-sm btn-secondary"
                              onClick={() => handleEdit(invoice)}
                            >
                              <Edit size={16} />
                            </button>
                          )}
                          {permissions.canDelete && (
                            <button 
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(invoice.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="no-data">
            <FileText size={48} />
            <h3>Không có hóa đơn nào</h3>
            <p>Chưa có hóa đơn nào cho tháng {selectedMonth}/{selectedYear}</p>
            {permissions.canCreate && (
              <button 
                className="btn btn-primary"
                onClick={() => setShowModal(true)}
              >
                <Plus size={20} />
                Tạo hóa đơn đầu tiên
              </button>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal large-modal">
            <div className="modal-header">
              <h2>{editingInvoice ? 'Sửa hóa đơn' : 'Tạo hóa đơn mới'}</h2>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Hợp đồng *</label>
                  <select
                    value={formData.contractId}
                    onChange={(e) => {
                      const contract = contracts.find(c => c.id === e.target.value);
                      setFormData({
                        ...formData, 
                        contractId: e.target.value,
                        rentAmount: contract ? contract.monthlyRent : ''
                      });
                    }}
                    required
                  >
                    <option value="">Chọn hợp đồng</option>
                    {contracts.map(contract => {
                      const contractInfo = getContractInfo(contract.id);
                      return (
                        <option key={contract.id} value={contract.id}>
                          {contractInfo.tenant} - Phòng {contractInfo.room}
                        </option>
                      );
                    })}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Tháng *</label>
                  <select
                    value={formData.month}
                    onChange={(e) => setFormData({...formData, month: e.target.value})}
                    required
                  >
                    <option value="">Chọn tháng</option>
                    {Array.from({length: 12}, (_, i) => (
                      <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Năm *</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                    min="2020"
                    max="2030"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Hạn thanh toán *</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Tiền thuê phòng</label>
                  <input
                    type="number"
                    value={formData.rentAmount}
                    onChange={(e) => setFormData({...formData, rentAmount: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Tiền điện</label>
                  <input
                    type="number"
                    value={formData.electricityAmount}
                    onChange={(e) => setFormData({...formData, electricityAmount: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Tiền nước</label>
                  <input
                    type="number"
                    value={formData.waterAmount}
                    onChange={(e) => setFormData({...formData, waterAmount: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Phí dịch vụ</label>
                  <input
                    type="number"
                    value={formData.serviceAmount}
                    onChange={(e) => setFormData({...formData, serviceAmount: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Chi phí khác</label>
                  <input
                    type="number"
                    value={formData.otherAmount}
                    onChange={(e) => setFormData({...formData, otherAmount: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Trạng thái</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="pending">Chưa thanh toán</option>
                    <option value="paid">Đã thanh toán</option>
                    <option value="overdue">Quá hạn</option>
                  </select>
                </div>
                
                <div className="form-group full-width">
                  <label>Ghi chú</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows="3"
                  />
                </div>
                
                <div className="form-group full-width">
                  <div className="total-amount">
                    <DollarSign size={20} />
                    <span>Tổng tiền: {formatCurrency(calculateTotal(formData))}</span>
                  </div>
                </div>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingInvoice ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal tạo hóa đơn tháng */}
      {showMonthlyModal && (
        <div className="modal-overlay">
          <div className="modal extra-large-modal">
            <div className="modal-header">
              <h2>Tạo hóa đơn tháng {selectedMonth}/{selectedYear}</h2>
              <button className="close-btn" onClick={() => setShowMonthlyModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmitMonthlyInvoices}>
              {/* Công tơ tổng */}
              <div className="meter-section">
                <h3>Công tơ tổng tòa nhà</h3>
                <div className="meter-grid">
                  <div className="form-group">
                    <label>Công tơ 1 pha - Đầu tháng</label>
                    <input
                      type="number"
                      value={monthlyFormData.mainMeter1PhaseStart}
                      onChange={(e) => setMonthlyFormData({
                        ...monthlyFormData,
                        mainMeter1PhaseStart: e.target.value
                      })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Công tơ 1 pha - Cuối tháng</label>
                    <input
                      type="number"
                      value={monthlyFormData.mainMeter1PhaseEnd}
                      onChange={(e) => setMonthlyFormData({
                        ...monthlyFormData,
                        mainMeter1PhaseEnd: e.target.value
                      })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Công tơ 3 pha - Đầu tháng</label>
                    <input
                      type="number"
                      value={monthlyFormData.mainMeter3PhaseStart}
                      onChange={(e) => setMonthlyFormData({
                        ...monthlyFormData,
                        mainMeter3PhaseStart: e.target.value
                      })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Công tơ 3 pha - Cuối tháng</label>
                    <input
                      type="number"
                      value={monthlyFormData.mainMeter3PhaseEnd}
                      onChange={(e) => setMonthlyFormData({
                        ...monthlyFormData,
                        mainMeter3PhaseEnd: e.target.value
                      })}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Công tơ phòng */}
              <div className="meter-section">
                <h3>Công tơ các phòng</h3>
                <div className="room-meters-grid">
                  {ROOMS.map(room => (
                    <div key={room.id} className="room-meter-item">
                      <h4>Phòng {room.number}</h4>
                      <div className="meter-inputs">
                        <div className="form-group">
                          <label>Đầu tháng</label>
                          <input
                            type="number"
                            value={monthlyFormData.roomMeters[room.id]?.startReading || ''}
                            onChange={(e) => setMonthlyFormData({
                              ...monthlyFormData,
                              roomMeters: {
                                ...monthlyFormData.roomMeters,
                                [room.id]: {
                                  ...monthlyFormData.roomMeters[room.id],
                                  startReading: e.target.value
                                }
                              }
                            })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Cuối tháng</label>
                          <input
                            type="number"
                            value={monthlyFormData.roomMeters[room.id]?.endReading || ''}
                            onChange={(e) => setMonthlyFormData({
                              ...monthlyFormData,
                              roomMeters: {
                                ...monthlyFormData.roomMeters,
                                [room.id]: {
                                  ...monthlyFormData.roomMeters[room.id],
                                  endReading: e.target.value
                                }
                              }
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tính toán tạm thời */}
              {monthlyFormData.mainMeter1PhaseStart && monthlyFormData.mainMeter1PhaseEnd && 
               monthlyFormData.mainMeter3PhaseStart && monthlyFormData.mainMeter3PhaseEnd && (
                <div className="meter-section">
                  <h3>Tính toán tạm thời</h3>
                  <div className="calculation-summary">
                    {(() => {
                      const utilityPrices = storage.getUtilityPrices();
                      
                      const totalMainElectricity = 
                        (parseFloat(monthlyFormData.mainMeter1PhaseEnd) - parseFloat(monthlyFormData.mainMeter1PhaseStart)) +
                        (parseFloat(monthlyFormData.mainMeter3PhaseEnd) - parseFloat(monthlyFormData.mainMeter3PhaseStart));

                      let totalRoomElectricity = 0;
                      Object.values(monthlyFormData.roomMeters).forEach(meter => {
                        if (meter.startReading && meter.endReading) {
                          totalRoomElectricity += parseFloat(meter.endReading) - parseFloat(meter.startReading);
                        }
                      });

                      const commonElectricity = totalMainElectricity - totalRoomElectricity;

                      const activeContracts = contracts.filter(contract => {
                        const startDate = new Date(contract.startDate);
                        const endDate = new Date(contract.endDate);
                        const checkDate = new Date(selectedYear, selectedMonth - 1, 1);
                        return startDate <= checkDate && endDate >= checkDate;
                      });

                      let totalTenants = 0;
                      activeContracts.forEach(contract => {
                        totalTenants += 1 + (contract.roommates ? contract.roommates.length : 0);
                      });

                      const commonElectricityPerPerson = totalTenants > 0 ? commonElectricity / totalTenants : 0;

                      return (
                        <>
                          <div className="calculation-item">
                            <span>Tổng điện tòa nhà:</span>
                            <strong>{totalMainElectricity.toFixed(2)} kWh</strong>
                          </div>
                          <div className="calculation-item">
                            <span>Tổng điện các phòng:</span>
                            <strong>{totalRoomElectricity.toFixed(2)} kWh</strong>
                          </div>
                          <div className="calculation-item">
                            <span>Điện chung:</span>
                            <strong>{commonElectricity.toFixed(2)} kWh</strong>
                          </div>
                          <div className="calculation-item">
                            <span>Số người đang thuê:</span>
                            <strong>{totalTenants} người</strong>
                          </div>
                          <div className="calculation-item">
                            <span>Điện chung/người:</span>
                            <strong>{commonElectricityPerPerson.toFixed(2)} kWh</strong>
                          </div>
                          <div className="calculation-item">
                            <span>Số hợp đồng hiệu lực:</span>
                            <strong>{activeContracts.length} hợp đồng</strong>
                          </div>
                          <div className="calculation-item">
                            <span>Giá điện hiện tại:</span>
                            <strong>{formatCurrency(utilityPrices.electricityPrice)}/kWh</strong>
                          </div>
                          <div className="calculation-item">
                            <span>Giá nước hiện tại:</span>
                            <strong>{formatCurrency(utilityPrices.waterPrice)}/người</strong>
                          </div>
                          <div className="calculation-item">
                            <span>Phí dịch vụ hiện tại:</span>
                            <strong>{formatCurrency(utilityPrices.servicePrice)}/người</strong>
                          </div>
                          <div className="calculation-item">
                            <span>Phí Internet hiện tại:</span>
                            <strong>{formatCurrency(utilityPrices.internetPrice)}/phòng</strong>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
              
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowMonthlyModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-success">
                  Tạo hóa đơn tháng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;