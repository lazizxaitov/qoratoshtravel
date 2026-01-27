"use client";

import { useEffect, useMemo, useState } from "react";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import { useContent } from "../../lib/useContent";
import { useTours } from "../../lib/useTours";
import { defaultLang, languages, type Lang } from "../content";

export default function AboutPage() {
  const contentData = useContent();
  const [lang, setLang] = useState<Lang>(defaultLang);
  const { tours } = useTours(lang);
  const locale = contentData[lang];
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
  const defaultStats = [
    {
      value: "2015",
      label:
        lang === "uz"
          ? "Asos solingan"
          : lang === "en"
          ? "Founded"
          : "?????? ??????????????????",
    },
    {
      value: "{tours}+",
      label:
        lang === "uz"
          ? "Yo'nalishlar"
          : lang === "en"
          ? "Routes"
          : "??????????????????????",
    },
    {
      value: "24/7",
      label:
        lang === "uz"
          ? "Qo'llab-quvvatlash"
          : lang === "en"
          ? "Support"
          : "??????????????????",
    },
  ];
  const stats = defaultStats.map((item) => ({
    ...item,
    value: String(item.value ?? "").replace("{tours}", String(tours.length)),
  }));
  const defaultSteps = [
    {
      title:
        lang === "uz"
          ? "Yo'nalishni tanlaymiz"
          : lang === "en"
          ? "We tailor the route"
          : "?????????????????? ??????????????",
      text:
        lang === "uz"
          ? "Istaklaringiz va budjetingizga mos variantlar."
          : lang === "en"
          ? "Options that match your wishes and budget."
          : "?????? ???????? ?????????????????? ?? ????????????.",
    },
    {
      title:
        lang === "uz"
          ? "Bron va hujjatlar"
          : lang === "en"
          ? "Booking and docs"
          : "???????????????????????? ?? ??????????????????",
      text:
        lang === "uz"
          ? "Chipta, mehmonxona, transfer va sug'urta."
          : lang === "en"
          ? "Tickets, hotel, transfers, insurance."
          : "????????????, ??????????, ??????????????????, ??????????????????.",
    },
    {
      title:
        lang === "uz"
          ? "Safarda hamrohlik"
          : lang === "en"
          ? "Support on the trip"
          : "?????????????????????????? ?? ????????",
      text:
        lang === "uz"
          ? "24/7 aloqa va tezkor yordam."
          : lang === "en"
          ? "24/7 contact and quick help."
          : "24/7 ?????????? ?? ????????????.",
    },
  ];
  const steps = defaultSteps;
  const experienceTitle =
    lang === "uz"
      ? "Bizning tajriba"
      : lang === "en"
      ? "Our experience"
      : "?????? ????????";
  const instagramLabel =
    lang === "uz" ? "Instagram" : lang === "en" ? "Instagram" : "??????????????????";
  const missionTitle =
    lang === "uz"
      ? "Bizning missiya"
      : lang === "en"
      ? "Our mission"
      : "???????? ????????????";
  const missionText =
    lang === "uz"
      ? "Sayohatni qulay, xavfsiz va esda qolarli qilish. Har bir yo'nalishda shaxsiy yondashuv."
      : lang === "en"
      ? "Make every trip comfortable, safe, and memorable with a personal touch."
      : "?????????????? ?????????????????????? ????????????????????, ???????????????????? ?? ???????????????????????????? ?? ???????????????????????? ????????????????.";
  const missionNote =
    lang === "uz"
      ? "Biz har bir mijozga mos reja tuzamiz va yo'l bo'yi yordam beramiz."
      : lang === "en"
      ? "We build a tailored plan and stay with you at every step."
      : "???? ???????????? ???????????????????????????? ???????? ?? ???????????????????????? ???? ???????????? ????????.";
  const galleryLabel =
    lang === "uz" ? "Galereya" : lang === "en" ? "Gallery" : "??????????????";

  const gallery = useMemo(() => {
    const images = [
      ...tours.map((tour) => ({
        src: tour.image_url,
        alt: tour.title,
      })),
      ...locale.hero.slides.map((slide) => ({
        src: slide.image,
        alt: slide.title,
      })),
    ];
    const seen = new Set<string>();
    return images.filter((item) => {
      if (seen.has(item.src)) {
        return false;
      }
      seen.add(item.src);
      return true;
    });
  }, [locale.hero.slides, tours]);

  return (
    <div className="text-[15px] text-[var(--ink-700)]">
      <SiteHeader
        locale={locale}
        lang={lang}
        languages={languages}
        onLangChange={handleLangChange}
      />
      <main className="mx-auto w-full max-w-6xl px-6 pb-24">
        <section className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full bg-[var(--brand-100)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand-700)]">
              {locale.about.label}
            </div>
            <h1 className="font-display text-3xl font-semibold text-[var(--ink-900)] sm:text-4xl">
              {locale.about.title}
            </h1>
            <p className="text-base leading-relaxed text-[var(--ink-700)]">
              {locale.about.text}
            </p>
            <div className="rounded-[28px] border border-black/5 bg-white/90 p-6 shadow-[var(--shadow-soft)]">
              <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand-700)]">
                {locale.about.label}
              </div>
              <ul className="mt-4 grid gap-3 text-sm text-[var(--ink-700)] sm:grid-cols-2">
                {locale.about.perks.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 rounded-2xl bg-[var(--sand-50)] px-4 py-3"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[var(--brand-700)] shadow-sm">
                      <svg
                        aria-hidden="true"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 3 4.5 6v5.5c0 4.1 3 7.7 7.5 9 4.5-1.3 7.5-4.9 7.5-9V6L12 3z"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[28px] border border-black/5 bg-white/90 p-6 shadow-[var(--shadow-soft)]">
              <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand-700)]">
                {locale.about.foundedTitle}
              </div>
              <p className="mt-3 text-sm text-[var(--ink-700)]">
                {locale.about.foundedText}
              </p>
            </div>
            <section className="mt-8 rounded-[28px] border border-black/5 bg-white p-6 shadow-[var(--shadow-soft)]">
              <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand-700)]">
                {experienceTitle}
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {stats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl bg-[var(--sand-50)] px-4 py-4 text-center"
                  >
                    <div className="font-display text-2xl font-semibold text-[var(--ink-900)]">
                      {item.value}
                    </div>
                    <div className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ink-600)]">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {steps.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-black/5 p-4"
                  >
                    <div className="text-sm font-semibold text-[var(--ink-900)]">
                      {item.title}
                    </div>
                    <div className="mt-2 text-xs text-[var(--ink-600)]">
                      {item.text}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <div className="space-y-6">
            <div className="logo-card group relative flex items-center justify-center overflow-hidden rounded-[32px] border border-black/5 bg-white/80 p-8 shadow-[var(--shadow-soft)]">
              <img
                src="/plane.png"
                alt=""
                className="logo-plane logo-plane--left w-12 opacity-0 group-hover:opacity-40"
                loading="lazy"
                aria-hidden="true"
              />
              <img
                src="/plane.png"
                alt=""
                className="logo-plane logo-plane--right w-12 opacity-0 group-hover:opacity-40"
                loading="lazy"
                aria-hidden="true"
              />
              <img
                src="/plane.png"
                alt=""
                className="logo-plane logo-plane--top w-10 opacity-0 group-hover:opacity-30"
                loading="lazy"
                aria-hidden="true"
              />
              <img
                src="/plane.png"
                alt=""
                className="logo-plane logo-plane--bottom w-10 opacity-0 group-hover:opacity-30"
                loading="lazy"
                aria-hidden="true"
              />
              <div className="logo-hover relative z-10">
                <img
                  src="/logo.png"
                  alt="Qoratosh Travel"
                  className="w-full max-w-[260px] object-contain"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="rounded-[28px] border border-black/5 bg-white/80 p-6 shadow-[var(--shadow-soft)]">
              <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand-700)]">
                {instagramLabel}
              </div>
              <div className="mt-4 overflow-hidden rounded-2xl border border-black/5 bg-white">
                <iframe
                  title="Qoratosh Travel Instagram"
                  src="https://www.instagram.com/qoratosh_airways/embed"
                  className="h-[520px] w-full border-0"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 glass-panel rounded-[28px] border border-white/40 p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand-700)]">
            {missionTitle}
          </div>
          <p className="mt-3 text-sm text-[var(--ink-700)]">
            {missionText}
          </p>
          <div className="mt-5 rounded-2xl bg-white/70 p-4 text-xs text-[var(--ink-600)]">
            {missionNote}
          </div>
        </section>

        <section className="mt-12 space-y-4">
          <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand-700)]">
            {galleryLabel}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {gallery.slice(0, 4).map((item) => (
              <div
                key={item.src}
                className="overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-soft)]"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="h-36 w-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {gallery.slice(4, 8).map((item) => (
              <div
                key={item.src}
                className="overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-soft)]"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="h-56 w-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter locale={locale.footer} />
    </div>
  );
}
