import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useTranslate } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";

const navItems = [
  { label: { en: "Home", bn: "Home" }, href: "/#home" },
  { label: { en: "About", bn: "About" }, href: "/about" },
  { label: { en: "Reviews", bn: "Reviews" }, href: "/#reviews" },
  { label: { en: "Features", bn: "Features" }, href: "/#features" },
];

export function MarketingNav() {
  const [open, setOpen] = useState(false);
  const t = useTranslate();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/50 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:h-16 lg:px-8">
        <Link to="/" className="flex items-center" aria-label={t({ en: "HomeSchool home", bn: "HomeSchool home" })}>
          <img src="/figma/logo.png" alt="HomeSchool" className="h-8 w-auto sm:h-9 lg:h-10" loading="eager" />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-5 text-sm font-semibold text-black lg:flex lg:text-base" aria-label="Primary">
          {navItems.map((item) => (
            <Link key={item.href} to={item.href} className="transition-colors hover:text-[#060BF7]">
              {t(item.label)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageToggle
            variant="ghost"
            className="h-auto gap-1 rounded-none px-0 py-0 text-xs font-semibold text-black hover:bg-transparent lg:text-sm"
          />
          <Link to="/login">
            <Button
              className="h-9 rounded-xl bg-[#060BF7] px-4 text-xs font-semibold text-white shadow-sm hover:bg-[#060BF7]/90 sm:h-10 sm:px-5 sm:text-sm lg:h-10 lg:text-base"
            >
              {t({ en: "Sign in", bn: "Sign in" })}
            </Button>
          </Link>
          <Link to="/pricing">
            <Button
              className="h-9 rounded-xl bg-[#F3AB36] px-4 text-xs font-semibold text-black shadow-sm hover:bg-[#f0a529] sm:h-10 sm:px-5 sm:text-sm lg:h-10 lg:text-base"
            >
              {t({ en: "Get Premium", bn: "Get Premium" })}
            </Button>
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 p-2 text-slate-700 shadow-sm transition hover:text-slate-900 lg:hidden"
          aria-label={open ? t({ en: "Close menu", bn: "Close menu" }) : t({ en: "Open menu", bn: "Open menu" })}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div id="mobile-menu" className={cn("border-t border-slate-200 bg-white/90 backdrop-blur-lg lg:hidden", open ? "block" : "hidden")}>
        <nav className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4" aria-label="Mobile">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setOpen(false)}
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:text-slate-900"
            >
              {t(item.label)}
            </Link>
          ))}
          <div className="mt-3 flex flex-col gap-2">
            <LanguageToggle variant="outline" className="w-full rounded-full text-xs font-semibold text-slate-700" />
            <Link to="/login" onClick={() => setOpen(false)}>
              <Button className="w-full rounded-full bg-[#060BF7] text-xs font-semibold text-white">
                {t({ en: "Sign in", bn: "Sign in" })}
              </Button>
            </Link>
            <Link to="/pricing" onClick={() => setOpen(false)}>
              <Button className="w-full rounded-full bg-[#F3AB36] text-xs font-semibold text-black">
                {t({ en: "Get Premium", bn: "Get Premium" })}
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
