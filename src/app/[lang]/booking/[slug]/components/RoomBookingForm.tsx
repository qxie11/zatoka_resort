"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Users, Mail, Phone, User, Eye, Minus, Plus } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import ImageGallery from "@/components/rooms/ImageGallery";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Room, Booking } from "@/lib/types";
import { DateRangePicker } from "@/components/booking/DateRangePicker";

const FormSchema = z.object({
  unitId: z.string().min(1, { message: "Пожалуйста, выберите домик / номер." }),
  dateRange: z.object({
    from: z.date({
      required_error: "Дата заезда обязательна.",
    }),
    to: z.date({
      required_error: "Дата выезда обязательна.",
    }),
  }),
  guests: z.coerce
    .number()
    .min(1, { message: "Требуется как минимум один гость." }),
  name: z
    .string()
    .min(2, { message: "Имя должно содержать минимум 2 символа." }),
  phone: z.string().min(10, { message: "Номер телефона обязателен." }),
  email: z
    .string()
    .optional()
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: "Некорректный email адрес.",
    }),
});

interface RoomBookingFormProps {
  room: Room;
  existingBookings: Booking[];
}

function ViewImagesButton({ room }: { room: Room }) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const allImages = room.imageUrl
    ? [room.imageUrl, ...(room.imageUrls || [])]
    : room.imageUrls || [];

  if (allImages.length === 0) {
    return null;
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={() => setIsGalleryOpen(true)}
        className="w-full sm:w-auto border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300 rounded-xl"
      >
        <Eye className="mr-2 h-4 w-4 text-teal-400" />
        Посмотреть
      </Button>
      <ImageGallery
        images={allImages}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        roomName={room.name}
      />
    </>
  );
}

export default function RoomBookingForm({
  room,
  existingBookings,
}: RoomBookingFormProps) {
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || "ru";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [discount, setDiscount] = useState(0); // discount in percentage
  const [promoError, setPromoError] = useState("");
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState("");

  const handleValidatePromo = async () => {
    if (!promoInput.trim()) return;
    setIsValidatingPromo(true);
    setPromoError("");
    try {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoInput }),
      });
      const data = await res.json();
      if (data.valid) {
        setDiscount(data.discount);
        setAppliedPromo(data.code);
        toast({
          title: "Промокод применен!",
          description: `Скидка ${data.discount}% успешно применена.`,
        });
      } else {
        setPromoError("Неверный или неактивный промокод");
        setDiscount(0);
        setAppliedPromo("");
      }
    } catch (err) {
      console.error(err);
      setPromoError("Ошибка проверки промокода");
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const isSingleUnit = room.units && room.units.length === 1;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      unitId: isSingleUnit ? room?.units?.[0]?.id : "",
      guests: 1,
      name: "",
      phone: "",
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);

    try {
      const nights = Math.ceil(
        (data.dateRange.to.getTime() - data.dateRange.from.getTime()) /
        (1000 * 60 * 60 * 24)
      );
      const originalPrice = nights * room.price;
      const pricePaid = Math.round(originalPrice * (1 - discount / 100));

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId: room.id,
          unitId: data.unitId,
          startDate: data.dateRange.from.toISOString(),
          endDate: data.dateRange.to.toISOString(),
          name: data.name,
          phone: data.phone,
          email: data.email || undefined,
          pricePaid,
          promoCode: appliedPromo || undefined,
          discountApplied: discount || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Ошибка при создании бронирования");
      }

      const booking = await response.json();

      toast({
        title: "Бронирование успешно создано!",
        description: `Ваше бронирование на ${format(
          data.dateRange.from,
          "dd.MM.yyyy",
          { locale: ru }
        )} - ${format(data.dateRange.to, "dd.MM.yyyy", {
          locale: ru,
        })} подтверждено.`,
      });

      const searchParams = new URLSearchParams({
        roomId: room.id,
        roomName: room.name,
        name: data.name,
        startDate: format(data.dateRange.from, "yyyy-MM-dd"),
        endDate: format(data.dateRange.to, "yyyy-MM-dd"),
        pricePaid: pricePaid.toString(),
        guests: data.guests.toString(),
      });

      router.push(`/${lang}/booking/success?${searchParams.toString()}`);
    } catch (error) {
      toast({
        title: "Ошибка",
        description:
          error instanceof Error
            ? error.message
            : "Не удалось создать бронирование. Попробуйте еще раз.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="shadow-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md text-white rounded-3xl">
      <CardHeader className="relative">
        <CardTitle className="text-2xl font-extrabold font-heading text-white">Оформление бронирования</CardTitle>
        <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent" />
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {room.units && room.units.length > 0 && (
              <FormField
                control={form.control}
                name="unitId"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="font-semibold text-slate-300">Домик / Номер</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(val) => {
                        field.onChange(val);
                        // Reset dates if the newly selected unit is not available on current dates
                        const currentRange = form.getValues("dateRange");
                        if (currentRange?.from && currentRange?.to && val) {
                          const isBooked = existingBookings.some(b => {
                            if (b.unitId !== val) return false;
                            const bStart = new Date(b.startDate);
                            const bEnd = new Date(b.endDate);
                            return currentRange.from < bEnd && currentRange.to > bStart;
                          });
                          if (isBooked) {
                            form.setValue("dateRange", { from: undefined as any, to: undefined as any });
                            toast({
                              title: "Даты сброшены",
                              description: "Выбранный домик занят на ранее выбранные даты. Пожалуйста, выберите новые даты.",
                              variant: "destructive",
                            });
                          }
                        }
                      }}
                      disabled={isSingleUnit}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-slate-900 border-white/10 text-white rounded-xl focus:ring-teal-500 shadow-sm h-11">
                          <SelectValue placeholder={isSingleUnit ? room.units?.[0].name : "Выберите домик / номер"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-900 border-white/10 text-white rounded-xl shadow-md">
                        {room.units!.map((unit) => (
                          <SelectItem key={unit.id} value={unit.id!} className="focus:bg-teal-500/20 focus:text-teal-300 rounded-lg py-2">
                            {unit.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {form.watch("unitId") && (
              <FormField
                control={form.control}
                name="dateRange"
                render={({ field }) => {
                  const selectedUnitId = form.watch("unitId");
                  const filteredBookings = existingBookings.filter(b => b.unitId === selectedUnitId);

                  return (
                    <DateRangePicker
                      value={field.value}
                      onChange={field.onChange}
                      existingBookings={filteredBookings}
                      totalUnitsCount={1}
                      showBookingInstructions={!isSingleUnit}
                    />
                  );
                }}
              />
            )}

            <FormField
              control={form.control}
              name="guests"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-teal-300 font-bold mb-2.5 flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-teal-400" />
                    Количество гостей
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-between bg-slate-950/40 border border-white/10 rounded-xl h-11 px-2.5 w-full max-w-[200px]">
                      <button
                        type="button"
                        onClick={() => field.onChange(Math.max(1, (field.value || 1) - 1))}
                        className="h-7 w-7 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all active:scale-95"
                      >
                        <Minus className="h-4 w-4" />
                      </button>

                      <span className="text-base font-extrabold select-none text-white tracking-wider">
                        {field.value || 1}
                      </span>

                      <button
                        type="button"
                        onClick={() => field.onChange(Math.min(room.capacity, (field.value || 1) + 1))}
                        className="h-7 w-7 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all active:scale-95"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </FormControl>
                  <p className="text-sm text-slate-400 mt-1">
                    Максимум {room.capacity} гостей
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-300 font-bold mb-2">Имя</FormLabel>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-400" />
                      <FormControl>
                        <Input
                          placeholder="Ваше имя"
                          className="pl-10 bg-slate-950/40 border-white/10 focus:border-teal-400/50 text-white rounded-xl h-11"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-300 font-bold mb-2">Телефон</FormLabel>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-400" />
                      <FormControl>
                        <Input
                          placeholder="+380501234567"
                          className="pl-10 bg-slate-950/40 border-white/10 focus:border-teal-400/50 text-white rounded-xl h-11"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-300 font-bold mb-2">Email</FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-400" />
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@email.com"
                          className="pl-10 bg-slate-950/40 border-white/10 focus:border-teal-400/50 text-white rounded-xl h-11"
                          suppressHydrationWarning
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Promo Code Entry */}
            <div className="pt-4 border-t border-white/5 space-y-2">
              <label className="text-sm font-bold text-teal-300">Промокод на скидку</label>
              <div className="flex gap-2 max-w-sm">
                <Input
                  placeholder="Введите промокод (например: ZATOKAWAVE)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="bg-slate-950/40 border-white/10 focus:border-teal-400/50 text-white rounded-xl h-11"
                />
                <Button
                  type="button"
                  onClick={handleValidatePromo}
                  disabled={isValidatingPromo || !promoInput.trim()}
                  className="bg-slate-800 hover:bg-slate-700 text-white border border-white/10 rounded-xl px-4 h-11"
                >
                  {isValidatingPromo ? "..." : "Применить"}
                </Button>
              </div>
              {promoError && <p className="text-xs text-rose-400">{promoError}</p>}
              {appliedPromo && <p className="text-xs text-teal-400">Применен промокод: {appliedPromo} ({discount}% скидка)</p>}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4 border-t border-white/5">
              <div>
                {form.watch("dateRange")?.from &&
                  form.watch("dateRange")?.to && (
                    <div className="text-sm">
                      <p className="text-slate-400">
                        Количество ночей:{" "}
                        {Math.ceil(
                          (form.watch("dateRange").to!.getTime() -
                            form.watch("dateRange").from!.getTime()) /
                          (1000 * 60 * 60 * 24)
                        )}
                      </p>
                      {discount > 0 ? (
                        <div>
                          <p className="text-xs text-slate-400 line-through">
                            Итого без скидки:{" "}
                            {Math.ceil(
                              (form.watch("dateRange").to!.getTime() -
                                form.watch("dateRange").from!.getTime()) /
                              (1000 * 60 * 60 * 24)
                            ) * room.price}{" "}
                            грн
                          </p>
                          <p className="text-lg font-bold text-teal-300">
                            Итого со скидкой ({discount}%):{" "}
                            {Math.round(
                              Math.ceil(
                                (form.watch("dateRange").to!.getTime() -
                                  form.watch("dateRange").from!.getTime()) /
                                (1000 * 60 * 60 * 24)
                              ) * room.price * (1 - discount / 100)
                            )}{" "}
                            грн
                          </p>
                        </div>
                      ) : (
                        <p className="text-lg font-bold text-teal-300">
                          Итого:{" "}
                          {Math.ceil(
                            (form.watch("dateRange").to!.getTime() -
                              form.watch("dateRange").from!.getTime()) /
                            (1000 * 60 * 60 * 24)
                          ) * room.price}{" "}
                          грн
                        </p>
                      )}
                    </div>
                  )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <ViewImagesButton room={room} />
                <Button
                  type="submit"
                  size="lg"
                  loading={isSubmitting}
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-bold border-0 shadow-lg shadow-orange-500/20 rounded-xl"
                >
                  Забронировать
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
