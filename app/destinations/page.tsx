"use client";

import { useEffect, useMemo, useState } from "react";
import DateRangePicker from "../../components/DateRangePicker";
import Select, { type SelectOption } from "../../components/Select";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import { useContent } from "../../lib/useContent";
import { useTours } from "../../lib/useTours";
import { defaultLang, languages, type Lang } from "../content";

export default function DestinationsPage() {
  const contentData = useContent();
  const [lang, setLang] = useState<Lang>(defaultLang);
  const { tours } = useTours(lang);
  const [filters, setFilters] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    adults: "",
    nights: "",
  });
  const [availableDates, setAvailableDates] = useState<Set<string> | null>(
    null
  );
  const [highlightDates, setHighlightDates] = useState<Set<string> | null>(
    null
  );
  const [calendarMonth, setCalendarMonth] = useState<Date>(() => new Date());
  const locale = contentData[lang];
  const peopleUnit = locale.search.peopleUnit ?? "";
  const tourCards = useMemo(
    () =>
      tours.map((tour) => ({
        id: tour.id,
        title: tour.title,
        country: tour.country,
        city: tour.city || tour.country,
        price: `${locale.search.priceFrom} ${tour.price_from}$`,
        days: `${tour.nights} ${locale.search.nightsLabel}`,
        image: tour.image_url,
        people: `${tour.adults_min}-${tour.adults_max}`,
        adultsMin: tour.adults_min,
        adultsMax: tour.adults_max,
        startDate: tour.start_date,
        endDate: tour.end_date,
      })),
    [locale.search.nightsLabel, locale.search.priceFrom, tours]
  );
  useEffect(() => {
    const saved = window.localStorage.getItem("qoratosh-lang");
    if (
      saved &&
      Object.prototype.hasOwnProperty.call(languages, saved)
    ) {
      setLang(saved as Lang);
    }
  }, []);
  const handleLangChange = (next: Lang) => {
    setLang(next);
    window.localStorage.setItem("qoratosh-lang", next);
  };
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const query = new URLSearchParams(window.location.search).get("query");
    if (query) {
      setFilters((prev) => ({ ...prev, destination: query }));
    }
  }, []);
  const allLabel = lang === "uz" ? "Barchasi" : lang === "en" ? "All" : "Все";
  const destinationAllLabel =
    lang === "uz"
      ? "Barcha yo'nalishlar"
      : lang === "en"
      ? "All destinations"
      : "Все направления";
  const adultsOptions: SelectOption[] = [
    { value: "", label: allLabel },
    ...["1", "2", "3", "4", "5", "6"].map((value) => ({
      value,
      label: value,
    })),
  ];
  const destinationOptions: SelectOption[] = [
    { value: "", label: destinationAllLabel },
    ...Array.from(
      new Map(
        tourCards
          .map((tour) => (tour.country || "").trim())
          .filter(Boolean)
          .map((country) => [country, { value: country, label: country }])
      ).values()
    ),
  ];
  const hasCustomDestination =
    filters.destination &&
    !destinationOptions.some((option) => option.value === filters.destination);
  if (hasCustomDestination) {
    destinationOptions.unshift({
      value: filters.destination,
      label: filters.destination,
    });
  }
  const maxNights = useMemo(() => {
    return tourCards.reduce((maxValue, tour) => {
      const nightsValue = Number.parseInt(
        String(tour.days).match(/\d+/)?.[0] ?? "0",
        10
      );
      return Math.max(maxValue, Number.isNaN(nightsValue) ? 0 : nightsValue);
    }, 0);
  }, [tourCards]);
  const nightsOptions: SelectOption[] = [
    { value: "", label: allLabel },
    ...Array.from({ length: maxNights }, (_, index) => {
      const value = String(index + 1);
      return { value, label: value };
    }),
  ];

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();
    const start = new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth(),
      1
    );
    const end = new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth() + 1,
      0
    );
    const toISO = (value: Date) =>
      `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(value.getDate()).padStart(2, "0")}`;
    const params = new URLSearchParams({
      startDate: toISO(start),
      endDate: toISO(end),
    });
    params.set("lang", lang);
    if (filters.destination) {
      params.set("destination", filters.destination);
    }
    if (filters.adults) {
      params.set("adults", filters.adults);
    }

    setAvailableDates(null);
    setHighlightDates(null);
    fetch(`/api/tours?${params.toString()}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((data) => {
        if (!isActive) {
          return;
        }
        const nextSet = new Set<string>();
        const items = Array.isArray(data?.items) ? data.items : [];
        items.forEach((tour: { start_date?: string }) => {
          if (!tour.start_date) {
            return;
          }
          const startDate = new Date(tour.start_date);
          if (Number.isNaN(startDate.getTime())) {
            return;
          }
          if (startDate >= start && startDate <= end) {
            nextSet.add(toISO(startDate));
          }
        });
        setAvailableDates(nextSet);
        setHighlightDates(nextSet);
      })
      .catch((error) => {
        if (error?.name === "AbortError") {
          return;
        }
        setAvailableDates(new Set());
        setHighlightDates(new Set());
      });

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [calendarMonth, filters.destination, filters.adults, lang]);

  const filteredTours = useMemo(() => {
    const normalized = filters.destination.trim().toLowerCase();
    return tourCards.filter((tour) => {
      const country = tour.country.toLowerCase();
      const matchesText = !normalized || country.includes(normalized);
      const nightsValue = Number.parseInt(
        String(tour.days).match(/\d+/)?.[0] ?? "",
        10
      );
      const matchesNights = filters.nights
        ? nightsValue === Number(filters.nights)
        : true;
      const matchesDates = filters.startDate
        ? Boolean(
            tour.startDate &&
              tour.endDate &&
              tour.startDate <= filters.startDate &&
              tour.endDate >= (filters.endDate || filters.startDate)
          )
        : true;
      const matchesAdults = filters.adults
        ? "adultsMin" in tour &&
          "adultsMax" in tour &&
          typeof tour.adultsMin === "number" &&
          typeof tour.adultsMax === "number" &&
          Number(filters.adults) >= tour.adultsMin &&
          Number(filters.adults) <= tour.adultsMax
        : true;
      return matchesText && matchesNights && matchesAdults && matchesDates;
    });
  }, [filters.destination, filters.nights, filters.adults, tourCards]);

  return (
    <div className="text-[15px] text-[var(--ink-700)]">
      <SiteHeader
        locale={locale}
        lang={lang}
        languages={languages}
        onLangChange={handleLangChange}
      />
      <main className="mx-auto w-full max-w-6xl px-6 pb-24">
        <section className="mt-10">
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand-700)]">
              {locale.destinations.label}
            </div>
            <h1 className="font-display text-3xl font-semibold text-[var(--ink-900)] sm:text-4xl">
              {locale.destinations.title}
            </h1>
          </div>

          <div className="mt-6">
            <div className="w-full rounded-[22px] border-2 border-[var(--brand-700)] bg-[var(--brand-700)] px-6 py-5 text-white shadow">
                <div className="grid gap-4 md:grid-cols-[2fr_1.8fr_0.9fr_0.9fr] md:items-end">
                <div className="flex h-[66px] flex-col justify-between text-[10px] uppercase tracking-[0.08em] text-white/70">
                  <label className="text-[10px] uppercase tracking-[0.08em] text-white/70">
                    {locale.search.destinationLabel}
                  </label>
                  <Select
                    value={filters.destination}
                    options={destinationOptions}
                    placeholder={locale.search.destinationPlaceholder}
                    onChange={(value) =>
                      setFilters((prev) => ({ ...prev, destination: value }))
                    }
                    buttonClassName="h-10 py-2"
                  />
                </div>
                <div className="flex h-[66px] flex-col justify-between text-[10px] uppercase tracking-[0.08em] text-white/70">
                  {locale.search.dateLabel}
                  <div>
                    <DateRangePicker
                      startDate={filters.startDate}
                      endDate={filters.endDate}
                      onChange={(startValue, endValue) =>
                        setFilters((prev) => ({
                          ...prev,
                          startDate: startValue,
                          endDate: endValue,
                        }))
                      }
                      locale={
                        lang === "uz" ? "uz-UZ" : lang === "en" ? "en-US" : "ru-RU"
                      }
                      placeholder={locale.search.dateValue}
                      buttonClassName="h-10 px-3"
                      resetLabel={locale.search.resetLabel}
                      availableDates={availableDates ?? undefined}
                      highlightDates={highlightDates ?? undefined}
                      onMonthChange={setCalendarMonth}
                    />
                  </div>
                </div>
                <div className="flex h-[66px] flex-col justify-between text-[10px] uppercase tracking-[0.08em] text-white/70">
                  {locale.search.adultsLabel}
                  <div>
                    <Select
                      value={filters.adults}
                      options={adultsOptions}
                      onChange={(value) =>
                        setFilters((prev) => ({ ...prev, adults: value }))
                      }
                      buttonClassName="h-10 py-2"
                    />
                  </div>
                </div>
                <div className="flex h-[66px] flex-col justify-between text-[10px] uppercase tracking-[0.08em] text-white/70">
                  {locale.search.nightsLabel}
                  <div>
                    <Select
                      value={filters.nights}
                      options={nightsOptions}
                      onChange={(value) =>
                        setFilters((prev) => ({ ...prev, nights: value }))
                      }
                      buttonClassName="h-10 py-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTours.map((tour) => (
              <a
                key={tour.id}
                href={`/tours/${tour.id}`}
                className="overflow-hidden rounded-3xl border border-[var(--brand-100)] bg-white shadow-[var(--shadow-soft)] transition hover:border-[var(--brand-200)] hover:bg-white/95"
              >
                <div className="relative h-56">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[var(--brand-700)]">
                    {tour.days}
                  </span>
                </div>
                <div className="space-y-3 p-5">
                  <div className="text-xs uppercase tracking-[0.08em] text-[var(--ink-700)]">
                    {tour.city}
                  </div>
                  <div className="font-display text-2xl font-semibold text-[var(--ink-900)]">
                    {tour.title}
                  </div>
                  {tour.people ? (
                    <div className="text-xs text-[var(--ink-600)]">
                      {locale.search.peopleLabel}: {tour.people} {peopleUnit}
                    </div>
                  ) : null}
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-[var(--brand-700)]">
                      {tour.price}
                    </span>
                    <span className="rounded-full bg-[var(--brand-700)] px-4 py-2 text-xs font-semibold text-white">
                      {locale.hot.detailsButton}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {filteredTours.length === 0 && (
            <div className="mt-10 rounded-3xl border border-dashed border-[var(--brand-200)] bg-white/80 p-6 text-sm text-[var(--ink-600)]">
              {locale.search.empty}
            </div>
          )}
        </section>
      </main>
      <SiteFooter locale={locale.footer} />
    </div>
  );
}
