"use client";

import { useEffect, useRef, useState } from "react";
import type { Lang } from "../app/content";

type HeaderLocale = {
  nav: {
    destinations: string;
    hot: string;
    about: string;
    contacts: string;
  };
  header: {
    contact: string;
    marquee: string;
  };
};

type LanguageMap = Record<Lang, { code: string; label: string; flag: string }>;

type SiteHeaderProps = {
  locale: HeaderLocale;
  lang: Lang;
  languages: LanguageMap;
  onLangChange: (lang: Lang) => void;
  headerRef?: React.RefObject<HTMLElement | null>;
};

export default function SiteHeader({
  locale,
  lang,
  languages,
  onLangChange,
  headerRef,
}: SiteHeaderProps) {
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [headerSearchOpen, setHeaderSearchOpen] = useState(false);
  const headerSearchInputRef = useRef<HTMLInputElement | null>(null);
  const langMenuRef = useRef<HTMLDetailsElement | null>(null);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const flagSrc = (code: string) => `/${code}.png`;

  useEffect(() => {
    function onScroll() {
      setHeaderScrolled(window.scrollY > 10);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (headerSearchOpen) {
      headerSearchInputRef.current?.focus();
    }
  }, [headerSearchOpen]);

  useEffect(() => {
    function handleHeaderSearchClose(event: MouseEvent) {
      if (!headerSearchOpen) {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (!target) {
        return;
      }
      const container = document.querySelector("[data-header-search]");
      if (container && !container.contains(target)) {
        setHeaderSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleHeaderSearchClose);
    return () =>
      document.removeEventListener("mousedown", handleHeaderSearchClose);
  }, [headerSearchOpen]);

  useEffect(() => {
    function handleLangMenuClose(event: MouseEvent) {
      if (!langMenuOpen || !langMenuRef.current) {
        return;
      }
      const target = event.target as Node | null;
      if (target && !langMenuRef.current.contains(target)) {
        setLangMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleLangMenuClose);
    return () =>
      document.removeEventListener("mousedown", handleLangMenuClose);
  }, [langMenuOpen]);

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-30 transition ${
        headerScrolled ? "bg-white/80 backdrop-blur shadow-sm" : "bg-white/90"
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center gap-6 px-6 py-4">
        <a
          href="/"
          className="group flex items-center gap-3 transition hover:opacity-90"
        >
          <img
            src="/logo2.png"
            alt="Qoratosh Travel"
            className="h-12 w-14 object-contain transition group-hover:scale-[1.02]"
          />
          <div className="leading-none">
            <div className="font-display text-lg font-semibold text-[var(--brand-700)]">
              Qoratosh
            </div>
            <div className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--brand-700)]">
              Travel
            </div>
          </div>
        </a>
        <nav className="hidden flex-1 items-center justify-center gap-5 text-sm font-medium text-[var(--ink-700)] lg:flex xl:gap-7">
          <a className="hover:text-[var(--brand-700)]" href="/destinations">
            {locale.nav.destinations}
          </a>
          <a className="hover:text-[var(--brand-700)]" href="/hot">
            {locale.nav.hot}
          </a>
          <a className="hover:text-[var(--brand-700)]" href="/about">
            {locale.nav.about}
          </a>
          <a className="hover:text-[var(--brand-700)]" href="/contacts">
            {locale.nav.contacts}
          </a>
        </nav>
        <div className="ml-auto hidden items-center gap-4 lg:flex">
          <div className="flex items-center gap-3" data-header-search>
            <button
              type="button"
              className={`flex h-9 items-center overflow-hidden rounded-full border border-black/10 bg-white text-[var(--ink-700)] transition-all duration-300 ${
                headerSearchOpen ? "w-44" : "w-9"
              }`}
              onClick={() => setHeaderSearchOpen((prev) => !prev)}
              aria-label="Search"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center">
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="m21 21-4.3-4.3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              {headerSearchOpen && (
                <input
                  ref={headerSearchInputRef}
                  type="text"
                  placeholder="Поиск"
                  className="ml-2 flex-1 bg-transparent text-sm text-[var(--ink-900)] placeholder:text-[var(--ink-700)] focus:outline-none"
                  onClick={(event) => event.stopPropagation()}
                />
              )}
            </button>
            <div
              className={`h-2 rounded-full bg-[var(--brand-700)] shadow-sm transition-all duration-300 ${
                headerSearchOpen ? "w-0 opacity-0" : "w-32 opacity-100"
              }`}
            />
          </div>
          <details
            ref={langMenuRef}
            className="relative z-40"
            open={langMenuOpen}
          >
            <summary
              className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-[var(--ink-900)]"
              onClick={(event) => {
                event.preventDefault();
                setLangMenuOpen((prev) => !prev);
              }}
            >
              <img
                src={flagSrc(languages[lang].code)}
                alt={languages[lang].label}
                className="h-4 w-6 rounded-sm object-cover"
                loading="lazy"
              />
              {languages[lang].code}
            </summary>
            <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-black/10 bg-white p-2 text-sm shadow-lg">
              {(Object.keys(languages) as Lang[]).map((key) => (
                <button
                  key={key}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left hover:bg-[var(--sand-50)]"
                  onClick={() => {
                    onLangChange(key);
                    setLangMenuOpen(false);
                  }}
                >
                  <img
                    src={flagSrc(languages[key].code)}
                    alt={languages[key].label}
                    className="h-4 w-6 rounded-sm object-cover"
                    loading="lazy"
                  />
                  {languages[key].label}
                </button>
              ))}
            </div>
          </details>
          <button className="rounded-full bg-[var(--brand-700)] px-6 py-2 text-sm font-semibold text-white shadow">
            {locale.header.contact}
          </button>
        </div>
      </div>
      <div
        className={`relative z-10 bg-[var(--brand-700)] transition-opacity ${
          headerScrolled ? "opacity-40" : "opacity-100"
        }`}
      >
        <div className="marquee mx-auto flex w-full max-w-6xl items-center px-6 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
          <div className="marquee-track flex items-center gap-6 whitespace-nowrap">
            <span>{locale.header.marquee}</span>
            <span>{locale.header.marquee}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
