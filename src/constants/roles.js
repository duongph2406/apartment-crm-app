// Định nghĩa quyền hạn
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager', 
  USER: 'user',
  TENANT: 'tenant'
};

export const PERMISSIONS = {
  [USER_ROLES.ADMIN]: {
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: true,
    canManageAccounts: true,
    canManageSystem: true
  },
  [USER_ROLES.MANAGER]: {
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false,
    canManageAccounts: true,
    canManageSystem: false
  },
  [USER_ROLES.USER]: {
    canCreate: false,
    canRead: true,
    canUpdate: false,
    canDelete: false,
    canManageAccounts: false,
    canManageSystem: false
  },
  [USER_ROLES.TENANT]: {
    canCreate: false,
    canRead: true, // Chỉ xem thông tin của mình
    canUpdate: false,
    canDelete: false,
    canManageAccounts: false,
    canManageSystem: false
  }
};