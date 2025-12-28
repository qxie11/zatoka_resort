export type Room = {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  amenities: string[];
  imageUrl: string;
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
  email: string;
};
