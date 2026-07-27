
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown, Eye } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Booking } from "@/lib/types"

type BookingWithRoomName = Booking & { roomName: string };

type ColumnsProps = {
  onEdit: (booking: Booking) => void;
  onDelete: (bookingId: string) => void;
  onView: (booking: Booking) => void;
  onStatusChange?: (bookingId: string, newStatus: string) => void;
};

export const columns = ({ onEdit, onDelete, onView, onStatusChange }: ColumnsProps): ColumnDef<BookingWithRoomName>[] => [
  {
    accessorKey: "roomName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Номер / Юнит
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const roomName = row.getValue("roomName") as string;
      const unitName = row.original.unitName;
      return unitName ? `${roomName} (${unitName})` : roomName;
    }
  },
  {
    accessorKey: "name",
    header: "Имя гостя",
  },
  {
    accessorKey: "status",
    header: "Статус",
    cell: ({ row }) => {
      const status = (row.original.status || "PENDING") as string;
      const statusColors: Record<string, string> = {
        PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        CONFIRMED: "bg-teal-500/10 text-teal-300 border-teal-500/30",
        CHECKED_IN: "bg-sky-500/10 text-sky-300 border-sky-500/30",
        CHECKED_OUT: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
      };

      return (
        <Select
          value={status}
          onValueChange={(val) => onStatusChange?.(row.original.id, val)}
        >
          <SelectTrigger className={`text-xs font-bold h-8 border rounded-xl shadow-none focus:ring-0 whitespace-nowrap ${statusColors[status] || statusColors.PENDING}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10 text-white rounded-xl shadow-2xl z-[9999]">
            <SelectItem value="PENDING" className="text-amber-400 focus:bg-white/10 focus:text-amber-300 rounded-lg cursor-pointer">
              ⏳ Ожидает
            </SelectItem>
            <SelectItem value="CONFIRMED" className="text-teal-300 focus:bg-white/10 focus:text-teal-200 rounded-lg cursor-pointer">
              ✅ Подтверждено
            </SelectItem>
            <SelectItem value="CHECKED_IN" className="text-sky-300 focus:bg-white/10 focus:text-sky-200 rounded-lg cursor-pointer">
              🏨 Проживает
            </SelectItem>
            <SelectItem value="CHECKED_OUT" className="text-emerald-300 focus:bg-white/10 focus:text-emerald-200 rounded-lg cursor-pointer">
              🏁 Выехал
            </SelectItem>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("email") as string | undefined;
      return email ? email : "—";
    },
  },
  {
    accessorKey: "adminComment",
    header: "Примечание",
    cell: ({ row }) => {
      const c = row.getValue("adminComment") as string | undefined;
      if (!c) return <span className="text-slate-500">—</span>;
      const short = c.length > 60 ? c.slice(0, 57) + "..." : c;
      return <span className="text-sm text-slate-300">{short}</span>;
    },
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
    accessorKey: "pricePaid",
    header: "Стоимость",
    cell: ({ row }) => {
      const pricePaid = row.original.pricePaid;
      const promoCode = row.original.promoCode;
      const discountApplied = row.original.discountApplied;
      
      if (pricePaid !== undefined && pricePaid !== null) {
        return (
          <div className="flex flex-col">
            <span className="font-bold text-teal-300 whitespace-nowrap">{pricePaid} грн</span>
            {promoCode && (
              <span className="text-[10px] text-slate-400 whitespace-nowrap">
                Код: {promoCode} (-{discountApplied}%)
              </span>
            )}
          </div>
        );
      }
      return <span className="text-slate-500">—</span>;
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const booking = row.original

      return (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView(booking)}
            className="text-slate-300 hover:text-teal-400 hover:bg-teal-500/10 rounded-xl transition-all h-8 w-8"
            title="Просмотреть детали"
          >
            <Eye className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white/5 rounded-xl">
                <span className="sr-only">Открыть меню</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-900 border-white/10 text-white rounded-xl">
              <DropdownMenuLabel>Действия</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onEdit(booking)} className="focus:bg-white/10 focus:text-teal-300 cursor-pointer">
                Редактировать
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem 
                onClick={() => onDelete(booking.id)} 
                className="text-rose-450 focus:text-rose-400 focus:bg-rose-500/10 cursor-pointer"
              >
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
