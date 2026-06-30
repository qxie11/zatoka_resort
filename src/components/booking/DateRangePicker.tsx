"use client";

import { format, startOfDay } from "date-fns";
import { ru, uk, enUS } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "@/hooks/use-toast";

import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Booking } from "@/lib/types";

interface DateRangePickerProps {
  value?: { from?: Date; to?: Date };
  onChange: (range: { from?: Date; to?: Date } | undefined) => void;
  existingBookings?: Booking[];
  excludeBookingId?: string;
  totalUnitsCount?: number;
  disabled?: (date: Date) => boolean;
  label?: string;
  className?: string;
  showBookingInstructions?: boolean;
}

export function DateRangePicker({
  value,
  onChange,
  existingBookings = [],
  excludeBookingId,
  totalUnitsCount = 1,
  disabled: customDisabled,
  label,
  className,
  showBookingInstructions = false,
}: DateRangePickerProps) {
  const { t, i18n } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const currentLang = (i18n.language || "ru").slice(0, 2);
  const activeLocale = currentLang === "uk" ? uk : currentLang === "en" ? enUS : ru;
  const activeLabel = label || t("checkInOut", "Даты заезда и выезда");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const disabledDates = useMemo(() => {
    const bookingCounts: Record<number, number> = {};
    const today = startOfDay(new Date());

    existingBookings.forEach((booking) => {
      if (excludeBookingId && booking.id === excludeBookingId) return;

      const start = startOfDay(new Date(booking.startDate));
      const end = startOfDay(new Date(booking.endDate));

      if (end < today) return;

      let currentDate = new Date(start);
      // Avoid over-counting the checkout day, but for strictness we might include it or not.
      // Usually checkout day is available for checkin. We should probably do `< end`
      while (currentDate < end) {
        const time = currentDate.getTime();
        bookingCounts[time] = (bookingCounts[time] || 0) + 1;
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    const disabledDatesList: Date[] = [];
    // Only disable if the number of overlapping bookings >= totalUnitsCount
    // If totalUnitsCount is 0 (fallback), treat as 1
    const threshold = Math.max(1, totalUnitsCount);
    for (const [timeStr, count] of Object.entries(bookingCounts)) {
      if (count >= threshold) {
        disabledDatesList.push(new Date(parseInt(timeStr)));
      }
    }

    return disabledDatesList;
  }, [existingBookings, excludeBookingId, totalUnitsCount]);

  const isDateDisabled = (date: Date) => {
    if (customDisabled && customDisabled(date)) return true;

    const dateStart = startOfDay(date);
    const today = startOfDay(new Date());

    if (dateStart < today) return true;

    return disabledDates.some((disabledDate) => {
      const disabledStart = startOfDay(disabledDate);
      return dateStart.getTime() === disabledStart.getTime();
    });
  };

  const isDateRangeDisabled = (date: Date) => {
    return isDateDisabled(date);
  };

  const validateDateRange = (range: { from?: Date; to?: Date } | undefined) => {
    if (!range?.from || !range?.to) return true;

    const start = startOfDay(range.from);
    const end = startOfDay(range.to);

    let currentDate = new Date(start);
    while (currentDate <= end) {
      if (isDateDisabled(currentDate)) {
        return false;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return true;
  };

  return (
    <FormItem className={cn("flex flex-col relative", popoverOpen ? "z-50" : "z-10", className)}>
      <FormLabel className="text-teal-300 font-bold mb-2.5 flex items-center gap-2 tracking-wide text-xs uppercase">
        <CalendarIcon className="h-4 w-4 text-teal-400" />
        {activeLabel}
      </FormLabel>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              type="button"
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-semibold bg-slate-950/80 border border-white/[0.06] hover:border-white/15 focus:border-teal-500/50 text-white hover:bg-slate-900/50 hover:text-white transition-all duration-300 rounded-xl h-12 shadow-inner px-4",
                !value?.from && "text-slate-400 font-normal"
              )}
            >
              {value?.from ? (
                value.to ? (
                  <span className="text-sm text-slate-200 tracking-wide font-bold">
                    {format(value.from, "dd MMM yyyy", { locale: activeLocale })} —{" "}
                    {format(value.to, "dd MMM yyyy", { locale: activeLocale })}
                  </span>
                ) : (
                  <span className="text-sm text-slate-200 tracking-wide font-bold">
                    {format(value.from, "dd MMM yyyy", { locale: activeLocale })}
                  </span>
                )
              ) : (
                <span className="text-sm text-slate-400">{t("selectDateRange")}</span>
              )}
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content 
            className={cn("w-auto p-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-950 text-white z-50 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2")}
            align="start"
            sideOffset={4}
            style={{ pointerEvents: "auto" }}
          >
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={value?.from}
              selected={value?.from ? { from: value.from, to: value.to } : undefined}
              onSelect={(range, selectedDay) => {
                if (value?.from && value?.to) {
                  onChange({ from: selectedDay, to: undefined });
                  return;
                }

                if (range?.from && range?.to) {
                  const start = startOfDay(range.from);
                  const end = startOfDay(range.to);
                  if (start.getTime() === end.getTime()) {
                    onChange({ from: range.from, to: undefined });
                    return;
                  }
                  if (validateDateRange(range)) {
                    onChange(range);
                    setPopoverOpen(false);
                  } else {
                    toast({
                      title: t("datesOccupiedTitle"),
                      description: t("datesOccupiedDesc"),
                      variant: "destructive",
                    });
                  }
                } else {
                  onChange(range);
                }
              }}
              numberOfMonths={isMobile ? 1 : 2}
              disabled={isDateRangeDisabled}
              locale={activeLocale}
              className="bg-slate-950 text-white border-0"
              classNames={{
                day_range_start: "day-range-start gradient-sunset text-slate-950 font-bold rounded-xl shadow-md z-30",
                day_range_end: "day-range-end gradient-sunset text-slate-950 font-bold rounded-xl shadow-md z-30",
                day_range_middle: "day-range-middle !bg-none !bg-transparent text-amber-100 font-semibold rounded-none hover:!bg-amber-500/20",
                day_selected: "gradient-sunset text-slate-950 font-bold rounded-xl",
                cell: "h-9 w-9 text-center text-sm p-0 relative [&:has(.day-range-start)]:rounded-l-xl [&:has(.day-range-end)]:rounded-r-xl [&:has([aria-selected])]:bg-amber-500/15 [&:has(.day-outside)]:bg-slate-900/40 first:[&:has([aria-selected])]:rounded-l-xl last:[&:has([aria-selected])]:rounded-r-xl focus-within:relative focus-within:z-20",
              }}
              modifiers={{
                booked: disabledDates,
              }}
              modifiersClassNames={{
                booked: "opacity-40 line-through text-slate-500 bg-slate-900/30 cursor-not-allowed",
              }}
            />
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </Popover>
      {showBookingInstructions && (
        <p className="text-sm text-slate-400 mt-2 bg-slate-900/40 border border-white/5 p-3 rounded-xl leading-relaxed">
          {t("bookedDatesMarked")}
        </p>
      )}
    </FormItem>
  );
}


