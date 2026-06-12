"use client";

import { useState, useEffect } from "react";
import { Star, Calendar, MessageSquare, Send, Edit2, Trash2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import Link from "next/link";
import { useParams } from "next/navigation";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
}

interface RoomReviewsProps {
  roomId: string;
  roomName: string;
}

export default function RoomReviews({ roomId, roomName }: RoomReviewsProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const params = useParams();
  const lang = (params?.lang as string) || "ru";

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [googleUser, setGoogleUser] = useState<{ name: string; email: string } | null>(null);

  // Form states for new review
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  // Delete states
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch reviews on mount
  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?roomId=${roomId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (e) {
      console.error("Failed to fetch reviews:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // Check if current user is admin
    setIsAdmin(localStorage.getItem("isAuthenticated") === "true");

    // Listen to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setGoogleUser({
          name: user.displayName || "Google User",
          email: user.email || "",
        });
        setName(user.displayName || "");
      } else {
        setGoogleUser(null);
        setName("");
      }
    });

    return () => unsubscribe();
  }, [roomId]);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setGoogleUser({
        name: user.displayName || "Google User",
        email: user.email || "",
      });
      setName(user.displayName || "");
      toast({
        title: "Авторизован через Google",
        description: `Добро пожаловать, ${user.displayName || "гость"}! Теперь вы можете оставить отзыв.`,
        className: "glass-card-dark border-l-4 border-l-teal-500 text-white"
      });
    } catch (e: any) {
      console.error(e);
      toast({
        title: "Ошибка входа",
        description: "Не удалось войти через Google. Убедитесь, что настроены переменные окружения в .env.",
        variant: "destructive"
      });
    }
  };

  const handleGoogleLogout = async () => {
    try {
      await signOut(auth);
      setGoogleUser(null);
      setName("");
      toast({
        title: "Выход выполнен",
        description: "Вы вышли из учетной записи Google.",
        className: "glass-card-dark border-l-4 border-l-rose-500 text-white"
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите ваше имя",
        variant: "destructive"
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, напишите комментарий",
        variant: "destructive"
      });
      return;
    }

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          name,
          rating,
          comment,
          date: new Date().toLocaleDateString("ru-RU")
        })
      });

      if (res.ok) {
        const newReview = await res.json();
        setReviews([newReview, ...reviews]);
        setName("");
        setRating(5);
        setComment("");
        toast({
          title: "Отзыв добавлен",
          description: "Спасибо! Ваш отзыв сохранен в базе данных.",
          className: "glass-card-dark border-l-4 border-l-teal-500 text-white"
        });
      } else {
        throw new Error();
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить отзыв. Попробуйте еще раз.",
        variant: "destructive"
      });
    }
  };

  const handleStartEdit = (review: Review) => {
    setEditingId(review.id);
    setEditName(review.name);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim() || !editComment.trim()) {
      toast({
        title: "Ошибка",
        description: "Поля не могут быть пустыми",
        variant: "destructive"
      });
      return;
    }

    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          rating: editRating,
          comment: editComment
        })
      });

      if (res.ok) {
        const updatedReview = await res.json();
        setReviews(reviews.map((r) => (r.id === id ? updatedReview : r)));
        setEditingId(null);
        toast({
          title: "Отзыв обновлен",
          description: "Изменения успешно сохранены.",
          className: "glass-card-dark border-l-4 border-l-teal-500 text-white"
        });
      } else {
        throw new Error();
      }
    } catch (e) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить изменения.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    const id = deletingId;
    const rowEl = document.getElementById(`review-row-${id}`);

    const performDelete = async () => {
      try {
        const res = await fetch(`/api/reviews/${id}`, {
          method: "DELETE"
        });

        if (res.ok) {
          setReviews((prev) => prev.filter((r) => r.id !== id));
          toast({
            title: "Отзыв удален",
            description: "Отзыв успешно удален из базы данных.",
            className: "glass-card-dark border-l-4 border-l-rose-500 text-white"
          });
        } else {
          throw new Error();
        }
      } catch (e) {
        toast({
          title: "Ошибка",
          description: "Не удалось удалить отзыв.",
          variant: "destructive"
        });
      }
    };

    if (rowEl) {
      const { thanosSnap } = await import("@/lib/thanos");
      thanosSnap(rowEl, performDelete);
    } else {
      performDelete();
    }
    setDeletingId(null);
  };

  const avgRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  return (
    <div className="space-y-8 mt-12 border-t border-white/5 pt-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-teal-400" />
            Отзывы гостей о номере
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Реальные впечатления посетителей, забронировавших {roomName}
          </p>
        </div>

        {/* Rating summary */}
        <div className="flex items-center gap-3 bg-slate-900/80 border border-white/10 px-4 py-2.5 rounded-2xl">
          <div className="flex items-center text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${i < Math.round(parseFloat(avgRating))
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-600"
                  }`}
              />
            ))}
          </div>
          <span className="text-lg font-bold text-white">{avgRating} / 5.0</span>
          <span className="text-slate-400 text-xs font-light">({reviews.length} отзывов)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-sm">Загрузка отзывов...</div>
          ) : reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review.id}
                id={`review-row-${review.id}`}
                className="p-5 rounded-2xl bg-slate-900/40 border border-white/5 space-y-3 hover:border-white/10 transition-colors relative"
              >
                {editingId === review.id ? (
                  // Edit mode inline
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-slate-950/80 border-white/10 text-white rounded-xl text-sm max-w-xs focus:border-teal-400/50"
                        placeholder="Имя"
                      />
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <button
                            type="button"
                            key={i}
                            onClick={() => setEditRating(i + 1)}
                            className="text-amber-400 focus:outline-none"
                          >
                            <Star
                              className={`h-4.5 w-4.5 ${i + 1 <= editRating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-600"
                                }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <Textarea
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      className="bg-slate-950/80 border-white/10 text-white rounded-xl text-sm resize-none focus:border-teal-400/50"
                      rows={3}
                      placeholder="Комментарий"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSaveEdit(review.id)}
                        className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Сохранить
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        variant="ghost"
                        className="text-slate-300 hover:bg-white/10 px-3 py-1.5 rounded-lg text-xs"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Отмена
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Normal view mode
                  <>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-300 font-semibold text-sm">
                          {review.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">{review.name}</h4>
                          <span className="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                            <Calendar className="h-3 w-3" />
                            {review.date}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center text-amber-400 bg-amber-500/5 px-2 py-1 rounded-lg border border-amber-500/10">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 mr-1" />
                          <span className="text-xs font-bold">{review.rating}</span>
                        </div>

                        {/* Admin Inline actions */}
                        {isAdmin && (
                          <div className="flex items-center gap-1.5 border-l border-white/10 pl-3">
                            <button
                              onClick={() => handleStartEdit(review)}
                              className="text-slate-400 hover:text-teal-400 p-1 transition-colors"
                              title="Редактировать"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setDeletingId(review.id)}
                              className="text-slate-400 hover:text-rose-400 p-1 transition-colors"
                              title="Удалить"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-slate-300 text-sm font-light leading-relaxed pl-1">
                      {review.comment}
                    </p>
                  </>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-slate-900/20 border border-dashed border-white/10 rounded-2xl">
              <MessageSquare className="h-10 w-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">Отзывов пока нет. Будьте первым!</p>
            </div>
          )}
        </div>

        {/* Leave a Review Form */}
        <div className="p-6 rounded-2xl glass-card-dark border border-white/10 h-fit space-y-4 shadow-xl">
          <h4 className="font-bold text-white text-lg">Оставить отзыв</h4>
          
          {!isAdmin && !googleUser ? (
            <div className="text-center py-6 space-y-4">
              <p className="text-slate-300 text-sm font-light leading-relaxed">
                Чтобы оставить отзыв о номере, пожалуйста, авторизуйтесь через Google или войдите как администратор.
              </p>
              
              <div className="space-y-2.5">
                <Button
                  onClick={handleGoogleLogin}
                  className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold border-0 shadow-lg rounded-xl flex items-center justify-center gap-2 py-5"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" width="24" height="24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  Войти через Google
                </Button>
                
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-white/10 bg-slate-900/60 text-white hover:bg-slate-800 rounded-xl py-5 text-sm"
                >
                  <Link href={`/${lang}/login`}>
                    Войти как Администратор
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {googleUser && (
                <div className="flex items-center justify-between bg-teal-500/10 border border-teal-500/20 px-3 py-2 rounded-xl">
                  <span className="text-teal-300 text-xs truncate max-w-[170px]" title={googleUser.email}>
                    {googleUser.name} (Google)
                  </span>
                  <button
                    type="button"
                    onClick={handleGoogleLogout}
                    className="text-xs text-rose-400 hover:underline hover:text-rose-300 font-medium"
                  >
                    Выйти
                  </button>
                </div>
              )}
              {isAdmin && (
                <div className="bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-xl text-amber-300 text-xs font-semibold">
                  Авторизован как Администратор
                </div>
              )}
              
              <div className="space-y-1.5">
                <label className="text-slate-300 text-xs font-medium">Ваше имя</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Иван Иванов"
                  className="bg-slate-950/80 border-white/10 text-white rounded-xl focus:border-teal-400/50"
                  disabled={!!googleUser}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 text-xs font-medium block">Ваша оценка</label>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const starValue = i + 1;
                    return (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setRating(starValue)}
                        onMouseEnter={() => setHoverRating(starValue)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="text-amber-400 hover:scale-110 transition-transform focus:outline-none"
                      >
                        <Star
                          className={`h-7 w-7 ${starValue <= (hoverRating ?? rating)
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
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Поделитесь вашими впечатлениями об отдыхе..."
                  rows={4}
                  className="bg-slate-950/80 border-white/10 text-white rounded-xl resize-none focus:border-teal-400/50"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-400 to-sky-500 hover:from-teal-300 hover:to-sky-400 text-slate-950 font-bold border-0 shadow-lg shadow-teal-500/10 rounded-xl transition-all duration-300"
              >
                <Send className="mr-2 h-4 w-4" />
                Отправить отзыв
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* Thanos snap deletion dialog */}
      <DeleteConfirmDialog
        isOpen={deletingId !== null}
        onOpenChange={(open) => !open && setDeletingId(null)}
        onConfirm={handleDelete}
        title="Удалить отзыв?"
        description="Вы уверены, что хотите удалить этот отзыв гостя? Это действие безвозвратно удалит отзыв из базы данных."
      />
    </div>
  );
}
