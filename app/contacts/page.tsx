"use client";

import { useEffect, useState } from "react";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import { useContent } from "../../lib/useContent";
import { defaultLang, languages, type Lang } from "../content";

export default function ContactsPage() {
  const contentData = useContent();
  const [lang, setLang] = useState<Lang>(defaultLang);
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
  const contacts = (locale as { contacts?: Record<string, string> }).contacts ?? {};
  const phoneLink = locale.footer.phone.replace(/\s+/g, "");
  const mapQuery = encodeURIComponent(locale.footer.address);
  const hoursLabel =
    contacts.hoursLabel ??
    (lang === "uz"
      ? "Ish vaqti"
      : lang === "en"
      ? "Working hours"
      : "\u0412\u0440\u0435\u043c\u044f \u0440\u0430\u0431\u043e\u0442\u044b");
  const hoursValue =
    contacts.hoursValue ??
    (lang === "uz"
      ? "Dushanba - Shanba, 09:00 - 19:00"
      : lang === "en"
      ? "Mon - Sat, 09:00 - 19:00"
      : "\u041f\u043d - \u0421\u0431, 09:00 - 19:00");
  const callLabel =
    contacts.callLabel ??
    (lang === "uz"
      ? "Qo'ng'iroq qilish"
      : lang === "en"
      ? "Call us"
      : "\u041f\u043e\u0437\u0432\u043e\u043d\u0438\u0442\u044c");
  const whatsappLabel = contacts.whatsappLabel ?? "WhatsApp";
  const directionsLabel =
    contacts.directionsLabel ??
    (lang === "uz"
      ? "Yo'l topish"
      : lang === "en"
      ? "Get directions"
      : "\u041f\u043e\u0441\u0442\u0440\u043e\u0438\u0442\u044c \u043c\u0430\u0440\u0448\u0440\u0443\u0442");
  const quickTitle =
    contacts.quickTitle ??
    (lang === "uz"
      ? "Tezkor aloqa"
      : lang === "en"
      ? "Quick message"
      : "\u0411\u044b\u0441\u0442\u0440\u0430\u044f \u0441\u0432\u044f\u0437\u044c");
  const quickName =
    contacts.quickName ??
    (lang === "uz"
      ? "Ism"
      : lang === "en"
      ? "Name"
      : "\u0418\u043c\u044f");
  const quickPhone =
    contacts.quickPhone ??
    (lang === "uz"
      ? "Telefon"
      : lang === "en"
      ? "Phone"
      : "\u0422\u0435\u043b\u0435\u0444\u043e\u043d");
  const quickMessage =
    contacts.quickMessage ??
    (lang === "uz"
      ? "Xabar"
      : lang === "en"
      ? "Message"
      : "\u0421\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0435");
  const quickSubmit =
    contacts.quickSubmit ??
    (lang === "uz"
      ? "Yuborish"
      : lang === "en"
      ? "Send"
      : "\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c");
  const addressLabel = contacts.addressLabel ?? locale.footer.contactsTitle;
  const phoneLabel = contacts.phoneLabel ?? "Phone";
  const emailLabel = contacts.emailLabel ?? "Email";
  const contactCards = [
    {
      label: addressLabel,
      value: locale.footer.address,
    },
    { label: phoneLabel, value: locale.footer.phone },
    { label: emailLabel, value: locale.footer.email },
  ];



  return (
    <div className="text-[15px] text-[var(--ink-700)]">
      <SiteHeader
        locale={locale}
        lang={lang}
        languages={languages}
        onLangChange={handleLangChange}
      />
      <main className="mx-auto w-full max-w-6xl px-6 pb-24">
        <section className="mt-8 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand-700)]">
            {locale.nav.contacts}
          </div>
          <h1 className="font-display text-3xl font-semibold text-[var(--ink-900)] sm:text-4xl">
            {locale.footer.contactsTitle}
          </h1>
          <p className="max-w-2xl text-sm text-[var(--ink-600)]">
            {locale.footer.text}
          </p>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-6">
            <div className="glass-panel rounded-[28px] border border-white/40 p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand-700)]">
                {hoursLabel}
              </div>
              <div className="mt-2 text-sm font-semibold text-[var(--ink-900)]">
                {hoursValue}
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={`tel:${phoneLink}`}
                  className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-[var(--brand-700)]"
                >
                  {callLabel}
                </a>
                <a
                  href={locale.footer.socialLinks.find((link) => link.label === "WhatsApp")?.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-[var(--brand-700)] px-4 py-2 text-sm font-semibold text-white"
                >
                  {whatsappLabel}
                </a>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-[var(--brand-700)]"
                >
                  {directionsLabel}
                </a>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {contactCards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-[24px] border border-black/5 bg-white p-5 shadow-[var(--shadow-soft)]"
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand-700)]">
                    {card.label}
                  </div>
                  <div className="mt-2 text-sm text-[var(--ink-800)]">
                    {card.value}
                  </div>
                </div>
              ))}
              <div className="rounded-[24px] border border-black/5 bg-white p-5 shadow-[var(--shadow-soft)]">
                <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand-700)]">
                  {locale.footer.socialLabel}
                </div>
                <div className="mt-3 flex items-center gap-3">
                  {locale.footer.socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-[var(--brand-700)] transition hover:bg-[var(--brand-100)]"
                      aria-label={link.label}
                    >
                      {link.label === "Telegram" && (
                        <svg
                          aria-hidden="true"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M19.9 4.6 3.7 10.5c-1.1.4-1.1 1.9 0 2.3l3.7 1.3 1.5 4.6c.2.6 1 .7 1.4.2l2.5-2.6 4.7 3.4c.6.4 1.4.1 1.6-.6l3.2-12.6c.2-.8-.6-1.5-1.4-1.3Z"
                            fill="currentColor"
                          />
                        </svg>
                      )}
                      {link.label === "Instagram" && (
                        <svg
                          aria-hidden="true"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <rect
                            x="4"
                            y="4"
                            width="16"
                            height="16"
                            rx="4"
                            stroke="currentColor"
                            strokeWidth="1.6"
                          />
                          <circle
                            cx="12"
                            cy="12"
                            r="3.5"
                            stroke="currentColor"
                            strokeWidth="1.6"
                          />
                          <circle cx="16.5" cy="7.5" r="1" fill="currentColor" />
                        </svg>
                      )}
                      {link.label === "WhatsApp" && (
                        <svg
                          aria-hidden="true"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M12 4.2A7.8 7.8 0 0 0 6.2 17l-.7 2.6 2.7-.7A7.8 7.8 0 1 0 12 4.2Z"
                            stroke="currentColor"
                            strokeWidth="1.6"
                          />
                          <path
                            d="M9.6 9.4c.2-.3.5-.3.7-.1l.8.8c.2.2.2.4.1.6l-.3.6c.5.9 1.2 1.6 2.1 2.1l.6-.3c.2-.1.5-.1.6.1l.8.8c.2.2.2.5-.1.7-.4.3-.9.4-1.4.3-2.2-.4-4-2.2-4.4-4.4-.1-.5 0-1 .3-1.4Z"
                            fill="currentColor"
                          />
                        </svg>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            </div>

          </div>
          <div className="overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-[var(--shadow-soft)]">
            <iframe
              title="Qoratosh Travel map"
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              className="h-[520px] w-full border-0"
              loading="lazy"
            />
          </div>
        </section>

        <section className="mt-8">
          <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-[var(--shadow-soft)]">
            <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand-700)]">
              {quickTitle}
            </div>
            <form className="mt-4 grid gap-3 text-sm text-[var(--ink-700)] md:grid-cols-2">
              <input
                type="text"
                placeholder={quickName}
                className="w-full rounded-2xl border border-black/10 bg-[var(--sand-50)] px-4 py-2 text-sm text-[var(--ink-900)] focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-100)]"
              />
              <input
                type="tel"
                placeholder={quickPhone}
                className="w-full rounded-2xl border border-black/10 bg-[var(--sand-50)] px-4 py-2 text-sm text-[var(--ink-900)] focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-100)]"
              />
              <textarea
                rows={3}
                placeholder={quickMessage}
                className="md:col-span-2 w-full resize-none rounded-2xl border border-black/10 bg-[var(--sand-50)] px-4 py-2 text-sm text-[var(--ink-900)] focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-100)]"
              />
              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="rounded-full bg-[var(--brand-700)] px-5 py-2 text-sm font-semibold text-white"
                >
                  {quickSubmit}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale.footer} />
    </div>
  );
}
