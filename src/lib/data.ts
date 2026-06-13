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
    slug: 'standard-cozy',
    name: 'Уютный стандарт (2-местный)',
    description: 'Комфортный номер для двоих. Оснащен удобной двуспальной кроватью, кондиционером, телевизором и собственным санузлом с душем.',
    price: 800,
    capacity: 2,
    amenities: ['Wi-Fi', 'Кондиционер', 'ТВ', 'Душ'],
    imageUrl: getImage('standard-room').imageUrl,
    imageUrls: [],
    imageHint: getImage('standard-room').imageHint,
  },
  {
    id: 'triple',
    slug: 'triple-room',
    name: 'Улучшенный 3-местный номер',
    description: 'Прекрасный вариант для небольшой семьи. Номер оборудован двуспальной и односпальной кроватями, кондиционером, холодильником и телевизором.',
    price: 1200,
    capacity: 3,
    amenities: ['Wi-Fi', 'Кондиционер', 'ТВ', 'Холодильник', 'Балкон'],
    imageUrl: getImage('deluxe-room').imageUrl,
    imageUrls: [],
    imageHint: getImage('deluxe-room').imageHint,
  },
  {
    id: 'family',
    slug: 'family-with-kitchen',
    name: 'Семейный с мини-кухней (4-местный)',
    description: 'Просторный семейный номер со своей мини-кухней. Включает двуспальную кровать и раскладной диван. Отличный выбор для длительного проживания с детьми.',
    price: 1500,
    capacity: 4,
    amenities: ['Wi-Fi', 'Кондиционер', 'ТВ', 'Мини-кухня', 'Посуда'],
    imageUrl: getImage('family-room').imageUrl,
    imageUrls: [],
    imageHint: getImage('family-room').imageHint,
  },
  {
    id: 'two-room',
    slug: 'two-room-family',
    name: 'Двухкомнатный семейный номер (5-местный)',
    description: 'Максимальный простор для большой семьи или компании. Две раздельные спальные комнаты, современная мебель, кондиционеры в каждой комнате и собственная тенистая терраса.',
    price: 1800,
    capacity: 5,
    amenities: ['Wi-Fi', 'Кондиционер в каждой комнате', 'Smart TV', 'Микроволновая печь', 'Собственная терраса'],
    imageUrl: getImage('suite-room').imageUrl,
    imageUrls: [],
    imageHint: getImage('suite-room').imageHint,
  },
];

export const amenities: Amenity[] = [
  { name: 'Бесплатный Wi-Fi', icon: 'Wifi', description: 'Высокоскоростной доступ в Интернет на всей территории гостевого дома.' },
  { name: 'Кондиционер', icon: 'Waves', description: 'Современный тихий кондиционер в каждой комнате для вашего комфорта.' },
  { name: 'Уютная общая кухня', icon: 'UtensilsCrossed', description: 'Полностью оборудованная кухня со всей необходимой посудой и техникой.' },
  { name: 'Зона барбекю / Мангал', icon: 'Sun', description: 'Просторный тенистый двор с мангалами, решетками, шампурами и беседками.' },
  { name: 'Детская площадка', icon: 'HeartPulse', description: 'Безопасная детская площадка с качелями и песочницей во дворе гостевого дома.' },
  { name: 'Парковка', icon: 'Car', description: 'Безопасные парковочные места для автомобилей наших гостей на закрытой территории.' }
];

export const bookings: Booking[] = [
    { id: 'booking1', roomId: 'standard', startDate: new Date(2024, 7, 10), endDate: new Date(2024, 7, 15), name: 'Иван Иванов', phone: '+380501234567', email: 'ivan@example.com' },
    { id: 'booking2', roomId: 'standard', startDate: new Date(2024, 7, 20), endDate: new Date(2024, 7, 22), name: 'Мария Петрова', phone: '+380502345678', email: 'maria@example.com' },
    { id: 'booking3', roomId: 'deluxe', startDate: new Date(2024, 7, 5), endDate: new Date(2024, 7, 12), name: 'Олег Сидоров', phone: '+380503456789', email: 'oleg@example.com' },
    { id: 'booking4', roomId: 'family', startDate: new Date(2024, 8, 1), endDate: new Date(2024, 8, 10), name: 'Анна Коваленко', phone: '+380504567890', email: 'anna@example.com' },
];
