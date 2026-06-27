import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Wiping existing database (Bookings, Units, Rooms)...');
  await prisma.booking.deleteMany();
  await prisma.roomUnit.deleteMany();
  await prisma.room.deleteMany();

  console.log('Creating single room...');
  await prisma.room.create({
    data: {
      name: 'Одноместный',
      slug: 'single',
      description: 'Уютный одноместный номер со всем необходимым для комфортного отдыха.',
      price: 600,
      capacity: 1,
      amenities: ['Wi-Fi', 'Кондиционер', 'ТВ', 'Душ'],
      imageUrl: 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=2000&auto=format&fit=crop',
      units: {
        create: [
          { name: '1а' },
          { name: '2б' },
          { name: '3с' }
        ]
      }
    }
  });

  console.log('Creating cottage...');
  await prisma.room.create({
    data: {
      name: 'Домик',
      slug: 'cottage',
      description: 'Отдельный домик для всей семьи со своей террасой и мини-кухней.',
      price: 1500,
      capacity: 4,
      amenities: ['Wi-Fi', 'Кондиционер', 'ТВ', 'Душ', 'Мини-кухня', 'Терраса'],
      imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2000&auto=format&fit=crop',
      units: {
        create: [
          { name: 'Домик 1' },
          { name: 'Домик 2' }
        ]
      }
    }
  });

  console.log('Creating promenade...');
  await prisma.room.create({
    data: {
      name: 'Променад',
      slug: 'promenade',
      description: 'Эксклюзивный номер с лучшим видом и повышенным комфортом.',
      price: 2500,
      capacity: 2,
      amenities: ['Wi-Fi', 'Кондиционер', 'Smart ТВ', 'Душ', 'Вид на море', 'Халаты'],
      imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2000&auto=format&fit=crop',
      units: {
        create: [
          { name: 'Променад' }
        ]
      }
    }
  });

  console.log('Done!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
