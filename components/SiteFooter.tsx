type FooterLocale = {
  title: string;
  text: string;
  contactsTitle: string;
  address: string;
  phone: string;
  email: string;
  socialLabel: string;
  socialLinks: readonly { href: string; label: string }[];
};

type SiteFooterProps = {
  locale: FooterLocale;
};

export default function SiteFooter({ locale }: SiteFooterProps) {
  return (
    <footer
      id="contacts"
      className="relative mt-20 overflow-hidden border-t border-white/40"
    >
      <div className="absolute inset-0 opacity-45">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(18, 148, 93, 0.45), transparent 55%), radial-gradient(circle at 80% 0%, rgba(11, 122, 75, 0.35), transparent 45%), url('https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>
      <div className="relative mx-auto grid w-full max-w-6xl gap-4 px-6 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-3 rounded-3xl border border-white/40 bg-white/65 p-6 backdrop-blur">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Qoratosh Travel"
              className="h-10 w-10 object-contain"
              loading="lazy"
            />
            <div className="font-display text-2xl font-semibold text-[var(--brand-700)]">
              {locale.title}
            </div>
          </div>
          <p className="text-sm text-[var(--ink-700)]">{locale.text}</p>
        </div>
        <div className="space-y-2 rounded-3xl border border-white/40 bg-white/65 p-6 text-sm text-[var(--ink-700)] backdrop-blur">
          <div className="font-semibold text-[var(--ink-900)]">
            {locale.contactsTitle}
          </div>
          <div>{locale.address}</div>
          <div>{locale.phone}</div>
          <div>{locale.email}</div>
        </div>
        <div className="space-y-3 rounded-3xl border border-white/40 bg-white/65 p-6 backdrop-blur">
          <div className="font-semibold text-[var(--ink-900)]">
            {locale.socialLabel}
          </div>
          <div className="flex items-center gap-3">
            {locale.socialLinks.map((link) => (
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
    </footer>
  );
}
