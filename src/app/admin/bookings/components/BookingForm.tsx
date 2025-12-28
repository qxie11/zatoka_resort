"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Booking, Room } from "@/lib/types";

const bookingSchema = z.object({
  roomId: z.string().min(1, "Необходимо выбрать номер"),
  dateRange: z.object({
    from: z.date({ required_error: "Дата заезда обязательна." }),
    to: z.date({ required_error: "Дата выезда обязательна." }),
  }).refine((data) => data.from < data.to, {
    message: "Дата выезда должна быть позже даты заезда.",
    path: ["to"],
  }),
  name: z.string().min(1, "Имя обязательно"),
  phone: z.string().min(1, "Номер телефона обязателен"),
  email: z.string().email("Неверный формат email"),
});

type BookingFormValues = {
    roomId: string;
    dateRange: {
        from: Date;
        to: Date;
    };
    name: string;
    phone: string;
    email: string;
}

interface BookingFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (values: Omit<Booking, 'id'>, id?: string) => void;
  booking: Booking | null;
  rooms: Room[];
}

export default function BookingForm({ isOpen, onOpenChange, onSubmit, booking, rooms }: BookingFormProps) {
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
        roomId: '',
        dateRange: {
            from: new Date(),
            to: new Date(new Date().setDate(new Date().getDate() + 1)),
        },
        name: '',
        phone: '',
        email: '',
    }
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
          email: booking.email,
      });
    } else {
      form.reset({
        roomId: '',
        dateRange: {
            from: new Date(),
            to: new Date(new Date().setDate(new Date().getDate() + 1)),
        },
        name: '',
        phone: '',
        email: '',
      });
    }
  }, [booking, form, isOpen]);

  const handleFormSubmit = form.handleSubmit((data) => {
    const submissionData = {
        roomId: data.roomId,
        startDate: data.dateRange.from,
        endDate: data.dateRange.to,
        name: data.name,
        phone: data.phone,
        email: data.email,
    };
    onSubmit(submissionData, booking?.id);
  });

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[525px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{booking ? "Редактировать бронирование" : "Создать бронирование"}</SheetTitle>
          <SheetDescription>
            {booking ? "Внесите изменения в информацию о бронировании." : "Заполните информацию для создания нового бронирования."}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleFormSubmit} className="grid gap-4 py-4">
           <div className="grid gap-2">
                <Label htmlFor="roomId">Номер</Label>
                <Select
                  value={form.watch("roomId")}
                  onValueChange={(value) => form.setValue("roomId", value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Выберите номер" />
                    </SelectTrigger>
                    <SelectContent>
                        {rooms.map((room) => (
                            <SelectItem key={room.id} value={room.id}>
                                {room.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {form.formState.errors.roomId && <p className="text-sm text-destructive">{form.formState.errors.roomId.message}</p>}
            </div>
            <div className="grid gap-2">
                <Label>Даты</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !form.watch("dateRange.from") && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {form.watch("dateRange.from") ? (
                            form.watch("dateRange.to") ? (
                              <>
                                {format(form.watch("dateRange.from"), "LLL dd, y", { locale: ru })} -{" "}
                                {format(form.watch("dateRange.to"), "LLL dd, y", { locale: ru })}
                              </>
                            ) : (
                              format(form.watch("dateRange.from"), "LLL dd, y", { locale: ru })
                            )
                          ) : (
                            <span>Выберите диапазон</span>
                          )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={form.watch("dateRange.from")}
                        selected={form.watch("dateRange")}
                        onSelect={(range) => {
                          if (range?.from && range?.to) {
                            form.setValue("dateRange", { from: range.from, to: range.to });
                          }
                        }}
                        numberOfMonths={1}
                        locale={ru}
                      />
                    </PopoverContent>
                  </Popover>
                  {form.formState.errors.dateRange?.from && <p className="text-sm text-destructive">{form.formState.errors.dateRange.from.message}</p>}
                  {form.formState.errors.dateRange?.to && <p className="text-sm text-destructive">{form.formState.errors.dateRange.to.message}</p>}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="name">Имя гостя</Label>
                <Input 
                  id="name" 
                  {...form.register("name")} 
                  placeholder="Введите имя"
                />
                {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="phone">Номер телефона</Label>
                <Input 
                  id="phone" 
                  {...form.register("phone")} 
                  placeholder="+380501234567"
                  type="tel"
                />
                {form.formState.errors.phone && <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  {...form.register("email")} 
                  placeholder="example@email.com"
                  type="email"
                />
                {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
            </div>
             <SheetFooter className="mt-4">
                <SheetClose asChild>
                    <Button type="button" variant="outline">Отмена</Button>
                </SheetClose>
                <Button type="submit">Сохранить</Button>
            </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
