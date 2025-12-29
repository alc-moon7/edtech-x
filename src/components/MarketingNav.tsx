import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { GraduationCap, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/", end: true },
  { label: "About", href: "/about" },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
  { label: "Help", href: "/help" },
];

export function MarketingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
        <Link to="/" className="flex items-center gap-2" aria-label="HomeSchool home">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
            <GraduationCap className="h-6 w-6" aria-hidden="true" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            HomeSchool
          </span>
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
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login">
            <Button variant="ghost">Sign in</Button>
          </Link>
          <Link to="/signup">
            <Button>Get started</Button>
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
              {item.label}
            </NavLink>
          ))}
          <div className="mt-3 flex flex-col gap-2">
            <Link to="/login" onClick={() => setOpen(false)}>
              <Button variant="outline" className="w-full">
                Sign in
              </Button>
            </Link>
            <Link to="/signup" onClick={() => setOpen(false)}>
              <Button className="w-full">Get started</Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
