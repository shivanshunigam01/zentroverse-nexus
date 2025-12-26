import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { baseApi } from "../api/baseApi";

export interface AuthState {
  accessToken: string | null;
  refreshToken?: string | null;
  user: any | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<Partial<AuthState>>) => {
      const { accessToken, refreshToken, user } = action.payload;
      if (accessToken !== undefined) state.accessToken = accessToken ?? null;
      if (refreshToken !== undefined) state.refreshToken = refreshToken ?? null;
      if (user !== undefined) state.user = user ?? null;
      state.isAuthenticated = !!state.accessToken;
    },
    resetAuth: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, resetAuth } = authSlice.actions;

export default authSlice.reducer;
