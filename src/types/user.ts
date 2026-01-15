/**
 * User Profile Module Types
 * Defines TypeScript interfaces for user profile-related data structures
 */

/**
 * User role enum
 */
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  TECHNICIAN = 'technician',
  OPERATOR = 'operator',
  VIEWER = 'viewer',
}

/**
 * Individual User profile data structure
 * Maps to MongoDB user document
 */
export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  profileImage?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  role: UserRole;
  department?: string;
  designation?: string;
  employeeId?: string;
  joinDate?: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

/**
 * User preferences and settings
 */
export interface UserPreferences {
  _id?: string;
  userId: string;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  twoFactorEnabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * User activity log
 */
export interface UserActivity {
  _id: string;
  userId: string;
  action: string;
  description: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  status: 'success' | 'failed';
}

/**
 * User security settings
 */
export interface UserSecurity {
  _id?: string;
  userId: string;
  passwordChangedAt?: string;
  lastPasswordChangeAt?: string;
  loginAttempts: number;
  lastFailedLoginAt?: string;
  passwordExpireAt?: string;
  sessionTimeout: number;
  twoFactorEnabled: boolean;
  activeDevices: UserDevice[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Active device information
 */
export interface UserDevice {
  _id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet';
  os: string;
  browser: string;
  ipAddress: string;
  lastAccessedAt: string;
  isCurrentDevice: boolean;
}

/**
 * Get user profile response
 * GET /api/user/profile
 */
export interface GetUserProfileResponse extends UserProfile {
  success: boolean;
  preferences?: UserPreferences;
  message?: string;
}

/**
 * Update user profile request
 * PUT /api/user/profile
 */
export interface UpdateUserProfileRequest {
  name?: string;
  phoneNumber?: string;
  profileImage?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  designation?: string;
}

/**
 * Update user profile response
 * PUT /api/user/profile
 */
export interface UpdateUserProfileResponse {
  success: boolean;
  user: UserProfile;
  message: string;
}

/**
 * Change password request
 * POST /api/user/change-password
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Change password response
 */
export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

/**
 * Get user activity logs response
 * GET /api/user/activity?limit=20&page=1
 */
export interface GetUserActivityResponse {
  success: boolean;
  activities: UserActivity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  message?: string;
}

/**
 * Get user security settings response
 * GET /api/user/security
 */
export interface GetUserSecurityResponse {
  success: boolean;
  security: UserSecurity;
  message?: string;
}

/**
 * Enable two-factor authentication request
 * POST /api/user/two-factor/enable
 */
export interface EnableTwoFactorRequest {
  method: 'email' | 'sms' | 'authenticator';
}

/**
 * Enable two-factor authentication response
 */
export interface EnableTwoFactorResponse {
  success: boolean;
  secret?: string;
  qrCode?: string;
  message: string;
}

/**
 * Verify two-factor authentication request
 * POST /api/user/two-factor/verify
 */
export interface VerifyTwoFactorRequest {
  code: string;
}

/**
 * Get active devices response
 * GET /api/user/devices
 */
export interface GetActiveDevicesResponse {
  success: boolean;
  devices: UserDevice[];
  message?: string;
}

/**
 * Logout from device request
 * POST /api/user/devices/:deviceId/logout
 */
export interface LogoutDeviceResponse {
  success: boolean;
  message: string;
}

/**
 * Update user preferences request
 * PUT /api/user/preferences
 */
export interface UpdateUserPreferencesRequest {
  theme?: 'light' | 'dark' | 'auto';
  language?: string;
  timezone?: string;
  notificationsEnabled?: boolean;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  pushNotifications?: boolean;
}

/**
 * Get user notifications response
 * GET /api/user/notifications?limit=20&page=1
 */
export interface GetNotificationsResponse {
  success: boolean;
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

/**
 * Notification interface
 */
export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  readAt?: string;
  createdAt: string;
}
