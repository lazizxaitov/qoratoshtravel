"use client";

import { useEffect, useMemo, useState } from "react";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import { useContent } from "../../lib/useContent";
import { useTours } from "../../lib/useTours";
import { defaultLang, languages, type Lang } from "../content";

export default function HotToursPage() {
  const contentData = useContent();
  const [lang, setLang] = useState<Lang>(defaultLang);
  const { tours, hotTours } = useTours(lang);
  const locale = contentData[lang];
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
  type HotTourCard = {
    id: string;
    title: string;
    city: string;
    price: string;
    image: string;
    badge: string;
    people?: string;
  };
  const hotTourCards: HotTourCard[] = useMemo(() => {
    return hotTours.map((tour) => ({
      id: tour.id,
      title: tour.title,
      city: tour.city || tour.country,
      price: `${locale.search.priceFrom} ${tour.price_from}$`,
      image: tour.image_url,
      badge: locale.hot.label,
      people:
        tour.adults_min && tour.adults_max
          ? `${tour.adults_min}-${tour.adults_max}`
          : "",
    }));
  }, [hotTours, locale, peopleUnit]);

  return (
    <div className="text-[15px] text-[var(--ink-700)]">
      <SiteHeader
        locale={locale}
        lang={lang}
        languages={languages}
        onLangChange={handleLangChange}
      />
      <main className="mx-auto w-full max-w-6xl px-6 pb-24">
        <section className="mt-10 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand-700)]">
            {locale.hot.label}
          </div>
          <h1 className="font-display text-3xl font-semibold text-[var(--ink-900)] sm:text-4xl">
            {locale.hot.title}
          </h1>
          <p className="max-w-2xl text-sm text-[var(--ink-600)]">
            {locale.hot.description}
          </p>
        </section>

        {hotTourCards.length ? (
          <section className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {hotTourCards.map((tour) => (
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
                  <span className="absolute left-4 top-4 rounded-full bg-[var(--brand-100)] px-3 py-1 text-xs font-semibold text-[var(--brand-700)]">
                    {tour.badge}
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
          </section>
        ) : (
          <div className="mt-10 rounded-3xl border border-dashed border-[var(--brand-100)] bg-white/80 p-10 text-center text-sm text-[var(--ink-600)]">
            {locale.search.empty}
          </div>
        )}
      </main>
      <SiteFooter locale={locale.footer} />
    </div>
  );
}
