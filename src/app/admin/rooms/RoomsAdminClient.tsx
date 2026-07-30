"use client";

import * as React from "react";
import type { Room } from "@/lib/types";
import {
  useGetRoomsQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
  useReorderRoomsMutation,
} from "@/lib/api";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import RoomForm from "./components/RoomForm";
import { useToast } from "@/hooks/use-toast";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import ImageGallery from "@/components/rooms/ImageGallery";

interface RoomsAdminClientProps {
  initialData: Room[];
}

export default function RoomsAdminClient({ initialData }: RoomsAdminClientProps) {
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [selectedRoom, setSelectedRoom] = React.useState<Room | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [roomIdToDelete, setRoomIdToDelete] = React.useState<string | null>(null);
  const [deletingIds, setDeletingIds] = React.useState<string[]>([]);
  const [galleryState, setGalleryState] = React.useState<{ isOpen: boolean; images: string[]; title: string }>({
    isOpen: false,
    images: [],
    title: "",
  });
  const { toast } = useToast();

  // RTK Query hooks with initial data
  const { data: rooms = initialData, isLoading, error } = useGetRoomsQuery();
  const [createRoom, { isLoading: isCreating }] = useCreateRoomMutation();
  const [updateRoom, { isLoading: isUpdating }] = useUpdateRoomMutation();
  const [deleteRoom] = useDeleteRoomMutation();
  const [reorderRooms] = useReorderRoomsMutation();

  const handleReorder = async (items: Room[]) => {
    try {
      const orderData = items.map((item, index) => ({ id: item.id, order: index }));
      await reorderRooms(orderData).unwrap();
      toast({
        title: "Успешно",
        description: "Порядок номеров сохранен",
      });
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error?.data?.error || error?.message || "Не удалось сохранить порядок номеров",
        variant: "destructive",
      });
    }
  };

  const handleAddNew = () => {
    setSelectedRoom(null);
    setSheetOpen(true);
  };

  const handleEdit = (room: Room) => {
    setSelectedRoom(room);
    setSheetOpen(true);
  };

  const handleDelete = (roomId: string) => {
    setRoomIdToDelete(roomId);
    setDeleteConfirmOpen(true);
  };

  const handleOpenGallery = (images: string[], title: string) => {
    setGalleryState({ isOpen: true, images, title });
  };

  const handleDeleteConfirm = async () => {
    if (!roomIdToDelete) return;
    const roomId = roomIdToDelete;
    const rowEl = document.getElementById(`row-${roomId}`);
    
    const performDelete = async () => {
      setDeletingIds((prev) => [...prev, roomId]);
      try {
        await deleteRoom(roomId).unwrap();
        toast({
          title: "Успешно",
          description: "Номер удален",
        });
      } catch (error) {
        setDeletingIds((prev) => prev.filter((id) => id !== roomId));
        toast({
          title: "Ошибка",
          description: error instanceof Error ? error.message : "Не удалось удалить номер",
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
        await Promise.all(ids.map((id) => deleteRoom(id).unwrap()));
        toast({
          title: "Успешно",
          description: "Выбранные номера удалены",
        });
      } catch (error) {
        setDeletingIds((prev) => prev.filter((id) => !ids.includes(id)));
        toast({
          title: "Ошибка",
          description: error instanceof Error ? error.message : "Не удалось удалить некоторые номера",
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

  const visibleRooms = React.useMemo(() => {
    return rooms.filter((room) => !deletingIds.includes(room.id));
  }, [rooms, deletingIds]);

  if (isLoading && rooms.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-300">Загрузка...</p>
      </div>
    );
  }

  if (error && rooms.length === 0) {
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
      <div className="flex items-center justify-between text-white mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Управление номерами</h1>
        <Button onClick={handleAddNew} disabled={isCreating || isUpdating} className="bg-gradient-to-r from-teal-400 to-sky-500 hover:from-teal-300 hover:to-sky-400 text-slate-950 font-bold border-0 shadow-lg shadow-teal-500/20 rounded-xl px-5 h-11">
          <PlusCircle className="mr-2 h-4 w-4" />
          Добавить номер
        </Button>
      </div>
      <DataTable 
        columns={columns({ onEdit: handleEdit, onDelete: handleDelete, onOpenGallery: handleOpenGallery })} 
        data={visibleRooms} 
        onDeleteSelected={handleBulkDelete}
        onReorder={handleReorder}
      />
      <RoomForm
        isOpen={sheetOpen}
        onOpenChange={setSheetOpen}
        onSubmit={handleFormSubmit}
        room={selectedRoom}
      />
      <DeleteConfirmDialog
        isOpen={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleDeleteConfirm}
        title="Удалить номер?"
        description="Вы уверены, что хотите удалить этот номер? Все связанные данные будут потеряны."
      />
      <ImageGallery
        images={galleryState.images}
        isOpen={galleryState.isOpen}
        onClose={() => setGalleryState((prev) => ({ ...prev, isOpen: false }))}
        roomName={galleryState.title || "Галерея номера"}
      />
    </>
  );
}
