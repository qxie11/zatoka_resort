import type { Room, Amenity, Booking } from '@/lib/types';
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
    name: 'Стандартный с видом на море',
    description: 'Уютный номер с потрясающим видом на Черное море. Идеально подходит для пар, оснащен удобной двуспальной кроватью и современной ванной комнатой.',
    price: 1500,
    capacity: 2,
    amenities: ['Wi-Fi', 'Кондиционер', 'ТВ', 'Мини-бар'],
    imageUrl: getImage('standard-room').imageUrl,
    imageUrls: [],
    imageHint: getImage('standard-room').imageHint,
  },
  {
    id: 'deluxe',
    name: 'Люкс "Делюкс"',
    description: 'Просторный и элегантный, наш люкс "Делюкс" предлагает собственный балкон, чтобы насладиться морским бризом, роскошную кровать размера "king-size" и ванную комнату с джакузи.',
    price: 2500,
    capacity: 2,
    amenities: ['Wi-Fi', 'Кондиционер', 'ТВ', 'Мини-бар', 'Балкон', 'Джакузи'],
    imageUrl: getImage('deluxe-room').imageUrl,
    imageUrls: [],
    imageHint: getImage('deluxe-room').imageHint,
  },
  {
    id: 'family',
    name: 'Семейный с видом на сад',
    description: 'Большой номер с кроватью размера "king-size" и двухъярусной кроватью, идеально подходит для семей. С видом на наш прекрасный сад и небольшой кухней для вашего удобства.',
    price: 2200,
    capacity: 4,
    amenities: ['Wi-Fi', 'Кондиционер', 'ТВ', 'Мини-кухня'],
    imageUrl: getImage('family-room').imageUrl,
    imageUrls: [],
    imageHint: getImage('family-room').imageHint,
  },
  {
    id: 'suite',
    name: 'Президентский люкс',
    description: 'Максимальная роскошь с отдельной гостиной, панорамным видом на море с большой частной террасы и эксклюзивными услугами, включая личного дворецкого.',
    price: 5000,
    capacity: 3,
    amenities: ['Wi-Fi', 'Кондиционер', 'Smart TV', 'Полностью оборудованная кухня', 'Частная терраса', 'Личный дворецкий'],
    imageUrl: getImage('suite-room').imageUrl,
    imageUrls: [],
    imageHint: getImage('suite-room').imageHint,
  },
];

export const amenities: Amenity[] = [
  { name: 'Бассейн', icon: 'Waves', description: 'Большой открытый бассейн с зоной для загара.' },
  { name: 'Бесплатный Wi-Fi', icon: 'Wifi', description: 'Высокоскоростной доступ в Интернет на всей территории отеля.' },
  { name: 'Ресторан', icon: 'UtensilsCrossed', description: 'Ресторан на территории отеля, предлагающий блюда местной и международной кухни.' },
  { name: 'Частный пляж', icon: 'Sun', description: 'Прямой доступ к чистому и частному пляжу.' },
  { name: 'Спа и оздоровление', icon: 'HeartPulse', description: 'Расслабьтесь и омолодитесь в нашем современном спа-центре.' },
  { name: 'Парковка', icon: 'Car', description: 'Безопасная парковка для всех наших гостей.' },
  { name: 'Обслуживание номеров', icon: 'ConciergeBell', description: 'Круглосуточное обслуживание номеров для вашего удобства.'},
  { name: 'Фитнес-центр', icon: 'Dumbbell', description: 'Поддерживайте форму в нашем полностью оборудованном тренажерном зале.'}
];

export const bookings: Booking[] = [
    { id: 'booking1', roomId: 'standard', startDate: new Date(2024, 7, 10), endDate: new Date(2024, 7, 15), name: 'Иван Иванов', phone: '+380501234567', email: 'ivan@example.com' },
    { id: 'booking2', roomId: 'standard', startDate: new Date(2024, 7, 20), endDate: new Date(2024, 7, 22), name: 'Мария Петрова', phone: '+380502345678', email: 'maria@example.com' },
    { id: 'booking3', roomId: 'deluxe', startDate: new Date(2024, 7, 5), endDate: new Date(2024, 7, 12), name: 'Олег Сидоров', phone: '+380503456789', email: 'oleg@example.com' },
    { id: 'booking4', roomId: 'family', startDate: new Date(2024, 8, 1), endDate: new Date(2024, 8, 10), name: 'Анна Коваленко', phone: '+380504567890', email: 'anna@example.com' },
];
