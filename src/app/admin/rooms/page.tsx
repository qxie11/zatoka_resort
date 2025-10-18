
"use client";

import * as React from "react";
import { rooms as initialRooms } from "@/lib/data";
import type { Room } from "@/lib/types";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import RoomForm from "./components/RoomForm";

export default function RoomsAdminPage() {
  const [rooms, setRooms] = React.useState<Room[]>(initialRooms);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [selectedRoom, setSelectedRoom] = React.useState<Room | null>(null);

  const handleAddNew = () => {
    setSelectedRoom(null);
    setSheetOpen(true);
  };

  const handleEdit = (room: Room) => {
    setSelectedRoom(room);
    setSheetOpen(true);
  };

  const handleDelete = (roomId: string) => {
    // This is a mock delete. In a real app, you'd call an API.
    setRooms(prev => prev.filter(room => room.id !== roomId));
  };

  const handleFormSubmit = (values: Omit<Room, 'id'>, id?: string) => {
    if (id) {
      // Update
      setRooms(prev => prev.map(room => room.id === id ? { ...values, id } : room));
    } else {
      // Create
      const newId = values.name.toLowerCase().replace(/\s+/g, '-');
      const newRoom: Room = { ...values, id: newId };
      setRooms(prev => [...prev, newRoom]);
    }
    setSheetOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Управление номерами</h1>
        <Button onClick={handleAddNew}>
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
