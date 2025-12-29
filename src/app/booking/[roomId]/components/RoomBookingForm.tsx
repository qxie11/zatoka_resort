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
        className="flex-1 sm:flex-none"
      >
        <Eye className="mr-2 h-4 w-4" />
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

      // Перенаправляем на страницу успеха или обратно к списку номеров
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
    <Card className="shadow-lg border-2">
      <CardHeader>
        <CardTitle className="text-2xl">Оформление бронирования</CardTitle>
      </CardHeader>
      <CardContent>
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
                  <FormLabel>Количество гостей</FormLabel>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Количество гостей"
                        className="pl-10"
                        min={1}
                        max={room.capacity}
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <p className="text-sm text-muted-foreground">
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
                    <FormLabel>Имя</FormLabel>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input
                          placeholder="Ваше имя"
                          className="pl-10"
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
                    <FormLabel>Телефон</FormLabel>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input
                          placeholder="+380501234567"
                          className="pl-10"
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
                    <FormLabel>Email</FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@email.com"
                          className="pl-10"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4 border-t">
              <div>
                {form.watch("dateRange")?.from &&
                  form.watch("dateRange")?.to && (
                    <div className="text-sm">
                      <p className="text-muted-foreground">
                        Количество ночей:{" "}
                        {Math.ceil(
                          (form.watch("dateRange").to!.getTime() -
                            form.watch("dateRange").from!.getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}
                      </p>
                      <p className="text-lg font-bold text-primary">
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
              <div className="flex gap-3 w-full sm:w-auto">
                <ViewImagesButton room={room} />
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none"
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
