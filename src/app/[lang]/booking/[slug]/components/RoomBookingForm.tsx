"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Users, Mail, Phone, User, Eye, Minus, Plus, Zap, Moon } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";

import { useTranslation } from "react-i18next";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const getFormSchema = (t: any) => z.object({
  unitId: z.string().min(1, { message: t("unitRequired") }),
  dateRange: z.object({
    from: z.date({
      required_error: t("dateRequired"),
    }),
    to: z.date({
      required_error: t("dateOutRequired"),
    }),
  }),
  guests: z.coerce
    .number()
    .min(1, { message: t("minGuests") }),
  name: z
    .string()
    .min(2, { message: t("nameMinLength") }),
  phone: z.string().min(10, { message: t("phoneRequired") }),
  email: z
    .string()
    .optional()
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: t("emailInvalid"),
    }),
});

type FormSchemaType = z.infer<ReturnType<typeof getFormSchema>>;

interface RoomBookingFormProps {
  room: Room;
  existingBookings: Booking[];
}

export function ViewImagesButton({ room }: { room: Room }) {
  const { t } = useTranslation();
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
        {t("viewPhotos")}
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

  // Quick Messenger booking support
  const [isQuickBookOpen, setIsQuickBookOpen] = useState(false);
  const [quickName, setQuickName] = useState("");
  const [quickPhone, setQuickPhone] = useState("");
  const [isQuickSubmitting, setIsQuickSubmitting] = useState(false);

  const quickBookTexts = {
    ru: {
      btn: "Бронь через мессенджер",
      title: "Бронирование через мессенджер",
      desc: "Оставьте ваше имя и телефон. Мы свяжемся с вами в мессенджере (Telegram/Viber) для уточнения дат и деталей бронирования.",
      nameLabel: "Имя",
      namePlaceholder: "Иван",
      phoneLabel: "Номер телефона",
      submitBtn: "Отправить заявку",
      submitting: "Отправка...",
      successTitle: "Заявка принята!",
      successDesc: "Мы свяжемся с вами в мессенджере в ближайшее время."
    },
    uk: {
      btn: "Бронь через месенджер",
      title: "Бронювання через месенджер",
      desc: "Залиште ваше ім'я та телефон. Ми зв'яжемося з вами в месенджері (Telegram/Viber) для уточнення дат та деталей бронювання.",
      nameLabel: "Ім'я",
      namePlaceholder: "Иван",
      phoneLabel: "Номер телефону",
      submitBtn: "Надіслати заявку",
      submitting: "Надсилання...",
      successTitle: "Заявка прийнята!",
      successDesc: "Ми зв'яжемося з вами в месенджері найближчим часом."
    },
    en: {
      btn: "Book via Messenger",
      title: "Messenger Booking",
      desc: "Leave your name and phone number. We will contact you via messenger (Telegram/Viber) to confirm dates and details.",
      nameLabel: "Name",
      namePlaceholder: "John",
      phoneLabel: "Phone number",
      submitBtn: "Submit Request",
      submitting: "Submitting...",
      successTitle: "Request Received!",
      successDesc: "We will contact you via messenger shortly."
    }
  };
  const qbt = quickBookTexts[lang as keyof typeof quickBookTexts] || quickBookTexts.ru;

  const handleQuickBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim() || !quickPhone.trim()) {
      toast({
        title: lang === "uk" ? "Помилка" : lang === "en" ? "Error" : "Ошибка",
        description: lang === "uk" ? "Будь ласка, заповніть всі поля" : lang === "en" ? "Please fill in all fields" : "Пожалуйста, заполните все поля",
        variant: "destructive",
      });
      return;
    }
    setIsQuickSubmitting(true);
    try {
      const res = await fetch("/api/callbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: quickName,
          phone: quickPhone,
          message: `Бронирование номера "${room.name}" (через мессенджер)`,
        }),
      });
      if (res.ok) {
        toast({
          title: qbt.successTitle,
          description: qbt.successDesc,
        });
        setIsQuickBookOpen(false);
        setQuickName("");
        setQuickPhone("");
      } else {
        throw new Error("Failed to submit request");
      }
    } catch (err) {
      console.error(err);
      toast({
        title: lang === "uk" ? "Помилка" : lang === "en" ? "Error" : "Ошибка",
        description: lang === "uk" ? "Не вдалося відправити запит" : lang === "en" ? "Failed to send request" : "Не удалось отправить запрос",
        variant: "destructive",
      });
    } finally {
      setIsQuickSubmitting(false);
    }
  };

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
          title: t("promoAppliedTitle"),
          description: t("promoAppliedDesc", { discount: data.discount }),
        });
      } else {
        setPromoError(t("promoInvalid"));
        setDiscount(0);
        setAppliedPromo("");
      }
    } catch (err) {
      console.error(err);
      setPromoError(t("promoError"));
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const isSingleUnit = room.units && room.units.length === 1;

  const { t } = useTranslation();
  
  const FormSchema = getFormSchema(t);
  
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      unitId: isSingleUnit && room.units ? room.units[0].id : "",
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
          startDate: `${data.dateRange.from.getFullYear()}-${String(data.dateRange.from.getMonth() + 1).padStart(2, '0')}-${String(data.dateRange.from.getDate()).padStart(2, '0')}`,
          endDate: `${data.dateRange.to.getFullYear()}-${String(data.dateRange.to.getMonth() + 1).padStart(2, '0')}-${String(data.dateRange.to.getDate()).padStart(2, '0')}`,
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
        throw new Error(error.message || t("bookingCreateError"));
      }

      const booking = await response.json();

      toast({
        title: t("bookingSuccessTitle"),
        description: t("bookingSuccessDesc", {
          start: format(data.dateRange.from, "dd.MM.yyyy", { locale: ru }),
          end: format(data.dateRange.to, "dd.MM.yyyy", { locale: ru })
        }),
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
        title: t("errorTitle"),
        description:
          error instanceof Error
            ? error.message
            : t("bookingCreateFail"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="shadow-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md text-white rounded-3xl">
      <CardHeader className="relative">
        <CardTitle className="text-2xl font-extrabold font-heading text-white">{t("bookingCheckoutTitle")}</CardTitle>
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
                    <FormLabel className="font-semibold text-slate-300">{t("roomUnitLabel")}</FormLabel>
                    <Select
                      value={field.value || undefined}
                      onValueChange={(val) => {
                        field.onChange(val);
                        // Reset dates if the newly selected unit is not available on current dates
                        const currentRange = form.getValues("dateRange");
                        if (currentRange?.from && currentRange?.to && val) {
                          const parseUTCAsLocal = (dInput: Date | string) => {
                            if (typeof dInput === "string") {
                              const cleanStr = dInput.split("T")[0];
                              const parts = cleanStr.split("-").map(Number);
                              if (parts.length === 3 && !parts.some(isNaN)) {
                                return new Date(parts[0], parts[1] - 1, parts[2]);
                              }
                            }
                            const d = new Date(dInput);
                            return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
                          };
                          const isBooked = existingBookings.some(b => {
                            if (b.unitId !== val) return false;
                            const bStart = parseUTCAsLocal(b.startDate);
                            const bEnd = parseUTCAsLocal(b.endDate);
                            return currentRange.from < bEnd && currentRange.to > bStart;
                          });
                          if (isBooked) {
                            form.setValue("dateRange", { from: undefined as any, to: undefined as any });
                            toast({
                              title: t("datesResetTitle"),
                              description: t("datesResetDesc"),
                              variant: "destructive",
                            });
                          }
                        }
                      }}
                      disabled={isSingleUnit}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-slate-900 border-white/10 text-white rounded-xl focus:ring-teal-500 shadow-sm h-11">
                          <SelectValue placeholder={isSingleUnit ? room.units?.[0].name : t("roomUnitPlaceholder")} />
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

            {(!room.units || room.units.length === 0 || form.watch("unitId")) && (
              <FormField
                control={form.control}
                name="dateRange"
                render={({ field }) => {
                  const selectedUnitId = form.watch("unitId");
                  const filteredBookings = existingBookings.filter(b => {
                    if (selectedUnitId) {
                      return b.unitId === selectedUnitId || !b.unitId;
                    }
                    return true;
                  });

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
                  <div className="text-sm font-medium leading-none text-teal-300 font-bold mb-2.5 flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-teal-400" />
                    {t("guestCountLabel")}
                  </div>
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
                    {t("maxGuests", { capacity: room.capacity })}
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
                    <FormLabel className="text-teal-300 font-bold mb-2">{t("nameLabel")}</FormLabel>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-400" />
                      <FormControl>
                        <Input
                          placeholder={t("namePlaceholder")}
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
                    <FormLabel className="text-teal-300 font-bold mb-2">{t("phoneLabel")}</FormLabel>
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
                    <FormLabel className="text-teal-300 font-bold mb-2">{t("emailLabel")}</FormLabel>
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
              <label className="text-sm font-bold text-teal-300">{t("promoLabel")}</label>
              <div className="flex gap-2 max-w-sm">
                <Input
                  placeholder={t("promoPlaceholder")}
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
                  {isValidatingPromo ? "..." : t("applyPromo")}
                </Button>
              </div>
              {promoError && <p className="text-xs text-rose-400">{promoError}</p>}
              {appliedPromo && <p className="text-xs text-teal-400">{t("appliedPromoText", { appliedPromo, discount })}</p>}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4 border-t border-white/5">
              <div>
                {form.watch("dateRange")?.from &&
                  form.watch("dateRange")?.to && (
                    <div className="text-sm w-full sm:min-w-[280px] bg-slate-950/60 border border-white/10 rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.3)] backdrop-blur-sm animate-fade-in-up">
                      <div className="text-slate-450 flex justify-between items-center gap-4">
                        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                          <Moon className="h-3.5 w-3.5 text-teal-400" />
                          {t("nightsCount")}
                        </span>
                        <span className="font-bold text-white text-base">
                          {Math.ceil(
                            (form.watch("dateRange").to!.getTime() -
                              form.watch("dateRange").from!.getTime()) /
                            (1000 * 60 * 60 * 24)
                          )}
                        </span>
                      </div>
                      {discount > 0 ? (
                        <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
                          <div className="text-xs text-slate-500 line-through flex justify-between gap-4">
                            <span>{t("totalWithoutDiscount")}</span>
                            <span>
                              {Math.ceil(
                                (form.watch("dateRange").to!.getTime() -
                                  form.watch("dateRange").from!.getTime()) /
                                (1000 * 60 * 60 * 24)
                              ) * room.price}{" "}
                              {t("currency")}
                            </span>
                          </div>
                          <div className="flex justify-between items-center gap-4">
                            <span className="text-slate-200 font-bold flex items-center gap-1.5">
                              {t("totalLabel")}
                              <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-bold rounded-lg px-1.5 py-0.5">
                                -{discount}%
                              </span>
                            </span>
                            <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-sky-350 to-teal-400 drop-shadow-sm">
                              {Math.round(
                                Math.ceil(
                                  (form.watch("dateRange").to!.getTime() -
                                    form.watch("dateRange").from!.getTime()) /
                                  (1000 * 60 * 60 * 24)
                                ) * room.price * (1 - discount / 100)
                              )}{" "}
                              {t("currency")}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center gap-4">
                          <span className="text-slate-200 font-bold flex items-center gap-1.5">{t("totalLabel")}</span>
                          <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-sky-350 to-teal-400 drop-shadow-sm">
                            {Math.ceil(
                              (form.watch("dateRange").to!.getTime() -
                                form.watch("dateRange").from!.getTime()) /
                              (1000 * 60 * 60 * 24)
                            ) * room.price}{" "}
                            {t("currency")}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center">
                <Dialog open={isQuickBookOpen} onOpenChange={setIsQuickBookOpen}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto border-teal-500/30 bg-teal-500/5 text-teal-300 hover:bg-teal-500/10 hover:border-teal-500/50 transition-all duration-300 rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <Zap className="h-4 w-4 fill-teal-300/20 animate-pulse text-teal-400" />
                      {qbt.btn}
                    </Button>
                  </DialogTrigger>
                  <DialogContent aria-describedby={undefined} className="bg-slate-900 border border-white/10 text-white rounded-2xl max-w-md shadow-2xl p-6">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-extrabold flex items-center gap-2 text-teal-300">
                        <Zap className="h-5 w-5 fill-teal-300/30 text-teal-400" />
                        {qbt.title}
                      </DialogTitle>
                      <DialogDescription className="text-slate-350 text-sm mt-2 leading-relaxed">
                        {qbt.desc}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleQuickBook} className="space-y-4 mt-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">{qbt.nameLabel}</label>
                        <Input
                          placeholder={qbt.namePlaceholder}
                          value={quickName}
                          onChange={(e) => setQuickName(e.target.value)}
                          required
                          className="bg-slate-950/60 border-white/10 text-white rounded-xl h-11"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">{qbt.phoneLabel}</label>
                        <Input
                          type="tel"
                          placeholder="+380..."
                          value={quickPhone}
                          onChange={(e) => setQuickPhone(e.target.value)}
                          required
                          className="bg-slate-950/60 border-white/10 text-white rounded-xl h-11"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={isQuickSubmitting}
                        className="w-full h-11 mt-2 bg-gradient-to-r from-teal-400 via-sky-400 to-sky-500 hover:from-teal-300 hover:to-sky-400 text-slate-950 font-black border-0 shadow-lg shadow-teal-500/20 rounded-xl"
                      >
                        {isQuickSubmitting ? qbt.submitting : qbt.submitBtn}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                <Button
                  type="submit"
                  size="lg"
                  loading={isSubmitting}
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-bold border-0 shadow-lg shadow-orange-500/20 rounded-xl"
                >
                  {t("bookBtn")}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
