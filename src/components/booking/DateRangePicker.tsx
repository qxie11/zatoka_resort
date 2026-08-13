"use client";

import { format, startOfDay } from "date-fns";
import { ru, uk, enUS } from "date-fns/locale";
import { CalendarIcon, CheckCircle2, ArrowRight, CalendarDays } from "lucide-react";
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
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const [hoveredDate, setHoveredDate] = useState<Date | undefined>(undefined);

  const currentLang = (i18n.language || "ru").slice(0, 2);
  const activeLocale = currentLang === "uk" ? uk : currentLang === "en" ? enUS : ru;
  const activeLabel = label || t("checkInOut", "Даты заезда и выезда");

  // Calculate nights count based on selected or hovered range
  const displayRange = useMemo(() => {
    if (!value?.from) return undefined;
    if (value.to) return { from: value.from, to: value.to };
    if (hoveredDate && hoveredDate > value.from) {
      return { from: value.from, to: hoveredDate };
    }
    return { from: value.from, to: undefined };
  }, [value, hoveredDate]);

  const nightsCount = useMemo(() => {
    if (displayRange?.from && displayRange?.to) {
      const from = startOfDay(displayRange.from);
      const to = startOfDay(displayRange.to);
      const diff = Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
      return diff > 0 ? diff : 0;
    }
    return 0;
  }, [displayRange]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
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

    const parseUTCAsLocal = (dateInput: Date | string) => {
      if (typeof dateInput === "string") {
        const cleanStr = dateInput.split("T")[0];
        const parts = cleanStr.split("-").map(Number);
        if (parts.length === 3 && !parts.some(isNaN)) {
          return new Date(parts[0], parts[1] - 1, parts[2]);
        }
      }
      const d = new Date(dateInput);
      return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
    };

    existingBookings.forEach((booking) => {
      if (excludeBookingId && booking.id === excludeBookingId) return;

      const start = startOfDay(parseUTCAsLocal(booking.startDate));
      const end = startOfDay(parseUTCAsLocal(booking.endDate));

      if (end < today) return;

      let currentDate = new Date(start);
      while (currentDate < end) {
        const time = currentDate.getTime();
        bookingCounts[time] = (bookingCounts[time] || 0) + 1;
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    const disabledDatesList: Date[] = [];
    const threshold = Math.max(1, totalUnitsCount);
    for (const [timeStr, count] of Object.entries(bookingCounts)) {
      if (count >= threshold) {
        disabledDatesList.push(new Date(parseInt(timeStr)));
      }
    }

    return disabledDatesList;
  }, [existingBookings, excludeBookingId, totalUnitsCount]);

  // O(1) lookup set for disabled dates
  const disabledSet = useMemo(() => {
    const s = new Set<number>();
    for (const d of disabledDates) {
      s.add(startOfDay(d).getTime());
    }
    return s;
  }, [disabledDates]);

  const isDateDisabled = (date: Date) => {
    if (customDisabled && customDisabled(date)) return true;

    const dateStart = startOfDay(date);
    const today = startOfDay(new Date());

    if (dateStart < today) return true;

    return disabledSet.has(dateStart.getTime());
  };

  const isDateRangeDisabled = (date: Date) => {
    const dateStart = startOfDay(date);
    const today = startOfDay(new Date());

    if (dateStart < today) return true;

    if (customDisabled && customDisabled(date)) return true;

    if (value?.from && !value?.to) {
      const checkIn = startOfDay(value.from);

      if (dateStart <= checkIn) return true;

      const hasOccupiedNight = disabledDates.some((disabledDate) => {
        const disabledStart = startOfDay(disabledDate);
        return disabledStart >= checkIn && disabledStart < dateStart;
      });

      if (hasOccupiedNight) return true;

      return false;
    }

    return disabledDates.some((disabledDate) => {
      const disabledStart = startOfDay(disabledDate);
      return dateStart.getTime() === disabledStart.getTime();
    });
  };

  const validateDateRange = (range: { from?: Date; to?: Date } | undefined) => {
    if (!range?.from || !range?.to) return true;

    const start = startOfDay(range.from);
    const end = startOfDay(range.to);

    let currentDate = new Date(start);
    while (currentDate < end) {
      if (isDateDisabled(currentDate)) {
        return false;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return true;
  };

  // Pre-compute hover range dates as an array for the modifier (avoids per-cell Date allocations)
  const rangeHoverDates = useMemo(() => {
    if (!value?.from || value?.to || !hoveredDate || hoveredDate <= value.from) return [];
    const dates: Date[] = [];
    const current = new Date(startOfDay(value.from));
    current.setDate(current.getDate() + 1);
    const end = startOfDay(hoveredDate).getTime();
    while (current.getTime() <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }, [value?.from, value?.to, hoveredDate]);

  return (
    <FormItem className={cn("flex flex-col relative", popoverOpen ? "z-50" : "z-10", className)}>
      <div className="text-sm font-medium leading-none text-teal-300 font-bold mb-2.5 flex items-center gap-2 tracking-wide text-xs uppercase">
        <CalendarIcon className="h-4 w-4 text-teal-400" />
        <span>{activeLabel}</span>
      </div>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              type="button"
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-semibold bg-slate-950/90 border transition-all duration-300 rounded-xl h-12 shadow-inner px-4 group/btn",
                value?.from && value?.to
                  ? "border-teal-500/50 text-teal-300 hover:border-teal-400"
                  : value?.from
                    ? "border-amber-500/60 text-amber-300 animate-pulse hover:border-amber-400"
                    : "border-teal-500/30 text-slate-300 hover:border-teal-400/60"
              )}
            >
              {mounted ? (
                value?.from ? (
                  value.to ? (
                    <span className="text-xs sm:text-sm text-teal-300 tracking-wide font-bold flex items-center gap-1.5 truncate max-w-full min-w-0">
                      <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
                      <span className="truncate">
                        {format(value.from, "dd MMM", { locale: activeLocale })} — {format(value.to, "dd MMM", { locale: activeLocale })}
                      </span>
                      <span className="hidden sm:inline-flex ml-1 text-[11px] bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-lg shrink-0">
                        {nightsCount} {currentLang === "uk" ? (nightsCount === 1 ? "ніч" : "ночей") : (nightsCount === 1 ? "ночь" : "ночей")}
                      </span>
                    </span>
                  ) : (
                    <span className="text-xs sm:text-sm text-amber-300 tracking-wide font-bold flex items-center gap-2 truncate max-w-full min-w-0">
                      <CalendarDays className="h-4 w-4 text-amber-400 shrink-0 animate-bounce" />
                      <span className="shrink-0">{format(value.from, "dd MMM yyyy", { locale: activeLocale })}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span className="text-amber-400 font-bold truncate">
                        {currentLang === "uk" ? "Дата виїзду..." : currentLang === "en" ? "Check-out..." : "Дата выезда..."}
                      </span>
                    </span>
                  )
                ) : (
                  <span className="text-xs sm:text-sm text-slate-300 group-hover/btn:text-teal-300 transition-colors flex items-center gap-2 font-medium truncate max-w-full min-w-0">
                    <CalendarIcon className="h-4 w-4 text-teal-400 shrink-0" />
                    <span className="truncate">
                      {currentLang === "uk" ? "Виберіть дати" : currentLang === "en" ? "Select dates" : "Выберите даты"}
                    </span>
                  </span>
                )
              ) : (
                <span className="text-sm text-slate-400 opacity-0">Loading...</span>
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
            {/* Step Guidance Header Banner */}
            <div className="p-3 sm:p-4 bg-slate-900/90 border-b border-white/10 flex flex-col gap-1 text-center">
              {!value?.from ? (
                <div className="flex items-center justify-center gap-2 text-xs font-extrabold text-amber-400 uppercase tracking-wider">
                  <span className="h-5 px-2 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-[10px]">Шаг 1 из 2</span>
                  <span>{currentLang === "uk" ? "Нажмите дату ЗАЕЗДА" : currentLang === "en" ? "Click CHECK-IN date" : "Нажмите дату ЗАЕЗДА"}</span>
                </div>
              ) : !value?.to ? (
                <div className="flex items-center justify-center gap-2 text-xs font-extrabold text-orange-400 uppercase tracking-wider animate-pulse">
                  <span className="h-5 px-2 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-[10px]">Шаг 2 из 2</span>
                  <span>{currentLang === "uk" ? "Теперь нажмите дату ВЫЕЗДА" : currentLang === "en" ? "Now click CHECK-OUT date" : "Теперь нажмите дату ВЫЕЗДА"}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-xs font-extrabold text-teal-300 uppercase tracking-wider">
                  <CheckCircle2 className="h-4 w-4 text-teal-400" />
                  <span>
                    {currentLang === "uk" ? "Даты выбраны:" : currentLang === "en" ? "Dates selected:" : "Даты выбраны:"}{" "}
                    {format(value.from, "dd MMM", { locale: activeLocale })} — {format(value.to, "dd MMM", { locale: activeLocale })} ({nightsCount} {nightsCount === 1 ? "ночь" : "ночей"})
                  </span>
                </div>
              )}
            </div>

            <Calendar
              initialFocus
              mode="range"
              defaultMonth={value?.from}
              selected={value?.from ? { from: value.from, to: value.to } : undefined}
              {...(!isMobile && {
                onDayMouseEnter: (date: Date) => {
                  if (value?.from && !value?.to && date > value.from) {
                    if (validateDateRange({ from: value.from, to: date })) {
                      setHoveredDate(date);
                    } else {
                      setHoveredDate(undefined);
                    }
                  }
                },
                onDayMouseLeave: () => setHoveredDate(undefined),
              })}
              onSelect={(range, selectedDay) => {
                setHoveredDate(undefined);

                // Case 1: Both dates were already selected -> reset and start new selection with tapped date
                if (value?.from && value?.to) {
                  onChange({ from: selectedDay, to: undefined });
                  return;
                }

                // Case 2: Check-in date is already selected, picking Check-out date
                if (value?.from && !value?.to) {
                  const start = startOfDay(value.from);
                  const selected = startOfDay(selectedDay);

                  if (selected > start) {
                    const newRange = { from: value.from, to: selectedDay };
                    if (validateDateRange(newRange)) {
                      onChange(newRange);
                      setPopoverOpen(false);
                    } else {
                      toast({
                        title: t("datesOccupiedTitle"),
                        description: t("datesOccupiedDesc"),
                        variant: "destructive",
                      });
                    }
                  } else {
                    // Selected earlier or same date -> reset check-in to this date
                    onChange({ from: selectedDay, to: undefined });
                  }
                  return;
                }

                // Case 3: Initial check-in date selection
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
                } else if (range?.from) {
                  onChange({ from: range.from, to: undefined });
                } else {
                  onChange({ from: selectedDay, to: undefined });
                }
              }}
              numberOfMonths={isMobile ? 1 : 2}
              disabled={isDateRangeDisabled}
              locale={activeLocale}
              className="bg-slate-950 text-white border-0 w-full flex justify-center mx-auto"
              classNames={{
                day_range_start: "day-range-start gradient-sunset text-slate-950 font-bold rounded-l-xl rounded-r-none shadow-md z-30",
                day_range_end: "day-range-end gradient-sunset text-slate-950 font-bold rounded-r-xl rounded-l-none shadow-md z-30",
                day_range_middle: "day-range-middle !bg-none !bg-transparent text-amber-100 font-semibold rounded-none hover:!bg-amber-500/20",
                day_selected: "gradient-sunset text-slate-950 font-bold rounded-xl",
                cell: "h-9 w-9 text-center text-sm p-0 relative [&:has(.day-range-start)]:rounded-l-xl [&:has(.day-range-end)]:rounded-r-xl [&:has([aria-selected])]:bg-amber-500/15 [&:has(.day-outside)]:bg-slate-900/40 first:[&:has([aria-selected])]:rounded-l-xl last:[&:has([aria-selected])]:rounded-r-xl focus-within:relative focus-within:z-20",
              }}
              modifiers={{
                booked: disabledDates,
                rangeHover: rangeHoverDates,
              }}
              modifiersClassNames={{
                booked: "opacity-40 line-through text-slate-500 bg-slate-900/30 cursor-not-allowed",
                rangeHover: "!bg-amber-500/15 text-amber-100 font-semibold rounded-none",
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


