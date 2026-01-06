import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useTranslate } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";

const navItems = [
  { label: { en: "Home", bn: "Home" }, href: "/", end: true },
  { label: { en: "About", bn: "About" }, href: "/about" },
  { label: { en: "Reviews", bn: "Reviews" }, href: "/#reviews" },
  { label: { en: "Features", bn: "Features" }, href: "/#features" },
];

export function MarketingNav() {
  const [open, setOpen] = useState(false);
  const t = useTranslate();

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 md:py-4">
        <Link to="/" className="flex items-center gap-2" aria-label={t({ en: "HomeSchool home", bn: "HomeSchool home" })}>
          <img src="/logo.png" alt="HomeSchool" className="h-10 w-auto" loading="eager" />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-8 md:flex" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "text-sm font-semibold transition-colors",
                  isActive ? "text-[#1f2efb]" : "text-slate-600 hover:text-slate-900"
                )
              }
            >
              {t(item.label)}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageToggle
            variant="ghost"
            className="rounded-full px-3 text-xs font-semibold text-slate-600 hover:bg-transparent hover:text-slate-900"
          />
          <Link to="/login">
            <Button
              size="sm"
              className="rounded-full bg-gradient-to-r from-[#1f2efb] to-[#2c4bff] px-5 text-xs font-semibold text-white shadow-[0_12px_20px_-12px_rgba(31,46,251,0.7)] hover:opacity-95"
            >
              {t({ en: "Sign in", bn: "Sign in" })}
            </Button>
          </Link>
          <Link to="/pricing">
            <Button
              size="sm"
              className="rounded-full bg-gradient-to-r from-[#f9c76d] to-[#f29b38] px-5 text-xs font-semibold text-[#1f2937] shadow-[0_12px_20px_-12px_rgba(241,155,56,0.7)] hover:opacity-95"
            >
              {t({ en: "Get Premium", bn: "Get Premium" })}
            </Button>
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-white/60 bg-white/80 p-2 text-slate-600 shadow-sm transition hover:text-slate-900 md:hidden"
          aria-label={open ? t({ en: "Close menu", bn: "Close menu" }) : t({ en: "Open menu", bn: "Open menu" })}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div id="mobile-menu" className={cn("border-t border-white/70 bg-white/95 md:hidden", open ? "block" : "hidden")}>
        <nav className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4" aria-label="Mobile">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  isActive ? "bg-blue-50 text-[#1f2efb]" : "text-slate-600 hover:text-slate-900"
                )
              }
            >
              {t(item.label)}
            </NavLink>
          ))}
          <div className="mt-3 flex flex-col gap-2">
            <LanguageToggle variant="outline" className="w-full rounded-full text-xs font-semibold text-slate-700" />
            <Link to="/login" onClick={() => setOpen(false)}>
              <Button
                className="w-full rounded-full bg-gradient-to-r from-[#1f2efb] to-[#2c4bff] text-xs font-semibold text-white shadow-[0_12px_20px_-12px_rgba(31,46,251,0.7)]"
              >
                {t({ en: "Sign in", bn: "Sign in" })}
              </Button>
            </Link>
            <Link to="/pricing" onClick={() => setOpen(false)}>
              <Button
                className="w-full rounded-full bg-gradient-to-r from-[#f9c76d] to-[#f29b38] text-xs font-semibold text-[#1f2937] shadow-[0_12px_20px_-12px_rgba(241,155,56,0.7)]"
              >
                {t({ en: "Get Premium", bn: "Get Premium" })}
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
