"use client";

import { BarChart3, CheckCircle2, Flame, Trophy } from "lucide-react";
import { useStudent } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useTranslate } from "@/lib/i18n";

const dayLabels = [
    { en: "S", bn: "র" },
    { en: "M", bn: "সো" },
    { en: "T", bn: "ম" },
    { en: "W", bn: "বু" },
    { en: "T", bn: "বৃ" },
    { en: "F", bn: "শু" },
    { en: "S", bn: "শ" },
];

export default function ProgressPage() {
    const { courses, progress, userStats } = useStudent();
    const t = useTranslate();

    const courseProgress = courses.map((course) => {
        const totalLessons = course.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0);
        const completedLessons = progress[course.id as keyof typeof progress]?.completedLessons?.length || 0;
        const percent = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;
        return { ...course, totalLessons, completedLessons, percent };
    });

    const totals = courseProgress.reduce(
        (acc, course) => {
            acc.total += course.totalLessons;
            acc.completed += course.completedLessons;
            return acc;
        },
        { total: 0, completed: 0 }
    );

    const quizScores = Object.values(progress).flatMap((item) =>
        Object.values(item.quizScores || {})
    );
    const averageScore = quizScores.length
        ? Math.round(quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length)
        : 0;
    const overallPercent = totals.total ? Math.round((totals.completed / totals.total) * 100) : 0;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-heading">{t({ en: "Progress Overview", bn: "অগ্রগতি সারসংক্ষেপ" })}</h1>
                <p className="text-muted-foreground">
                    {t({ en: "Track lessons completed, quiz performance, and weekly activity.", bn: "সম্পন্ন লেসন, কুইজ পারফরম্যান্স ও সাপ্তাহিক কার্যক্রম ট্র্যাক করুন।" })}
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title={t({ en: "Lessons Completed", bn: "সম্পন্ন লেসন" })}
                    value={`${totals.completed}/${totals.total}`}
                    caption={`${overallPercent}% ${t({ en: "overall", bn: "সামগ্রিকভাবে" })}`}
                    icon={CheckCircle2}
                />
                <StatCard
                    title={t({ en: "Average Quiz Score", bn: "গড় কুইজ স্কোর" })}
                    value={`${averageScore}%`}
                    caption={t({ en: "Across all quizzes", bn: "সব কুইজ মিলিয়ে" })}
                    icon={Trophy}
                />
                <StatCard
                    title={t({ en: "Current Streak", bn: "বর্তমান ধারাবাহিকতা" })}
                    value={`${userStats.streak} ${t({ en: "days", bn: "দিন" })}`}
                    caption={t({ en: "Keep it going", bn: "চালিয়ে যান" })}
                    icon={Flame}
                />
                <StatCard
                    title={t({ en: "Weekly Activity", bn: "সাপ্তাহিক কার্যক্রম" })}
                    value={`7 ${t({ en: "days", bn: "দিন" })}`}
                    caption={t({ en: "Daily study tracking", bn: "দৈনিক পড়াশোনা ট্র্যাকিং" })}
                    icon={BarChart3}
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <h2 className="text-lg font-semibold">{t({ en: "Course progress", bn: "কোর্স অগ্রগতি" })}</h2>
                    <div className="mt-4 space-y-4">
                        {courseProgress.map((course) => (
                            <div key={course.id} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">{course.title}</span>
                                    <span className="text-muted-foreground">
                                        {course.completedLessons}/{course.totalLessons} {t({ en: "lessons", bn: "লেসন" })}
                                    </span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-muted">
                                    <div className="h-2 rounded-full bg-primary" style={{ width: `${course.percent}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <h2 className="text-lg font-semibold">{t({ en: "Weekly activity", bn: "সাপ্তাহিক কার্যক্রম" })}</h2>
                    <p className="text-xs text-muted-foreground">
                        {t({ en: "Daily study streaks for the last 7 days", bn: "শেষ ৭ দিনের দৈনিক পড়াশোনার ধারাবাহিকতা" })}
                    </p>
                    <div className="mt-5 flex items-end justify-between gap-2">
                        {userStats.weeklyActivity.map((active, index) => (
                            <div key={index} className="flex flex-col items-center gap-2">
                                <div
                                    className={cn(
                                        "w-6 rounded-full",
                                        active ? "bg-primary" : "bg-muted",
                                        active ? "h-20" : "h-10"
                                    )}
                                />
                                <span className="text-[10px] text-muted-foreground">
                                    {t(dayLabels[index])}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({
    title,
    value,
    caption,
    icon: Icon,
}: {
    title: string;
    value: string;
    caption: string;
    icon: any;
}) {
    return (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{title}</span>
                <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="h-4 w-4" />
                </div>
            </div>
            <div className="mt-4 text-2xl font-bold font-heading">{value}</div>
            <p className="mt-1 text-xs text-muted-foreground">{caption}</p>
        </div>
    );
}
