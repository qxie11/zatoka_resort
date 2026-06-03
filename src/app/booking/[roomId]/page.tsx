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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <Card className="mb-8 shadow-2xl border border-white/10 bg-slate-900/60 backdrop-blur-sm text-white rounded-3xl">
              <div className="flex flex-col md:flex-row">
                <div className="relative w-full md:w-1/3 h-64 md:h-auto min-h-[250px] overflow-hidden">
                  <Image
                    src={room.imageUrl}
                    alt={room.name}
                    fill
                    className="object-cover rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none"
                    data-ai-hint={room.imageHint}
                  />
                </div>
                <div className="flex flex-col justify-between w-full md:w-2/3">
                  <CardHeader>
                    <CardTitle className="text-3xl font-extrabold text-white">{room.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2 text-teal-300 font-medium text-sm">
                      <BedDouble className="h-4 w-4 text-teal-400" />
                      <span>До {room.capacity} гостей</span>
                    </div>
                    <CardDescription className="pt-2 text-slate-300 font-light leading-relaxed text-base">{room.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {room.amenities.map((amenity) => (
                        <Badge key={amenity} className="bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border-teal-500/20 transition-colors font-medium rounded-lg px-2.5 py-1">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-teal-300 tracking-tight">{room.price} грн <span className="text-sm text-slate-400 font-normal">/ ночь</span></p>
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
