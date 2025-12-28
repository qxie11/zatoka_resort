
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Booking } from "@/lib/types"

type BookingWithRoomName = Booking & { roomName: string };

type ColumnsProps = {
  onEdit: (booking: Booking) => void;
  onDelete: (bookingId: string) => void;
};

export const columns = ({ onEdit, onDelete }: ColumnsProps): ColumnDef<BookingWithRoomName>[] => [
  {
    accessorKey: "roomName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Номер
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "name",
    header: "Имя гостя",
  },
  {
    accessorKey: "phone",
    header: "Телефон",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "startDate",
    header: "Дата заезда",
    cell: ({ row }) => {
      return format(new Date(row.getValue("startDate")), "PPP", { locale: ru });
    }
  },
  {
    accessorKey: "endDate",
    header: "Дата выезда",
    cell: ({ row }) => {
      return format(new Date(row.getValue("endDate")), "PPP", { locale: ru });
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const booking = row.original

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
            <DropdownMenuItem onClick={() => onEdit(booking)}>
              Редактировать
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete(booking.id)} 
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
