"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Users, Mail, Phone, User, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
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
import type { Room, Booking } from "@/lib/types";
import { DateRangePicker } from "@/components/booking/DateRangePicker";

const FormSchema = z.object({
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      guests: 1,
      name: "",
      phone: "",
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId: room.id,
          startDate: data.dateRange.from.toISOString(),
          endDate: data.dateRange.to.toISOString(),
          name: data.name,
          phone: data.phone,
          email: data.email || undefined,
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

      router.push("/booking?success=true");
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
            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <DateRangePicker
                  value={field.value}
                  onChange={field.onChange}
                  existingBookings={existingBookings}
                />
              )}
            />

            <FormField
              control={form.control}
              name="guests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-300 font-bold mb-2">Количество гостей</FormLabel>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-400" />
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Количество гостей"
                        className="pl-10 bg-slate-950/40 border-white/10 focus:border-teal-400/50 text-white rounded-xl h-11"
                        min={1}
                        max={room.capacity}
                        {...field}
                      />
                    </FormControl>
                  </div>
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
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                      <p className="text-lg font-bold text-teal-300">
                        Итого:{" "}
                        {Math.ceil(
                          (form.watch("dateRange").to!.getTime() -
                            form.watch("dateRange").from!.getTime()) /
                            (1000 * 60 * 60 * 24)
                        ) * room.price}{" "}
                        грн
                      </p>
                    </div>
                  )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <ViewImagesButton room={room} />
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-bold border-0 shadow-lg shadow-orange-500/20 rounded-xl"
                >
                  {isSubmitting ? "Отправка..." : "Забронировать"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
