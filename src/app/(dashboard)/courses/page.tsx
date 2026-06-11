"use client";

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
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
    const mapped = courses.map((course) => ({
      key: course.id,
      title: { en: course.title, bn: course.title },
      status: course.status ?? "ongoing",
      cover: course.cover,
      coverImage: course.coverImage,
      courseId: course.id,
      classLabel: course.class,
      isPurchased: course.isPurchased === true,
      isFree: course.isFree === true,
      hasFreeChapter: course.chapters?.some((chapter) => chapter.isFree) ?? false,
      priceFull: course.priceFull ?? null,
    }));
    
    return mapped.sort((a, b) => {
      const aIsAgri = a.title.en.toLowerCase().includes("agriculture");
      const bIsAgri = b.title.en.toLowerCase().includes("agriculture");
      if (aIsAgri && !bIsAgri) return 1;
      if (!aIsAgri && bIsAgri) return -1;
      return 0;
    });
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
            {visibleCards.map((card) => {
              const innerContent = (
                <>
                  {!card.coverImage && (
                    <div className="absolute left-3 top-3 flex flex-col gap-1 z-10">
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
                  )}
                  
                  {!card.coverImage && (
                    <div className="flex h-full flex-col items-center justify-center px-3 text-center relative z-10">
                      <div className="text-sm font-semibold text-white drop-shadow-md">{t(card.title)}</div>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-1/2 w-[85%] z-10 -translate-x-1/2 translate-y-16 transition-all duration-300 ease-out group-hover:translate-y-0 transform-gpu">
                    <div className="flex items-center justify-between w-full rounded-full border border-white/40 bg-white/20 backdrop-blur-md px-4 py-2 text-center text-[11px] font-semibold text-white shadow-sm hover:bg-white/30">
                      <span>{t({ en: "Continue Class", bn: "ক্লাস চালিয়ে যান" })}</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </>
              );

              const className = cn(
                "relative block w-full overflow-hidden rounded-xl text-white shadow-sm aspect-[196/268] group transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer transform-gpu will-change-transform",
                !card.coverImage && "bg-gradient-to-b",
                !card.coverImage && card.cover
              );
              
              const style = card.coverImage ? { backgroundImage: `url('${card.coverImage}')`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined;

              if (card.courseId) {
                return (
                  <Link key={card.key} to={`/courses/${card.courseId}`} className={className} style={style}>
                    {innerContent}
                  </Link>
                );
              }
              
              return (
                <div key={card.key} className={className} style={style}>
                  {innerContent}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
