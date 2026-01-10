"use client";

import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Bell,
  Search,
  Menu,
  User,
  BookOpen,
  CalendarDays,
  LineChart,
  LogOut,
  Settings,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useTranslate } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";
import { cn } from "@/lib/utils";

const mobileNavItems = [
  {
    title: { en: "Class", bn: "??????" },
    href: "/courses",
    icon: BookOpen,
  },
  {
    title: { en: "Schedule", bn: "????????" },
    href: "/live-classes",
    icon: CalendarDays,
  },
  {
    title: { en: "Progress", bn: "?????????" },
    href: "/progress",
    icon: LineChart,
  },
];

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const t = useTranslate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    t({ en: "Student", bn: "??????????" });
  const displayClass = user?.user_metadata?.class || t({ en: "Class", bn: "??????" });

  const handleSignOut = async () => {
    await signOut();
    setMobileOpen(false);
    navigate("/login");
  };

  return (
    <>
      <div className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-4 md:px-6 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-muted-foreground hover:text-foreground"
            aria-label={t({ en: "Open sidebar", bn: "??????? ?????" })}
            aria-expanded={mobileOpen}
            aria-controls="dashboard-mobile-menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder={t({ en: "Search courses...", bn: "????? ??????..." })}
              aria-label={t({ en: "Search courses", bn: "????? ??????" })}
              className="h-9 w-64 rounded-xl border border-border bg-accent/50 py-2 pl-9 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <LanguageToggle variant="ghost" />
          <button
            type="button"
            className="relative rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            aria-label={t({ en: "Notifications", bn: "??????????" })}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-border">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-sm font-medium text-foreground">{displayName}</span>
              <span className="text-xs text-muted-foreground">{displayClass}</span>
            </div>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-all border border-primary/20"
              aria-label={t({ en: "User menu", bn: "????? ????" })}
            >
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div
        id="dashboard-mobile-menu"
        className={cn("fixed inset-0 z-40 md:hidden", mobileOpen ? "block" : "hidden")}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className="absolute inset-0 bg-slate-900/30"
          onClick={() => setMobileOpen(false)}
          aria-label={t({ en: "Close menu", bn: "???? ???? ????" })}
        />
        <div className="relative h-full w-72 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
              <img src="/logo.png" alt="HomeSchool" className="h-8 w-auto" loading="lazy" />
            </Link>
            <button
              type="button"
              className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
              onClick={() => setMobileOpen(false)}
              aria-label={t({ en: "Close menu", bn: "???? ???? ????" })}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-2 px-4 py-4" aria-label="Dashboard">
            {mobileNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-slate-200 text-slate-900 shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )
                  }
                >
                  <Icon className="h-5 w-5" />
                  {t(item.title)}
                </NavLink>
              );
            })}
          </nav>

          <div className="border-t border-slate-200 px-4 py-4">
            <div className="mb-3 text-xs text-slate-500">
              {t({ en: "Signed in as", bn: "???? ?? ??????" })}: {displayName}
            </div>
            <NavLink
              to="/settings"
              end
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  "mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-slate-200 text-slate-900 shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )
              }
            >
              <Settings className="h-5 w-5" />
              {t({ en: "Settings", bn: "??????" })}
            </NavLink>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              {t({ en: "Sign Out", bn: "???? ???" })}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

