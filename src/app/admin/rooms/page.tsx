"use client";

import * as React from "react";
import type { Room } from "@/lib/types";
import {
  useGetRoomsQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} from "@/lib/api";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import RoomForm from "./components/RoomForm";
import { useToast } from "@/hooks/use-toast";

export default function RoomsAdminPage() {
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [selectedRoom, setSelectedRoom] = React.useState<Room | null>(null);
  const { toast } = useToast();

  // RTK Query hooks
  const { data: rooms = [], isLoading, error } = useGetRoomsQuery();
  const [createRoom, { isLoading: isCreating }] = useCreateRoomMutation();
  const [updateRoom, { isLoading: isUpdating }] = useUpdateRoomMutation();
  const [deleteRoom] = useDeleteRoomMutation();

  const handleAddNew = () => {
    setSelectedRoom(null);
    setSheetOpen(true);
  };

  const handleEdit = (room: Room) => {
    setSelectedRoom(room);
    setSheetOpen(true);
  };

  const handleDelete = async (roomId: string) => {
    try {
      await deleteRoom(roomId).unwrap();
      toast({
        title: "Успешно",
        description: "Номер удален",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось удалить номер",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = async (values: Omit<Room, 'id'>, id?: string) => {
    try {
      if (id) {
        // Update
        await updateRoom({ id, data: values }).unwrap();
        toast({
          title: "Успешно",
          description: "Номер обновлен",
        });
      } else {
        // Create
        await createRoom(values).unwrap();
        toast({
          title: "Успешно",
          description: "Номер создан",
        });
      }
      setSheetOpen(false);
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error?.data?.error || error?.message || "Не удалось сохранить номер",
        variant: "destructive",
      });
    }
  };

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
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Управление номерами</h1>
        <Button onClick={handleAddNew} disabled={isCreating || isUpdating}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Добавить номер
        </Button>
      </div>
      <DataTable 
        columns={columns({ onEdit: handleEdit, onDelete: handleDelete })} 
        data={rooms} 
      />
      <RoomForm
        isOpen={sheetOpen}
        onOpenChange={setSheetOpen}
        onSubmit={handleFormSubmit}
        room={selectedRoom}
      />
    </>
  );
}
