"use client";

import { useEffect, useRef, useState } from "react";

export type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  value: string;
  options: SelectOption[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
};

export default function Select({
  value,
  options,
  placeholder,
  onChange,
  className,
  buttonClassName,
  menuClassName,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const active = options.find((option) => option.value === value);

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

  return (
    <div ref={rootRef} className={`relative ${className ?? ""}`}>
      <button
        type="button"
        className={`flex w-full items-center justify-between gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[var(--ink-900)] ${buttonClassName ?? ""}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={active ? "" : "text-[var(--ink-700)]"}>
          {active ? active.label : placeholder}
        </span>
        <span className="text-[var(--brand-700)]">▾</span>
      </button>
      <div
        className={`absolute left-0 top-full z-20 mt-2 w-full origin-top rounded-2xl border border-black/10 bg-white p-2 shadow-lg transition-all duration-200 ease-out ${
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        } ${menuClassName ?? ""}`}
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors ${
              option.value === value
                ? "bg-[var(--brand-100)] text-[var(--brand-700)]"
                : "text-[var(--ink-900)] hover:bg-[var(--sand-50)]"
            }`}
            onClick={() => {
              onChange(option.value);
              setOpen(false);
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
