import { configureStore } from "@reduxjs/toolkit";
import { roomsApi, bookingsApi } from "./api";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [roomsApi.reducerPath]: roomsApi.reducer,
      [bookingsApi.reducerPath]: bookingsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            "bookingsApi/executeQuery/fulfilled",
            "bookingsApi/executeMutation/fulfilled",
            "bookingsApi/subscriptions/internal_getRTKQSubscriptions",
            "roomsApi/executeQuery/fulfilled",
            "roomsApi/executeMutation/fulfilled",
          ],
          ignoredActionPaths: [
            "meta.arg.originalArgs",
            "payload",
            "meta.baseQueryMeta.request",
            "meta.baseQueryMeta.response",
            /^meta\.baseQueryMeta/,
          ],
          ignoredPaths: [
            "bookingsApi.queries",
            "bookingsApi.mutations",
            /^bookingsApi\.queries\./,
            /^bookingsApi\.mutations\./,
            "roomsApi.queries",
            "roomsApi.mutations",
            /^roomsApi\.queries\./,
            /^roomsApi\.mutations\./,
          ],
        },
      })
        .concat(roomsApi.middleware)
        .concat(bookingsApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
