import React, { useState, useEffect } from 'react';
import { Settings, Save, DollarSign, Zap, Droplets, Wifi, Users, Edit, Check, X } from 'lucide-react';
import { storage } from '../utils/localStorage';
import { getCurrentUser } from '../utils/auth';
import { PERMISSIONS } from '../constants/roles';
import { ROOMS } from '../constants/rooms';
import './CostManagement.css';

const CostManagement = () => {
  const [utilityPrices, setUtilityPrices] = useState({
    electricityPrice: '3500',
    waterPrice: '25000',
    internetPrice: '50000',
    servicePrice: '30000'
  });

  const [roomPrices, setRoomPrices] = useState({});
  const [editingRoom, setEditingRoom] = useState(null);
  const [tempRoomData, setTempRoomData] = useState({});

  const currentUser = getCurrentUser();
  const permissions = PERMISSIONS[currentUser?.role] || {};

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load utility prices
    const savedUtilityPrices = storage.getUtilityPrices();
    if (savedUtilityPrices) {
      setUtilityPrices(savedUtilityPrices);
    }

    // Load room prices and internet status
    const savedRoomPrices = storage.getRoomPrices();
    if (savedRoomPrices) {
      setRoomPrices(savedRoomPrices);
    } else {
      // Initialize with default room prices
      const initialRoomPrices = {};
      ROOMS.forEach(room => {
        initialRoomPrices[room.id] = {
          price: room.price || '2000000',
          hasInternet: true
        };
      });
      setRoomPrices(initialRoomPrices);
      storage.setRoomPrices(initialRoomPrices);
    }
  };

  const handleUtilityPriceChange = (field, value) => {
    setUtilityPrices(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveUtilityPrices = () => {
    storage.setUtilityPrices(utilityPrices);
    alert('Đã lưu giá dịch vụ thành công!');
  };

  const handleEditRoom = (roomId) => {
    setEditingRoom(roomId);
    setTempRoomData({
      price: roomPrices[roomId]?.price || '2000000',
      hasInternet: roomPrices[roomId]?.hasInternet || false
    });
  };

  const handleSaveRoom = (roomId) => {
    const updatedRoomPrices = {
      ...roomPrices,
      [roomId]: {
        price: tempRoomData.price,
        hasInternet: tempRoomData.hasInternet
      }
    };
    
    setRoomPrices(updatedRoomPrices);
    storage.setRoomPrices(updatedRoomPrices);
    setEditingRoom(null);
    setTempRoomData({});
  };

  const handleCancelEdit = () => {
    setEditingRoom(null);
    setTempRoomData({});
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (!permissions.canUpdate) {
    return (
      <div className="cost-management-page">
        <div className="access-denied">
          <Settings size={48} />
          <h3>Không có quyền truy cập</h3>
          <p>Bạn không có quyền quản lý chi phí</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cost-management-page">
      <div className="page-header">
        <h1>Quản lý chi phí</h1>
        <p>Cài đặt giá dịch vụ và giá phòng</p>
      </div>

      {/* Phần cài đặt giá dịch vụ */}
      <div className="cost-section">
        <div className="section-header">
          <h2>
            <Settings size={24} />
            Cài đặt giá dịch vụ
          </h2>
        </div>

        <div className="utility-prices-grid">
          <div className="utility-price-card">
            <div className="utility-icon electricity">
              <Zap size={36} />
            </div>
            <div className="utility-info">
              <h3>Giá điện</h3>
              <div className="price-input">
                <input
                  type="number"
                  value={utilityPrices.electricityPrice}
                  onChange={(e) => handleUtilityPriceChange('electricityPrice', e.target.value)}
                />
                <span className="unit">VNĐ/kWh</span>
              </div>
            </div>
          </div>

          <div className="utility-price-card">
            <div className="utility-icon water">
              <Droplets size={36} />
            </div>
            <div className="utility-info">
              <h3>Giá nước</h3>
              <div className="price-input">
                <input
                  type="number"
                  value={utilityPrices.waterPrice}
                  onChange={(e) => handleUtilityPriceChange('waterPrice', e.target.value)}
                />
                <span className="unit">VNĐ/người</span>
              </div>
            </div>
          </div>

          <div className="utility-price-card">
            <div className="utility-icon internet">
              <Wifi size={36} />
            </div>
            <div className="utility-info">
              <h3>Giá Internet</h3>
              <div className="price-input">
                <input
                  type="number"
                  value={utilityPrices.internetPrice}
                  onChange={(e) => handleUtilityPriceChange('internetPrice', e.target.value)}
                />
                <span className="unit">VNĐ/phòng</span>
              </div>
            </div>
          </div>

          <div className="utility-price-card">
            <div className="utility-icon service">
              <Users size={36} />
            </div>
            <div className="utility-info">
              <h3>Phí dịch vụ</h3>
              <div className="price-input">
                <input
                  type="number"
                  value={utilityPrices.servicePrice}
                  onChange={(e) => handleUtilityPriceChange('servicePrice', e.target.value)}
                />
                <span className="unit">VNĐ/người</span>
              </div>
            </div>
          </div>
        </div>

        <div className="section-actions">
          <button className="btn btn-primary" onClick={saveUtilityPrices}>
            <Save size={20} />
            Lưu giá dịch vụ
          </button>
        </div>
      </div>

      {/* Phần bảng chỉnh sửa giá phòng */}
      <div className="cost-section">
        <div className="section-header">
          <h2>
            <DollarSign size={24} />
            Bảng giá phòng
          </h2>
          <p>Chỉnh sửa giá thuê và trạng thái Internet cho từng phòng</p>
        </div>

        <div className="rooms-price-table">
          <table>
            <thead>
              <tr>
                <th>Phòng</th>
                <th>Giá thuê</th>
                <th>Internet</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {ROOMS.map(room => (
                <tr key={room.id}>
                  <td>
                    <div className="room-info">
                      <strong>Phòng {room.number}</strong>
                      <span className="room-type">{room.type}</span>
                    </div>
                  </td>
                  <td>
                    {editingRoom === room.id ? (
                      <div className="edit-price-input">
                        <input
                          type="number"
                          value={tempRoomData.price}
                          onChange={(e) => setTempRoomData({
                            ...tempRoomData,
                            price: e.target.value
                          })}
                        />
                        <span className="unit">VNĐ</span>
                      </div>
                    ) : (
                      <span className="price-display">
                        {formatCurrency(roomPrices[room.id]?.price || room.price || 2000000)}
                      </span>
                    )}
                  </td>
                  <td>
                    {editingRoom === room.id ? (
                      <label className="internet-checkbox">
                        <input
                          type="checkbox"
                          checked={tempRoomData.hasInternet}
                          onChange={(e) => setTempRoomData({
                            ...tempRoomData,
                            hasInternet: e.target.checked
                          })}
                        />
                        <span className="checkmark"></span>
                        Internet
                      </label>
                    ) : (
                      <div className="internet-status">
                        {roomPrices[room.id]?.hasInternet ? (
                          <span className="internet-enabled">
                            <Wifi size={16} />
                            Có Internet
                          </span>
                        ) : (
                          <span className="internet-disabled">
                            Không có Internet
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      {editingRoom === room.id ? (
                        <>
                          <button 
                            className="btn btn-sm btn-success"
                            onClick={() => handleSaveRoom(room.id)}
                          >
                            <Check size={16} />
                          </button>
                          <button 
                            className="btn btn-sm btn-secondary"
                            onClick={handleCancelEdit}
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => handleEditRoom(room.id)}
                        >
                          <Edit size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CostManagement;