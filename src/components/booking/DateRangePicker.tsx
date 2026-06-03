"use client";

import { format, startOfDay } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

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
  PopoverContent,
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
  label = "Даты заезда и выезда",
  className,
}: DateRangePickerProps) {
  const [isMobile, setIsMobile] = useState(false);

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
    <FormItem className={cn("flex flex-col", className)}>
      <FormLabel className="text-teal-300 font-bold mb-2">{label}</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
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
                    {format(value.from, "LLL dd, y", { locale: ru })} -{" "}
                    {format(value.to, "LLL dd, y", { locale: ru })}
                  </>
                ) : (
                  format(value.from, "LLL dd, y", { locale: ru })
                )
              ) : (
                <span>Выберите диапазон дат</span>
              )}
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-950 text-white z-50" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={{ from: value?.from, to: value?.to }}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                if (validateDateRange(range)) {
                  onChange(range);
                } else {
                  toast({
                    title: "Даты заняты",
                    description: "Выбранный диапазон дат пересекается с существующими бронированиями. Пожалуйста, выберите другие даты.",
                    variant: "destructive",
                  });
                }
              } else {
                onChange(range);
              }
            }}
            numberOfMonths={isMobile ? 1 : 2}
            disabled={isDateRangeDisabled}
            locale={ru}
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
        </PopoverContent>
      </Popover>
      <FormMessage />
      {existingBookings.length > 0 && disabledDates.length > 0 && (
        <p className="text-sm text-slate-400 mt-1">
          Занятые даты отмечены в календаре
        </p>
      )}
    </FormItem>
  );
}

