"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  CreditCard,
  XCircle,
  Star,
  Eye,
  Clock,
  Flame,
  Users,
  CheckCircle2,
  Quote,
} from "lucide-react";
import type { Room, Review } from "@/lib/types";

interface BookingPageExtrasProps {
  lang: string;
  room: Room;
  reviews: Review[];
  recentBookingsCount: number;
}

export default function BookingPageExtras({
  lang,
  room,
  reviews,
  recentBookingsCount,
}: BookingPageExtrasProps) {
  const [viewerCount, setViewerCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      setViewerCount(Math.floor(Math.random() * 4) + 2);
    }, 0);

    const interval = setInterval(() => {
      setViewerCount((prev) => {
        const change = Math.random() > 0.5 ? 1 : -1;
        return Math.max(1, Math.min(8, prev + change));
      });
    }, 15000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const t = {
    ru: {
      trustTitle: "Ваши гарантии",
      trustCancel: "Бесплатная отмена за 7 дней",
      trustPayment: "Оплата при заезде",
      trustSecure: "Безопасное бронирование",
      trustNoFees: "Без скрытых комиссий",
      urgencyTitle: "Популярный номер",
      viewing: "чел. сейчас просматривают",
      recentBookings: "бронирований за эту неделю",
      reviewsTitle: "Отзывы гостей",
      noReviews: "Станьте первым, кто оставит отзыв!",
      avgRating: "Средняя оценка",
      amenitiesTitle: "Удобства номера",
    },
    uk: {
      trustTitle: "Ваші гарантії",
      trustCancel: "Безкоштовне скасування за 7 днів",
      trustPayment: "Оплата при заїзді",
      trustSecure: "Безпечне бронювання",
      trustNoFees: "Без прихованих комісій",
      urgencyTitle: "Популярний номер",
      viewing: "осіб зараз переглядають",
      recentBookings: "бронювань за цей тиждень",
      reviewsTitle: "Відгуки гостей",
      noReviews: "Станьте першим, хто залишить відгук!",
      avgRating: "Середня оцінка",
      amenitiesTitle: "Зручності номера",
    },
    en: {
      trustTitle: "Your Guarantees",
      trustCancel: "Free cancellation 7 days prior",
      trustPayment: "Pay at check-in",
      trustSecure: "Secure booking",
      trustNoFees: "No hidden fees",
      urgencyTitle: "Popular Room",
      viewing: "people viewing now",
      recentBookings: "bookings this week",
      reviewsTitle: "Guest Reviews",
      noReviews: "Be the first to leave a review!",
      avgRating: "Average rating",
      amenitiesTitle: "Room Amenities",
    },
  };

  const current = t[lang as keyof typeof t] || t.ru;
  const displayReviews = reviews.slice(0, 3);
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <>
      {/* Trust Badges */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-md p-6 shadow-xl">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-5 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-teal-400" />
          {current.trustTitle}
        </h3>
        <div className="space-y-4">
          {[
            {
              icon: XCircle,
              text: current.trustCancel,
              color: "text-emerald-400",
              bg: "bg-emerald-500/10",
            },
            {
              icon: CreditCard,
              text: current.trustPayment,
              color: "text-amber-400",
              bg: "bg-amber-500/10",
            },
            {
              icon: ShieldCheck,
              text: current.trustSecure,
              color: "text-sky-400",
              bg: "bg-sky-500/10",
            },
            {
              icon: CheckCircle2,
              text: current.trustNoFees,
              color: "text-teal-400",
              bg: "bg-teal-500/10",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.text}
                className="flex items-center gap-3 group"
              >
                <div
                  className={`p-2 rounded-xl ${item.bg} shrink-0 transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <span className="text-sm text-slate-200 font-medium">
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Room Amenities */}
      {room.amenities && room.amenities.length > 0 && (
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-md p-6 shadow-xl">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-4">
            {current.amenitiesTitle}
          </h3>
          <div className="flex flex-wrap gap-2">
            {room.amenities.map((amenity) => (
              <span
                key={amenity}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs font-medium text-teal-300"
              >
                <CheckCircle2 className="h-3 w-3 text-teal-400" />
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Guest Reviews */}
      {displayReviews.length > 0 && (
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-md p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-300 flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              {current.reviewsTitle}
            </h3>
            {avgRating && (
              <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                <span className="text-sm font-bold text-amber-300">{avgRating}</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {displayReviews.map((review) => (
              <div
                key={review.id}
                className="bg-slate-950/40 rounded-2xl p-4 border border-white/5 space-y-2 group hover:border-white/10 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{review.name}</span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < review.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  <Quote className="h-3 w-3 text-teal-500/50 inline mr-1" />
                  {review.comment}
                </p>
                <p className="text-[10px] text-slate-500">{review.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
