
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Image as ImageIcon, Maximize2, MoreHorizontal, ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Room } from "@/lib/types"

type ColumnsProps = {
  onEdit: (room: Room) => void;
  onDelete: (roomId: string) => void;
  onOpenGallery?: (images: string[], title: string) => void;
};

export const columns = ({ onEdit, onDelete, onOpenGallery }: ColumnsProps): ColumnDef<Room>[] => [
  {
    id: "image",
    header: "Фото",
    cell: ({ row }) => {
      const room = row.original;
      const allImages = [room.imageUrl, ...(room.imageUrls || [])].filter(Boolean) as string[];
      if (allImages.length === 0) {
        return (
          <div className="w-12 h-9 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-slate-600">
            <ImageIcon className="h-4 w-4" />
          </div>
        );
      }

      return (
        <div 
          className="relative w-12 h-9 rounded-lg overflow-hidden cursor-pointer group border border-white/10 bg-slate-900 shadow-sm"
          onClick={() => onOpenGallery?.(allImages, room.name)}
          title="Открыть фото на весь экран"
        >
          <img src={allImages[0]} alt={room.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Maximize2 className="h-3.5 w-3.5 text-white" />
          </div>
          {allImages.length > 1 && (
            <span className="absolute bottom-0.5 right-0.5 bg-black/70 text-white text-[9px] font-bold px-1 rounded">
              +{allImages.length - 1}
            </span>
          )}
        </div>
      );
    }
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Название
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
       return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-right"
        >
          Цена (грн)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("uk-UA").format(amount)
 
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "capacity",
    header: "Вместимость",
    cell: ({ row }) => <div className="text-center">{row.getValue("capacity")}</div>
  },
  {
    id: "units",
    header: "Юниты",
    cell: ({ row }) => {
      const units = row.original.units;
      if (!units || units.length === 0) return "—";
      return units.map(u => u.name).join(", ");
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const room = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Открыть меню</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Действия</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(room)}>
              Редактировать
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete(room.id)} 
              className="text-destructive focus:text-destructive"
            >
              Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
