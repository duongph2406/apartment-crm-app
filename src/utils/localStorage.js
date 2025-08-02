// Utility function để format ngày tháng
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

// Enhanced storage with error handling and performance optimizations
const STORAGE_KEYS = {
  USERS: 'crm_users',
  CURRENT_USER: 'crm_current_user',
  TENANTS: 'crm_tenants',
  CONTRACTS: 'crm_contracts',
  INVOICES: 'crm_invoices',
  ROOM_ASSIGNMENTS: 'crm_room_assignments',
  ROOM_DETAILS: 'crm_room_details',
  INCIDENTS: 'crm_incidents',
  FEEDBACKS: 'crm_feedbacks',
  UTILITY_PRICES: 'crm_utility_prices',
  ROOM_PRICES: 'crm_room_prices'
};

// Storage utilities
const safeJSONParse = (data, fallback = null) => {
  try {
    return data ? JSON.parse(data) : fallback;
  } catch (error) {
    console.error('JSON Parse Error:', error);
    return fallback;
  }
};

const safeJSONStringify = (data) => {
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.error('JSON Stringify Error:', error);
    return null;
  }
};

const safeLocalStorageGet = (key, fallback = null) => {
  try {
    const item = localStorage.getItem(key);
    return safeJSONParse(item, fallback);
  } catch (error) {
    console.error('LocalStorage Get Error:', error);
    return fallback;
  }
};

const safeLocalStorageSet = (key, value) => {
  try {
    const stringified = safeJSONStringify(value);
    if (stringified !== null) {
      localStorage.setItem(key, stringified);
      return true;
    }
  } catch (error) {
    console.error('LocalStorage Set Error:', error);
  }
  return false;
};

export const storage = {
  // Users
  getUsers: () => safeLocalStorageGet(STORAGE_KEYS.USERS, []),
  setUsers: (users) => safeLocalStorageSet(STORAGE_KEYS.USERS, users),

  // Current user
  getCurrentUser: () => safeLocalStorageGet(STORAGE_KEYS.CURRENT_USER),
  setCurrentUser: (user) => safeLocalStorageSet(STORAGE_KEYS.CURRENT_USER, user),
  removeCurrentUser: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } catch (error) {
      console.error('Remove current user error:', error);
    }
  },

  // Tenants
  getTenants: () => {
    const tenants = localStorage.getItem('crm_tenants');
    return tenants ? JSON.parse(tenants) : [];
  },

  setTenants: (tenants) => {
    localStorage.setItem('crm_tenants', JSON.stringify(tenants));
  },

  // Contracts
  getContracts: () => {
    const contracts = localStorage.getItem('crm_contracts');
    return contracts ? JSON.parse(contracts) : [];
  },

  setContracts: (contracts) => {
    localStorage.setItem('crm_contracts', JSON.stringify(contracts));
  },

  // Invoices
  getInvoices: () => {
    const invoices = localStorage.getItem('crm_invoices');
    return invoices ? JSON.parse(invoices) : [];
  },

  setInvoices: (invoices) => {
    localStorage.setItem('crm_invoices', JSON.stringify(invoices));
  },

  // Room assignments
  getRoomAssignments: () => {
    const assignments = localStorage.getItem('crm_room_assignments');
    return assignments ? JSON.parse(assignments) : {};
  },

  setRoomAssignments: (assignments) => {
    localStorage.setItem('crm_room_assignments', JSON.stringify(assignments));
  },

  // Room status and details
  getRoomDetails: () => {
    const details = localStorage.getItem('crm_room_details');
    return details ? JSON.parse(details) : {};
  },

  setRoomDetails: (details) => {
    localStorage.setItem('crm_room_details', JSON.stringify(details));
  },

  // Monthly electricity data
  getMonthlyElectricityData: (monthYear) => {
    const data = localStorage.getItem(`crm_electricity_${monthYear}`);
    return data ? JSON.parse(data) : null;
  },

  setMonthlyElectricityData: (monthYear, data) => {
    localStorage.setItem(`crm_electricity_${monthYear}`, JSON.stringify(data));
  },

  // Utility prices
  getUtilityPrices: () => {
    const prices = localStorage.getItem('crm_utility_prices');
    return prices ? JSON.parse(prices) : {
      electricityPrice: 3500,
      waterPrice: 25000,
      servicePrice: 30000,
      internetPrice: 50000
    };
  },

  setUtilityPrices: (prices) => {
    localStorage.setItem('crm_utility_prices', JSON.stringify(prices));
  },

  // Room prices
  getRoomPrices: () => {
    const prices = localStorage.getItem('crm_room_prices');
    return prices ? JSON.parse(prices) : {};
  },

  setRoomPrices: (prices) => {
    localStorage.setItem('crm_room_prices', JSON.stringify(prices));
  },

  // Incidents
  getIncidents: () => {
    const incidents = localStorage.getItem('crm_incidents');
    return incidents ? JSON.parse(incidents) : [];
  },

  setIncidents: (incidents) => {
    localStorage.setItem('crm_incidents', JSON.stringify(incidents));
  },

  // Feedbacks
  getFeedbacks: () => {
    const feedbacks = localStorage.getItem('crm_feedbacks');
    return feedbacks ? JSON.parse(feedbacks) : [];
  },

  setFeedbacks: (feedbacks) => {
    localStorage.setItem('crm_feedbacks', JSON.stringify(feedbacks));
  },

  // Rooms
  getRooms: () => {
    const rooms = localStorage.getItem('crm_rooms');
    return rooms ? JSON.parse(rooms) : [];
  },

  setRooms: (rooms) => {
    localStorage.setItem('crm_rooms', JSON.stringify(rooms));
  }
};