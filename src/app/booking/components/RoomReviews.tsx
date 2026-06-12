"use client";

import { useState, useEffect } from "react";
import { Star, User, Calendar, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

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

const defaultReviews: Record<string, Review[]> = {
  default: [
    {
      id: "1",
      name: "Александр М.",
      rating: 5,
      date: "04.06.2026",
      comment: "Потрясающий номер! Первая линия — действительно первая линия, до моря буквально минута пешком. Номер чистый, современный, кондиционер работает отлично. Обязательно вернемся снова!"
    },
    {
      id: "2",
      name: "Ольга Д.",
      rating: 5,
      date: "28.05.2026",
      comment: "Отдыхали всей семьей. Дети в восторге от бассейна и близости к пляжу. Персонал очень отзывчивый, помогли со всеми вопросами. Отличное соотношение цены и качества."
    },
    {
      id: "3",
      name: "Дмитрий К.",
      rating: 4,
      date: "15.05.2026",
      comment: "Хороший просторный номер с шикарным видом. Wi-Fi на территории работал стабильно, что было важно для работы. Из минусов — в выходные на побережье бывает шумновато, но при закрытых окнах ничего не слышно."
    }
  ]
};

export default function RoomReviews({ roomId, roomName }: RoomReviewsProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    // Load reviews from localStorage or initialize with defaults
    const stored = localStorage.getItem(`reviews_${roomId}`);
    if (stored) {
      try {
        setReviews(JSON.parse(stored));
      } catch (e) {
        setReviews(defaultReviews.default);
      }
    } else {
      setReviews(defaultReviews.default);
    }
  }, [roomId]);

  const handleSubmit = (e: React.FormEvent) => {
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

    const newReview: Review = {
      id: Date.now().toString(),
      name,
      rating,
      date: new Date().toLocaleDateString("ru-RU"),
      comment
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(`reviews_${roomId}`, JSON.stringify(updatedReviews));

    // Clear form
    setName("");
    setRating(5);
    setComment("");

    toast({
      title: "Отзыв добавлен",
      description: "Спасибо за ваш отзыв! Он опубликован в реальном времени.",
      className: "glass-card-dark border-l-4 border-l-teal-500 text-white"
    });
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
                className={`h-5 w-5 ${
                  i < Math.round(parseFloat(avgRating))
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
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review.id}
                className="p-5 rounded-2xl bg-slate-900/40 border border-white/5 space-y-3 hover:border-white/10 transition-colors"
              >
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

                  <div className="flex items-center text-amber-400 bg-amber-500/5 px-2 py-1 rounded-lg border border-amber-500/10">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 mr-1" />
                    <span className="text-xs font-bold">{review.rating}</span>
                  </div>
                </div>

                <p className="text-slate-300 text-sm font-light leading-relaxed pl-1">
                  {review.comment}
                </p>
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-slate-300 text-xs font-medium">Ваше имя</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Иван Иванов"
                className="bg-slate-950/80 border-white/10 text-white rounded-xl focus:border-teal-400/50"
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
                        className={`h-7 w-7 ${
                          starValue <= (hoverRating ?? rating)
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
        </div>
      </div>
    </div>
  );
}
