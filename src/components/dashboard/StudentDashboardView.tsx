"use client";

import {
  Bell,
  BookOpen,
  CalendarDays,
  ChevronDown,
  Clock,
  Flame,
  Globe,
  PenLine,
  TrendingUp,
  FlaskConical,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useStudent } from "@/lib/store";
import { useTranslate } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const SUBJECT_ICON_MAP: Record<string, typeof BookOpen> = {
  mathematics: BookOpen,
  math: BookOpen,
  science: FlaskConical,
  english: PenLine,
  "social-studies": Globe,
  social: Globe,
};

function formatShortDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const statCards = [
  {
    key: "streak",
    title: { en: "Study Streak", bn: "স্টাডি স্ট্রিক" },
    value: "12",
    suffix: { en: "Days", bn: "দিন" },
    note: { en: "Keep it up!", bn: "চালিয়ে যান!" },
    noteClass: "text-orange-500",
    icon: Flame,
    iconClass: "bg-orange-100 text-orange-500",
  },
  {
    key: "hours",
    title: { en: "Total Hours", bn: "মোট সময়" },
    value: "59",
    suffix: { en: "hrs", bn: "ঘণ্টা" },
    note: { en: "+8% this week", bn: "এই সপ্তাহে +৮%" },
    noteClass: "text-emerald-500",
    icon: Clock,
    iconClass: "bg-blue-100 text-blue-500",
  },
  {
    key: "score",
    title: { en: "Average Score", bn: "গড় স্কোর" },
    value: "85%",
    note: { en: "+3% improvement", bn: "+৩% উন্নতি" },
    noteClass: "text-emerald-500",
    icon: TrendingUp,
    iconClass: "bg-emerald-100 text-emerald-500",
  },
  {
    key: "lessons",
    title: { en: "Lessons Done", bn: "সম্পন্ন লেসন" },
    value: "62/84",
    note: { en: "74% complete", bn: "৭৪% সম্পন্ন" },
    noteClass: "text-purple-500",
    icon: BookOpen,
    iconClass: "bg-purple-100 text-purple-500",
  },
];

const subjectCards = [
  {
    key: "math",
    title: { en: "Mathematics", bn: "গণিত" },
    lessons: "18/24",
    progress: 75,
    accent: "bg-blue-500",
    icon: BookOpen,
  },
  {
    key: "science",
    title: { en: "Science", bn: "বিজ্ঞান" },
    lessons: "16/20",
    progress: 82,
    accent: "bg-emerald-500",
    icon: FlaskConical,
  },
  {
    key: "english",
    title: { en: "English", bn: "ইংরেজি" },
    lessons: "12/18",
    progress: 68,
    accent: "bg-fuchsia-500",
    icon: PenLine,
  },
  {
    key: "social",
    title: { en: "Social Studies", bn: "সামাজিক বিজ্ঞান" },
    lessons: "16/22",
    progress: 71,
    accent: "bg-orange-500",
    icon: Globe,
  },
];

const performanceBars = [
  { label: { en: "Math", bn: "গণিত" }, value: 78 },
  { label: { en: "English", bn: "ইংরেজি" }, value: 90 },
  { label: { en: "Social", bn: "সমাজ" }, value: 70 },
  { label: { en: "Hindi", bn: "হিন্দি" }, value: 82 },
];

const studyHours = [12, 15, 18, 14];

const upcomingTests = [
  {
    key: "math",
    title: { en: "Mathematics", bn: "গণিত" },
    subtitle: { en: "Algebra - Linear Equations", bn: "বীজগণিত - সরল সমীকরণ" },
    date: { en: "Jan 15, 2025", bn: "১৫ জানুয়ারি, ২০২৫" },
    time: "10:00 AM",
    accent: "bg-purple-100 text-purple-600",
  },
  {
    key: "science",
    title: { en: "Science", bn: "বিজ্ঞান" },
    subtitle: { en: "Physics - Laws of Motion", bn: "পদার্থবিজ্ঞান - গতির সূত্র" },
    date: { en: "Jan 18, 2025", bn: "১৮ জানুয়ারি, ২০২৫" },
    time: "11:30 AM",
    accent: "bg-blue-100 text-blue-600",
  },
  {
    key: "english",
    title: { en: "English", bn: "ইংরেজি" },
    subtitle: { en: "Grammar - Tenses", bn: "ব্যাকরণ - কাল" },
    date: { en: "Jan 20, 2025", bn: "২০ জানুয়ারি, ২০২৫" },
    time: "9:00 AM",
    accent: "bg-emerald-100 text-emerald-600",
  },
];

export function StudentDashboardView() {
  const { user } = useAuth();
  const {
    leaderboard,
    dashboardStats,
    subjectCards: subjectCardsData,
    performanceBars: performanceBarsData,
    studyHours: studyHoursData,
    upcomingTests: upcomingTestsData,
  } = useStudent();
  const t = useTranslate();
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Arjun";
  const displayClass = user?.user_metadata?.class || t({ en: "Class 7", bn: "ক্লাস ৭" });

  const statValues: Record<string, string> = {
    streak: `${dashboardStats.streakDays}`,
    hours: `${dashboardStats.totalHours}`,
    score: `${dashboardStats.averageScore}%`,
    lessons: `${dashboardStats.lessonsDone}/${dashboardStats.lessonsTotal}`,
  };

  const subjectCardsForRender = subjectCardsData.map((subject) => ({
    ...subject,
    icon: SUBJECT_ICON_MAP[subject.key] ?? BookOpen,
    title: { en: subject.title, bn: subject.title },
  }));

  const performanceBarsForRender = performanceBarsData.map((bar) => ({
    label: { en: bar.label, bn: bar.label },
    value: bar.value,
  }));

  const upcomingTestsForRender = upcomingTestsData.map((test) => ({
    key: test.id,
    title: { en: test.title, bn: test.title },
    subtitle: { en: test.subtitle, bn: test.subtitle },
    date: { en: formatShortDate(test.date), bn: formatShortDate(test.date) },
    time: test.time,
    accent: test.accent,
  }));

  const resolvedStudyHours = studyHoursData;
  const maxHour = Math.max(...resolvedStudyHours, 1);
  const points = resolvedStudyHours
    .map((value, index) => {
      const x = (index / (resolvedStudyHours.length - 1)) * 220 + 20;
      const y = 120 - (value / maxHour) * 90;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-slate-200/60">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">
              {t({ en: "Welcome back,", bn: "স্বাগতম," })} {displayName}!
            </h1>
            <p className="text-xs text-slate-500">
              {t({ en: "Class", bn: "ক্লাস" })}: {displayClass}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm"
              aria-label={t({ en: "Notifications", bn: "নোটিফিকেশন" })}
            >
              <Bell className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-2 py-1.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-semibold text-slate-600">
                {displayName.slice(0, 1).toUpperCase()}
              </span>
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.key} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{t(card.title)}</span>
                <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg", card.iconClass)}>
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-3 text-xl font-semibold text-slate-900">
                {statValues[card.key] ?? card.value}
                {card.suffix && <span className="ml-1">{t(card.suffix)}</span>}
              </div>
              <p className={cn("mt-1 text-[11px] font-medium", card.noteClass)}>{t(card.note)}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/60">
        <h2 className="text-sm font-semibold text-slate-800">{t({ en: "My Subjects", bn: "আমার বিষয়গুলো" })}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {subjectCardsForRender.length ? (
            subjectCardsForRender.map((subject) => {
              const Icon = subject.icon;
              return (
                <div key={subject.key} className="rounded-xl border border-slate-200/70 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg text-white", subject.accent)}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{t(subject.title)}</div>
                      <div className="text-xs text-slate-500">
                        {subject.lessons} {t({ en: "lessons", bn: "লেসন" })}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100">
                    <div className={cn("h-1.5 rounded-full", subject.accent)} style={{ width: `${subject.progress}%` }} />
                  </div>
                  <div className="mt-2 text-xs font-medium text-slate-500">{subject.progress}%</div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
              {t({ en: "No subjects available yet.", bn: "এখনও কোনো বিষয় উপলভ্য নয়।" })}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/60">
          <h2 className="text-sm font-semibold text-slate-800">{t({ en: "Subject Performance", bn: "বিষয়ভিত্তিক পারফরম্যান্স" })}</h2>
          <div className="mt-5 flex h-40 items-end gap-4 rounded-xl bg-slate-50 px-4 py-3">
            {performanceBarsForRender.map((bar) => (
              <div key={t(bar.label)} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-full w-full items-end rounded-lg bg-purple-100">
                  <div className="w-full rounded-lg bg-[#7A5AF8]" style={{ height: `${bar.value}%` }} />
                </div>
                <span className="text-[11px] text-slate-500">{t(bar.label)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/60">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-slate-900">
                5 {t({ en: "Days", bn: "দিন" })}
              </div>
              <p className="text-xs text-slate-500">{t({ en: "Current streak", bn: "চলতি স্ট্রিক" })}</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-orange-500">
              <Flame className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-4 flex items-end justify-between gap-2">
            {[40, 65, 55, 70, 45, 80, 60].map((height, index) => (
              <div key={index} className="h-16 w-2 rounded-full bg-slate-100">
                <div className="w-2 rounded-full bg-orange-400" style={{ height: `${height}%` }} />
              </div>
            ))}
          </div>

          <div className="mt-5 text-xs font-semibold text-slate-700">{t({ en: "Leaderboard", bn: "লিডারবোর্ড" })}</div>
          <ul className="mt-3 space-y-3 text-xs text-slate-600">
            {leaderboard.slice(0, 5).map((item) => (
              <li key={item.rank} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={cn("h-6 w-6 rounded-full", item.avatar)} />
                  <span className="font-medium text-slate-700">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-500">{item.points} pts</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/60">
          <h2 className="text-sm font-semibold text-slate-800">{t({ en: "Weekly Study Hours", bn: "সাপ্তাহিক পড়াশোনার সময়" })}</h2>
          <div className="mt-4 rounded-xl bg-slate-50 p-4">
            <svg viewBox="0 0 260 140" className="h-40 w-full">
              <polyline
                fill="none"
                stroke="#4F6EF7"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
              {resolvedStudyHours.map((value, index) => {
                const x = (index / (resolvedStudyHours.length - 1)) * 220 + 20;
                const y = 120 - (value / maxHour) * 90;
                return <circle key={index} cx={x} cy={y} r="4" fill="#4F6EF7" />;
              })}
            </svg>
            <div className="mt-2 flex justify-between text-[11px] text-slate-500">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/60">
          <h2 className="text-sm font-semibold text-slate-800">{t({ en: "Upcoming Tests", bn: "আগামী পরীক্ষাগুলো" })}</h2>
          <div className="mt-4 space-y-3">
            {upcomingTestsForRender.length ? (
              upcomingTestsForRender.map((test) => (
                <div key={test.key} className="rounded-xl border border-slate-200/70 p-3">
                  <div className="flex items-start gap-3">
                    <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg", test.accent)}>
                      <CalendarDays className="h-4 w-4" />
                    </span>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-slate-900">{t(test.title)}</div>
                      <div className="text-[11px] text-slate-500">{t(test.subtitle)}</div>
                      <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500">
                        <span>{t(test.date)}</span>
                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                        <span>{test.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-500">
                {t({ en: "No upcoming tests scheduled.", bn: "কোনো আসন্ন পরীক্ষা নির্ধারিত নেই।" })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
