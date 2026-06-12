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
import type { Booking, Room } from "@/lib/types";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BookingsAdminClientProps {
  initialBookings: Booking[];
  initialRooms: Room[];
}

export default function BookingsAdminClient({
  initialBookings,
  initialRooms,
}: BookingsAdminClientProps) {
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(null);
  const [selectedRoomId, setSelectedRoomId] = React.useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [bookingIdToDelete, setBookingIdToDelete] = React.useState<string | null>(null);
  const [deletingIds, setDeletingIds] = React.useState<string[]>([]);
  const { toast } = useToast();

  // RTK Query hooks with initial data
  const { data: bookings = initialBookings, isLoading: isLoadingBookings, error: bookingsError } = useGetBookingsQuery();
  const { data: rooms = initialRooms, isLoading: isLoadingRooms, error: roomsError } = useGetRoomsQuery();
  const [createBooking, { isLoading: isCreating }] = useCreateBookingMutation();
  const [updateBooking, { isLoading: isUpdating }] = useUpdateBookingMutation();
  const [deleteBooking] = useDeleteBookingMutation();

  const isLoading = (isLoadingBookings && bookings.length === 0) || (isLoadingRooms && rooms.length === 0);
  const error = (bookingsError && bookings.length === 0) || (roomsError && rooms.length === 0);

  const handleAddNew = () => {
    setSelectedBooking(null);
    setSheetOpen(true);
  };

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking);
    setSheetOpen(true);
  };

  const handleDelete = (bookingId: string) => {
    setBookingIdToDelete(bookingId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!bookingIdToDelete) return;
    const bookingId = bookingIdToDelete;
    const rowEl = document.getElementById(`row-${bookingId}`);
    
    const performDelete = async () => {
      setDeletingIds((prev) => [...prev, bookingId]);
      try {
        await deleteBooking(bookingId).unwrap();
        toast({
          title: "Успешно",
          description: "Бронирование удалено",
        });
      } catch (error: any) {
        setDeletingIds((prev) => prev.filter((id) => id !== bookingId));
        toast({
          title: "Ошибка",
          description: error?.data?.error || error?.message || "Не удалось удалить бронирование",
          variant: "destructive",
        });
      }
    };

    if (rowEl) {
      const { thanosSnap } = await import("@/lib/thanos");
      thanosSnap(rowEl, performDelete);
    } else {
      performDelete();
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    const performDelete = async () => {
      setDeletingIds((prev) => [...prev, ...ids]);
      try {
        await Promise.all(ids.map((id) => deleteBooking(id).unwrap()));
        toast({
          title: "Успешно",
          description: "Выбранные бронирования удалены",
        });
      } catch (error: any) {
        setDeletingIds((prev) => prev.filter((id) => !ids.includes(id)));
        toast({
          title: "Ошибка",
          description: error?.data?.error || error?.message || "Не удалось удалить некоторые бронирования",
          variant: "destructive",
        });
      }
    };

    const rowEls = ids.map((id) => document.getElementById(`row-${id}`)).filter(Boolean) as HTMLElement[];
    if (rowEls.length > 0) {
      const { thanosSnap } = await import("@/lib/thanos");
      let snappedCount = 0;
      rowEls.forEach((el) => {
        thanosSnap(el, () => {
          snappedCount++;
          if (snappedCount === rowEls.length) {
            performDelete();
          }
        });
      });
    } else {
      performDelete();
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

  const filteredBookings = React.useMemo(() => {
    const active = bookings.filter((b) => !deletingIds.includes(b.id));
    return selectedRoomId 
      ? active.filter(booking => booking.roomId === selectedRoomId)
      : active;
  }, [bookings, deletingIds, selectedRoomId]);

  const bookingsWithRoomNames = filteredBookings.map(booking => {
    const room = rooms.find(r => r.id === booking.roomId);
    return { ...booking, roomName: room ? room.name : 'Неизвестный номер' };
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-300">Загрузка...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-destructive">
          Ошибка загрузки данных: {error && typeof error === 'object' && 'message' in error ? (error as any).message : 'Неизвестная ошибка'}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-hidden text-white bg-slate-950">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Управление бронированиями</h1>
        <Button onClick={handleAddNew} disabled={isCreating || isUpdating} className="w-full sm:w-auto bg-gradient-to-r from-teal-400 to-sky-500 hover:from-teal-300 hover:to-sky-400 text-slate-950 font-bold border-0 shadow-lg shadow-teal-500/20 rounded-xl px-5 h-11">
          <PlusCircle className="mr-2 h-4 w-4" />
          Добавить бронирование
        </Button>
      </div>
      
      <Card className="mb-6 glass-card-dark border border-white/10 bg-slate-900/60 text-white rounded-3xl overflow-hidden shadow-2xl">
        <CardHeader className="border-b border-white/5 bg-slate-950/20 p-5">
          <CardTitle className="text-lg font-extrabold text-white">Фильтр по номеру</CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <Select 
            onValueChange={(value) => setSelectedRoomId(value === "all" ? null : value)}
            value={selectedRoomId || "all"}
          >
            <SelectTrigger className="w-full md:w-[300px] bg-slate-950/40 border-white/10 text-white rounded-xl focus:ring-teal-400/50 shadow-sm h-11">
              <SelectValue placeholder="Выберите номер" />
            </SelectTrigger>
            <SelectContent className="bg-slate-950 border-white/10 text-white rounded-xl shadow-2xl">
              <SelectItem value="all" className="focus:bg-white/10 focus:text-teal-300 rounded-lg cursor-pointer">Все номера</SelectItem>
              {rooms.map((room) => (
                <SelectItem key={room.id} value={room.id} className="focus:bg-white/10 focus:text-teal-300 rounded-lg cursor-pointer">
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
          onDeleteSelected={handleBulkDelete}
        />
      </div>
      
      <BookingForm
        isOpen={sheetOpen}
        onOpenChange={setSheetOpen}
        onSubmit={handleFormSubmit}
        booking={selectedBooking}
        rooms={rooms}
      />
      <DeleteConfirmDialog
        isOpen={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleDeleteConfirm}
        title="Удалить бронирование?"
        description="Вы уверены, что хотите удалить это бронирование? Это действие нельзя отменить."
      />
    </div>
  );
}
