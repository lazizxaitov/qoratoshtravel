"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type DateRangePickerProps = {
  startDate: string;
  endDate: string;
  onChange: (startDate: string, endDate: string) => void;
  locale: string;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  resetLabel?: string;
  availableDates?: Set<string>;
  onMonthChange?: (viewDate: Date) => void;
};

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function toISODate(value: Date) {
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(
    value.getDate()
  )}`;
}

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: Date[] = [];

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    days.push(new Date(year, month, day));
  }

  return { firstDay, days };
}

export default function DateRangePicker({
  startDate,
  endDate,
  onChange,
  locale,
  placeholder,
  className,
  buttonClassName,
  resetLabel = "Reset",
  availableDates,
  onMonthChange,
}: DateRangePickerProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const start = useMemo(
    () => (startDate ? new Date(startDate) : null),
    [startDate]
  );
  const end = useMemo(() => (endDate ? new Date(endDate) : null), [endDate]);
  const [viewDate, setViewDate] = useState<Date>(start ?? new Date());

  useEffect(() => {
    if (onMonthChange) {
      onMonthChange(viewDate);
    }
  }, [onMonthChange, viewDate]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!rootRef.current) {
        return;
      }
      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "short",
      }),
    [locale]
  );

  const monthFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        month: "long",
        year: "numeric",
      }),
    [locale]
  );

  const weekdays = useMemo(() => {
    const base = new Date(2024, 0, 1);
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(base);
      date.setDate(base.getDate() + index);
      return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(date);
    });
  }, [locale]);

  const { firstDay, days } = getMonthDays(
    viewDate.getFullYear(),
    viewDate.getMonth()
  );
  const startOffset = (firstDay.getDay() + 6) % 7;

  const displayValue =
    start && end
      ? `${formatter.format(start)} - ${formatter.format(end)}`
      : start
      ? formatter.format(start)
      : placeholder;

  return (
    <div ref={rootRef} className={`relative ${className ?? ""}`}>
      <button
        type="button"
        className={`flex w-full items-center justify-between rounded-xl bg-transparent text-sm font-semibold text-white ${buttonClassName ?? ""}`}
        onClick={() => {
          setViewDate(start ?? new Date());
          setOpen((prev) => !prev);
        }}
      >
        <span className={start ? "" : "text-white/70"}>{displayValue}</span>
        <span className="text-white/60">▾</span>
      </button>
      <div
        className={`absolute left-0 top-full z-20 mt-2 w-72 origin-top rounded-2xl border border-black/10 bg-white p-3 text-[var(--ink-900)] shadow-lg transition-all duration-200 ease-out ${
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="rounded-full bg-[var(--brand-100)] px-2 py-1 text-xs text-[var(--brand-700)]"
            onClick={() =>
              setViewDate(
                new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)
              )
            }
          >
            {"<"}
          </button>
          <div className="text-sm font-semibold">
            {monthFormatter.format(viewDate)}
          </div>
          <button
            type="button"
            className="rounded-full bg-[var(--brand-100)] px-2 py-1 text-xs text-[var(--brand-700)]"
            onClick={() =>
              setViewDate(
                new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)
              )
            }
          >
            {">"}
          </button>
        </div>
        <div className="mt-3 grid grid-cols-7 text-center text-[10px] uppercase tracking-[0.18em] text-[var(--ink-700)]">
          {weekdays.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1 text-center text-sm">
          {Array.from({ length: startOffset }).map((_, index) => (
            <div key={`empty-${index}`} />
          ))}
          {days.map((day) => {
            const dayValue = toISODate(day);
            const isSelectedStart = startDate === dayValue;
            const isSelectedEnd = endDate === dayValue;
            const isInRange =
              startDate &&
              endDate &&
              dayValue > startDate &&
              dayValue < endDate;
            const isToday = toISODate(new Date()) === dayValue;
            const isUnavailable = availableDates
              ? !availableDates.has(dayValue)
              : false;
            const isDisabled = isUnavailable;

            return (
              <button
                key={dayValue}
                type="button"
                className={`rounded-lg px-2 py-1 ${
                  isSelectedStart || isSelectedEnd
                    ? "bg-[var(--brand-700)] text-white"
                    : isDisabled
                    ? "cursor-not-allowed bg-rose-50/70 text-rose-500"
                    : isInRange
                    ? "bg-[var(--brand-100)] text-[var(--brand-700)]"
                    : isToday
                    ? "border border-[var(--brand-700)] text-[var(--brand-700)]"
                    : "text-[var(--ink-900)] hover:bg-[var(--brand-100)]"
                }`}
                onClick={() => {
                  if (isDisabled) {
                    return;
                  }
                  if (!startDate || (startDate && endDate)) {
                    onChange(dayValue, "");
                    return;
                  }
                  if (dayValue < startDate) {
                    onChange(dayValue, "");
                    return;
                  }
                  onChange(startDate, dayValue);
                  setOpen(false);
                }}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          className="mt-3 w-full rounded-xl bg-[var(--brand-100)] px-3 py-2 text-xs font-semibold text-[var(--brand-700)]"
          onClick={() => onChange("", "")}
        >
          {resetLabel}
        </button>
      </div>
    </div>
  );
}
