"use client";

import { Link, NavLink, useNavigate } from "react-router-dom";
import { BookOpen, Bot, CalendarDays, LayoutDashboard, LogOut, Settings, BrainCircuit, Globe2, Network } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useTranslate } from "@/lib/i18n";

type SidebarItem = {
  title: { en: string; bn: string };
  href: string;
  icon: React.ElementType;
  isComingSoon?: boolean;
};

const sidebarItems: SidebarItem[] = [
  {
    title: { en: "Dashboard", bn: "ড্যাশবোর্ড" },
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: { en: "Class", bn: "ক্লাস" },
    href: "/courses",
    icon: BookOpen,
  },
  {
    title: { en: "Schedule", bn: "সময়সূচি" },
    href: "/live-classes",
    icon: CalendarDays,
  },
  {
    title: { en: "HomeSchool AI", bn: "হোমস্কুল এআই" },
    href: "/homeschool-ai",
    icon: Bot,
  },
  {
    title: { en: "Brain Analytics", bn: "ব্রেইন অ্যানালিটিক্স" },
    href: "#brain-analytics",
    icon: BrainCircuit,
    isComingSoon: true,
  },
  {
    title: { en: "Global Arena", bn: "গ্লোবাল অ্যারেনা" },
    href: "#global-arena",
    icon: Globe2,
    isComingSoon: true,
  },
  {
    title: { en: "Skill Matrix", bn: "স্কিল ম্যাট্রিক্স" },
    href: "#skill-matrix",
    icon: Network,
    isComingSoon: true,
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

          if (item.isComingSoon) {
            return (
              <div
                key={item.href}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-slate-400/80 cursor-not-allowed select-none transition-colors hover:bg-slate-50/50"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 opacity-70" />
                  {t(item.title)}
                </div>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#060BF7] bg-[#060BF7]/10 px-2 py-0.5 rounded-full ring-1 ring-[#060BF7]/20 shadow-sm">
                  {t({ en: "Soon", bn: "আসছে" })}
                </span>
              </div>
            );
          }

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

