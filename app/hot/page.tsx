"use client";

import { useEffect, useState } from "react";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import { useContent } from "../../lib/useContent";
import { defaultLang, languages, type Lang } from "../content";

export default function HotToursPage() {
  const contentData = useContent();
  const [lang, setLang] = useState<Lang>(defaultLang);
  const locale = contentData[lang];
  const peopleUnit = locale.search.peopleUnit ?? "";
  const hotImages = locale.tours.map((tour) => tour.image);
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

        <section className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {locale.hotTours.map((tour, index) => (
            <a
              key={tour.id}
              href={`/tours/${tour.id}`}
              className="overflow-hidden rounded-3xl border border-[var(--brand-100)] bg-white shadow-[var(--shadow-soft)] transition hover:border-[var(--brand-200)] hover:bg-white/95"
            >
              <div className="relative h-56">
                <img
                  src={hotImages[index % hotImages.length] ?? locale.hero.image}
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
      </main>
      <SiteFooter locale={locale.footer} />
    </div>
  );
}
