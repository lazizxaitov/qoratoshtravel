"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import SiteFooter from "../../../components/SiteFooter";
import SiteHeader from "../../../components/SiteHeader";
import { useContent } from "../../../lib/useContent";
import { useTours } from "../../../lib/useTours";
import { defaultLang, languages, type Lang } from "../../content";

export default function TourPage() {
  const contentData = useContent();
  const [lang, setLang] = useState<Lang>(defaultLang);
  const { tours } = useTours(lang);
  const params = useParams<{ id: string }>();
  const rawTourId = params?.id ?? "";
  const tourId = useMemo(() => {
    if (!rawTourId) return "";
    try {
      return decodeURIComponent(rawTourId);
    } catch {
      return rawTourId;
    }
  }, [rawTourId]);
  const locale = contentData[lang];
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: "",
    lastName: "",
    phone: "",
    comment: "",
  });
  const [leadStatus, setLeadStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle"
  );
  const [leadErrorDetail, setLeadErrorDetail] = useState("");
  const peopleUnit = locale.search.peopleUnit ?? "";
  const formatPeopleRange = (min: number, max: number) =>
    min === max ? `${min}` : `${min}-${max}`;
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
    if (!isConsultationOpen) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsConsultationOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isConsultationOpen]);
  const leadStatusLabel =
    lang === "uz"
      ? "So'rov yuborildi. Biz tez orada bog'lanamiz."
      : lang === "en"
      ? "Request sent. We will contact you soon."
      : "Заявка отправлена. Мы свяжемся с вами.";
  const leadErrorLabel =
    lang === "uz"
      ? "Xatolik. Qayta urinib ko'ring."
      : lang === "en"
      ? "Error. Please try again."
      : "Ошибка. Попробуйте еще раз.";

  const handleLeadSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (leadStatus === "sending") {
      return;
    }
    setLeadStatus("sending");
    setLeadErrorDetail("");
    const tourLink =
      typeof window !== "undefined"
        ? `${window.location.origin}/tours/${encodeURIComponent(tourId)}`
        : undefined;
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "tour",
          lang,
          name: leadForm.name,
          lastName: leadForm.lastName,
          phone: leadForm.phone,
          comment: leadForm.comment,
          tourId: tourId || undefined,
          tourTitle: title,
          tourLink,
        }),
      });
      if (!response.ok) {
        const text = await response.text();
        let detail = text;
        try {
          const data = JSON.parse(text);
          if (typeof data?.error === "string") {
            detail = data.error;
          } else if (typeof data?.message === "string") {
            detail = data.message;
          }
        } catch {}
        setLeadErrorDetail(detail ? ` (${detail})` : "");
        throw new Error("Request failed");
      }
      setLeadStatus("success");
      setLeadForm({ name: "", lastName: "", phone: "", comment: "" });
    } catch {
      setLeadStatus("error");
    }
  };
  const [tourSlideIndex, setTourSlideIndex] = useState(0);
  const [calendarMonth, setCalendarMonth] = useState<Date>(() => new Date());
  const [tourRange, setTourRange] = useState<{ start: string; end: string } | null>(
    null
  );

  const tour = useMemo(() => {
    const localTours = (locale.tours as unknown as Array<{
      id: string;
      title: string;
      city: string;
      price?: string;
      days?: string;
      image?: string;
      people?: string;
    }>) ?? [];
    const localHotTours = (locale.hotTours as unknown as Array<{
      id: string;
      title: string;
      city: string;
      price?: string;
      badge?: string;
      people?: string;
    }>) ?? [];
    return (
      tours.find((item) => item.id === tourId) ??
      localTours.find((item) => item.id === tourId) ??
      localHotTours.find((item) => item.id === tourId) ??
      null
    );
  }, [locale.hotTours, locale.tours, tourId, tours]);

  const title = tour?.title ?? "Tour";
  const city = tour?.city ?? "";
  const price =
    "price_from" in (tour ?? {})
      ? `${locale.search.priceFrom} ${(tour as { price_from: number }).price_from}$`
      : (tour as { price?: string } | null)?.price ?? "";
  const daysLabel =
    "nights" in (tour ?? {})
      ? `${(tour as { nights: number }).nights} ${locale.search.nightsLabel}`
      : (tour as { days?: string } | null)?.days ?? "";
  const image =
    "image_url" in (tour ?? {})
      ? (tour as { image_url: string }).image_url
      : (tour as { image?: string } | null)?.image ?? locale.hero.image;
  const people =
    "adults_min" in (tour ?? {})
      ? formatPeopleRange(
          (tour as { adults_min: number }).adults_min,
          (tour as { adults_max: number }).adults_max
        )
      : (tour as { people?: string } | null)?.people ?? "";
  const gallery = useMemo(() => {
    const images = [
      image,
      ...((tour as { gallery_urls?: string[] } | null)?.gallery_urls ?? []),
      ...locale.hero.slides.map((slide) => slide.image),
    ].filter(Boolean);
    return Array.from(new Set(images));
  }, [image, locale.hero.slides, tour]);

  useEffect(() => {
    if (gallery.length <= 1) {
      return;
    }
    const timer = window.setInterval(() => {
      setTourSlideIndex((prev) =>
        prev === gallery.length - 1 ? 0 : prev + 1
      );
    }, 6000);
    return () => window.clearInterval(timer);
  }, [gallery.length]);

  useEffect(() => {
    if (!title) {
      return;
    }
    let isActive = true;
    const controller = new AbortController();
    const params = new URLSearchParams({ id: tourId });
    params.set("lang", lang);

    setTourRange(null);
    fetch(`/api/tours?${params.toString()}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((data) => {
        if (!isActive) {
          return;
        }
        const items = Array.isArray(data?.items) ? data.items : [];
        const matched =
          items.find((item: { id?: string }) => item.id === tourId) ?? items[0];
        if (matched?.start_date && matched?.end_date) {
          setTourRange({ start: matched.start_date, end: matched.end_date });
        }
      })
      .catch((error) => {
        if (error?.name === "AbortError") {
          return;
        }
        setTourRange(null);
      });

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [title, tourId, lang]);

  const pad = (value: number) => value.toString().padStart(2, "0");
  const toISODate = (value: Date) =>
    `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(
      value.getDate()
    )}`;
  const getMonthDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];
    for (let day = 1; day <= lastDay.getDate(); day += 1) {
      days.push(new Date(year, month, day));
    }
    return { firstDay, days };
  };

  const monthFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(
        lang === "uz" ? "uz-UZ" : lang === "en" ? "en-US" : "ru-RU",
        {
          month: "long",
          year: "numeric",
        }
      ),
    [lang]
  );

  const weekdays = useMemo(() => {
    const base = new Date(2024, 0, 1);
    const localeCode = lang === "uz" ? "uz-UZ" : lang === "en" ? "en-US" : "ru-RU";
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(base);
      date.setDate(base.getDate() + index);
      return new Intl.DateTimeFormat(localeCode, { weekday: "short" }).format(
        date
      );
    });
  }, [lang]);

  const { firstDay, days: monthDays } = getMonthDays(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth()
  );
  const startOffset = (firstDay.getDay() + 6) % 7;
  const startHint =
    lang === "uz"
      ? "Jo'nash va mehmonxonaga joylashish"
      : lang === "en"
      ? "Departure and hotel check-in"
      : "\u041f\u043e\u0441\u0430\u0434\u043a\u0430 \u0438 \u0437\u0430\u0441\u0435\u043b\u0435\u043d\u0438\u0435 \u0432 \u043e\u0442\u0435\u043b\u044c";
  const endHint =
    lang === "uz"
      ? "Uyga qaytish"
      : lang === "en"
      ? "Return home"
      : "\u0412\u043e\u0437\u0432\u0440\u0430\u0449\u0435\u043d\u0438\u0435 \u0434\u043e\u043c\u043e\u0439";

  return (
    <div className="text-[15px] text-[var(--ink-700)]">
      <SiteHeader
        locale={locale}
        lang={lang}
        languages={languages}
        onLangChange={handleLangChange}
      />
      <main className="mx-auto w-full max-w-6xl px-6 pb-24">
        <section className="mt-10 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand-700)]">
              {locale.tourPage.label}
            </div>
            <a
              href="/destinations"
              className="text-sm font-semibold text-[var(--brand-700)]"
            >
              {locale.tourPage.back}
            </a>
          </div>
          <div className="relative h-[320px] overflow-hidden rounded-[32px] bg-[var(--brand-100)] sm:h-[380px]">
            <div className="absolute inset-0">
              {gallery.map((src, index) => (
                <img
                  key={`tour-image-${src}-${index}`}
                  src={src}
                  alt={title}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
                    index === tourSlideIndex ? "opacity-100" : "opacity-0"
                  }`}
                  loading={index === tourSlideIndex ? "eager" : "lazy"}
                />
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[rgba(6,55,35,0.65)] via-[rgba(6,55,35,0.35)] to-[rgba(6,55,35,0.05)]" />
            <div className="relative flex h-full flex-col justify-end gap-4 p-6 text-white sm:p-8">
              <h1 className="font-display text-3xl font-semibold sm:text-4xl">
                {title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/85">
                {city && (
                  <span className="rounded-full bg-white/20 px-3 py-1">
                    {city}
                  </span>
                )}
                {daysLabel && (
                  <span className="rounded-full bg-white/20 px-3 py-1">
                    {daysLabel}
                  </span>
                )}
                {price && (
                  <span className="rounded-full bg-white/20 px-3 py-1">
                    {price}
                  </span>
                )}
                {people && (
                  <span className="rounded-full bg-white/20 px-3 py-1">
                    {locale.search.peopleLabel}: {people} {peopleUnit}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-[var(--shadow-soft)]">
            <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand-700)]">
              {locale.tourPage.aboutTitle}
            </div>
            <p className="mt-3 text-sm text-[var(--ink-700)]">
              {locale.tourPage.aboutText}
            </p>
          </div>
          <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-[var(--shadow-soft)]">
            <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand-700)]">
              {locale.tourPage.infoTitle}
            </div>
            <div className="mt-4 space-y-2 text-sm text-[var(--ink-700)]">
              {city && <div>{city}</div>}
              {daysLabel && <div>{daysLabel}</div>}
              {price && <div>{price}</div>}
              {people && (
                <div>
                  {locale.search.peopleLabel}: {people} {peopleUnit}
                </div>
              )}
            </div>
            <button
              type="button"
              className="mt-5 inline-flex rounded-full bg-[var(--brand-700)] px-5 py-2 text-sm font-semibold text-white"
              onClick={() => setIsConsultationOpen(true)}
            >
              {locale.tourPage.bookButton}
            </button>
          </div>
        </section>

        <section className="mt-8">
          <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-[var(--shadow-soft)]">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand-700)]">
                {locale.search.dateLabel}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-full bg-[var(--brand-100)] px-2 py-1 text-xs text-[var(--brand-700)]"
                  onClick={() =>
                    setCalendarMonth(
                      new Date(
                        calendarMonth.getFullYear(),
                        calendarMonth.getMonth() - 1,
                        1
                      )
                    )
                  }
                  aria-label="Previous month"
                >
                  {"<"}
                </button>
                <div className="text-sm font-semibold text-[var(--ink-900)]">
                  {monthFormatter.format(calendarMonth)}
                </div>
                <button
                  type="button"
                  className="rounded-full bg-[var(--brand-100)] px-2 py-1 text-xs text-[var(--brand-700)]"
                  onClick={() =>
                    setCalendarMonth(
                      new Date(
                        calendarMonth.getFullYear(),
                        calendarMonth.getMonth() + 1,
                        1
                      )
                    )
                  }
                  aria-label="Next month"
                >
                  {">"}
                </button>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-7 text-center text-[10px] uppercase tracking-[0.08em] text-[var(--ink-600)]">
              {weekdays.map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-7 gap-2 text-center text-sm">
              {Array.from({ length: startOffset }).map((_, index) => (
                <div key={`empty-${index}`} />
              ))}
              {monthDays.map((day) => {
                const dayValue = toISODate(day);
                const isInRange = tourRange
                  ? dayValue >= tourRange.start && dayValue <= tourRange.end
                  : false;
                const isStart = tourRange?.start === dayValue;
                const isEnd = tourRange?.end === dayValue;
                return (
                  <div
                    key={dayValue}
                    title={isStart ? startHint : isEnd ? endHint : undefined}
                    className={`rounded-lg px-2 py-1 transition ${
                      isInRange
                        ? "bg-[var(--brand-100)] text-[var(--brand-700)]"
                        : "text-[var(--ink-900)]/35"
                    } ${isStart || isEnd ? "ring-2 ring-[var(--brand-600)]" : ""}`}
                  >
                    {day.getDate()}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[var(--ink-600)]">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-[var(--brand-100)] ring-1 ring-[var(--brand-600)]" />
                <span>{startHint}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-[var(--brand-100)] ring-1 ring-[var(--brand-600)]" />
                <span>{endHint}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-[var(--brand-100)]" />
                <span>
                  {lang === "uz"
                    ? "Turni davom etishi"
                    : lang === "en"
                    ? "Tour in progress"
                    : "\u041f\u0435\u0440\u0438\u043e\u0434 \u0442\u0443\u0440\u0430"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-[var(--ink-900)]/20" />
                <span>
                  {lang === "uz"
                    ? "Mavjud emas"
                    : lang === "en"
                    ? "No tour"
                    : "\u0412\u043d\u0435 \u0442\u0443\u0440\u0430"}
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
      {isConsultationOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8 backdrop-blur-sm"
          onClick={() => setIsConsultationOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-[28px] border border-white/30 bg-white p-6 shadow-[var(--shadow-strong)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand-700)]">
                  {locale.cta.kicker}
                </div>
                <div className="font-display text-2xl font-semibold text-[var(--ink-900)]">
                  {locale.cta.formTitle}
                </div>
                <p className="mt-2 text-sm text-[var(--ink-600)]">
                  {locale.cta.formSubtitle}
                </p>
              </div>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-[var(--ink-700)] hover:bg-[var(--sand-50)]"
                aria-label="Close"
                onClick={() => setIsConsultationOpen(false)}
              >
                Г—
              </button>
            </div>
            <form className="mt-6 grid gap-4" onSubmit={handleLeadSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold text-[var(--ink-600)]">
                  {locale.cta.formName}
                  <input
                    type="text"
                    className="mt-2 w-full rounded-2xl border border-black/10 bg-[var(--sand-50)] px-4 py-2 text-sm text-[var(--ink-900)] focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-100)]"
                    placeholder={locale.cta.formName}
                    value={leadForm.name}
                    onChange={(event) =>
                      setLeadForm((prev) => ({ ...prev, name: event.target.value }))
                    }
                  />
                </label>
                <label className="text-sm font-semibold text-[var(--ink-600)]">
                  {locale.cta.formLastName}
                  <input
                    type="text"
                    className="mt-2 w-full rounded-2xl border border-black/10 bg-[var(--sand-50)] px-4 py-2 text-sm text-[var(--ink-900)] focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-100)]"
                    placeholder={locale.cta.formLastName}
                    value={leadForm.lastName}
                    onChange={(event) =>
                      setLeadForm((prev) => ({
                        ...prev,
                        lastName: event.target.value,
                      }))
                    }
                  />
                </label>
              </div>
              <label className="text-sm font-semibold text-[var(--ink-600)]">
                {locale.cta.formPhone}
                <input
                  type="tel"
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-[var(--sand-50)] px-4 py-2 text-sm text-[var(--ink-900)] focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-100)]"
                  placeholder="+998 90 000 00 00"
                  value={leadForm.phone}
                  onChange={(event) =>
                    setLeadForm((prev) => ({ ...prev, phone: event.target.value }))
                  }
                />
              </label>
              <label className="text-sm font-semibold text-[var(--ink-600)]">
                {locale.cta.formComment}
                <textarea
                  rows={4}
                  className="mt-2 w-full resize-none rounded-2xl border border-black/10 bg-[var(--sand-50)] px-4 py-2 text-sm text-[var(--ink-900)] focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-100)]"
                  placeholder={locale.cta.formComment}
                  value={leadForm.comment}
                  onChange={(event) =>
                    setLeadForm((prev) => ({ ...prev, comment: event.target.value }))
                  }
                />
              </label>
              {leadStatus === "success" && (
                <div className="text-sm text-[var(--brand-700)]">
                  {leadStatusLabel}
                </div>
              )}
              {leadStatus === "error" && (
                <div className="text-sm text-red-600">
                  {leadErrorLabel}
                  {leadErrorDetail}
                </div>
              )}
              <button
                type="submit"
                className="mt-2 rounded-full bg-[var(--brand-700)] px-6 py-3 text-sm font-semibold text-white"
                disabled={leadStatus === "sending"}
              >
                {leadStatus === "sending"
                  ? lang === "uz"
                    ? "Yuborilmoqda..."
                    : lang === "en"
                    ? "Sending..."
                    : "Отправка..."
                  : locale.cta.formSubmit}
              </button>
            </form>
          </div>
        </div>
      )}
      <SiteFooter locale={locale.footer} />
    </div>
  );
}
