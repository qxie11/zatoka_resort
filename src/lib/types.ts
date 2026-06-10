export type Room = {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  amenities: string[];
  imageUrl: string;
  imageUrls: string[];
  imageHint: string;
};

export type Amenity = {
    name: string;
    icon: string;
    description: string;
}

export type Booking = {
  id: string;
  roomId: string;
  startDate: Date;
  endDate: Date;
  name: string;
  phone: string;
  email?: string;
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
  createdAt?: Date;
  updatedAt?: Date;
};

