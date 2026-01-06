import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useTranslate } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";

const navItems = [
  { label: { en: "Home", bn: "Home" }, href: "/#home" },
  { label: { en: "Subjects", bn: "Subjects" }, href: "/#subjects" },
  { label: { en: "About", bn: "About" }, href: "/about" },
  { label: { en: "Reviews", bn: "Reviews" }, href: "/#reviews" },
  { label: { en: "Features", bn: "Features" }, href: "/#features" },
];

export function MarketingNav() {
  const [open, setOpen] = useState(false);
  const t = useTranslate();

  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-[70px] w-full max-w-[1728px] items-center justify-between px-4 sm:h-[84px] sm:px-8 lg:h-[96px] lg:px-10 xl:h-[100px] xl:px-[72px] 2xl:h-[106px] 2xl:pl-[125px] 2xl:pr-[40px]">
        <Link to="/" className="flex items-center" aria-label={t({ en: "HomeSchool home", bn: "HomeSchool home" })}>
          <img src="/figma/logo.png" alt="HomeSchool" className="h-8 w-auto sm:h-10 lg:h-12 xl:h-[52px] 2xl:h-[59px]" loading="eager" />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-6 text-[15px] font-bold text-black lg:flex xl:gap-8 xl:text-[16px]" aria-label="Primary">
          {navItems.map((item) => (
            <Link key={item.href} to={item.href} className="transition-colors hover:text-[#060BF7]">
              {t(item.label)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex xl:gap-5">
          <LanguageToggle
            variant="ghost"
            className="h-auto gap-1 rounded-none px-0 py-0 text-[13px] font-bold text-black hover:bg-transparent lg:text-[15px] xl:text-[16px]"
          />
          <Link to="/login">
            <Button
              className="h-[38px] rounded-[12px] bg-[#060BF7] px-4 text-[13px] font-bold text-white shadow-[0_12px_20px_rgba(115,82,221,0.13)] hover:bg-[#060BF7]/90 lg:h-[44px] lg:px-5 lg:text-[15px] xl:h-[46px] xl:px-6 xl:text-[16px]"
            >
              {t({ en: "Sign in", bn: "Sign in" })}
            </Button>
          </Link>
          <Link to="/pricing">
            <Button
              className="h-[38px] rounded-[12px] bg-[#F3AB36] px-4 text-[13px] font-bold text-black shadow-[0_12px_20px_rgba(115,82,221,0.13)] hover:bg-[#f0a529] lg:h-[44px] lg:px-5 lg:text-[15px] xl:h-[46px] xl:px-6 xl:text-[16px]"
            >
              {t({ en: "Get Premium", bn: "Get Premium" })}
            </Button>
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition hover:text-slate-900 lg:hidden"
          aria-label={open ? t({ en: "Close menu", bn: "Close menu" }) : t({ en: "Open menu", bn: "Open menu" })}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div id="mobile-menu" className={cn("border-t border-slate-200 bg-white/90 backdrop-blur-lg lg:hidden", open ? "block" : "hidden")}>
        <nav className="mx-auto flex max-w-[1728px] flex-col gap-2 px-4 py-4" aria-label="Mobile">
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
