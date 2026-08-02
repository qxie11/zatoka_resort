import { prisma } from './prisma';
import type { Room, Booking, BlogPost, Review } from './types';

// Rooms CRUD
export const getRooms = async (): Promise<Room[]> => {
  const rooms = await prisma.room.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    include: {
      units: {
        orderBy: { order: 'asc' }
      }
    },
  });
  
  return rooms.map(room => ({
    id: room.id,
    slug: room.slug,
    name: room.name,
    description: room.description,
    price: room.price,
    capacity: room.capacity,
    amenities: room.amenities,
    imageUrl: room.imageUrl,
    imageUrls: room.imageUrls || [],
    imageHint: room.imageHint,
    order: room.order,
    units: room.units,
  }));
};

export const getRoomById = async (id: string): Promise<Room | null> => {
  const room = await prisma.room.findUnique({
    where: { id },
    include: {
      units: {
        orderBy: { order: 'asc' }
      }
    }
  });
  
  if (!room) return null;
  
  return {
    id: room.id,
    slug: room.slug,
    name: room.name,
    description: room.description,
    price: room.price,
    capacity: room.capacity,
    amenities: room.amenities,
    imageUrl: room.imageUrl,
    imageUrls: room.imageUrls || [],
    imageHint: room.imageHint,
    order: room.order,
    units: room.units,
  };
};

export const getRoomBySlugOrId = async (slugOrId: string): Promise<Room | null> => {
  let room = await prisma.room.findUnique({
    where: { slug: slugOrId },
    include: {
      units: {
        orderBy: { order: 'asc' }
      }
    },
  });
  
  if (!room) {
    room = await prisma.room.findUnique({
      where: { id: slugOrId },
      include: {
        units: {
          orderBy: { order: 'asc' }
        }
      },
    });
  }
  
  if (!room) return null;
  
  return {
    id: room.id,
    slug: room.slug,
    name: room.name,
    description: room.description,
    price: room.price,
    capacity: room.capacity,
    amenities: room.amenities,
    imageUrl: room.imageUrl,
    imageUrls: room.imageUrls || [],
    imageHint: room.imageHint,
    order: room.order,
    units: room.units,
  };
};

export const createRoom = async (room: Omit<Room, 'id' | 'slug'> & { slug?: string }): Promise<Room> => {
  const newRoom = await prisma.room.create({
    data: {
      name: room.name,
      slug: room.slug || room.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      description: room.description,
      price: room.price,
      capacity: room.capacity,
      amenities: room.amenities,
      imageUrl: room.imageUrl,
      imageUrls: room.imageUrls || [],
      imageHint: room.imageHint || '',
      units: {
        create: room.units?.map(u => ({ name: u.name })) || []
      }
    },
    include: { units: true },
  });
  
  return {
    id: newRoom.id,
    slug: newRoom.slug,
    name: newRoom.name,
    description: newRoom.description,
    price: newRoom.price,
    capacity: newRoom.capacity,
    amenities: newRoom.amenities,
    imageUrl: newRoom.imageUrl,
    imageUrls: newRoom.imageUrls || [],
    imageHint: newRoom.imageHint,
    order: newRoom.order,
    units: newRoom.units,
  };
};

export const updateRoom = async (id: string, room: Partial<Omit<Room, 'id' | 'slug'> & { slug?: string }>): Promise<Room | null> => {
  try {
    const updateData: any = {};
    
    if (room.slug !== undefined) updateData.slug = room.slug;
    if (room.name !== undefined) updateData.name = room.name;
    if (room.description !== undefined) updateData.description = room.description;
    if (room.price !== undefined) updateData.price = room.price;
    if (room.capacity !== undefined) updateData.capacity = room.capacity;
    if (room.amenities !== undefined) updateData.amenities = room.amenities;
    if (room.imageUrl !== undefined) updateData.imageUrl = room.imageUrl;
    if (room.imageUrls !== undefined) updateData.imageUrls = room.imageUrls;
    if (room.imageHint !== undefined) updateData.imageHint = room.imageHint;

    if (room.units !== undefined) {
      const unitsWithOrder = room.units.map((u, index) => ({ ...u, order: index }));
      const unitsToUpdate = unitsWithOrder.filter(u => u.id && !u.id.startsWith('new-'));
      const unitsToCreate = unitsWithOrder.filter(u => !u.id || u.id.startsWith('new-'));

      updateData.units = {
        deleteMany: {
          id: { notIn: unitsToUpdate.map(u => u.id!) }
        },
        update: unitsToUpdate.map(u => ({
          where: { id: u.id! },
          data: { name: u.name, order: u.order }
        })),
        create: unitsToCreate.map(u => ({ name: u.name, order: u.order }))
      };
    }

    if (Object.keys(updateData).length === 0) {
      const existingRoom = await prisma.room.findUnique({ where: { id }, include: { units: true } });
      if (!existingRoom) return null;
      
      return {
        id: existingRoom.id,
        slug: existingRoom.slug,
        name: existingRoom.name,
        description: existingRoom.description,
        price: existingRoom.price,
        capacity: existingRoom.capacity,
        amenities: existingRoom.amenities,
        imageUrl: existingRoom.imageUrl,
        imageUrls: existingRoom.imageUrls || [],
        imageHint: existingRoom.imageHint,
        order: existingRoom.order,
        units: existingRoom.units,
      };
    }

    const updatedRoom = await prisma.room.update({
      where: { id },
      data: updateData,
      include: { units: true },
    });
    
    return {
      id: updatedRoom.id,
      slug: updatedRoom.slug,
      name: updatedRoom.name,
      description: updatedRoom.description,
      price: updatedRoom.price,
      capacity: updatedRoom.capacity,
      amenities: updatedRoom.amenities,
      imageUrl: updatedRoom.imageUrl,
      imageUrls: updatedRoom.imageUrls || [],
      imageHint: updatedRoom.imageHint,
      order: updatedRoom.order,
      units: updatedRoom.units,
    };
  } catch (error: any) {
    console.error('Error updating room:', error);
    if (error?.code === 'P2025') {
      return null;
    }
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
    include: { unit: true },
  });
  
  return bookings.map((booking: any) => ({
    id: booking.id,
    roomId: booking.roomId,
    unitId: booking.unitId || undefined,
    unitName: booking.unit?.name || undefined,
    startDate: booking.startDate,
    endDate: booking.endDate,
    name: booking.name,
    phone: booking.phone,
    email: booking.email || undefined,
    pricePaid: booking.pricePaid || undefined,
    promoCode: booking.promoCode || undefined,
    discountApplied: booking.discountApplied || undefined,
    adminComment: booking.adminComment || undefined,
    status: booking.status || "CONFIRMED",
    createdAt: booking.createdAt,
  }));
};

export const getBookingsByRoomId = async (roomId: string): Promise<Booking[]> => {
  const bookings = await prisma.booking.findMany({
    where: { roomId },
    orderBy: { startDate: 'asc' },
    include: { unit: true },
  });
  
  return bookings.map((booking: any) => ({
    id: booking.id,
    roomId: booking.roomId,
    unitId: booking.unitId || undefined,
    unitName: booking.unit?.name || undefined,
    startDate: booking.startDate,
    endDate: booking.endDate,
    name: booking.name,
    phone: booking.phone,
    email: booking.email || undefined,
    pricePaid: booking.pricePaid || undefined,
    promoCode: booking.promoCode || undefined,
    discountApplied: booking.discountApplied || undefined,
    adminComment: booking.adminComment || undefined,
    createdAt: booking.createdAt,
  }));
};

export const getBookingById = async (id: string): Promise<Booking | null> => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { unit: true },
  });
  
  if (!booking) return null;
  
  return {
    id: booking.id,
    roomId: booking.roomId,
    unitId: booking.unitId || undefined,
    unitName: (booking as any).unit?.name || undefined,
    startDate: booking.startDate,
    endDate: booking.endDate,
    name: booking.name,
    phone: booking.phone,
    email: booking.email || undefined,
    pricePaid: booking.pricePaid || undefined,
    promoCode: booking.promoCode || undefined,
    discountApplied: booking.discountApplied || undefined,
    adminComment: (booking as any).adminComment || undefined,
    createdAt: booking.createdAt,
  };
};

const saveCustomerEmail = async (email: string, name: string, phone: string) => {
  try {
    await prisma.customerEmail.upsert({
      where: { email },
      update: { name, phone },
      create: { email, name, phone },
    });
  } catch (err) {
    console.error("Failed to save customer email:", err);
  }
};

export const createBooking = async (booking: Omit<Booking, 'id'>): Promise<Booking> => {
  const newBooking = await prisma.booking.create({
    data: {
      roomId: booking.roomId,
      unitId: booking.unitId || null,
      startDate: booking.startDate,
      endDate: booking.endDate,
      name: booking.name,
      phone: booking.phone,
      email: booking.email ?? null,
      pricePaid: booking.pricePaid ?? null,
      promoCode: booking.promoCode ?? null,
      discountApplied: booking.discountApplied ?? null,
      adminComment: booking.adminComment ?? null,
    },
    include: { unit: true },
  });

  if (newBooking.email) {
    await saveCustomerEmail(newBooking.email, newBooking.name, newBooking.phone);
  }
  
  return {
    id: newBooking.id,
    roomId: newBooking.roomId,
    unitId: newBooking.unitId || undefined,
    unitName: (newBooking as any).unit?.name || undefined,
    startDate: newBooking.startDate,
    endDate: newBooking.endDate,
    name: newBooking.name,
    phone: newBooking.phone,
    email: newBooking.email ?? undefined,
    pricePaid: newBooking.pricePaid ?? undefined,
    promoCode: newBooking.promoCode ?? undefined,
    discountApplied: newBooking.discountApplied ?? undefined,
    adminComment: (newBooking as any).adminComment ?? undefined,
    createdAt: newBooking.createdAt,
  };
};

export const updateBooking = async (id: string, booking: Partial<Omit<Booking, 'id'>>): Promise<Booking | null> => {
  try {
    const updateData: any = {};
    
    if (booking.roomId !== undefined) {
      updateData.room = {
        connect: { id: booking.roomId },
      };
    }
    if (booking.unitId !== undefined) {
      if (booking.unitId) {
        updateData.unit = {
          connect: { id: booking.unitId },
        };
      } else {
        updateData.unit = {
          disconnect: true,
        };
      }
    }
    if (booking.startDate !== undefined) updateData.startDate = booking.startDate;
    if (booking.endDate !== undefined) updateData.endDate = booking.endDate;
    if (booking.name !== undefined) updateData.name = booking.name;
    if (booking.phone !== undefined) updateData.phone = booking.phone;
    if (booking.email !== undefined) updateData.email = booking.email || null;
    if (booking.pricePaid !== undefined) updateData.pricePaid = booking.pricePaid;
    if (booking.promoCode !== undefined) updateData.promoCode = booking.promoCode;
    if (booking.discountApplied !== undefined) updateData.discountApplied = booking.discountApplied;
    if ((booking as any).adminComment !== undefined) updateData.adminComment = (booking as any).adminComment || null;
    if (booking.status !== undefined) updateData.status = booking.status;
    
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: { unit: true },
    });

    if (updatedBooking.email) {
      await saveCustomerEmail(updatedBooking.email, updatedBooking.name, updatedBooking.phone);
    }
    
    return {
      id: updatedBooking.id,
      roomId: updatedBooking.roomId,
      unitId: updatedBooking.unitId || undefined,
      unitName: (updatedBooking as any).unit?.name || undefined,
      startDate: updatedBooking.startDate,
      endDate: updatedBooking.endDate,
      name: updatedBooking.name,
      phone: updatedBooking.phone,
      email: updatedBooking.email ?? undefined,
      pricePaid: updatedBooking.pricePaid ?? undefined,
      promoCode: updatedBooking.promoCode ?? undefined,
      discountApplied: updatedBooking.discountApplied ?? undefined,
      adminComment: (updatedBooking as any).adminComment ?? undefined,
      status: (updatedBooking as any).status || "PENDING",
      createdAt: updatedBooking.createdAt,
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

// Blog Posts CRUD
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return posts;
};

export const getBlogPostById = async (id: string): Promise<BlogPost | null> => {
  const post = await prisma.blogPost.findUnique({
    where: { id },
  });
  return post;
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });
  return post;
};

export const createBlogPost = async (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> => {
  const newPost = await prisma.blogPost.create({
    data: post,
  });
  return newPost;
};

export const updateBlogPost = async (id: string, post: Partial<Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>>): Promise<BlogPost | null> => {
  try {
    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: post,
    });
    return updatedPost;
  } catch (error) {
    return null;
  }
};

export const incrementBlogPostView = async (id: string): Promise<BlogPost | null> => {
  try {
    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    return updatedPost;
  } catch (error) {
    console.error("incrementBlogPostView error:", error);
    return null;
  }
};

export const incrementBlogPostLike = async (id: string, increment: boolean = true): Promise<BlogPost | null> => {
  try {
    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: {
        likes: {
          increment: increment ? 1 : -1,
        },
      },
    });
    return updatedPost;
  } catch (error) {
    console.error("incrementBlogPostLike error:", error);
    return null;
  }
};

export const deleteBlogPost = async (id: string): Promise<boolean> => {
  try {
    await prisma.blogPost.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
};

// Reviews CRUD
export const getReviews = async (): Promise<Review[]> => {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return reviews;
};

export const getReviewsByRoomId = async (roomId: string): Promise<Review[]> => {
  const reviews = await prisma.review.findMany({
    where: { roomId },
    orderBy: { createdAt: 'desc' },
  });
  return reviews;
};

export const createReview = async (review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<Review> => {
  const newReview = await prisma.review.create({
    data: review,
  });
  return newReview;
};

export const updateReview = async (id: string, review: Partial<Omit<Review, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Review | null> => {
  try {
    const updatedReview = await prisma.review.update({
      where: { id },
      data: review,
    });
    return updatedReview;
  } catch (error) {
    return null;
  }
};

export const deleteReview = async (id: string): Promise<boolean> => {
  try {
    await prisma.review.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
};

