"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { ru, uk, enUS } from "date-fns/locale";
import { CalendarIcon, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

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
import i18n from "@/lib/i18n";

const dateFnsLocales = {
  ru,
  uk,
  en: enUS,
};

type SupportedLanguage = "ru" | "uk" | "en";

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
  const { t, i18n: i18nInstance } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>("ru");

  useEffect(() => {
    setMounted(true);
    const lang = (i18nInstance.language || "ru").slice(0, 2) as SupportedLanguage;
    setCurrentLang(dateFnsLocales[lang] ? lang : "en");

    const handleLangChange = (lng: string) => {
      const detected = lng.slice(0, 2) as SupportedLanguage;
      setCurrentLang(dateFnsLocales[detected] ? detected : "en");
    };

    i18n.on("languageChanged", handleLangChange);
    return () => {
      i18n.off("languageChanged", handleLangChange);
    };
  }, [i18nInstance]);

  const activeLocale = dateFnsLocales[currentLang] || ru;

  const FormSchema = z.object({
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
  });

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
        title: t("roomsNotFoundToastTitle"),
        description: t("roomsNotFoundToastDesc"),
        variant: "destructive",
      });
    } else {
      toast({
        title: t("roomsFoundToastTitle"),
        description: t("roomsFoundToastDesc", { count: filteredRooms.length }),
      });
    }
  }

  const translate = (key: string, fallback: string) => {
    if (!mounted) return fallback;
    return t(key);
  };

  return (
    <Card className="max-w-4xl mx-auto my-12 shadow-2xl border border-white/10 glass-card-dark rounded-3xl text-white">
      <CardContent className="p-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end"
          >
            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-teal-300 font-bold mb-2">
                    {translate("checkInOut", "Заезд / Выезд")}
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal bg-slate-950/40 border-white/10 text-white hover:bg-white/10 hover:text-white transition-smooth rounded-xl h-11",
                            !field.value?.from && "text-slate-400"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-teal-400" />
                          {field.value?.from ? (
                            field.value.to ? (
                              <>
                                {format(field.value.from, "LLL dd, y", {
                                  locale: activeLocale,
                                })}{" "}
                                -{" "}
                                {format(field.value.to, "LLL dd, y", {
                                  locale: activeLocale,
                                })}
                              </>
                            ) : (
                              format(field.value.from, "LLL dd, y", {
                                locale: activeLocale,
                              })
                            )
                          ) : (
                            <span>{translate("selectDateRange", "Выберите диапазон дат")}</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-950 text-white" align="start">
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
                        locale={activeLocale}
                        className="bg-slate-950 text-white border-0"
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
                <FormItem className="flex flex-col">
                  <FormLabel className="text-teal-300 font-bold mb-2">
                    {translate("guests", "Гости")}
                  </FormLabel>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-400" />
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={translate("guestsPlaceholder", "Количество гостей")}
                        className="pl-10 bg-slate-950/40 border-white/10 focus:border-teal-400/50 text-white rounded-xl h-11"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full h-11 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 hover:opacity-90 active:scale-[0.98] text-slate-950 font-bold border-0 shadow-lg shadow-orange-500/20 rounded-xl transition-all duration-300">
              {translate("checkAvailability", "Проверить наличие")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
