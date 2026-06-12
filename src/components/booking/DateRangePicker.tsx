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
  disabled?: (date: Date) => boolean;
  label?: string;
  className?: string;
}

export function DateRangePicker({
  value,
  onChange,
  existingBookings = [],
  excludeBookingId,
  disabled: customDisabled,
  label,
  className,
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
    const disabledDatesList: Date[] = [];
    const today = startOfDay(new Date());

    existingBookings.forEach((booking) => {
      if (excludeBookingId && booking.id === excludeBookingId) return;

      const start = startOfDay(new Date(booking.startDate));
      const end = startOfDay(new Date(booking.endDate));

      if (end < today) return;

      let currentDate = new Date(start);
      while (currentDate <= end) {
        disabledDatesList.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    return disabledDatesList;
  }, [existingBookings, excludeBookingId]);

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
      <FormLabel className="text-teal-300 font-bold mb-2">{activeLabel}</FormLabel>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              type="button"
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal bg-slate-950/40 border-white/10 text-white hover:bg-white/10 hover:text-white transition-smooth rounded-xl h-11",
                !value?.from && "text-slate-400"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-teal-400" />
              {value?.from ? (
                value.to ? (
                  <>
                    {format(value.from, "LLL dd, y", { locale: activeLocale })} -{" "}
                    {format(value.to, "LLL dd, y", { locale: activeLocale })}
                  </>
                ) : (
                  format(value.from, "LLL dd, y", { locale: activeLocale })
                )
              ) : (
                <span>{t("selectDateRange", "Выберите диапазон дат")}</span>
              )}
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content 
            className={cn("w-auto p-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-950 text-white z-50 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2")}
            align="start"
            sideOffset={4}
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
                      title: t("datesOccupiedTitle", "Даты заняты"),
                      description: t("datesOccupiedDesc", "Выбранный диапазон дат пересекается с существующими бронированиями. Пожалуйста, выберите другие даты."),
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
                day_selected: "gradient-sunset text-slate-950 font-bold shadow-md rounded-lg",
              }}
              modifiers={{
                booked: disabledDates,
              }}
              modifiersClassNames={{
                booked: "gradient-sunset text-slate-950 font-bold rounded-lg",
              }}
            />
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </Popover>
      <FormMessage />
      {existingBookings.length > 0 && disabledDates.length > 0 && (
        <p className="text-sm text-slate-400 mt-1">
          {t("bookedDatesMarked", "Занятые даты отмечены в календаре")}
        </p>
      )}
    </FormItem>
  );
}


