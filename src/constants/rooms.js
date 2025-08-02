// Dữ liệu phòng cố định
export const ROOMS = [
  { id: '102', number: '102', area: 26, price: 4200000, floor: 1, type: 'Studio' },
  { id: '201', number: '201', area: 25, price: 5200000, floor: 2, type: '1PN' },
  { id: '202', number: '202', area: 20, price: 4200000, floor: 2, type: 'Studio' },
  { id: '301', number: '301', area: 25, price: 5200000, floor: 3, type: '1PN' },
  { id: '302', number: '302', area: 20, price: 4200000, floor: 3, type: 'Studio' },
  { id: '401', number: '401', area: 25, price: 5200000, floor: 4, type: '1PN' },
  { id: '402', number: '402', area: 20, price: 4200000, floor: 4, type: 'Studio' },
  { id: '501', number: '501', area: 25, price: 5200000, floor: 5, type: '1PN' },
  { id: '502', number: '502', area: 20, price: 4200000, floor: 5, type: 'Studio' },
  { id: '601', number: '601', area: 25, price: 5200000, floor: 6, type: '1PN' },
  { id: '602', number: '602', area: 20, price: 4400000, floor: 6, type: 'Studio' }
];

export const ROOM_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  DEPOSITED: 'deposited',
  MAINTENANCE: 'maintenance'
};