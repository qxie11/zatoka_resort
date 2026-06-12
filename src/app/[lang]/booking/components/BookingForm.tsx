"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ru, uk, enUS } from "date-fns/locale";
import { Users, Minus, Plus, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import type { Room, Booking } from "@/lib/types";
import i18n from "@/lib/i18n";
import { DateRangePicker } from "@/components/booking/DateRangePicker";

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

  const FormSchema = z.object({
    dateRange: z.object({
      from: z.date({
        required_error: t("dateRequired"),
      }),
      to: z.date({
        required_error: t("dateOutRequired"),
      }),
    }),
    guests: z.number().min(1, { message: t("minGuests") }).max(10),
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
    <Card className="max-w-4xl mx-auto my-12 shadow-[0_0_50px_rgba(20,184,166,0.15)] border border-teal-500/25 bg-slate-900/60 backdrop-blur-md rounded-[2rem] text-white relative z-50 overflow-hidden">
      {/* Decorative top border wave glow */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-teal-400 via-sky-400 to-amber-300" />
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
                <DateRangePicker
                  value={field.value}
                  onChange={field.onChange}
                  label={translate("checkInOut", "Заезд / Выезд")}
                />
              )}
            />
            
            {/* Custom Interactive Plus/Minus Counter for Guests */}
            <FormField
              control={form.control}
              name="guests"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-teal-300 font-bold mb-2.5 flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-teal-400" />
                    {translate("guests", "Гости")}
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-between bg-slate-950/60 border border-white/10 rounded-xl h-12 px-2.5 w-full">
                      <button
                        type="button"
                        onClick={() => field.onChange(Math.max(1, field.value - 1))}
                        className="h-8 w-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all active:scale-95"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      
                      <span className="text-base font-extrabold select-none text-white tracking-wider">
                        {field.value}
                      </span>
                      
                      <button
                        type="button"
                        onClick={() => field.onChange(Math.min(10, field.value + 1))}
                        className="h-8 w-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all active:scale-95"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 hover:scale-[1.02] active:scale-95 text-slate-950 font-bold border-0 shadow-lg shadow-orange-500/25 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Search className="h-4.5 w-4.5 text-slate-950" />
              {translate("checkAvailability", "Проверить наличие")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
