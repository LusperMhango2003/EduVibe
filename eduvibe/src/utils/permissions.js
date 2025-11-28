export const USER_ROLES = {
  STUDENT: 'STUDENT',
  INSTRUCTOR: 'INSTRUCTOR',
  ADMIN: 'ADMIN',
};

export const ROLE_PERMISSIONS = {
  [USER_ROLES.STUDENT]: {
    viewPublishedContent: true,
    viewRecordings: true,
    downloadMaterials: true,
    enrollCourses: true,
    uploadContent: false,
    editOwnContent: false,
    publishContent: false,
    reviewContent: false,
    approveContent: false,
    manageCategories: false,
    manageUsers: false,
  },
  [USER_ROLES.INSTRUCTOR]: {
    viewPublishedContent: true,
    viewRecordings: true,
    downloadMaterials: true,
    enrollCourses: false,
    uploadContent: true,
    editOwnContent: true,
    publishContent: false,
    reviewContent: false,
    approveContent: false,
    manageCategories: false,
    manageUsers: false,
  },
  [USER_ROLES.ADMIN]: {
    viewPublishedContent: true,
    viewRecordings: true,
    downloadMaterials: true,
    enrollCourses: false,
    uploadContent: true,
    editOwnContent: true,
    publishContent: true,
    reviewContent: true,
    approveContent: true,
    manageCategories: true,
    manageUsers: true,
  },
};

export const hasPermission = (role, action) => {
  if (!role || !ROLE_PERMISSIONS[role]) {
    return false;
  }
  return ROLE_PERMISSIONS[role][action] === true;
};

export const hasRole = (userRole, allowedRoles) => {
  return allowedRoles.includes(userRole);
};

export const isContentCreator = (role) => {
  return hasRole(role, [USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN]);
};

export const isAdmin = (role) => {
  return role === USER_ROLES.ADMIN;
};

export const isStudent = (role) => {
  return role === USER_ROLES.STUDENT;
};

export const getRolePermissions = (role) => {
  return ROLE_PERMISSIONS[role] || {};
};

export const getRoleDisplayName = (role) => {
  const displayNames = {
    [USER_ROLES.STUDENT]: 'Student',
    [USER_ROLES.INSTRUCTOR]: 'Instructor',
    [USER_ROLES.ADMIN]: 'Administrator',
  };
  return displayNames[role] || 'Unknown';
};
