export type RoomUnit = {
  id: string;
  name: string;
  roomId: string;
};

export type Room = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  amenities: string[];
  imageUrl: string;
  imageUrls: string[];
  imageHint: string;
  units?: RoomUnit[];
};

export type Amenity = {
    name: string;
    icon: string;
    description: string;
}

export type Booking = {
  id: string;
  roomId: string;
  unitId?: string;
  unitName?: string;
  startDate: Date;
  endDate: Date;
  name: string;
  phone: string;
  email?: string;
  pricePaid?: number;
  promoCode?: string;
  discountApplied?: number;
  adminComment?: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  date: string;
  imageUrl: string;
  readTime: number;
  categoryRu: string;
  categoryUk: string;
  categoryEn: string;
  titleRu: string;
  titleUk: string;
  titleEn: string;
  excerptRu: string;
  excerptUk: string;
  excerptEn: string;
  contentRu: string[];
  contentUk: string[];
  contentEn: string[];
  views: number;
  likes: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Review = {
  id: string;
  roomId: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
};

