"use client";

import { Link, NavLink, useNavigate } from "react-router-dom";
import { BookOpen, Brain, CalendarDays, LineChart, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useTranslate } from "@/lib/i18n";

const sidebarItems = [
  {
    title: { en: "Class", bn: "শ্রেণি" },
    href: "/courses",
    icon: BookOpen,
  },
  {
    title: { en: "Schedule", bn: "সময়সূচি" },
    href: "/live-classes",
    icon: CalendarDays,
  },
  {
    title: { en: "AI Tutor", bn: "এআই টিউটর" },
    href: "/help",
    icon: Brain,
  },
  {
    title: { en: "Progress", bn: "প্রোগ্রেস" },
    href: "/progress",
    icon: LineChart,
  },
];

export function Sidebar() {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const t = useTranslate();
  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    t({ en: "Student", bn: "শিক্ষার্থী" });

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-slate-200 bg-white md:flex">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="HomeSchool" className="h-10 w-auto" loading="lazy" />
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-2 px-4 py-4" aria-label="Dashboard">
        {sidebarItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.href}
              to={item.href}
              end
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

      <div className="border-t border-slate-200 p-4">
        <div className="mb-3 text-xs text-slate-500">
          {t({ en: "Signed in as", bn: "সাইন ইন করেছেন" })}: {displayName}
        </div>
        <NavLink
          to="/settings"
          end
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
          {t({ en: "Settings", bn: "সেটিংস" })}
        </NavLink>
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          {t({ en: "Sign Out", bn: "সাইন আউট" })}
        </button>
      </div>
    </div>
  );
}
