import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
      state.accessToken = accessToken ?? null;
      state.refreshToken = refreshToken ?? null;
      state.user = user ?? null;
      state.isAuthenticated = !!state.accessToken;
    },
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
      state.isAuthenticated = !!state.accessToken;
    },
    setRefreshAccessToken: (state, action: PayloadAction<string | null>) => {
      state.refreshToken = action.payload;
    },
    resetAuth: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, resetAuth, setAccessToken, setRefreshAccessToken } = authSlice.actions;

export default authSlice.reducer;
