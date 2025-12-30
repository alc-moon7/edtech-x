import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useTranslate } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";

const navItems = [
  { label: { en: "Home", bn: "হোম" }, href: "/", end: true },
  { label: { en: "About", bn: "আমাদের সম্পর্কে" }, href: "/about" },
  { label: { en: "Pricing", bn: "মূল্য" }, href: "/pricing" },
  { label: { en: "Contact", bn: "যোগাযোগ" }, href: "/contact" },
  { label: { en: "Help", bn: "সহায়তা" }, href: "/help" },
];

export function MarketingNav() {
  const [open, setOpen] = useState(false);
  const t = useTranslate();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
        <Link to="/" className="flex items-center gap-2" aria-label="HomeSchool home">
          <img
            src="/logo.png"
            alt="HomeSchool"
            className="h-10 w-auto"
            loading="eager"
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-muted-foreground"
                )
              }
            >
              {t(item.label)}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageToggle />
          <Link to="/login">
            <Button variant="ghost">{t({ en: "Sign in", bn: "সাইন ইন" })}</Button>
          </Link>
          <Link to="/signup">
            <Button>{t({ en: "Get started", bn: "শুরু করুন" })}</Button>
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-lg border border-border bg-background p-2 text-muted-foreground hover:text-foreground"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        id="mobile-menu"
        className={cn("border-t border-border bg-background md:hidden", open ? "block" : "hidden")}
      >
        <nav className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4" aria-label="Mobile">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              {t(item.label)}
            </NavLink>
          ))}
          <div className="mt-3 flex flex-col gap-2">
            <LanguageToggle className="w-full" />
            <Link to="/login" onClick={() => setOpen(false)}>
              <Button variant="outline" className="w-full">
                {t({ en: "Sign in", bn: "সাইন ইন" })}
              </Button>
            </Link>
            <Link to="/signup" onClick={() => setOpen(false)}>
              <Button className="w-full">{t({ en: "Get started", bn: "শুরু করুন" })}</Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
