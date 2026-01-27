"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import DateRangePicker from "../components/DateRangePicker";
import Select, { type SelectOption } from "../components/Select";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { useContent } from "../lib/useContent";
import { useTours } from "../lib/useTours";
import { defaultLang, languages, type Lang } from "./content";

type SearchFormState = {
  destination: string;
  startDate: string;
  endDate: string;
  adults: string;
  type: string;
};

type TourResult = {
  id: string;
  title: string;
  country: string;
  city: string;
  start_date: string;
  end_date: string;
  adults_min: number;
  adults_max: number;
  price_from: number;
  nights: number;
  image_url: string;
  is_hot: number;
  tour_type?: string;
  gallery_urls?: string[];
};

const formatPeopleRange = (min: number, max: number) =>
  min === max ? `${min}` : `${min}-${max}`;

export default function Home() {
  const contentData = useContent();
  const [lang, setLang] = useState<Lang>(defaultLang);
  const { tours, hotTours } = useTours(lang);
  const [searchForm, setSearchForm] = useState<SearchFormState>({
    destination: "",
    startDate: "",
    endDate: "",
    adults: "",
    type: "all",
  });
  const [searchResults, setSearchResults] = useState<TourResult[]>([]);
  const [tourTypes, setTourTypes] = useState<
    { code: string; label_ru: string; label_uz: string; label_en: string }[]
  >([]);
  const [searchDismissed, setSearchDismissed] = useState(false);
  const [aboutRevealProgress, setAboutRevealProgress] = useState(0);
  const [isToursDragging, setIsToursDragging] = useState(false);
  const [hotPromoIndex, setHotPromoIndex] = useState(0);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
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
  const [searchStatus, setSearchStatus] = useState<"idle" | "loading" | "error">(
    "idle"
  );
  const [searchTouched, setSearchTouched] = useState(false);
  const [availableDates, setAvailableDates] = useState<Set<string> | null>(
    null
  );
  const [highlightDates, setHighlightDates] = useState<Set<string> | null>(
    null
  );
  const [calendarMonth, setCalendarMonth] = useState<Date>(() => new Date());
  const revealTimerRef = useRef<number | null>(null);
  const aboutSectionRef = useRef<HTMLElement | null>(null);
  const aboutTitleRef = useRef<HTMLHeadingElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const toursScrollRef = useRef<HTMLDivElement | null>(null);
  const toursDragStartXRef = useRef(0);
  const toursScrollLeftRef = useRef(0);
  const toursTargetScrollRef = useRef(0);
  const toursRafRef = useRef<number | null>(null);
  const toursDraggedRef = useRef(false);
  const toursPointerDownRef = useRef(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("qoratosh-lang");
    if (
      saved &&
      Object.prototype.hasOwnProperty.call(languages, saved)
    ) {
      setLang(saved as Lang);
    }
  }, []);

  useEffect(() => {
    fetch("/api/tour-types")
      .then((res) => res.json())
      .then((data) => {
        setTourTypes(data?.items ?? []);
      })
      .catch(() => {
        setTourTypes([]);
      });
  }, []);

  const handleLangChange = (next: Lang) => {
    setLang(next);
    window.localStorage.setItem("qoratosh-lang", next);
  };
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const stored = window.localStorage.getItem("qt-lang");
    if (stored && stored in contentData) {
      setLang(stored as Lang);
    }
  }, [contentData]);

  useEffect(() => {
    window.localStorage.setItem("qt-lang", lang);
  }, [lang]);

  useEffect(() => {
    function onScroll() {
      const currentScrollY = window.scrollY;
      lastScrollYRef.current = currentScrollY;

      const header = headerRef.current;
      const title = aboutTitleRef.current;
      if (!title) {
        return;
      }
      const headerBottom = header?.getBoundingClientRect().bottom ?? 0;
      const titleTop = title.getBoundingClientRect().top;
      const start = headerBottom + 320;
      const end = headerBottom + 120;
      const range = Math.max(1, start - end);
      const rawProgress = (start - titleTop) / range;
      const nextProgress = Math.min(1, Math.max(0, rawProgress));
      setAboutRevealProgress(nextProgress);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (revealTimerRef.current) {
        window.clearTimeout(revealTimerRef.current);
      }
    };
  }, []);

  const locale = contentData[lang] ?? contentData[defaultLang];
  const defaultGallery = [
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504270997636-07ddfbd48945?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1473625247510-8ceb1760943f?q=80&w=1200&auto=format&fit=crop",
  ];
  const galleryItems = Array.isArray(locale?.gallery?.images)
    ? locale.gallery.images.filter((item: string) => Boolean(item))
    : [];
  const galleryList = galleryItems.length ? galleryItems : defaultGallery;
  const galleryRows = [
    galleryList.slice(0, 4),
    galleryList.slice(4, 8),
  ];
  const peopleUnit = locale.search.peopleUnit ?? "";
  const dateFormatter = new Intl.DateTimeFormat(
    lang === "ru" ? "ru-RU" : lang === "uz" ? "uz-UZ" : "en-US",
    { day: "2-digit", month: "short" }
  );

  const formatDate = (value: string) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }
    return dateFormatter.format(parsed);
  };
  const adultsOptions = ["1", "2", "3", "4", "5", "6"];
  const destinationOptions: SelectOption[] = Array.from(
    new Set(tours.map((tour) => tour.title))
  ).map((value) => ({ value, label: value }));
  const adultsSelectOptions: SelectOption[] = [
    { value: "", label: locale.search.peopleValue },
    ...adultsOptions.map((value) => ({
      value,
      label: value,
    })),
  ];
  const typeLabelMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const item of tourTypes) {
      map[item.code] =
        lang === "ru"
          ? item.label_ru
          : lang === "uz"
            ? item.label_uz
            : item.label_en;
    }
    return map;
  }, [tourTypes, lang]);
  const typeSelectOptions: SelectOption[] = useMemo(() => {
    const allOption =
      locale.search.typeOptions.find((item) => item.value === "all") ??
      locale.search.typeOptions[0];
    const options: SelectOption[] = [];
    if (allOption) {
      options.push({ value: "all", label: allOption.label });
    }
    for (const item of tourTypes) {
      options.push({
        value: item.code,
        label:
          lang === "ru"
            ? item.label_ru
            : lang === "uz"
              ? item.label_uz
              : item.label_en,
      });
    }
    return options;
  }, [locale.search.typeOptions, tourTypes, lang]);
  const getTourBadge = (tour: TourResult) => {
    if (tour.tour_type && typeLabelMap[tour.tour_type]) {
      return typeLabelMap[tour.tour_type];
    }
    return tour.is_hot ? locale.hot.label : "";
  };
  const toursSlideDuration = Math.max(30, tours.length * 12);
  const reviewsSlideDuration = Math.max(30, locale.reviewsList.length * 10);
  const hotSlides = locale.hot.slides;
  const heroSlides = locale.hero.slides ?? [locale.hero];
  const heroSlide = heroSlides[heroSlideIndex % heroSlides.length];
  const heroLink = (heroSlide as { href?: string }).href;

  useEffect(() => {
    if (hotPromoIndex >= hotSlides.length) {
      setHotPromoIndex(0);
    }
  }, [hotPromoIndex, hotSlides.length]);

  useEffect(() => {
    if (hotSlides.length <= 1) {
      return;
    }
    const timer = window.setInterval(() => {
      setHotPromoIndex((prev) =>
        prev === hotSlides.length - 1 ? 0 : prev + 1
      );
    }, 6000);
    return () => window.clearInterval(timer);
  }, [hotSlides.length]);

  useEffect(() => {
    if (heroSlides.length <= 1) {
      return;
    }
    const timer = window.setInterval(() => {
      setHeroSlideIndex((prev) =>
        prev === heroSlides.length - 1 ? 0 : prev + 1
      );
    }, 7000);
    return () => window.clearInterval(timer);
  }, [heroSlides.length]);

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

  const handleLeadSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (leadStatus === "sending") {
      return;
    }
    setLeadStatus("sending");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "cta",
          lang,
          name: leadForm.name,
          lastName: leadForm.lastName,
          phone: leadForm.phone,
          comment: leadForm.comment,
        }),
      });
      if (!response.ok) {
        throw new Error("Request failed");
      }
      setLeadStatus("success");
      setLeadForm({ name: "", lastName: "", phone: "", comment: "" });
    } catch {
      setLeadStatus("error");
    }
  };

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
    if (searchForm.destination) {
      params.set("destination", searchForm.destination);
    }

    setAvailableDates(null);
    fetch(`/api/tours?${params.toString()}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((data) => {
        if (!isActive) {
          return;
        }
        const nextSet = new Set<string>();
        const items = Array.isArray(data?.items) ? data.items : [];
        items.forEach((tour: { start_date?: string; end_date?: string }) => {
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
  }, [calendarMonth, searchForm.destination, lang]);
  const perkIcons = [
    {
      viewBox: "0 0 24 24",
      path: "M12 3 4.5 6v5.5c0 4.1 3 7.7 7.5 9 4.5-1.3 7.5-4.9 7.5-9V6L12 3z",
    },
    {
      viewBox: "0 0 24 24",
      path: "M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm-7 8.5c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5v.5H5v-.5z",
    },
    {
      viewBox: "0 0 24 24",
      path: "M12 7v6l4 2m6-3a10 10 0 1 1-20 0 10 10 0 0 1 20 0z",
    },
    {
      viewBox: "0 0 24 24",
      path: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm7.3 9h-3.6a15.6 15.6 0 0 0-1.1-5 8.1 8.1 0 0 1 4.7 5zM12 4.2A13.4 13.4 0 0 1 13.6 11H10.4A13.4 13.4 0 0 1 12 4.2zM5.4 11a8.1 8.1 0 0 1 4.7-5 15.6 15.6 0 0 0-1.1 5H5.4zm3.6 2a15.6 15.6 0 0 0 1.1 5 8.1 8.1 0 0 1-4.7-5H9zm3 6.8A13.4 13.4 0 0 1 10.4 13h3.2A13.4 13.4 0 0 1 12 19.8zm3.6-.8a15.6 15.6 0 0 0 1.1-5h3.6a8.1 8.1 0 0 1-4.7 5z",
    },
  ];

  const handleSearchSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchTouched(true);
    setSearchDismissed(false);
    setSearchStatus("loading");
    setSearchResults([]);
    if (revealTimerRef.current) {
      window.clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
    }
    const animationStart = Date.now();
    const planeDurationMs = 1800;

    const params = new URLSearchParams();
    params.set("lang", lang);
    if (searchForm.destination.trim()) {
      params.set("destination", searchForm.destination.trim());
    }
    if (searchForm.startDate) {
      params.set("startDate", searchForm.startDate);
    }
    if (searchForm.endDate) {
      params.set("endDate", searchForm.endDate);
    }
    if (searchForm.adults) {
      params.set("adults", searchForm.adults);
    }
    if (searchForm.type && searchForm.type !== "all") {
      params.set("type", searchForm.type);
    }

    try {
      const response = await fetch(`/api/tours?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Request failed");
      }
      const data = (await response.json()) as { items: TourResult[] };
      const elapsed = Date.now() - animationStart;
      const delay = Math.max(0, planeDurationMs - elapsed);
      revealTimerRef.current = window.setTimeout(() => {
        setSearchResults(data.items);
        setSearchStatus("idle");
      }, delay);
    } catch {
      setSearchStatus("error");
    }
  };

  const handleToursPointerDown = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    const container = toursScrollRef.current;
    if (!container) {
      return;
    }
    toursDraggedRef.current = false;
    toursPointerDownRef.current = true;
    toursDragStartXRef.current = event.clientX;
    toursScrollLeftRef.current = container.scrollLeft;
    toursTargetScrollRef.current = container.scrollLeft;
  };

  const handleToursPointerMove = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    const container = toursScrollRef.current;
    if (!container || !toursPointerDownRef.current) {
      return;
    }
    const delta = event.clientX - toursDragStartXRef.current;
    if (Math.abs(delta) > 6) {
      toursDraggedRef.current = true;
      if (!isToursDragging) {
        setIsToursDragging(true);
        container.setPointerCapture(event.pointerId);
      }
      event.preventDefault();
    }
    if (!isToursDragging) {
      return;
    }
    toursTargetScrollRef.current = toursScrollLeftRef.current - delta * 0.8;
    if (toursRafRef.current === null) {
      const step = () => {
        const current = container.scrollLeft;
        const target = toursTargetScrollRef.current;
        const next = current + (target - current) * 0.25;
        container.scrollLeft = next;
        if (!isToursDragging || Math.abs(target - next) < 0.5) {
          toursRafRef.current = null;
          return;
        }
        toursRafRef.current = window.requestAnimationFrame(step);
      };
      toursRafRef.current = window.requestAnimationFrame(step);
    }
  };

  const handleToursPointerEnd = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    const container = toursScrollRef.current;
    if (!container) {
      return;
    }
    if (isToursDragging) {
      container.releasePointerCapture(event.pointerId);
    }
    toursPointerDownRef.current = false;
    setIsToursDragging(false);
    if (toursRafRef.current !== null) {
      window.cancelAnimationFrame(toursRafRef.current);
      toursRafRef.current = null;
    }
  };

  return (
    <div className="text-[15px] text-[var(--ink-700)]">
      <SiteHeader
        headerRef={headerRef}
        locale={locale}
        lang={lang}
        languages={languages}
        onLangChange={handleLangChange}
      />

      <main className="mx-auto w-full max-w-5xl px-6 pb-24">
        <section className="mt-10">
          <div
            className={`relative h-[320px] overflow-hidden rounded-[32px] bg-[var(--brand-100)] sm:h-[360px] ${
              heroLink ? "cursor-pointer" : ""
            }`}
            onClick={() => {
              if (heroLink) {
                window.location.href = heroLink;
              }
            }}
          >
            <div className="absolute inset-0">
              {heroSlides.map((slide, index) => (
                <img
                  key={`hero-image-${slide.image}-${index}`}
                  src={slide.image}
                  alt={slide.title}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
                    index === heroSlideIndex ? "opacity-100" : "opacity-0"
                  }`}
                  loading={index === heroSlideIndex ? "eager" : "lazy"}
                />
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[rgba(6,55,35,0.65)] via-[rgba(6,55,35,0.35)] to-[rgba(6,55,35,0.05)]" />
            {heroSlides.length > 1 && (
              <div className="absolute right-10 top-8 z-10 flex items-center gap-2">
                {heroSlides.map((_, index) => (
                  <button
                    key={`hero-dot-${index}`}
                    type="button"
                    className={`h-2.5 w-2.5 rounded-full transition ${
                      index === heroSlideIndex ? "bg-white" : "bg-white/40"
                    }`}
                    aria-label={`Slide ${index + 1}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      setHeroSlideIndex(index);
                    }}
                  />
                ))}
              </div>
            )}
            <div className="relative grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.2fr_1fr]">
              <div className="relative min-h-[170px] text-white sm:min-h-[190px]">
                {heroSlides.map((slide, index) => (
                  <div
                    key={`hero-text-${slide.title}-${index}`}
                    className={`absolute inset-0 space-y-6 transition-all duration-700 ease-in-out ${
                      index === heroSlideIndex
                        ? "opacity-100 translate-y-0"
                        : "pointer-events-none opacity-0 translate-y-2"
                    }`}
                  >
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1 text-xs uppercase tracking-[0.08em]">
                      {slide.badge}
                    </span>
                    <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
                      {slide.title}
                    </h1>
                    <p className="max-w-lg text-sm text-white/85 sm:text-base -mt-2">
                      {slide.description}
                    </p>
                  </div>
                ))}
              </div>
              <div className="hidden lg:block" />
            </div>
          </div>
          <div className="relative z-10 -mt-14">
            <div className="relative flex justify-center">
              <form
                className="w-full max-w-4xl rounded-[22px] border-2 border-[var(--brand-700)] bg-[var(--brand-700)] px-6 py-5 text-white shadow"
                onSubmit={handleSearchSubmit}
              >
                <div className="grid gap-4 md:grid-cols-[2fr_1.8fr_0.9fr_0.9fr_auto] md:items-end">
                  <div className="flex h-[66px] flex-col justify-between text-[10px] uppercase tracking-[0.08em] text-white/70">
                    <label className="text-[10px] uppercase tracking-[0.08em] text-white/70">
                      {locale.search.destinationLabel}
                    </label>
                    <Select
                      value={searchForm.destination}
                      options={destinationOptions}
                      placeholder={locale.search.destinationPlaceholder}
                      onChange={(value) =>
                        setSearchForm((prev) => ({
                          ...prev,
                          destination: value,
                        }))
                      }
                      buttonClassName="h-10 py-2"
                    />
                  </div>
                  <div className="flex h-[66px] flex-col justify-between text-[10px] uppercase tracking-[0.08em] text-white/70">
                    {locale.search.dateLabel}
                    <div>
                      <DateRangePicker
                        startDate={searchForm.startDate}
                        endDate={searchForm.endDate}
                        onChange={(startValue, endValue) =>
                          setSearchForm((prev) => ({
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
                        value={searchForm.adults}
                        options={adultsSelectOptions}
                        onChange={(value) =>
                          setSearchForm((prev) => ({
                            ...prev,
                            adults: value,
                          }))
                        }
                        buttonClassName="h-10 py-2"
                      />
                    </div>
                  </div>
                  <div className="flex h-[66px] flex-col justify-between text-[10px] uppercase tracking-[0.08em] text-white/70">
                    {locale.search.typeLabel}
                    <div>
                      <Select
                        value={searchForm.type}
                        options={typeSelectOptions}
                        onChange={(value) =>
                          setSearchForm((prev) => ({
                            ...prev,
                            type: value,
                          }))
                        }
                        buttonClassName="h-10 py-2"
                      />
                    </div>
                  </div>
                  <button className="h-[48px] self-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[var(--brand-700)]">
                    {locale.search.button}
                  </button>
                </div>
              </form>
            </div>
            {searchStatus === "loading" && (
              <div className="pointer-events-none mx-auto mt-3 w-full max-w-4xl px-6">
                <div className="relative h-12 overflow-hidden">
                  <div className="plane-fly">
                    <img
                      src="/plane.png"
                      alt="Plane"
                      className="h-11 w-11 rotate-90"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          {searchTouched && !searchDismissed && (
            <div className="relative mt-6 overflow-hidden rounded-3xl border border-black/5 bg-white/90 p-6 shadow-[var(--shadow-soft)]">
              <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand-700)]">
                {locale.search.resultsTitle}
              </div>
              <button
                type="button"
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-[var(--ink-700)] hover:bg-[var(--sand-50)]"
                aria-label="Close results"
                onClick={() => setSearchDismissed(true)}
              >
                ×
              </button>
              {searchStatus === "loading" && (
                <p className="mt-4 text-sm text-[var(--ink-700)]">
                  {locale.search.loading}
                </p>
              )}
              {searchStatus === "error" && (
                <p className="mt-4 text-sm text-[var(--ink-700)]">
                  {locale.search.error}
                </p>
              )}
              {searchStatus === "idle" && searchResults.length === 0 && (
                <p className="mt-4 text-sm text-[var(--ink-700)]">
                  {locale.search.empty}
                </p>
              )}
              {searchStatus === "idle" && searchResults.length > 0 && (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {searchResults.map((tour) => (
                    <a
                      key={tour.id}
                      href={`/tours/${tour.id}`}
                      className="flex gap-4 rounded-2xl border border-black/5 bg-white p-4 shadow-sm transition hover:border-[var(--brand-200)] hover:bg-white/95"
                    >
                      <img
                        src={tour.image_url}
                        alt={tour.title}
                        className="h-24 w-24 rounded-xl object-cover"
                        loading="lazy"
                      />
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="text-xs uppercase tracking-[0.08em] text-[var(--ink-700)]">
                            {tour.country}, {tour.city}
                          </div>
                          <div className="text-lg font-semibold text-[var(--ink-900)]">
                            {tour.title}
                          </div>
                          <div className="mt-1 text-xs text-[var(--ink-700)]">
                            {formatDate(tour.start_date)} - {formatDate(tour.end_date)}
                          </div>
                          <div className="mt-1 text-xs text-[var(--ink-600)]">
                            {locale.search.peopleLabel}:{" "}
                            {formatPeopleRange(tour.adults_min, tour.adults_max)}{" "}
                            {peopleUnit}
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-sm">
                          <span className="font-semibold text-[var(--brand-700)]">
                            {locale.search.priceFrom} {tour.price_from}$ · {tour.nights}{" "}
                            {locale.search.nightsLabel}
                          </span>
                          {(() => {
                            const typeCode =
                              tour.tour_type ??
                              (tour.is_hot === 1 ? "hot" : "regular");
                            const label = typeLabelMap[typeCode];
                            if (!label || typeCode === "regular") {
                              return null;
                            }
                            return (
                              <span className="rounded-full bg-[var(--brand-100)] px-3 py-1 text-xs font-semibold text-[var(--brand-700)]">
                                {label}
                              </span>
                            );
                          })()}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        <section
          ref={aboutSectionRef}
          id="about"
          className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_1fr]"
        >
          <div className="min-w-0 space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full bg-[var(--brand-100)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand-700)]">
              {locale.about.label}
            </div>
            <h2
              ref={aboutTitleRef}
              className="font-display text-3xl font-semibold text-[var(--ink-900)] sm:text-4xl"
            >
              {locale.about.title}
            </h2>
            <p className="text-base leading-relaxed text-[var(--ink-700)]">
              {locale.about.text}
            </p>
            <div
              className="overflow-hidden"
              style={{
                maxHeight: `${Math.round(520 * aboutRevealProgress)}px`,
                opacity: aboutRevealProgress,
                transform: `translateY(${(1 - aboutRevealProgress) * 14}px)`,
              }}
            >
              <div className="w-full min-w-0 rounded-[28px] border border-[var(--brand-200)] bg-white/90 p-6 shadow-[var(--shadow-soft)]">
                  <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand-700)]">
                    {locale.about.whyLabel}
                  </div>
                  <ul className="mt-4 grid gap-4 text-sm text-[var(--ink-700)] sm:grid-cols-2">
                    {locale.about.perks.map((item, index) => {
                      const icon = perkIcons[index % perkIcons.length];
                      return (
                        <li
                          key={item}
                          className="flex items-center gap-3 rounded-2xl bg-[var(--sand-50)] px-4 py-3"
                        >
                          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--brand-100)] text-[var(--brand-700)]">
                            <svg
                              aria-hidden="true"
                              viewBox={icon.viewBox}
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d={icon.path} />
                            </svg>
                          </span>
                          <span>{item}</span>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="mt-5 text-sm text-[var(--ink-600)]">
                    <span className="font-semibold text-[var(--ink-800)]">
                      {locale.about.foundedTitle}
                    </span>{" "}
                    {locale.about.foundedText}
                  </div>
                </div>
              </div>
            </div>
          <div className="flex flex-col items-center justify-start gap-6 lg:pt-6">
            <div className="group relative w-full max-w-[260px] overflow-hidden">
              <div className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] rounded-3xl bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-0 transition duration-700 group-hover:translate-x-full group-hover:opacity-100" />
              <img
                src="/logo.png"
                alt="Qoratosh Travel"
                className="relative w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        <section id="destinations" className="mt-20 space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand-700)]">
                {locale.destinations.label}
              </div>
              <h2 className="font-display text-3xl font-semibold text-[var(--ink-900)] sm:text-4xl">
                {locale.destinations.title}
              </h2>
            </div>
            <a
              href="/destinations"
              className="rounded-full border border-black/10 bg-white px-5 py-2 text-sm font-semibold text-[var(--brand-700)]"
            >
              {locale.destinations.button}
            </a>
          </div>
          <div
            ref={toursScrollRef}
            className={`tour-marquee marquee-draggable ${isToursDragging ? "is-dragging is-paused" : ""}`}
            onPointerDown={handleToursPointerDown}
            onPointerMove={handleToursPointerMove}
            onPointerUp={handleToursPointerEnd}
            onPointerLeave={handleToursPointerEnd}
            onClickCapture={(event) => {
              if (toursDraggedRef.current) {
                event.preventDefault();
                event.stopPropagation();
                toursDraggedRef.current = false;
              }
            }}
            style={{ scrollBehavior: isToursDragging ? "auto" : "smooth" }}
          >
            <div
              className="marquee-track flex items-stretch gap-6"
              style={{ animationDuration: `${toursSlideDuration}s` }}
            >
              {tours.map((tour) => (
                <a
                  key={tour.id}
                  href={`/tours/${tour.id}`}
                  className="w-72 overflow-hidden rounded-3xl border border-[var(--brand-100)] bg-white shadow-[var(--shadow-soft)] transition hover:border-[var(--brand-200)] hover:bg-white/95"
                >
                  <div className="relative h-48">
                    <img
                      src={tour.image_url}
                      alt={tour.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      draggable={false}
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[var(--brand-700)]">
                      {tour.nights} {locale.search.nightsLabel}
                    </span>
                  </div>
                  <div className="space-y-3 p-5">
                    <div className="text-xs uppercase tracking-[0.08em] text-[var(--ink-700)]">
                      {tour.city}
                    </div>
                    <div className="font-display text-xl font-semibold text-[var(--ink-900)]">
                      {tour.title}
                    </div>
                    {tour.adults_min ? (
                      <div className="text-xs text-[var(--ink-600)]">
                        {locale.search.peopleLabel}:{" "}
                        {formatPeopleRange(tour.adults_min, tour.adults_max)}{" "}
                        {peopleUnit}
                      </div>
                    ) : null}
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-[var(--brand-700)]">
                        {locale.search.priceFrom} {tour.price_from}$
                      </span>
                      <span className="rounded-full bg-[var(--brand-700)] px-4 py-2 text-xs font-semibold text-white">
                        {locale.search.button}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section
          id="hot"
          className="mt-20 grid gap-8 rounded-[32px] bg-white p-8 shadow-[var(--shadow-soft)] lg:grid-cols-[1.2fr_1fr]"
        >
          <div className="space-y-6">
            <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand-700)]">
              {locale.hot.label}
            </div>
            <h2 className="font-display text-3xl font-semibold text-[var(--ink-900)]">
              {locale.hot.title}
            </h2>
            <p className="text-sm text-[var(--ink-700)]">
              {locale.hot.description}
            </p>
            <div className="max-h-[340px] space-y-4 overflow-y-auto pr-2">
              {hotTours.map((item) => (
                <a
                  key={item.id}
                  href={`/tours/${item.id}`}
                  className="flex items-center justify-between rounded-2xl border border-black/5 bg-[var(--sand-50)] px-4 py-3 transition hover:border-[var(--brand-200)] hover:bg-white"
                >
                  <div>
                    <div className="text-sm font-semibold text-[var(--ink-900)]">
                      {item.title}
                    </div>
                    <div className="text-xs uppercase tracking-[0.08em] text-[var(--ink-700)]">
                      {item.city}
                    </div>
                    {item.adults_min ? (
                      <div className="mt-1 text-xs text-[var(--ink-600)]">
                        {locale.search.peopleLabel}:{" "}
                        {formatPeopleRange(item.adults_min, item.adults_max)}{" "}
                        {peopleUnit}
                      </div>
                    ) : null}
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-[var(--brand-700)]">
                      {getTourBadge(item)}
                    </div>
                    <div className="text-sm font-semibold text-[var(--ink-900)]">
                      {locale.search.priceFrom} {item.price_from}$
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-[var(--brand-700)] text-white">
            <div className="absolute inset-0 opacity-25">
              <img
                src={hotSlides[hotPromoIndex]?.image}
                alt={hotSlides[hotPromoIndex]?.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="relative flex h-full flex-col justify-between gap-6 p-6">
              <div>
                <div className="text-xs uppercase tracking-[0.08em] text-white/80">
                  {hotSlides[hotPromoIndex]?.badge}
                </div>
                <div className="font-display text-2xl font-semibold">
                  {hotSlides[hotPromoIndex]?.title}
                </div>
              </div>
              <div className="mt-auto space-y-3">
                <div className="flex items-center justify-center gap-2">
                  {hotSlides.map((_, index) => (
                    <span
                      key={`hot-dot-${index}`}
                      className={`h-2 w-2 rounded-full transition ${
                        index === hotPromoIndex
                          ? "bg-white"
                          : "bg-white/40"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 text-white transition hover:bg-white/15"
                      aria-label="Previous"
                      onClick={() =>
                        setHotPromoIndex((prev) =>
                          prev === 0 ? hotSlides.length - 1 : prev - 1
                        )
                      }
                    >
                      <svg
                        aria-hidden="true"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M15 6 9 12l6 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 text-white transition hover:bg-white/15"
                      aria-label="Next"
                      onClick={() =>
                        setHotPromoIndex((prev) =>
                          prev === hotSlides.length - 1 ? 0 : prev + 1
                        )
                      }
                    >
                      <svg
                        aria-hidden="true"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="m9 6 6 6-6 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  <a
                    href={hotSlides[hotPromoIndex]?.href ?? "#hot"}
                    className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-[var(--brand-700)]"
                  >
                    {locale.hot.detailsButton}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-[var(--shadow-soft)]">
            <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand-700)]">
              {locale.promos.monthLabel}
            </div>
            <h3 className="font-display text-2xl font-semibold text-[var(--ink-900)]">
              {locale.promos.monthTitle}
            </h3>
            <p className="mt-3 text-sm text-[var(--ink-700)]">
              {locale.promos.monthText}
            </p>
            <a
              href={locale.promos.monthHref ?? "/hot"}
              className="mt-5 inline-flex rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-[var(--brand-700)]"
            >
              {locale.hot.detailsButton}
            </a>
          </div>
          <div className="rounded-[28px] bg-[var(--sand-100)] p-6 shadow-[var(--shadow-soft)]">
            <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand-700)]">
              {locale.promos.specialLabel}
            </div>
            <h3 className="font-display text-2xl font-semibold text-[var(--ink-900)]">
              {locale.promos.specialTitle}
            </h3>
            <p className="mt-3 text-sm text-[var(--ink-700)]">
              {locale.promos.specialText}
            </p>
            <a
              href={locale.promos.specialHref ?? "/hot"}
              className="mt-5 inline-flex rounded-full bg-[var(--brand-700)] px-4 py-2 text-sm font-semibold text-white"
            >
              {locale.hot.detailsButton}
            </a>
          </div>
        </section>

        <section id="reviews" className="mt-20 space-y-8">
          <div className="text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand-700)]">
              {locale.reviews.label}
            </div>
            <h2 className="font-display text-3xl font-semibold text-[var(--ink-900)] sm:text-4xl">
              {locale.reviews.title}
            </h2>
          </div>
          <div className="marquee">
            <div
              className="marquee-track flex items-stretch gap-6 pointer-events-none"
              style={{ animationDuration: `${reviewsSlideDuration}s` }}
            >
              {Array.from({ length: 2 }).flatMap((_, repeatIndex) =>
                locale.reviewsList.map((review, index) => (
                  <article
                    key={`${repeatIndex}-${review.id}-${index}`}
                    className="w-80 shrink-0 rounded-3xl border border-black/5 bg-white p-6 shadow-[var(--shadow-soft)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-100)] text-sm font-semibold text-[var(--brand-700)]">
                        {review.name[0]}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[var(--ink-900)]">
                          {review.name}
                        </div>
                        <div className="text-xs uppercase tracking-[0.08em] text-[var(--ink-700)]">
                          {review.city}
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-[var(--ink-700)]">
                      "{review.text}"
                    </p>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="mt-16 space-y-4">
          {galleryRows.map((row, rowIndex) => (
            <div
              key={`gallery-row-${rowIndex}`}
              className="marquee"
            >
              <div
                className="marquee-track flex items-stretch gap-4"
                style={{
                  animationDuration: "80s",
                  animationDirection: rowIndex === 0 ? "normal" : "reverse",
                }}
              >
                {Array.from({ length: 2 }).flatMap((_, repeatIndex) =>
                  row.map((src, index) => (
                    <div
                      key={`${repeatIndex}-${src}-${index}`}
                      className="w-64 overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-soft)]"
                    >
                      <img
                        src={src}
                        alt="Gallery"
                        className="h-44 w-full object-cover sm:h-48"
                        loading="lazy"
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </section>

        <section className="mt-20 overflow-hidden rounded-[32px]">
          <div
            className="relative flex min-h-[240px] items-center justify-center px-6 py-16 text-center text-white"
            style={{
              backgroundImage:
                "linear-gradient(120deg, rgba(10, 40, 25, 0.55), rgba(10, 40, 25, 0.1)), url('https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1600&auto=format&fit=crop')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="relative z-10 space-y-4">
              <div className="text-xs uppercase tracking-[0.08em] text-white/80">
                {locale.cta.kicker}
              </div>
              <div className="font-display text-3xl font-semibold sm:text-4xl">
                {locale.cta.title}
              </div>
              <button
                type="button"
                className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-[var(--brand-700)]"
                onClick={() => setIsConsultationOpen(true)}
              >
                {locale.cta.button}
              </button>
            </div>
          </div>
        </section>

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
                  ×
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
                  <div className="text-sm text-red-600">{leadErrorLabel}</div>
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
      </main>

      <SiteFooter locale={locale.footer} />
    </div>
  );
}
