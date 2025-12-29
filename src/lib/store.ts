import { configureStore } from '@reduxjs/toolkit';
import { roomsApi, bookingsApi } from './api';

export const makeStore = () => {
  return configureStore({
    reducer: {
      [roomsApi.reducerPath]: roomsApi.reducer,
      [bookingsApi.reducerPath]: bookingsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Игнорируем Date объекты в данных бронирований
          ignoredActions: [
            'bookingsApi/executeQuery/fulfilled',
            'bookingsApi/executeMutation/fulfilled',
            'bookingsApi/subscriptions/internal_getRTKQSubscriptions',
          ],
          ignoredActionPaths: ['meta.arg.originalArgs', 'payload'],
          ignoredPaths: [
            'bookingsApi.queries',
            'bookingsApi.mutations',
            /^bookingsApi\.queries\./,
            /^bookingsApi\.mutations\./,
          ],
        },
      })
        .concat(roomsApi.middleware)
        .concat(bookingsApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

