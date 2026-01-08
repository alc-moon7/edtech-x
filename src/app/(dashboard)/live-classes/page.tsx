"use client";

import { ChevronDown, Flame } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useTranslate } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const calendarDays = [
  { key: "sun-28", date: 28, monthOffset: -1, weekday: { en: "SUN", bn: "রবি" } },
  { key: "mon-29", date: 29, monthOffset: -1, weekday: { en: "MON", bn: "সোম" } },
  { key: "tue-30", date: 30, monthOffset: -1, weekday: { en: "TUE", bn: "মঙ্গল" } },
  {
    key: "wed-31",
    date: 31,
    monthOffset: -1,
    weekday: { en: "WED", bn: "বুধ" },
    events: [{ label: { en: "New Year's Eve", bn: "নতুন বছরের শেষ রাত" }, tone: "emerald" }],
  },
  {
    key: "thu-1",
    date: 1,
    monthOffset: 0,
    weekday: { en: "THU", bn: "বৃহ" },
    events: [{ label: { en: "New Year's Day", bn: "নতুন বছরের দিন" }, tone: "emerald" }],
  },
  { key: "fri-2", date: 2, monthOffset: 0, weekday: { en: "FRI", bn: "শুক্র" }, flame: true },
  { key: "sat-3", date: 3, monthOffset: 0, weekday: { en: "SAT", bn: "শনি" } },
  { key: "sun-4", date: 4, monthOffset: 0, flame: true },
  { key: "mon-5", date: 5, monthOffset: 0, flame: true },
  { key: "tue-6", date: 6, monthOffset: 0, flame: true },
  { key: "wed-7", date: 7, monthOffset: 0 },
  { key: "thu-8", date: 8, monthOffset: 0, flame: true, highlight: true },
  { key: "fri-9", date: 9, monthOffset: 0 },
  {
    key: "sat-10",
    date: 10,
    monthOffset: 0,
    events: [{ label: { en: "Bangabandhu Homecoming", bn: "বঙ্গবন্ধু স্বদেশ প্রত্যাবর্তন" }, tone: "emerald" }],
  },
  { key: "sun-11", date: 11, monthOffset: 0 },
  { key: "mon-12", date: 12, monthOffset: 0 },
  { key: "tue-13", date: 13, monthOffset: 0 },
  { key: "wed-14", date: 14, monthOffset: 0 },
  { key: "thu-15", date: 15, monthOffset: 0 },
  {
    key: "fri-16",
    date: 16,
    monthOffset: 0,
    events: [{ label: { en: "Shab-e-Meraj (tentative)", bn: "শবে মেরাজ (সম্ভাব্য)" }, tone: "emerald" }],
  },
  { key: "sat-17", date: 17, monthOffset: 0 },
  { key: "sun-18", date: 18, monthOffset: 0 },
  { key: "mon-19", date: 19, monthOffset: 0 },
  { key: "tue-20", date: 20, monthOffset: 0 },
  { key: "wed-21", date: 21, monthOffset: 0 },
  { key: "thu-22", date: 22, monthOffset: 0 },
  { key: "fri-23", date: 23, monthOffset: 0 },
  { key: "sat-24", date: 24, monthOffset: 0 },
  { key: "sun-25", date: 25, monthOffset: 0 },
  { key: "mon-26", date: 26, monthOffset: 0 },
  { key: "tue-27", date: 27, monthOffset: 0 },
  { key: "wed-28", date: 28, monthOffset: 0 },
  { key: "thu-29", date: 29, monthOffset: 0 },
  { key: "fri-30", date: 30, monthOffset: 0 },
  { key: "sat-31", date: 31, monthOffset: 0 },
];

export default function SchedulePage() {
  const { user } = useAuth();
  const t = useTranslate();
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Arjun";
  const displayClass = user?.user_metadata?.class || "7";

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
        <div className="overflow-x-auto">
          <div className="min-w-[720px]">
            <div className="grid grid-cols-7">
              {calendarDays.map((day, index) => {
                const isTopRow = index < 7;
                const isLastRow = index >= calendarDays.length - 7;
                const isLastCol = (index + 1) % 7 === 0;
                const mutedDate = day.monthOffset !== 0;
                return (
                  <div
                    key={day.key}
                    className={cn(
                      "min-h-[92px] p-2 sm:p-3",
                      !isLastRow && "border-b border-slate-200",
                      !isLastCol && "border-r border-slate-200"
                    )}
                  >
                    {isTopRow && (
                      <div className="text-[10px] font-semibold text-slate-400">{t(day.weekday!)}</div>
                    )}
                    <div className="mt-1 flex items-center justify-between">
                      {day.highlight ? (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[11px] font-semibold text-white">
                          {day.date}
                        </span>
                      ) : (
                        <span
                          className={cn(
                            "text-[11px] font-semibold",
                            mutedDate ? "text-slate-400" : "text-slate-700"
                          )}
                        >
                          {day.date}
                        </span>
                      )}
                      {day.flame && <Flame className="h-4 w-4 text-orange-400" />}
                    </div>
                    {day.events && day.events.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {day.events.map((event) => (
                          <span
                            key={`${day.key}-${event.label.en}`}
                            className={cn(
                              "inline-flex w-full items-center justify-center rounded-full px-2 py-0.5 text-[9px] font-semibold text-white",
                              event.tone === "emerald" && "bg-emerald-600"
                            )}
                            title={t(event.label)}
                          >
                            <span className="truncate">{t(event.label)}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
