import { configureStore } from '@reduxjs/toolkit';
import { roomsApi, bookingsApi } from './api';

export const makeStore = () => {
  return configureStore({
    reducer: {
      [roomsApi.reducerPath]: roomsApi.reducer,
      [bookingsApi.reducerPath]: bookingsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(roomsApi.middleware)
        .concat(bookingsApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

