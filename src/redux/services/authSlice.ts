import { baseApi, publicApi } from "../api/baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<any[], void>({
      query: () => "/users",
      providesTags: ["User"],
    }),

    getUserById: builder.query<any, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _err, id) => [{ type: "User", id }],
    }),

    createUser: builder.mutation<any, Partial<any>>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    logout: builder.mutation<any, { refreshToken: string; }>({
      query: (credentials) => ({
        url: "/auth/logout",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const authApi = publicApi.injectEndpoints({
  endpoints: (builder) => ({
    // adjust path/body shape to your backend
    login: builder.mutation<
      { accessToken: string; user: any },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: { accessToken: string; user: any }) => {
        return response;
      },
    }),
    signup: builder.mutation<any, Partial<any>>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useSignupMutation } = authApi;

export const { useGetUsersQuery, useGetUserByIdQuery, useCreateUserMutation, useLogoutMutation } =
  userApi;
