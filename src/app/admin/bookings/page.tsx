
"use client";

import * as React from "react";
import { bookings as initialBookings, rooms } from "@/lib/data";
import type { Booking, Room } from "@/lib/types";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import BookingForm from "./components/BookingForm";

export default function BookingsAdminPage() {
  const [bookings, setBookings] = React.useState<Booking[]>(initialBookings);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(null);

  const handleAddNew = () => {
    setSelectedBooking(null);
    setSheetOpen(true);
  };

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking);
    setSheetOpen(true);
  };

  const handleDelete = (bookingId: string) => {
    setBookings(prev => prev.filter(booking => booking.id !== bookingId));
  };

  const handleFormSubmit = (values: Omit<Booking, 'id'>, id?: string) => {
    if (id) {
      setBookings(prev => prev.map(booking => booking.id === id ? { ...values, id } : booking));
    } else {
      const newId = `booking${Date.now()}`;
      const newBooking: Booking = { ...values, id: newId };
      setBookings(prev => [...prev, newBooking]);
    }
    setSheetOpen(false);
  };

  const bookingsWithRoomNames = bookings.map(booking => {
    const room = rooms.find(r => r.id === booking.roomId);
    return { ...booking, roomName: room ? room.name : 'Неизвестный номер' };
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Управление бронированиями</h1>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Добавить бронирование
        </Button>
      </div>
      <DataTable 
        columns={columns({ onEdit: handleEdit, onDelete: handleDelete })} 
        data={bookingsWithRoomNames} 
      />
      <BookingForm
        isOpen={sheetOpen}
        onOpenChange={setSheetOpen}
        onSubmit={handleFormSubmit}
        booking={selectedBooking}
        rooms={rooms}
      />
    </>
  );
}
