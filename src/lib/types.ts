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
