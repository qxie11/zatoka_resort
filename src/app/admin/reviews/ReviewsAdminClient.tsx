"use client";

import { useState } from "react";
import { MessageSquare, Trash2, Calendar, User, Star, Loader2, Bed, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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

  // Deletion States
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [reviewIdToDelete, setReviewIdToDelete] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);

  // Edition States
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editName, setEditName] = useState("");
  const [editRoomId, setEditRoomId] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
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
      setSelectedIds((prev) => prev.filter((x) => x !== id));
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

  const handleBulkDeleteConfirm = async () => {
    const ids = selectedIds;
    const rowEls = ids.map((id) => document.getElementById(`row-${id}`)).filter(Boolean) as HTMLElement[];

    const performDelete = async () => {
      setReviews((prev) => prev.filter((r) => !ids.includes(r.id)));
      setSelectedIds([]);
      try {
        await Promise.all(
          ids.map((id) =>
            fetch(`/api/reviews/${id}`, {
              method: "DELETE",
            })
          )
        );
        toast({
          title: "Успешно",
          description: "Выбранные отзывы успешно удалены",
          className: "glass-card-dark border-l-4 border-l-rose-500 text-white"
        });
      } catch (error) {
        fetchReviews();
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось удалить некоторые отзывы",
        });
      }
    };

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
    setBulkDeleteConfirmOpen(false);
  };


  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setEditName(review.name);
    setEditRoomId(review.roomId);
    setEditRating(review.rating);
    setEditComment(review.comment);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingReview) return;
    if (!editName.trim() || !editComment.trim()) {
      toast({
        title: "Ошибка",
        description: "Поля не могут быть пустыми",
        variant: "destructive"
      });
      return;
    }

    try {
      const res = await fetch(`/api/reviews/${editingReview.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          roomId: editRoomId,
          rating: editRating,
          comment: editComment,
        })
      });

      if (!res.ok) throw new Error("Failed to update");

      const updated = await res.json();
      setReviews((prev) =>
        prev.map((r) =>
          r.id === editingReview.id
            ? {
                ...updated,
                room: rooms.find((rm) => rm.id === editRoomId) || r.room,
              }
            : r
        )
      );

      setEditDialogOpen(false);
      setEditingReview(null);

      toast({
        title: "Успешно",
        description: "Отзыв успешно обновлен",
        className: "glass-card-dark border-l-4 border-l-teal-500 text-white"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось обновить отзыв",
      });
    }
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

        {/* Action Panel */}
        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          {selectedIds.length > 0 && (
            <Button
              onClick={() => setBulkDeleteConfirmOpen(true)}
              className="bg-gradient-to-r from-rose-500 to-red-650 hover:from-rose-400 hover:to-red-500 text-white font-bold border-0 shadow-lg shadow-rose-500/20 rounded-xl px-5 h-11"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Удалить выбранные ({selectedIds.length})
            </Button>
          )}

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
                  <th className="p-4 pl-6 sticky left-0 bg-slate-950/90 z-20 border-r border-white/5 shadow-[2px_0_5px_rgba(0,0,0,0.3)] w-12">
                    <Checkbox
                      checked={
                        filteredReviews.length > 0 &&
                        selectedIds.length === filteredReviews.length
                      }
                      onCheckedChange={(value) => {
                        if (value) {
                          setSelectedIds(filteredReviews.map((r) => r.id));
                        } else {
                          setSelectedIds([]);
                        }
                      }}
                      className="border-white/20 text-white data-[state=checked]:bg-teal-500 data-[state=checked]:text-slate-950"
                    />
                  </th>
                  <th className="p-4">Дата</th>
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
                    className="group hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4 pl-6 sticky left-0 bg-slate-900 group-hover:bg-slate-800/95 z-10 border-r border-white/5 shadow-[2px_0_5px_rgba(0,0,0,0.3)] transition-colors">
                      <Checkbox
                        checked={selectedIds.includes(review.id)}
                        onCheckedChange={(value) => {
                          if (value) {
                            setSelectedIds((prev) => [...prev, review.id]);
                          } else {
                            setSelectedIds((prev) =>
                              prev.filter((id) => id !== review.id)
                            );
                          }
                        }}
                        className="border-white/20 text-white data-[state=checked]:bg-teal-500 data-[state=checked]:text-slate-950"
                      />
                    </td>
                    <td className="p-4 text-slate-400">
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
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(review)}
                          className="text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 rounded-xl transition-all"
                          title="Редактировать отзыв"
                        >
                          <Edit2 className="h-4.5 w-4.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(review.id)}
                          className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                          title="Удалить отзыв"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Review Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="glass-card-dark border-white/10 text-white max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              <Edit2 className="h-5 w-5 text-teal-400 animate-pulse" />
              Редактировать отзыв
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <label className="text-slate-300 text-xs font-medium">Имя гостя</label>
              <Input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-slate-950/80 border-white/10 text-white rounded-xl focus:border-teal-400/50"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-slate-300 text-xs font-medium">Номер комнаты</label>
              <Select value={editRoomId} onValueChange={setEditRoomId}>
                <SelectTrigger className="w-full bg-slate-950/80 border border-white/10 text-white rounded-xl focus:ring-0 focus:ring-offset-0 focus:border-teal-400/50">
                  <SelectValue placeholder="Выберите номер" />
                </SelectTrigger>
                <SelectContent className="bg-slate-950 border border-white/10 text-white rounded-xl">
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id} className="focus:bg-teal-500/20 focus:text-white cursor-pointer hover:bg-white/5 transition-colors">
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 text-xs font-medium block">Оценка</label>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => {
                  const starValue = i + 1;
                  return (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setEditRating(starValue)}
                      className="text-amber-400 focus:outline-none hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          starValue <= editRating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-600"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 text-xs font-medium">Комментарий</label>
              <Textarea
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                rows={4}
                className="bg-slate-950/80 border-white/10 text-white rounded-xl resize-none focus:border-teal-400/50"
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="ghost"
              onClick={() => setEditDialogOpen(false)}
              className="text-slate-200 hover:!text-white hover:bg-white/10 rounded-xl"
            >
              Отмена
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="bg-gradient-to-r from-teal-400 to-sky-500 hover:from-teal-300 hover:to-sky-400 text-slate-950 font-bold rounded-xl border-0"
            >
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        isOpen={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleDeleteConfirm}
        title="Удалить отзыв?"
        description="Вы уверены, что хотите удалить этот отзыв гостя? Это действие безвозвратно удалит отзыв из базы данных."
      />
      <DeleteConfirmDialog
        isOpen={bulkDeleteConfirmOpen}
        onOpenChange={setBulkDeleteConfirmOpen}
        onConfirm={handleBulkDeleteConfirm}
        title="Удалить выбранные отзывы?"
        description={`Вы действительно хотите удалить выбранные отзывы (${selectedIds.length} шт.)? Это действие безвозвратно удалит их из базы данных.`}
      />
    </div>
  );
}


