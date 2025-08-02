import React, { useState, useEffect } from 'react';
import { Building, User, Calendar, Edit, Save, X, Wifi, WifiOff } from 'lucide-react';
import { ROOMS, ROOM_STATUS } from '../constants/rooms';
import { storage, formatDate } from '../utils/localStorage';
import { getCurrentUser } from '../utils/auth';
import { PERMISSIONS } from '../constants/roles';

const Rooms = () => {
    const [roomAssignments, setRoomAssignments] = useState({});
    const [roomDetails, setRoomDetails] = useState({});
    const [tenants, setTenants] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [editingRoom, setEditingRoom] = useState(null);
    const [editForm, setEditForm] = useState({
        status: '',
        hasInternet: true,
        depositInfo: {
            depositorId: '',
            depositAmount: '',
            contractDate: ''
        },
        maintenanceNote: ''
    });

    const currentUser = getCurrentUser();
    const permissions = PERMISSIONS[currentUser?.role] || {};

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setRoomAssignments(storage.getRoomAssignments());
        setRoomDetails(storage.getRoomDetails());
        setTenants(storage.getTenants());
        setContracts(storage.getContracts());
    };

    const initializeRoomDetails = () => {
        const existingDetails = storage.getRoomDetails();
        const updatedDetails = { ...existingDetails };

        ROOMS.forEach(room => {
            if (!updatedDetails[room.id]) {
                updatedDetails[room.id] = {
                    status: ROOM_STATUS.AVAILABLE,
                    hasInternet: true,
                    depositInfo: {
                        depositorId: '',
                        depositAmount: '',
                        contractDate: ''
                    },
                    maintenanceNote: ''
                };
            } else {
                // Migrate old data structure (depositorName -> depositorId)
                if (updatedDetails[room.id].depositInfo && updatedDetails[room.id].depositInfo.depositorName) {
                    const depositorName = updatedDetails[room.id].depositInfo.depositorName;
                    const tenant = tenants.find(t => t.fullName === depositorName);
                    updatedDetails[room.id].depositInfo.depositorId = tenant ? tenant.id : '';
                    delete updatedDetails[room.id].depositInfo.depositorName;
                }
            }
        });

        storage.setRoomDetails(updatedDetails);
        setRoomDetails(updatedDetails);
    };

    useEffect(() => {
        initializeRoomDetails();
    }, []);

    const getRoomStatus = (roomId) => {
        // Kiểm tra xem phòng có hợp đồng hiệu lực không
        const assignment = roomAssignments[roomId];
        if (assignment) {
            const contract = contracts.find(c => c.id === assignment.contractId);
            if (contract && contract.status === 'active') {
                return ROOM_STATUS.OCCUPIED;
            }
        }

        // Kiểm tra trạng thái đã đặt cọc có quá hạn không
        const roomDetail = roomDetails[roomId];
        if (roomDetail && roomDetail.status === ROOM_STATUS.DEPOSITED) {
            const contractDate = new Date(roomDetail.depositInfo.contractDate);
            const today = new Date();
            if (today > contractDate) {
                // Tự động chuyển về trống nếu quá hạn
                updateRoomStatus(roomId, ROOM_STATUS.AVAILABLE);
                return ROOM_STATUS.AVAILABLE;
            }
        }

        return roomDetail?.status || ROOM_STATUS.AVAILABLE;
    };

    const updateRoomStatus = (roomId, newStatus, additionalData = {}) => {
        const updatedDetails = { ...roomDetails };
        if (!updatedDetails[roomId]) {
            updatedDetails[roomId] = {
                status: ROOM_STATUS.AVAILABLE,
                hasInternet: true,
                depositInfo: { depositorId: '', depositAmount: '', contractDate: '' },
                maintenanceNote: ''
            };
        }

        updatedDetails[roomId] = {
            ...updatedDetails[roomId],
            status: newStatus,
            ...additionalData
        };

        storage.setRoomDetails(updatedDetails);
        setRoomDetails(updatedDetails);
    };

    const getRoomTenant = (roomId) => {
        const assignment = roomAssignments[roomId];
        if (assignment) {
            return tenants.find(t => t.id === assignment.tenantId);
        }
        return null;
    };

    const getRoomContract = (roomId) => {
        const assignment = roomAssignments[roomId];
        if (assignment) {
            return contracts.find(c => c.id === assignment.contractId);
        }
        return null;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case ROOM_STATUS.AVAILABLE:
                return 'green';
            case ROOM_STATUS.OCCUPIED:
                return 'blue';
            case ROOM_STATUS.DEPOSITED:
                return 'yellow';
            case ROOM_STATUS.MAINTENANCE:
                return 'orange';
            default:
                return 'gray';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case ROOM_STATUS.AVAILABLE:
                return 'Trống';
            case ROOM_STATUS.OCCUPIED:
                return 'Đã thuê';
            case ROOM_STATUS.DEPOSITED:
                return 'Đã cọc';
            case ROOM_STATUS.MAINTENANCE:
                return 'Bảo trì';
            default:
                return 'Không xác định';
        }
    };

    const handleEditRoom = (roomId) => {
        const roomDetail = roomDetails[roomId] || {
            status: ROOM_STATUS.AVAILABLE,
            hasInternet: true,
            depositInfo: { depositorId: '', depositAmount: '', contractDate: '' },
            maintenanceNote: ''
        };

        setEditingRoom(roomId);
        setEditForm(roomDetail);
    };

    const handleSaveRoom = () => {
        if (!editingRoom) return;

        const newStatus = editForm.status;

        // Kiểm tra logic chuyển trạng thái
        if (newStatus === ROOM_STATUS.OCCUPIED) {
            const assignment = roomAssignments[editingRoom];
            if (!assignment) {
                alert('Không thể chuyển sang trạng thái "Đã thuê" khi phòng chưa có hợp đồng!');
                return;
            }
        }

        // Kiểm tra thông tin đặt cọc
        if (newStatus === ROOM_STATUS.DEPOSITED) {
            if (!editForm.depositInfo.depositorId) {
                alert('Vui lòng chọn người đặt cọc!');
                return;
            }
            if (!editForm.depositInfo.depositAmount) {
                alert('Vui lòng nhập số tiền cọc!');
                return;
            }
            if (!editForm.depositInfo.contractDate) {
                alert('Vui lòng chọn ngày hẹn ký hợp đồng!');
                return;
            }
        }

        updateRoomStatus(editingRoom, newStatus, {
            hasInternet: editForm.hasInternet,
            depositInfo: editForm.depositInfo,
            maintenanceNote: editForm.maintenanceNote
        });

        setEditingRoom(null);
    };

    const handleCancelEdit = () => {
        setEditingRoom(null);
        setEditForm({
            status: '',
            hasInternet: true,
            depositInfo: { depositorId: '', depositAmount: '', contractDate: '' },
            maintenanceNote: ''
        });
    };

    const canChangeStatus = (roomId, targetStatus) => {
        const assignment = roomAssignments[roomId];
        const hasContract = assignment && contracts.find(c => c.id === assignment.contractId && c.status === 'active');

        if (targetStatus === ROOM_STATUS.OCCUPIED && !hasContract) {
            return false;
        }

        if (hasContract && targetStatus !== ROOM_STATUS.OCCUPIED) {
            return false;
        }

        return true;
    };

    const getDepositorName = (depositorId) => {
        const tenant = tenants.find(t => t.id === depositorId);
        return tenant ? tenant.fullName : 'N/A';
    };

    return (
        <div className="rooms-page">
            <div className="page-header">
                <h1>Quản lý phòng</h1>
                <p>Danh sách và trạng thái các phòng trong tòa nhà</p>
            </div>

            <div className="rooms-grid">
                {ROOMS.map((room) => {
                    const status = getRoomStatus(room.id);
                    const tenant = getRoomTenant(room.id);
                    const contract = getRoomContract(room.id);
                    const roomDetail = roomDetails[room.id] || {};
                    const isEditing = editingRoom === room.id;

                    return (
                        <div key={room.id} className={`room-card ${getStatusColor(status)}`}>
                            <div className="room-header">
                                <div className="room-number">
                                    <Building size={20} />
                                    <span>Phòng {room.number}</span>
                                    {status === ROOM_STATUS.OCCUPIED && (
                                        roomDetail.hasInternet ? (
                                            <Wifi size={16} className="wifi-icon" title="Có Internet" />
                                        ) : (
                                            <WifiOff size={16} className="wifi-icon disabled" title="Không có Internet" />
                                        )
                                    )}
                                </div>
                                <div className="room-actions">
                                    <div className={`room-status ${getStatusColor(status)}`}>
                                        {getStatusLabel(status)}
                                    </div>
                                    {permissions.canUpdate && !isEditing && (
                                        <button
                                            className="btn btn-sm btn-secondary"
                                            onClick={() => handleEditRoom(room.id)}
                                            title="Chỉnh sửa phòng"
                                        >
                                            <Edit size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="room-details">
                                <div className="room-info">
                                    <p><strong>Diện tích:</strong> {room.area}m² (cố định)</p>
                                    <p><strong>Giá thuê:</strong> {formatCurrency(room.price)}</p>
                                    <p><strong>Tầng:</strong> {room.floor} (cố định)</p>
                                </div>

                                {isEditing && (
                                    <div className="room-edit-form">
                                        <div className="form-group">
                                            <label>Trạng thái:</label>
                                            <select
                                                value={editForm.status}
                                                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                            >
                                                <option value={ROOM_STATUS.AVAILABLE}>Trống</option>
                                                <option
                                                    value={ROOM_STATUS.OCCUPIED}
                                                    disabled={!canChangeStatus(room.id, ROOM_STATUS.OCCUPIED)}
                                                >
                                                    Đã thuê
                                                </option>
                                                <option value={ROOM_STATUS.DEPOSITED}>Đã cọc</option>
                                                <option value={ROOM_STATUS.MAINTENANCE}>Bảo trì</option>
                                            </select>
                                        </div>

                                        {editForm.status === ROOM_STATUS.OCCUPIED && (
                                            <div className="form-group">
                                                <label className="checkbox-label">
                                                    <input
                                                        type="checkbox"
                                                        checked={editForm.hasInternet}
                                                        onChange={(e) => setEditForm({ ...editForm, hasInternet: e.target.checked })}
                                                    />
                                                    Internet
                                                </label>
                                            </div>
                                        )}

                                        {editForm.status === ROOM_STATUS.DEPOSITED && (
                                            <div className="deposit-form">
                                                <div className="form-group">
                                                    <label>Người đặt cọc:</label>
                                                    <select
                                                        value={editForm.depositInfo.depositorId}
                                                        onChange={(e) => setEditForm({
                                                            ...editForm,
                                                            depositInfo: {
                                                                ...editForm.depositInfo,
                                                                depositorId: e.target.value
                                                            }
                                                        })}
                                                    >
                                                        <option value="">Chọn khách thuê</option>
                                                        {tenants.map(tenant => (
                                                            <option key={tenant.id} value={tenant.id}>
                                                                {tenant.fullName} - {tenant.phone}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label>Số tiền cọc:</label>
                                                    <input
                                                        type="number"
                                                        value={editForm.depositInfo.depositAmount}
                                                        onChange={(e) => setEditForm({
                                                            ...editForm,
                                                            depositInfo: {
                                                                ...editForm.depositInfo,
                                                                depositAmount: e.target.value
                                                            }
                                                        })}
                                                        placeholder="Số tiền đã cọc"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Ngày hẹn ký HĐ:</label>
                                                    <input
                                                        type="date"
                                                        value={editForm.depositInfo.contractDate}
                                                        onChange={(e) => setEditForm({
                                                            ...editForm,
                                                            depositInfo: {
                                                                ...editForm.depositInfo,
                                                                contractDate: e.target.value
                                                            }
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {editForm.status === ROOM_STATUS.MAINTENANCE && (
                                            <div className="form-group">
                                                <label>Nội dung bảo trì:</label>
                                                <textarea
                                                    value={editForm.maintenanceNote}
                                                    onChange={(e) => setEditForm({ ...editForm, maintenanceNote: e.target.value })}
                                                    placeholder="Mô tả công việc bảo trì..."
                                                    rows="3"
                                                />
                                            </div>
                                        )}

                                        <div className="form-actions">
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={handleSaveRoom}
                                            >
                                                <Save size={14} />
                                                Lưu
                                            </button>
                                            <button
                                                className="btn btn-sm btn-secondary"
                                                onClick={handleCancelEdit}
                                            >
                                                <X size={14} />
                                                Hủy
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {!isEditing && (
                                    <>
                                        {status === ROOM_STATUS.DEPOSITED && roomDetail.depositInfo && roomDetail.depositInfo.depositorId && (
                                            <div className="deposit-info">
                                                <h4>Thông tin đặt cọc:</h4>
                                                <p><strong>Người cọc:</strong> {getDepositorName(roomDetail.depositInfo.depositorId)}</p>
                                                <p><strong>Số tiền:</strong> {formatCurrency(roomDetail.depositInfo.depositAmount)}</p>
                                                <p><strong>Hẹn ký HĐ:</strong> {formatDate(roomDetail.depositInfo.contractDate)}</p>
                                            </div>
                                        )}

                                        {status === ROOM_STATUS.MAINTENANCE && roomDetail.maintenanceNote && (
                                            <div className="maintenance-info">
                                                <h4>Bảo trì:</h4>
                                                <p>{roomDetail.maintenanceNote}</p>
                                            </div>
                                        )}

                                        {tenant && (
                                            <div className="tenant-info">
                                                <div className="tenant-header">
                                                    <User size={16} />
                                                    <span>Khách thuê</span>
                                                </div>
                                                <p><strong>Tên:</strong> {tenant.fullName}</p>
                                                <p><strong>SĐT:</strong> {tenant.phone}</p>
                                                {contract && (
                                                    <div className="contract-info">
                                                        <Calendar size={14} />
                                                        <span>Hết hạn: {formatDate(contract.endDate)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Rooms;