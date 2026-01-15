import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { resetAuth, setAccessToken, setRefreshAccessToken } from '../reducer/app.reducer';

// base fetch query which injects auth header when available
const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any)?.app?.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// wrapper that will clear persisted auth and dispatch a reset on 401 responses
const baseQueryUpdated = async (args: any, api: any, extraOptions: any) => {
  console.log(api.getState()?.app?.refreshToken)
  const result = await rawBaseQuery(args, api, extraOptions);
  console.log(result,result?.error?.data?.code);
  if (result?.error?.data?.code === 'TOKEN_EXPIRED') {
    console.log(api.getState()?.app?.refreshToken);
    const refreshToken = api.getState()?.app?.refreshToken; // Ensure your state includes refreshToken
    if (refreshToken) {
      // Call the refresh token endpoint
      const refreshResult = await rawBaseQuery(
        {
          url: '/auth/refresh-token',
          method: 'POST',
          body: { refreshToken: refreshToken },
        },
        api,
        extraOptions
      );
      console.log({refreshResult})
      if (refreshResult?.accessToken) {
        // Update the token in the Redux store
        api.dispatch(setAccessToken(refreshResult.accessToken));
        // api.dispatch(setRefreshAccessToken(refreshResult.refreshToken));

        // Retry the original request with the new token
       const updatedResult = await rawBaseQuery(args, api, extraOptions);
       return updatedResult;
      } else {
        // Logout if the refresh token fails
        api.dispatch(resetAuth());
      }
    } else {
      // Logout if no refresh token is available
      api.dispatch(resetAuth());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryUpdated,
  tagTypes: ['User', 'Post', 'Estimate','JobCard','stock', 'counterSales','inwards','stockalert','stocktransfer','customer','vendor'],
  endpoints: () => ({}),
});

export const publicApi = createApi({
  reducerPath: 'publicApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000'
  }),
  tagTypes: [],
  endpoints: () => ({}),
});

