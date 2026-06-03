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
      <SheetContent className="sm:max-w-[600px] overflow-y-auto bg-slate-950 border-l border-white/10 shadow-2xl text-slate-100">
        <SheetHeader className="relative pb-4 border-b border-white/10">
          <SheetTitle className="text-2xl font-bold text-white">
            {booking ? "Редактировать бронирование" : "Создать бронирование"}
          </SheetTitle>
          <SheetDescription className="text-slate-400 font-light mt-1">
            {booking
              ? "Внесите изменения в подробную информацию о бронировании гостя."
              : "Заполните необходимые данные гостя для резервирования номера."}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={handleFormSubmit} className="space-y-6 py-5 text-slate-200">
            <FormField
              control={form.control}
              name="roomId"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="font-semibold text-slate-300">Номер</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full bg-slate-900 border-white/10 text-white rounded-xl focus:ring-teal-500 shadow-sm h-11">
                        <SelectValue placeholder="Выберите номер" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-slate-900 border-white/10 text-white rounded-xl shadow-md">
                      {rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id} className="focus:bg-teal-500/20 focus:text-teal-300 rounded-lg py-2">
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
                <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/10 shadow-sm">
                  <DateRangePicker
                    value={field.value}
                    onChange={field.onChange}
                    existingBookings={roomBookings}
                    excludeBookingId={booking?.id}
                  />
                </div>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="font-semibold text-slate-300">Имя</FormLabel>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <FormControl>
                        <Input placeholder="Имя гостя" className="pl-10 bg-slate-900 border-white/10 text-white rounded-xl focus:ring-teal-500 shadow-sm h-11" {...field} />
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
                  <FormItem className="space-y-1.5">
                    <FormLabel className="font-semibold text-slate-300">Телефон</FormLabel>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <FormControl>
                        <Input placeholder="+380..." className="pl-10 bg-slate-900 border-white/10 text-white rounded-xl focus:ring-teal-500 shadow-sm h-11" {...field} />
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
                  <FormItem className="space-y-1.5">
                    <FormLabel className="font-semibold text-slate-300">Email</FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@mail.com"
                          className="pl-10 bg-slate-900 border-white/10 text-white rounded-xl focus:ring-teal-500 shadow-sm h-11"
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

            <SheetFooter className="mt-6 border-t border-white/10 pt-4 gap-2">
              <SheetClose asChild>
                <Button type="button" variant="outline" className="rounded-xl border-white/10 text-slate-300 hover:bg-white/5 h-11">
                  Отмена
                </Button>
              </SheetClose>
              <Button type="submit" className="bg-gradient-to-r from-teal-400 to-sky-500 hover:from-teal-300 hover:to-sky-400 text-slate-950 font-bold border-0 shadow-lg shadow-teal-500/20 rounded-xl px-5 h-11">Сохранить бронирование</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
