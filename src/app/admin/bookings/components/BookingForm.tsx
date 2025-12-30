"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Users, Mail, Phone, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import type { Booking, Room } from "@/lib/types";
import { useGetBookingsQuery } from "@/lib/api";
import { DateRangePicker } from "@/components/booking/DateRangePicker";

const bookingSchema = z.object({
  roomId: z.string().min(1, "Необходимо выбрать номер"),
  dateRange: z.object({
    from: z.date({
      required_error: "Дата заезда обязательна.",
    }).optional(),
    to: z.date({
      required_error: "Дата выезда обязательна.",
    }).optional(),
  }).refine((data) => data.from && data.to, {
    message: "Необходимо выбрать обе даты",
  }),
  name: z.string().min(1, "Имя обязательно"),
  phone: z.string().min(1, "Номер телефона обязателен"),
  email: z.string().optional().refine((val) => !val || z.string().email().safeParse(val).success, {
    message: "Неверный формат email",
  }),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (values: Omit<Booking, "id">, id?: string) => void;
  booking: Booking | null;
  rooms: Room[];
}

export default function BookingForm({
  isOpen,
  onOpenChange,
  onSubmit,
  booking,
  rooms,
}: BookingFormProps) {
  const { data: allBookings = [] } = useGetBookingsQuery();
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      roomId: "",
      dateRange: {
        from: undefined as any,
        to: undefined as any,
      },
      name: "",
      phone: "",
      email: "",
    },
  });

  useEffect(() => {
    if (booking) {
      form.reset({
        roomId: booking.roomId,
        dateRange: {
          from: new Date(booking.startDate),
          to: new Date(booking.endDate),
        },
        name: booking.name,
        phone: booking.phone,
        email: booking.email || "",
      });
    } else {
      form.reset({
        roomId: "",
        dateRange: {
          from: undefined as any,
          to: undefined as any,
        },
        name: "",
        phone: "",
        email: "",
      });
    }
  }, [booking, form, isOpen]);

  const selectedRoomId = form.watch("roomId");

  const roomBookings = useMemo(() => {
    if (!selectedRoomId) return [];
    return allBookings.filter((b: Booking) => b.roomId === selectedRoomId);
  }, [selectedRoomId, allBookings]);

  const handleFormSubmit = form.handleSubmit((data) => {
    if (!data.dateRange.from || !data.dateRange.to) {
      return;
    }
    const submissionData = {
      roomId: data.roomId,
      startDate: data.dateRange.from,
      endDate: data.dateRange.to,
      name: data.name,
      phone: data.phone,
      email: data.email || undefined,
    };
    onSubmit(submissionData, booking?.id);
  });

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {booking ? "Редактировать бронирование" : "Создать бронирование"}
          </SheetTitle>
          <SheetDescription>
            {booking
              ? "Внесите изменения в информацию о бронировании."
              : "Заполните информацию для создания нового бронирования."}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={handleFormSubmit} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="roomId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Номер</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите номер" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <DateRangePicker
                  value={field.value}
                  onChange={field.onChange}
                  existingBookings={roomBookings}
                  excludeBookingId={booking?.id}
                />
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
                        <Input placeholder="Ваше имя" className="pl-10" {...field} />
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
                        <Input placeholder="+380501234567" className="pl-10" {...field} />
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
                    <FormLabel>Email (необязательно)</FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@email.com"
                          className="pl-10"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <SheetFooter className="mt-6">
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Отмена
                </Button>
              </SheetClose>
              <Button type="submit">Сохранить</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
