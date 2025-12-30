"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Room, Booking } from "@/lib/types";

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
});

interface BookingFormProps {
  rooms: Room[];
  bookings: Booking[];
  onFilterChange: (filteredRooms: Room[]) => void;
}

export default function BookingForm({
  rooms,
  bookings,
  onFilterChange,
}: BookingFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      guests: 1,
    },
  });

  function datesOverlap(
    start1: Date,
    end1: Date,
    start2: Date,
    end2: Date
  ): boolean {
    return start1 < end2 && start2 < end1;
  }

  function isRoomAvailable(
    room: Room,
    startDate: Date,
    endDate: Date
  ): boolean {
    const roomBookings = bookings.filter((b) => b.roomId === room.id);

    const hasOverlap = roomBookings.some((booking) => {
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
      return datesOverlap(startDate, endDate, bookingStart, bookingEnd);
    });

    return !hasOverlap;
  }

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const filteredRooms = rooms.filter((room) => {
      if (room.capacity < data.guests) {
        return false;
      }

      return isRoomAvailable(room, data.dateRange.from, data.dateRange.to);
    });

    onFilterChange(filteredRooms);

    if (filteredRooms.length === 0) {
      toast({
        title: "Номера не найдены",
        description:
          "К сожалению, на выбранные даты нет доступных номеров с подходящей вместимостью.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Найдено номеров",
        description: `Найдено ${filteredRooms.length} доступных номеров на выбранные даты.`,
      });
    }
  }

  return (
    <Card className="max-w-4xl mx-auto my-12 shadow-gentle border-0 bg-white/90 backdrop-blur-sm">
      <CardContent className="p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
          >
            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Заезд / Выезд</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value?.from && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value?.from ? (
                            field.value.to ? (
                              <>
                                {format(field.value.from, "LLL dd, y", {
                                  locale: ru,
                                })}{" "}
                                -{" "}
                                {format(field.value.to, "LLL dd, y", {
                                  locale: ru,
                                })}
                              </>
                            ) : (
                              format(field.value.from, "LLL dd, y", {
                                locale: ru,
                              })
                            )
                          ) : (
                            <span>Выберите диапазон дат</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={field.value?.from}
                        selected={{
                          from: field.value?.from,
                          to: field.value?.to,
                        }}
                        onSelect={field.onChange}
                        numberOfMonths={2}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        locale={ru}
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="guests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Гости</FormLabel>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Количество гостей"
                        className="pl-10"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full md:w-auto">
              Проверить наличие
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
