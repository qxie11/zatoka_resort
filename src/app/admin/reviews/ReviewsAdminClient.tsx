"use client";

import { useState } from "react";
import { MessageSquare, Trash2, Calendar, User, Star, Loader2, Bed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Room {
  id: string;
  name: string;
}

interface Review {
  id: string;
  roomId: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  createdAt: string;
  room: Room;
}

interface ReviewsAdminClientProps {
  initialReviews: Review[];
  rooms: Room[];
}

export default function ReviewsAdminClient({ initialReviews, rooms }: ReviewsAdminClientProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [selectedRoomId, setSelectedRoomId] = useState<string>("all");
  const { toast } = useToast();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [reviewIdToDelete, setReviewIdToDelete] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      // Need to re-populate full room objects locally if not returned, 
      // but since we are synchronizing in-memory for deleted items, we can fallback to mapping.
      const mapped = data.map((d: any) => ({
        ...d,
        room: rooms.find(r => r.id === d.roomId) || { id: d.roomId, name: "Неизвестный номер" }
      }));
      setReviews(mapped);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось обновить список отзывов",
      });
    }
  };

  const handleDelete = (id: string) => {
    setReviewIdToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!reviewIdToDelete) return;
    const id = reviewIdToDelete;
    const rowEl = document.getElementById(`row-${id}`);

    const performDelete = async () => {
      setReviews((prev) => prev.filter((r) => r.id !== id));
      try {
        const res = await fetch(`/api/reviews/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Failed to delete");

        toast({
          title: "Успешно",
          description: "Отзыв успешно удален",
          className: "glass-card-dark border-l-4 border-l-rose-500 text-white"
        });
      } catch (error) {
        fetchReviews();
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось удалить отзыв",
        });
      }
    };

    if (rowEl) {
      const { thanosSnap } = await import("@/lib/thanos");
      thanosSnap(rowEl, performDelete);
    } else {
      performDelete();
    }
    setReviewIdToDelete(null);
  };

  // Filter reviews based on selection
  const filteredReviews = selectedRoomId === "all"
    ? reviews
    : reviews.filter((r) => r.roomId === selectedRoomId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <MessageSquare className="h-7 w-7 text-teal-400" />
            Управление отзывами
          </h1>
          <p className="text-slate-400 text-sm mt-1">
             Модерируйте отзывы гостей, оставленные под номерами отеля
          </p>
        </div>

        {/* Room Filter Selector using Radix Select */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Фильтр:</span>
          <Select value={selectedRoomId} onValueChange={setSelectedRoomId}>
            <SelectTrigger className="w-[200px] bg-slate-900 border border-white/10 text-white rounded-xl focus:ring-0 focus:ring-offset-0 focus:border-teal-400/50">
              <SelectValue placeholder="Все номера" />
            </SelectTrigger>
            <SelectContent className="bg-slate-950 border border-white/10 text-white rounded-xl shadow-2xl">
              <SelectItem value="all" className="focus:bg-teal-500/20 focus:text-white cursor-pointer hover:bg-white/5 transition-colors">
                Все номера
              </SelectItem>
              {rooms.map((room) => (
                <SelectItem key={room.id} value={room.id} className="focus:bg-teal-500/20 focus:text-white cursor-pointer hover:bg-white/5 transition-colors">
                  {room.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>


      {filteredReviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-white/10 rounded-3xl bg-slate-900/40 text-center space-y-4">
          <div className="p-4 rounded-full bg-teal-500/10 text-teal-400">
            <MessageSquare className="h-10 w-10" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Отзывов не найдено</h3>
            <p className="text-slate-400 text-sm mt-1">
              {selectedRoomId === "all"
                ? "Гости пока не оставляли отзывы под номерами."
                : "Под этим номером пока нет ни одного отзыва."}
            </p>
          </div>
        </div>
      ) : (
        <div className="border border-white/10 rounded-3xl overflow-hidden glass-card-dark shadow-2xl bg-slate-900/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-slate-950/50 text-slate-300 text-xs font-bold uppercase tracking-wider">
                  <th className="p-4 pl-6">Дата</th>
                  <th className="p-4">Гость</th>
                  <th className="p-4">Номер</th>
                  <th className="p-4">Оценка</th>
                  <th className="p-4">Комментарий</th>
                  <th className="p-4 pr-6 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-slate-200">
                {filteredReviews.map((review) => (
                  <tr
                    key={review.id}
                    id={`row-${review.id}`}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4 pl-6 text-slate-400">
                      <span className="flex items-center gap-2 text-xs">
                        <Calendar className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                        {review.date}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-white">
                      <span className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                        {review.name}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <Bed className="h-3.5 w-3.5 text-teal-500 shrink-0" />
                        {review.room?.name || "Неизвестный номер"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center text-amber-400 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10 w-fit">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 mr-1" />
                        <span className="text-xs font-bold">{review.rating}</span>
                      </div>
                    </td>
                    <td className="p-4 max-w-xs truncate text-slate-300" title={review.comment}>
                      {review.comment}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(review.id)}
                        className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                        title="Удалить отзыв"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <DeleteConfirmDialog
        isOpen={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleDeleteConfirm}
        title="Удалить отзыв?"
        description="Вы уверены, что хотите удалить этот отзыв гостя? Это действие безвозвратно удалит отзыв из базы данных."
      />
    </div>
  );
}
