"use client";

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Search } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useStudent } from "@/lib/store";
import { useTranslate } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const tabs = [
  { key: "all", label: { en: "All Class", bn: "All Class" } },
  { key: "ongoing", label: { en: "Ongoing Class", bn: "Ongoing Class" } },
  { key: "ended", label: { en: "Ended Class", bn: "Ended Class" } },
];

export default function CoursesPage() {
  const { user } = useAuth();
  const { courses } = useStudent();
  const t = useTranslate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Arjun";
  const displayClass = user?.user_metadata?.class || "7";

  const resolvedCards = useMemo(() => {
    if (!courses.length) {
      return [];
    }
    return courses.map((course) => ({
      key: course.id,
      title: { en: course.title, bn: course.title },
      status: course.status ?? "ongoing",
      cover: course.cover,
      courseId: course.id,
      classLabel: course.class,
      isPurchased: course.isPurchased === true,
      isFree: course.isFree === true,
      hasFreeChapter: course.chapters?.some((chapter) => chapter.isFree) ?? false,
      priceFull: course.priceFull ?? null,
    }));
  }, [courses, displayClass]);

  const visibleCards = useMemo(() => {
    const filtered = activeTab === "all"
      ? resolvedCards
      : resolvedCards.filter((card) => card.status === activeTab);
    if (!searchQuery.trim()) return filtered;
    const query = searchQuery.trim().toLowerCase();
    return filtered.filter((card) => card.title.en.toLowerCase().includes(query));
  }, [activeTab, resolvedCards, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-slate-200/60">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">
              {t({ en: "Welcome back,", bn: "স্বাগতম," })} {displayName}!
            </h1>
            <p className="text-xs text-slate-500">
              {t({ en: "Class", bn: "শ্রেণি" })} : {displayClass}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-2 py-1.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-semibold text-slate-600">
              {displayName.slice(0, 1).toUpperCase()}
            </span>
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/60">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t({ en: "Search class name", bn: "ক্লাসের নাম খুঁজুন" })}
              className="h-11 w-full rounded-full border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-wrap items-center gap-6 border-b border-slate-200 pb-2 text-sm font-medium text-slate-500">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "relative pb-2 transition-colors",
                  activeTab === tab.key ? "text-blue-600" : "hover:text-slate-700"
                )}
              >
                {t(tab.label)}
                {activeTab === tab.key && (
                  <span className="absolute left-0 right-0 -bottom-[9px] h-0.5 rounded-full bg-blue-600" />
                )}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {visibleCards.map((card) => (
              <div
                key={card.key}
                className="rounded-2xl border border-slate-200/70 bg-white p-3 shadow-sm"
              >
                <div
                  className={cn(
                    "relative w-full overflow-hidden rounded-xl bg-gradient-to-b text-white",
                    card.cover
                  )}
                >
                  <div className="absolute left-3 top-3 flex flex-col gap-1">
                    <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-700">
                      {t({ en: card.classLabel ?? "Class", bn: card.classLabel ?? "Class" })}
                    </span>
                    {card.priceFull !== null && (
                      <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                        BDT {card.priceFull}
                      </span>
                    )}
                    {card.hasFreeChapter && (
                      <span className="rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                        {t({ en: "Free chapter", bn: "Free chapter" })}
                      </span>
                    )}
                  </div>
                  <div className="flex min-h-[160px] flex-col items-center justify-center px-3 text-center">
                    <div className="text-sm font-semibold">{t(card.title)}</div>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    {card.courseId ? (
                      <Link
                        to={`/courses/${card.courseId}`}
                        className="block w-full rounded-full bg-white/90 py-1.5 text-center text-[11px] font-semibold text-slate-700 shadow-sm"
                      >
                        {card.isPurchased
                          ? t({ en: "Continue Subject", bn: "Continue Subject" })
                          : t({ en: "Buy Subject", bn: "Buy Subject" })}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className="w-full rounded-full bg-white/90 py-1.5 text-[11px] font-semibold text-slate-700 shadow-sm"
                      >
                        {t({ en: "Continue Class", bn: "ক্লাস চালিয়ে যান" })}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
