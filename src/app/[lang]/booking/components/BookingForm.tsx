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

import { useSearchParams } from "next/navigation";

const dateFnsLocales = {
  ru,
  uk,
  en: enUS,
};

type SupportedLanguage = "ru" | "uk" | "en";

interface BookingFormProps {
  rooms: Room[];
  bookings: Booking[];
  onFilterChange: (filteredRooms: Room[], guests: number) => void;
}

export default function BookingForm({
  rooms,
  bookings,
  onFilterChange,
}: BookingFormProps) {
  const { t, i18n: i18nInstance } = useTranslation();
  const searchParams = useSearchParams();
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
    dateRange: z
      .object({
        from: z.date().optional(),
        to: z.date().optional(),
      })
      .refine((data) => data && data.from && data.to, {
        message: t("selectDateRange", "Выберите диапазон дат"),
      }),
    guests: z.number().min(1, { message: t("minGuests") }).max(10),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dateRange: { from: undefined, to: undefined },
      guests: 1,
    },
  });

  useEffect(() => {
    if (!mounted) return;
    const checkin = searchParams.get("checkin");
    const checkout = searchParams.get("checkout");
    const guests = searchParams.get("guests");

    if (checkin || checkout || guests) {
      const from = checkin ? new Date(checkin) : undefined;
      const to = checkout ? new Date(checkout) : undefined;
      const parsedGuests = guests ? parseInt(guests, 10) : 1;
      const validGuests = isNaN(parsedGuests) ? 1 : parsedGuests;

       
      form.reset({
        dateRange: { from, to },
        guests: validGuests,
      });

      if (from && to && !isNaN(from.getTime()) && !isNaN(to.getTime())) {
        const maxCapacity = rooms.length > 0 ? Math.max(...rooms.map(r => r.capacity)) : 4;

        const filteredRooms = rooms.filter((room) => {
          if (validGuests <= maxCapacity) {
            if (room.capacity < validGuests) {
              return false;
            }
          }
          return isRoomAvailable(room, from, to);
        });
         
        onFilterChange(filteredRooms, validGuests);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, mounted]);

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

    const overlappingBookings = roomBookings.filter((booking) => {
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
      return datesOverlap(startDate, endDate, bookingStart, bookingEnd);
    });

    if (!room.units || room.units.length === 0) {
      return overlappingBookings.length === 0;
    }

    const bookedUnitIds = new Set(overlappingBookings.map(b => b.unitId).filter(Boolean));
    return room.units.some(unit => !bookedUnitIds.has(unit.id));
  }

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const maxCapacity = rooms.length > 0 ? Math.max(...rooms.map(r => r.capacity)) : 4;

    const filteredRooms = rooms.filter((room) => {
      if (data.guests <= maxCapacity) {
        if (room.capacity < data.guests) {
          return false;
        }
      }

      return isRoomAvailable(room, data.dateRange.from!, data.dateRange.to!);
    });

    onFilterChange(filteredRooms, data.guests);

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
    <div className="relative max-w-4xl mx-auto my-12 group">
      {/* Dynamic Background Glows */}
      <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-teal-500 via-sky-500 to-amber-400 opacity-20 blur-xl group-hover:opacity-30 transition duration-1000 group-hover:duration-2000" />
      
      <Card className="relative overflow-hidden border border-white/[0.08] bg-slate-950/60 backdrop-blur-xl rounded-[2rem] text-white shadow-2xl">
        {/* Glow corner highlights */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        
        {/* Gradient border indicator */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-500/80 via-sky-400/80 to-amber-300/80" />
        
        <CardContent className="p-8 md:p-10 pb-12 md:pb-14 relative z-10">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-end"
            >
              <div className="relative group/field">
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
              </div>
              
              {/* Custom Interactive Plus/Minus Counter for Guests */}
              <FormField
                control={form.control}
                name="guests"
                render={({ field }) => (
                  <FormItem className="flex flex-col relative">
                    <div className="text-sm font-medium leading-none text-teal-300 font-bold mb-2.5 flex items-center gap-2 tracking-wide text-xs uppercase">
                      <Users className="h-4 w-4 text-teal-400" />
                      {translate("guests", "Гости")}
                    </div>
                    <FormControl>
                      <div className="flex items-center justify-between bg-slate-950/80 border border-white/[0.06] hover:border-white/15 focus-within:border-teal-500/50 rounded-xl h-12 px-3 w-full transition-all duration-300 shadow-inner">
                        <button
                          type="button"
                          onClick={() => field.onChange(Math.max(1, field.value - 1))}
                          className="h-8 w-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-teal-500/20 text-slate-300 hover:text-teal-300 transition-all duration-300 active:scale-90"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        
                        <span className="text-lg font-black select-none text-white tracking-widest min-w-[20px] text-center">
                          {field.value}
                        </span>
                        
                        <button
                          type="button"
                          onClick={() => field.onChange(Math.min(10, field.value + 1))}
                          className="h-8 w-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-teal-500/20 text-slate-300 hover:text-teal-300 transition-all duration-300 active:scale-90"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="absolute top-full left-0 mt-1.5 z-20 text-rose-400/90 text-xs font-semibold flex items-center gap-1 bg-slate-950 border border-rose-500/30 py-1.5 px-3 rounded-lg w-max max-w-full shadow-lg shadow-black/50 animate-in fade-in slide-in-from-top-1 duration-300" />
                  </FormItem>
                )}
              />
              
              <div className="relative">
                <Button 
                  type="submit" 
                  disabled={!form.watch("dateRange")?.from || !form.watch("dateRange")?.to}
                  className="w-full h-12 bg-gradient-to-r from-teal-400 via-sky-400 to-amber-300 hover:from-teal-300 hover:via-sky-300 hover:to-amber-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100 text-slate-950 font-black border-0 shadow-lg shadow-teal-500/10 hover:shadow-teal-500/20 hover:scale-[1.02] active:scale-[0.98] rounded-xl transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider text-xs"
                >
                  <Search className="h-4 w-4 text-slate-950 stroke-[2.5]" />
                  {translate("checkAvailability", "Проверить наличие")}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
