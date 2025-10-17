import type { Room, Amenity } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const getImage = (id: string) => {
    const image = PlaceHolderImages.find(img => img.id === id);
    if (!image) {
        // Fallback to a default image if not found
        return { imageUrl: 'https://picsum.photos/seed/default/600/400', imageHint: 'placeholder' };
    }
    return image;
}

export const rooms: Room[] = [
  {
    id: 'standard',
    name: 'Standard Sea View',
    description: 'A cozy room with a stunning view of the Black Sea. Perfect for couples, it features a comfortable queen-sized bed and a modern bathroom.',
    price: 1500,
    capacity: 2,
    amenities: ['Wi-Fi', 'Air Conditioning', 'TV', 'Mini-bar'],
    imageUrl: getImage('standard-room').imageUrl,
    imageHint: getImage('standard-room').imageHint,
  },
  {
    id: 'deluxe',
    name: 'Deluxe Suite',
    description: 'Spacious and elegant, our deluxe suite offers a private balcony to enjoy the sea breeze, a plush king-sized bed, and a luxurious bathroom with a jacuzzi.',
    price: 2500,
    capacity: 2,
    amenities: ['Wi-Fi', 'Air Conditioning', 'TV', 'Mini-bar', 'Balcony', 'Jacuzzi'],
    imageUrl: getImage('deluxe-room').imageUrl,
    imageHint: getImage('deluxe-room').imageHint,
  },
  {
    id: 'family',
    name: 'Family Garden View',
    description: 'A large room with a king bed and a bunk bed, ideal for families. Overlooks our beautiful garden and includes a small kitchenette for your convenience.',
    price: 2200,
    capacity: 4,
    amenities: ['Wi-Fi', 'Air Conditioning', 'TV', 'Kitchenette'],
    imageUrl: getImage('family-room').imageUrl,
    imageHint: getImage('family-room').imageHint,
  },
  {
    id: 'suite',
    name: 'Presidential Suite',
    description: 'The ultimate luxury experience with a separate living room, panoramic sea views from a large private terrace, and exclusive services including a personal butler.',
    price: 5000,
    capacity: 3,
    amenities: ['Wi-Fi', 'Air Conditioning', 'Smart TV', 'Full Kitchen', 'Private Terrace', 'Personal Butler'],
    imageUrl: getImage('suite-room').imageUrl,
    imageHint: getImage('suite-room').imageHint,
  },
];

export const amenities: Amenity[] = [
  { name: 'Swimming Pool', icon: 'Waves', description: 'Large outdoor swimming pool with a sunbathing area.' },
  { name: 'Free Wi-Fi', icon: 'Wifi', description: 'High-speed internet access throughout the hotel.' },
  { name: 'Restaurant', icon: 'UtensilsCrossed', description: 'On-site restaurant serving local and international cuisine.' },
  { name: 'Private Beach', icon: 'Sun', description: 'Direct access to a clean and private beach area.' },
  { name: 'Spa & Wellness', icon: 'HeartPulse', description: 'Relax and rejuvenate at our modern spa center.' },
  { name: 'Parking', icon: 'Car', description: 'Secure parking available for all our guests.' },
  { name: 'Room Service', icon: 'ConciergeBell', description: '24/7 room service for your convenience.'},
  { name: 'Fitness Center', icon: 'Dumbbell', description: 'Stay fit in our fully-equipped gym.'}
];
