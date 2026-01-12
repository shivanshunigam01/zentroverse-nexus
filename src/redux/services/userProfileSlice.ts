import { baseApi } from "../api/baseApi";
import {
  GetUserProfileResponse,
  UpdateUserProfileRequest,
  UpdateUserProfileResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  GetUserActivityResponse,
  GetUserSecurityResponse,
  EnableTwoFactorRequest,
  EnableTwoFactorResponse,
  VerifyTwoFactorRequest,
  GetActiveDevicesResponse,
  LogoutDeviceResponse,
  UpdateUserPreferencesRequest,
  GetNotificationsResponse,
} from "@/types/user";

/**
 * User Profile Service
 * Handles all user profile-related API calls
 */
export const userProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * GET /api/auth/profile
     * Fetch current user profile
     */
    getUserProfile: builder.query<GetUserProfileResponse, void>({
      query: () => ({
        url: "/auth/profile",
        method: "GET",
      }),
      providesTags: [{ type: "User", id: "PROFILE" }],
    }),

    /**
     * PUT /api/auth/profile
     * Update user profile information
     */
    updateUserProfile: builder.mutation<
      UpdateUserProfileResponse,
      UpdateUserProfileRequest
    >({
      query: (body) => ({
        url: "/auth/profile",
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "User", id: "PROFILE" }],
    }),

    /**
     * POST /api/auth/change-password
     * Change user password
     */
    changePassword: builder.mutation<
      ChangePasswordResponse,
      ChangePasswordRequest
    >({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        body,
      }),
    }),

    /**
     * POST /api/user/upload-avatar
     * Upload user profile avatar/image
     */
    uploadAvatar: builder.mutation<UpdateUserProfileResponse, FormData>({
      query: (formData) => ({
        url: "/user/upload-avatar",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "User", id: "PROFILE" }],
    }),

    /**
     * GET /api/user/activity
     * Get user activity logs with pagination
     */
    getUserActivity: builder.query<
      GetUserActivityResponse,
      { limit?: number; page?: number }
    >({
      query: ({ limit = 20, page = 1 } = {}) => ({
        url: `/user/activity?limit=${limit}&page=${page}`,
        method: "GET",
      }),
      providesTags: [{ type: "User", id: "ACTIVITY" }],
    }),

    /**
     * GET /api/user/security
     * Get user security settings
     */
    getUserSecurity: builder.query<GetUserSecurityResponse, void>({
      query: () => ({
        url: "/user/security",
        method: "GET",
      }),
      providesTags: [{ type: "User", id: "SECURITY" }],
    }),

    /**
     * POST /api/user/two-factor/enable
     * Enable two-factor authentication
     */
    enableTwoFactor: builder.mutation<
      EnableTwoFactorResponse,
      EnableTwoFactorRequest
    >({
      query: (body) => ({
        url: "/user/two-factor/enable",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "User", id: "SECURITY" }],
    }),

    /**
     * POST /api/user/two-factor/verify
     * Verify two-factor authentication code
     */
    verifyTwoFactor: builder.mutation<
      EnableTwoFactorResponse,
      VerifyTwoFactorRequest
    >({
      query: (body) => ({
        url: "/user/two-factor/verify",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "User", id: "SECURITY" }],
    }),

    /**
     * POST /api/user/two-factor/disable
     * Disable two-factor authentication
     */
    disableTwoFactor: builder.mutation<EnableTwoFactorResponse, void>({
      query: () => ({
        url: "/user/two-factor/disable",
        method: "POST",
      }),
      invalidatesTags: [{ type: "User", id: "SECURITY" }],
    }),

    /**
     * GET /api/user/devices
     * Get list of active devices/sessions
     */
    getActiveDevices: builder.query<GetActiveDevicesResponse, void>({
      query: () => ({
        url: "/user/devices",
        method: "GET",
      }),
      providesTags: [{ type: "User", id: "DEVICES" }],
    }),

    /**
     * POST /api/user/devices/:deviceId/logout
     * Logout from specific device
     */
    logoutFromDevice: builder.mutation<LogoutDeviceResponse, { deviceId: string }>({
      query: ({ deviceId }) => ({
        url: `/user/devices/${deviceId}/logout`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "User", id: "DEVICES" }],
    }),

    /**
     * POST /api/user/devices/logout-all
     * Logout from all devices
     */
    logoutFromAllDevices: builder.mutation<LogoutDeviceResponse, void>({
      query: () => ({
        url: "/user/devices/logout-all",
        method: "POST",
      }),
      invalidatesTags: [{ type: "User", id: "DEVICES" }],
    }),

    /**
     * PUT /api/user/preferences
     * Update user preferences and settings
     */
    updateUserPreferences: builder.mutation<
      UpdateUserProfileResponse,
      UpdateUserPreferencesRequest
    >({
      query: (body) => ({
        url: "/user/preferences",
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "User", id: "PROFILE" }],
    }),

    /**
     * GET /api/user/notifications
     * Get user notifications with pagination
     */
    getNotifications: builder.query<
      GetNotificationsResponse,
      { limit?: number; page?: number }
    >({
      query: ({ limit = 20, page = 1 } = {}) => ({
        url: `/user/notifications?limit=${limit}&page=${page}`,
        method: "GET",
      }),
      providesTags: [{ type: "User", id: "NOTIFICATIONS" }],
    }),

    /**
     * POST /api/user/notifications/:id/read
     * Mark notification as read
     */
    markNotificationAsRead: builder.mutation<
      EnableTwoFactorResponse,
      { notificationId: string }
    >({
      query: ({ notificationId }) => ({
        url: `/user/notifications/${notificationId}/read`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "User", id: "NOTIFICATIONS" }],
    }),

    /**
     * POST /api/user/notifications/read-all
     * Mark all notifications as read
     */
    markAllNotificationsAsRead: builder.mutation<EnableTwoFactorResponse, void>({
      query: () => ({
        url: "/user/notifications/read-all",
        method: "POST",
      }),
      invalidatesTags: [{ type: "User", id: "NOTIFICATIONS" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useChangePasswordMutation,
  useUploadAvatarMutation,
  useGetUserActivityQuery,
  useGetUserSecurityQuery,
  useEnableTwoFactorMutation,
  useVerifyTwoFactorMutation,
  useDisableTwoFactorMutation,
  useGetActiveDevicesQuery,
  useLogoutFromDeviceMutation,
  useLogoutFromAllDevicesMutation,
  useUpdateUserPreferencesMutation,
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} = userProfileApi;
