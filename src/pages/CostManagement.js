import React, { useState, useEffect } from 'react';
import { Settings, Save, DollarSign, Zap, Droplets, Wifi, Users, Edit, Check, X } from 'lucide-react';
import { storage } from '../utils/localStorage';
import { getCurrentUser } from '../utils/auth';

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

  // Simplified rooms data
  const ROOMS = [
    { id: '102', number: '102', area: 26, price: 4200000, floor: 1, type: 'Studio' },
    { id: '201', number: '201', area: 25, price: 5200000, floor: 2, type: '1PN' },
    { id: '202', number: '202', area: 20, price: 4200000, floor: 2, type: 'Studio' },
    { id: '301', number: '301', area: 25, price: 5200000, floor: 3, type: '1PN' },
    { id: '302', number: '302', area: 20, price: 4200000, floor: 3, type: 'Studio' }
  ];

  // Simplified permissions
  const permissions = {
    canUpdate: currentUser?.role === 'admin' || currentUser?.role === 'manager'
  };

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
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Settings size={48} />
        <h3>Không có quyền truy cập</h3>
        <p>Bạn không có quyền quản lý chi phí</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ color: '#2c3e50', marginBottom: '8px' }}>Quản lý chi phí</h1>
        <p style={{ color: '#666' }}>Cài đặt giá dịch vụ và giá phòng</p>
      </div>

      {/* Phần cài đặt giá dịch vụ */}
      <div style={{ background: 'white', borderRadius: '8px', padding: '24px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '24px', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#2c3e50', marginBottom: '8px' }}>
            <Settings size={24} />
            Cài đặt giá dịch vụ
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: '#f39c12', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <Zap size={32} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>Giá điện</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="number"
                  value={utilityPrices.electricityPrice}
                  onChange={(e) => handleUtilityPriceChange('electricityPrice', e.target.value)}
                  style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <span style={{ fontSize: '14px', color: '#666' }}>VNĐ/kWh</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: '#3498db', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <Droplets size={32} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>Giá nước</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="number"
                  value={utilityPrices.waterPrice}
                  onChange={(e) => handleUtilityPriceChange('waterPrice', e.target.value)}
                  style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <span style={{ fontSize: '14px', color: '#666' }}>VNĐ/người</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: '#9b59b6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <Wifi size={32} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>Giá Internet</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="number"
                  value={utilityPrices.internetPrice}
                  onChange={(e) => handleUtilityPriceChange('internetPrice', e.target.value)}
                  style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <span style={{ fontSize: '14px', color: '#666' }}>VNĐ/phòng</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: '#1abc9c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <Users size={32} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>Phí dịch vụ</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="number"
                  value={utilityPrices.servicePrice}
                  onChange={(e) => handleUtilityPriceChange('servicePrice', e.target.value)}
                  style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <span style={{ fontSize: '14px', color: '#666' }}>VNĐ/người</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid #eee' }}>
          <button 
            onClick={saveUtilityPrices}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '10px 20px', 
              background: '#3498db', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer' 
            }}
          >
            <Save size={16} />
            Lưu giá dịch vụ
          </button>
        </div>
      </div>

      {/* Phần bảng chỉnh sửa giá phòng */}
      <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '24px', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#2c3e50', marginBottom: '8px' }}>
            <DollarSign size={24} />
            Bảng giá phòng
          </h2>
          <p style={{ color: '#666', margin: 0 }}>Chỉnh sửa giá thuê và trạng thái Internet cho từng phòng</p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Phòng</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Giá thuê</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Internet</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {ROOMS.map(room => (
                <tr key={room.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>
                    <div>
                      <strong>Phòng {room.number}</strong>
                      <div style={{ fontSize: '12px', color: '#666' }}>{room.type}</div>
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {editingRoom === room.id ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="number"
                          value={tempRoomData.price}
                          onChange={(e) => setTempRoomData({
                            ...tempRoomData,
                            price: e.target.value
                          })}
                          style={{ padding: '6px', border: '1px solid #ddd', borderRadius: '4px', width: '120px' }}
                        />
                        <span style={{ fontSize: '12px', color: '#666' }}>VNĐ</span>
                      </div>
                    ) : (
                      <span style={{ fontWeight: '600', color: '#27ae60' }}>
                        {formatCurrency(roomPrices[room.id]?.price || room.price || 2000000)}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {editingRoom === room.id ? (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={tempRoomData.hasInternet}
                          onChange={(e) => setTempRoomData({
                            ...tempRoomData,
                            hasInternet: e.target.checked
                          })}
                        />
                        Internet
                      </label>
                    ) : (
                      <div>
                        {roomPrices[room.id]?.hasInternet ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#27ae60' }}>
                            <Wifi size={16} />
                            Có Internet
                          </span>
                        ) : (
                          <span style={{ color: '#e74c3c' }}>
                            Không có Internet
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {editingRoom === room.id ? (
                        <>
                          <button 
                            onClick={() => handleSaveRoom(room.id)}
                            style={{ 
                              padding: '6px 12px', 
                              background: '#27ae60', 
                              color: 'white', 
                              border: 'none', 
                              borderRadius: '4px', 
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <Check size={16} />
                          </button>
                          <button 
                            onClick={handleCancelEdit}
                            style={{ 
                              padding: '6px 12px', 
                              background: '#95a5a6', 
                              color: 'white', 
                              border: 'none', 
                              borderRadius: '4px', 
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => handleEditRoom(room.id)}
                          style={{ 
                            padding: '6px 12px', 
                            background: '#3498db', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px', 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                          }}
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