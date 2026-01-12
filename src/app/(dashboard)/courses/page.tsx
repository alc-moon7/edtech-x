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

const classCards = [
  {
    key: "bangla",
    title: { en: "Bangla", bn: "Bangla" },
    status: "ongoing",
    cover: "from-emerald-600 via-emerald-500 to-emerald-700",
  },
  {
    key: "social",
    title: { en: "Social Science", bn: "Social Science" },
    status: "ongoing",
    cover: "from-teal-600 via-cyan-500 to-emerald-600",
  },
  {
    key: "english-1",
    title: { en: "English 1st Paper", bn: "English 1st Paper" },
    status: "ongoing",
    cover: "from-amber-600 via-orange-500 to-amber-700",
  },
  {
    key: "english-2",
    title: { en: "English 2nd Paper", bn: "English 2nd Paper" },
    status: "ongoing",
    cover: "from-emerald-600 via-lime-500 to-emerald-700",
  },
  {
    key: "math",
    title: { en: "Mathematics", bn: "Mathematics" },
    status: "ongoing",
    cover: "from-indigo-600 via-blue-500 to-indigo-700",
  },
  {
    key: "ict",
    title: { en: "ICT", bn: "ICT" },
    status: "ongoing",
    cover: "from-slate-600 via-slate-500 to-slate-700",
  },
  {
    key: "science",
    title: { en: "Science", bn: "Science" },
    status: "ongoing",
    cover: "from-emerald-700 via-emerald-600 to-emerald-800",
  },
  {
    key: "religion",
    title: { en: "Religion & Ethics", bn: "Religion & Ethics" },
    status: "ongoing",
    cover: "from-rose-600 via-rose-500 to-rose-700",
  },
  {
    key: "agriculture",
    title: { en: "Agriculture Studies", bn: "Agriculture Studies" },
    status: "ongoing",
    cover: "from-green-700 via-green-600 to-emerald-700",
  },
  {
    key: "arts",
    title: { en: "Fine Arts", bn: "Fine Arts" },
    status: "ended",
    cover: "from-purple-600 via-purple-500 to-indigo-600",
  },
  {
    key: "civics",
    title: { en: "Civics & Citizenship", bn: "Civics & Citizenship" },
    status: "ended",
    cover: "from-yellow-700 via-yellow-600 to-orange-600",
  },
  {
    key: "geography",
    title: { en: "Geography", bn: "Geography" },
    status: "ended",
    cover: "from-sky-600 via-sky-500 to-blue-600",
  },
  {
    key: "health",
    title: { en: "Health & Sports", bn: "Health & Sports" },
    status: "ended",
    cover: "from-red-600 via-red-500 to-orange-600",
  },
  {
    key: "music",
    title: { en: "Music", bn: "Music" },
    status: "ended",
    cover: "from-amber-700 via-amber-600 to-yellow-600",
  },
  {
    key: "drawing",
    title: { en: "Drawing", bn: "Drawing" },
    status: "ended",
    cover: "from-lime-600 via-lime-500 to-green-600",
  },
  {
    key: "science-lab",
    title: { en: "Science Lab", bn: "Science Lab" },
    status: "ended",
    cover: "from-blue-700 via-blue-600 to-indigo-700",
  },
  {
    key: "history",
    title: { en: "History", bn: "History" },
    status: "ended",
    cover: "from-emerald-700 via-emerald-600 to-teal-700",
  },
  {
    key: "economics",
    title: { en: "Economics", bn: "Economics" },
    status: "ended",
    cover: "from-orange-700 via-orange-600 to-amber-700",
  },
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
      return classCards.map((card) => ({
        ...card,
        courseId: undefined,
        isPurchased: false,
        classLabel: displayClass,
      }));
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
                  <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-700">
                    {t({ en: card.classLabel ?? "Class", bn: card.classLabel ?? "Class" })}
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
                          ? t({ en: "Continue Class", bn: "????? ??????? ???" })
                          : t({ en: "Buy Course", bn: "????? ?????" })}
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
