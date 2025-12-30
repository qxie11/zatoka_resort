"use client";

import * as React from "react";
import {
  useGetBookingsQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
  useGetRoomsQuery,
} from "@/lib/api";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import BookingForm from "./components/BookingForm";
import { useToast } from "@/hooks/use-toast";
import type { Booking } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BookingsAdminPage() {
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(null);
  const [selectedRoomId, setSelectedRoomId] = React.useState<string | null>(null);
  const { toast } = useToast();

  // RTK Query hooks
  const { data: bookings = [], isLoading: isLoadingBookings, error: bookingsError } = useGetBookingsQuery();
  const { data: rooms = [], isLoading: isLoadingRooms, error: roomsError } = useGetRoomsQuery();
  const [createBooking, { isLoading: isCreating }] = useCreateBookingMutation();
  const [updateBooking, { isLoading: isUpdating }] = useUpdateBookingMutation();
  const [deleteBooking] = useDeleteBookingMutation();

  const isLoading = isLoadingBookings || isLoadingRooms;
  const error = bookingsError || roomsError;

  const handleAddNew = () => {
    setSelectedBooking(null);
    setSheetOpen(true);
  };

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking);
    setSheetOpen(true);
  };

  const handleDelete = async (bookingId: string) => {
    try {
      await deleteBooking(bookingId).unwrap();
      toast({
        title: "Успешно",
        description: "Бронирование удалено",
      });
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error?.data?.error || error?.message || "Не удалось удалить бронирование",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = async (values: Omit<Booking, 'id'>, id?: string) => {
    try {
      if (id) {
        await updateBooking({ id, data: values }).unwrap();
        toast({
          title: "Успешно",
          description: "Бронирование обновлено",
        });
      } else {
        await createBooking(values).unwrap();
        toast({
          title: "Успешно",
          description: "Бронирование создано",
        });
      }
      setSheetOpen(false);
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error?.data?.error || error?.message || "Не удалось сохранить бронирование",
        variant: "destructive",
      });
    }
  };

  const filteredBookings = selectedRoomId 
    ? bookings.filter(booking => booking.roomId === selectedRoomId)
    : bookings;

  const bookingsWithRoomNames = filteredBookings.map(booking => {
    const room = rooms.find(r => r.id === booking.roomId);
    return { ...booking, roomName: room ? room.name : 'Неизвестный номер' };
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>Загрузка...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-destructive">
          Ошибка загрузки данных: {error instanceof Error ? error.message : 'Неизвестная ошибка'}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Управление бронированиями</h1>
        <Button onClick={handleAddNew} disabled={isCreating || isUpdating} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Добавить бронирование
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Фильтр по номеру</CardTitle>
        </CardHeader>
        <CardContent>
          <Select 
            onValueChange={(value) => setSelectedRoomId(value === "all" ? null : value)}
            value={selectedRoomId || "all"}
          >
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Выберите номер" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все номера</SelectItem>
              {rooms.map((room) => (
                <SelectItem key={room.id} value={room.id}>
                  {room.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="w-full overflow-x-auto">
        <DataTable 
          columns={columns({ onEdit: handleEdit, onDelete: handleDelete })} 
          data={bookingsWithRoomNames} 
        />
      </div>
      
      <BookingForm
        isOpen={sheetOpen}
        onOpenChange={setSheetOpen}
        onSubmit={handleFormSubmit}
        booking={selectedBooking}
        rooms={rooms}
      />
    </div>
  );
}
