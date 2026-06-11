import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export default function DeleteConfirmDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  title = "Подтверждение удаления",
  description = "Вы действительно хотите удалить этот элемент? Это действие необратимо.",
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="glass-card-dark border border-white/10 bg-slate-900/95 backdrop-blur-md rounded-3xl shadow-2xl text-white max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-extrabold text-white">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-300 text-sm">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 transition-all">
            Отмена
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-bold border-0 shadow-lg shadow-rose-500/20"
          >
            Удалить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
