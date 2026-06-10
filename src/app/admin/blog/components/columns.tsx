"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { BlogPost } from "@/lib/types";

type ColumnsProps = {
  onEdit: (post: BlogPost) => void;
  onDelete: (postId: string) => void;
};

export const columns = ({ onEdit, onDelete }: ColumnsProps): ColumnDef<BlogPost>[] => [
  {
    accessorKey: "titleRu",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Заголовок (RU)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="max-w-[250px] truncate font-medium">{row.getValue("titleRu")}</div>
  },
  {
    accessorKey: "categoryRu",
    header: "Категория",
    cell: ({ row }) => <div className="text-center">{row.getValue("categoryRu")}</div>
  },
  {
    accessorKey: "date",
    header: "Дата",
    cell: ({ row }) => <div className="text-center font-mono text-xs">{row.getValue("date")}</div>
  },
  {
    accessorKey: "readTime",
    header: "Время чтения",
    cell: ({ row }) => <div className="text-center">{row.getValue("readTime")} мин</div>
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const post = row.original;

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
            <DropdownMenuItem onClick={() => onEdit(post)}>
              Редактировать
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete(post.id)} 
              className="text-destructive focus:text-destructive"
            >
              Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
