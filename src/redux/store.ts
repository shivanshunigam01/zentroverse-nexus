import { configureStore } from '@reduxjs/toolkit';
import { baseApi, publicApi } from './api/baseApi';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import appReducer from './reducer/app.reducer';

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['accessToken', 'user', 'isAuthenticated'],
};

const persistedAuthReducer = persistReducer(authPersistConfig, appReducer);

export const store = configureStore({
  reducer: {
    app: persistedAuthReducer,
    [baseApi.reducerPath]: baseApi.reducer,
    [publicApi.reducerPath]: publicApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware, publicApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
