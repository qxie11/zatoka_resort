import { prisma } from './prisma';
import type { Room, Booking } from './types';

// Rooms CRUD
export const getRooms = async (): Promise<Room[]> => {
  const rooms = await prisma.room.findMany({
    orderBy: { createdAt: 'desc' },
  });
  
  return rooms.map(room => ({
    id: room.id,
    name: room.name,
    description: room.description,
    price: room.price,
    capacity: room.capacity,
    amenities: room.amenities,
    imageUrl: room.imageUrl,
    imageHint: room.imageHint,
  }));
};

export const getRoomById = async (id: string): Promise<Room | null> => {
  const room = await prisma.room.findUnique({
    where: { id },
  });
  
  if (!room) return null;
  
  return {
    id: room.id,
    name: room.name,
    description: room.description,
    price: room.price,
    capacity: room.capacity,
    amenities: room.amenities,
    imageUrl: room.imageUrl,
    imageHint: room.imageHint,
  };
};

export const createRoom = async (room: Omit<Room, 'id'>): Promise<Room> => {
  const newRoom = await prisma.room.create({
    data: {
      name: room.name,
      description: room.description,
      price: room.price,
      capacity: room.capacity,
      amenities: room.amenities,
      imageUrl: room.imageUrl,
      imageHint: room.imageHint || '',
    },
  });
  
  return {
    id: newRoom.id,
    name: newRoom.name,
    description: newRoom.description,
    price: newRoom.price,
    capacity: newRoom.capacity,
    amenities: newRoom.amenities,
    imageUrl: newRoom.imageUrl,
    imageHint: newRoom.imageHint,
  };
};

export const updateRoom = async (id: string, room: Partial<Omit<Room, 'id'>>): Promise<Room | null> => {
  try {
    const updatedRoom = await prisma.room.update({
      where: { id },
      data: {
        ...(room.name && { name: room.name }),
        ...(room.description && { description: room.description }),
        ...(room.price !== undefined && { price: room.price }),
        ...(room.capacity !== undefined && { capacity: room.capacity }),
        ...(room.amenities && { amenities: room.amenities }),
        ...(room.imageUrl && { imageUrl: room.imageUrl }),
        ...(room.imageHint !== undefined && { imageHint: room.imageHint }),
      },
    });
    
    return {
      id: updatedRoom.id,
      name: updatedRoom.name,
      description: updatedRoom.description,
      price: updatedRoom.price,
      capacity: updatedRoom.capacity,
      amenities: updatedRoom.amenities,
      imageUrl: updatedRoom.imageUrl,
      imageHint: updatedRoom.imageHint,
    };
  } catch (error) {
    return null;
  }
};

export const deleteRoom = async (id: string): Promise<boolean> => {
  try {
    await prisma.room.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
};

// Bookings CRUD
export const getBookings = async (): Promise<Booking[]> => {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
  });
  
  return bookings.map(booking => ({
    id: booking.id,
    roomId: booking.roomId,
    startDate: booking.startDate,
    endDate: booking.endDate,
    name: booking.name,
    phone: booking.phone,
    email: booking.email,
  }));
};

export const getBookingsByRoomId = async (roomId: string): Promise<Booking[]> => {
  const bookings = await prisma.booking.findMany({
    where: { roomId },
    orderBy: { startDate: 'asc' },
  });
  
  return bookings.map(booking => ({
    id: booking.id,
    roomId: booking.roomId,
    startDate: booking.startDate,
    endDate: booking.endDate,
    name: booking.name,
    phone: booking.phone,
    email: booking.email,
  }));
};

export const getBookingById = async (id: string): Promise<Booking | null> => {
  const booking = await prisma.booking.findUnique({
    where: { id },
  });
  
  if (!booking) return null;
  
  return {
    id: booking.id,
    roomId: booking.roomId,
    startDate: booking.startDate,
    endDate: booking.endDate,
    name: booking.name,
    phone: booking.phone,
    email: booking.email,
  };
};

export const createBooking = async (booking: Omit<Booking, 'id'>): Promise<Booking> => {
  const newBooking = await prisma.booking.create({
    data: {
      roomId: booking.roomId,
      startDate: booking.startDate,
      endDate: booking.endDate,
      name: booking.name,
      phone: booking.phone,
      email: booking.email,
    },
  });
  
  return {
    id: newBooking.id,
    roomId: newBooking.roomId,
    startDate: newBooking.startDate,
    endDate: newBooking.endDate,
    name: newBooking.name,
    phone: newBooking.phone,
    email: newBooking.email,
  };
};

export const updateBooking = async (id: string, booking: Partial<Omit<Booking, 'id'>>): Promise<Booking | null> => {
  try {
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        ...(booking.roomId && { roomId: booking.roomId }),
        ...(booking.startDate && { startDate: booking.startDate }),
        ...(booking.endDate && { endDate: booking.endDate }),
        ...(booking.name && { name: booking.name }),
        ...(booking.phone && { phone: booking.phone }),
        ...(booking.email && { email: booking.email }),
      },
    });
    
    return {
      id: updatedBooking.id,
      roomId: updatedBooking.roomId,
      startDate: updatedBooking.startDate,
      endDate: updatedBooking.endDate,
      name: updatedBooking.name,
      phone: updatedBooking.phone,
      email: updatedBooking.email,
    };
  } catch (error) {
    return null;
  }
};

export const deleteBooking = async (id: string): Promise<boolean> => {
  try {
    await prisma.booking.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
};

