import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Очищаем существующие данные
  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();

  // Создаем номера
  const rooms = await prisma.room.createMany({
    data: [
      {
        name: 'Стандартный с видом на море',
        description: 'Уютный номер с потрясающим видом на Черное море. Идеально подходит для пар, оснащен удобной двуспальной кроватью и современной ванной комнатой.',
        price: 1500,
        capacity: 2,
        amenities: ['Wi-Fi', 'Кондиционер', 'ТВ', 'Мини-бар'],
        imageUrl: 'https://picsum.photos/seed/standard-room/600/400',
        imageHint: 'standard-room',
      },
      {
        name: 'Люкс "Делюкс"',
        description: 'Просторный и элегантный, наш люкс "Делюкс" предлагает собственный балкон, чтобы насладиться морским бризом, роскошную кровать размера "king-size" и ванную комнату с джакузи.',
        price: 2500,
        capacity: 2,
        amenities: ['Wi-Fi', 'Кондиционер', 'ТВ', 'Мини-бар', 'Балкон', 'Джакузи'],
        imageUrl: 'https://picsum.photos/seed/deluxe-room/600/400',
        imageHint: 'deluxe-room',
      },
      {
        name: 'Семейный с видом на сад',
        description: 'Большой номер с кроватью размера "king-size" и двухъярусной кроватью, идеально подходит для семей. С видом на наш прекрасный сад и небольшой кухней для вашего удобства.',
        price: 2200,
        capacity: 4,
        amenities: ['Wi-Fi', 'Кондиционер', 'ТВ', 'Мини-кухня'],
        imageUrl: 'https://picsum.photos/seed/family-room/600/400',
        imageHint: 'family-room',
      },
      {
        name: 'Президентский люкс',
        description: 'Максимальная роскошь с отдельной гостиной, панорамным видом на море с большой частной террасы и эксклюзивными услугами, включая личного дворецкого.',
        price: 5000,
        capacity: 3,
        amenities: ['Wi-Fi', 'Кондиционер', 'Smart TV', 'Полностью оборудованная кухня', 'Частная терраса', 'Личный дворецкий'],
        imageUrl: 'https://picsum.photos/seed/suite-room/600/400',
        imageHint: 'suite-room',
      },
    ],
  });

  console.log(`Создано ${rooms.count} номеров`);

  // Получаем созданные номера для создания бронирований
  const createdRooms = await prisma.room.findMany();

  // Создаем бронирования с актуальными датами (в будущем)
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  
  const twoWeeks = new Date(today);
  twoWeeks.setDate(today.getDate() + 14);
  
  const threeWeeks = new Date(today);
  threeWeeks.setDate(today.getDate() + 21);
  
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);

  const bookings = await prisma.booking.createMany({
    data: [
      {
        roomId: createdRooms[0].id,
        startDate: nextWeek,
        endDate: new Date(nextWeek.getTime() + 5 * 24 * 60 * 60 * 1000), // +5 дней
        name: 'Иван Иванов',
        phone: '+380501234567',
        email: 'ivan@example.com',
      },
      {
        roomId: createdRooms[0].id,
        startDate: twoWeeks,
        endDate: new Date(twoWeeks.getTime() + 2 * 24 * 60 * 60 * 1000), // +2 дня
        name: 'Мария Петрова',
        phone: '+380502345678',
        email: 'maria@example.com',
      },
      {
        roomId: createdRooms[1].id,
        startDate: threeWeeks,
        endDate: new Date(threeWeeks.getTime() + 7 * 24 * 60 * 60 * 1000), // +7 дней
        name: 'Олег Сидоров',
        phone: '+380503456789',
        email: 'oleg@example.com',
      },
      {
        roomId: createdRooms[2].id,
        startDate: nextMonth,
        endDate: new Date(nextMonth.getTime() + 9 * 24 * 60 * 60 * 1000), // +9 дней
        name: 'Анна Коваленко',
        phone: '+380504567890',
        email: 'anna@example.com',
      },
    ],
  });

  console.log(`Создано ${bookings.count} бронирований`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

