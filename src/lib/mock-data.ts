import type { Room, Booking } from "./types";
import { rooms as initialRooms, bookings as initialBookings } from "./data";

let rooms: Room[] = [...initialRooms];
let bookings: Booking[] = [...initialBookings];

export const getRooms = (): Room[] => {
  return rooms;
};

export const getRoomById = (id: string): Room | undefined => {
  return rooms.find((room) => room.id === id);
};

export const createRoom = (room: Omit<Room, "id">): Room => {
  const newRoom: Room = {
    ...room,
    id: room.name.toLowerCase().replace(/\s+/g, "-"),
  };
  rooms.push(newRoom);
  return newRoom;
};

export const updateRoom = (
  id: string,
  room: Partial<Omit<Room, "id">>
): Room | null => {
  const index = rooms.findIndex((r) => r.id === id);
  if (index === -1) return null;
  rooms[index] = { ...rooms[index], ...room };
  return rooms[index];
};

export const deleteRoom = (id: string): boolean => {
  const index = rooms.findIndex((r) => r.id === id);
  if (index === -1) return false;
  rooms.splice(index, 1);
  bookings = bookings.filter((b) => b.roomId !== id);
  return true;
};

export const getBookings = (): Booking[] => {
  return bookings;
};

export const getBookingById = (id: string): Booking | undefined => {
  return bookings.find((booking) => booking.id === id);
};

export const createBooking = (booking: Omit<Booking, "id">): Booking => {
  const newBooking: Booking = {
    ...booking,
    id: `booking${Date.now()}`,
  };
  bookings.push(newBooking);
  return newBooking;
};

export const updateBooking = (
  id: string,
  booking: Partial<Omit<Booking, "id">>
): Booking | null => {
  const index = bookings.findIndex((b) => b.id === id);
  if (index === -1) return null;
  bookings[index] = { ...bookings[index], ...booking };
  return bookings[index];
};

export const deleteBooking = (id: string): boolean => {
  const index = bookings.findIndex((b) => b.id === id);
  if (index === -1) return false;
  bookings.splice(index, 1);
  return true;
};

export const resetData = () => {
  rooms = [...initialRooms];
  bookings = [...initialBookings];
};
