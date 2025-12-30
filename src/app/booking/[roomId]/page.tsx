import { notFound } from 'next/navigation';
import { getRoomById, getBookingsByRoomId } from '@/lib/db';
import RoomBookingForm from './components/RoomBookingForm';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { BedDouble } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PageProps {
  params: Promise<{ roomId: string }>;
}

export default async function RoomBookingPage({ params }: PageProps) {
  const { roomId } = await params;
  const room = await getRoomById(roomId);
  const bookings = await getBookingsByRoomId(roomId);

  if (!room) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <Card className="mb-8 shadow-lg">
              <div className="flex flex-col md:flex-row">
                <div className="relative w-full md:w-1/3 h-64 md:h-auto">
                  <Image
                    src={room.imageUrl}
                    alt={room.name}
                    fill
                    className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                    data-ai-hint={room.imageHint}
                  />
                </div>
                <div className="flex flex-col justify-between w-full md:w-2/3">
                  <CardHeader>
                    <CardTitle className="text-3xl">{room.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                      <BedDouble className="h-4 w-4" />
                      <span>До {room.capacity} гостей</span>
                    </div>
                    <CardDescription className="pt-2 text-base">{room.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {room.amenities.map((amenity) => (
                        <Badge key={amenity} variant="secondary">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">{room.price} грн</p>
                      <p className="text-sm text-muted-foreground">за ночь</p>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>

            <RoomBookingForm room={room} existingBookings={bookings} />
          </div>
        </div>
      </section>
    </div>
  );
}

