import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Room, Booking } from "./types";

const baseQuery = fetchBaseQuery({
  baseUrl: "/api",
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

export const roomsApi = createApi({
  reducerPath: "roomsApi",
  baseQuery,
  tagTypes: ["Room"],
  endpoints: (builder) => ({
    getRooms: builder.query<Room[], void>({
      query: () => "/rooms",
      providesTags: ["Room"],
    }),
    getRoomById: builder.query<Room, string>({
      query: (id) => `/rooms/${id}`,
      providesTags: (result, error, id) => [{ type: "Room", id }],
    }),
    createRoom: builder.mutation<Room, Omit<Room, "id">>({
      query: (room) => ({
        url: "/rooms",
        method: "POST",
        body: room,
      }),
      invalidatesTags: ["Room"],
    }),
    updateRoom: builder.mutation<
      Room,
      { id: string; data: Partial<Omit<Room, "id">> }
    >({
      query: ({ id, data }) => ({
        url: `/rooms/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Room", id },
        "Room",
      ],
    }),
    deleteRoom: builder.mutation<void, string>({
      query: (id) => ({
        url: `/rooms/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Room"],
    }),
  }),
});

export const bookingsApi = createApi({
  reducerPath: "bookingsApi",
  baseQuery,
  tagTypes: ["Booking"],
  endpoints: (builder) => ({
    getBookings: builder.query<Booking[], void>({
      query: () => "/bookings",
      providesTags: ["Booking"],
      transformResponse: (response: Booking[]) => {
        return response.map((booking) => ({
          ...booking,
          startDate: new Date(booking.startDate),
          endDate: new Date(booking.endDate),
        }));
      },
    }),
    getBookingById: builder.query<Booking, string>({
      query: (id) => `/bookings/${id}`,
      providesTags: (result, error, id) => [{ type: "Booking", id }],
      transformResponse: (response: Booking) => ({
        ...response,
        startDate: new Date(response.startDate),
        endDate: new Date(response.endDate),
      }),
    }),
    createBooking: builder.mutation<Booking, Omit<Booking, "id">>({
      query: (booking) => ({
        url: "/bookings",
        method: "POST",
        body: {
          ...booking,
          startDate: booking.startDate.toISOString(),
          endDate: booking.endDate.toISOString(),
        },
      }),
      invalidatesTags: ["Booking"],
      transformResponse: (response: Booking) => ({
        ...response,
        startDate: new Date(response.startDate),
        endDate: new Date(response.endDate),
      }),
    }),
    updateBooking: builder.mutation<
      Booking,
      { id: string; data: Partial<Omit<Booking, "id">> }
    >({
      query: ({ id, data }) => ({
        url: `/bookings/${id}`,
        method: "PUT",
        body: {
          ...data,
          ...(data.startDate && { startDate: data.startDate.toISOString() }),
          ...(data.endDate && { endDate: data.endDate.toISOString() }),
        },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Booking", id },
        "Booking",
      ],
      transformResponse: (response: Booking) => ({
        ...response,
        startDate: new Date(response.startDate),
        endDate: new Date(response.endDate),
      }),
    }),
    deleteBooking: builder.mutation<void, string>({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Booking"],
    }),
  }),
});

export const {
  useGetRoomsQuery,
  useGetRoomByIdQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} = roomsApi;

export const {
  useGetBookingsQuery,
  useGetBookingByIdQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
} = bookingsApi;
