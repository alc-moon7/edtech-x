"use client";

import { useStudent } from "@/lib/store";
import { BookOpen, AlertCircle, TrendingUp, Clock } from "lucide-react";
import { useLanguage, useTranslate } from "@/lib/i18n";

const scheduleItems = [
    { id: "today", day: { en: "Today", bn: "আজ" }, subject: { en: "Math: Algebra", bn: "গণিত: বীজগণিত" }, time: "4:00 PM" },
    { id: "tomorrow", day: { en: "Tomorrow", bn: "আগামীকাল" }, subject: { en: "English: Grammar", bn: "ইংরেজি: ব্যাকরণ" }, time: "5:30 PM" },
    { id: "wed", day: { en: "Wed", bn: "বুধ" }, subject: { en: "Physics: Lab", bn: "পদার্থবিজ্ঞান: ল্যাব" }, time: "3:00 PM" },
];

export default function ParentDashboard() {
    const { courses, progress, dashboardStats } = useStudent();
    const t = useTranslate();
    const { language } = useLanguage();

    const child = {
        name: "Arian Ahmed",
        class: "Class 10",
        school: "Dhaka Residential Model College",
        avatar: "bg-blue-500"
    };
    const progressLabel = language === "bn"
        ? `${child.name} এর অগ্রগতি পর্যবেক্ষণ`
        : `Monitoring progress for ${child.name}`;

    const weeklyHours = dashboardStats.weeklyStudyHours[dashboardStats.weeklyStudyHours.length - 1] ?? 0;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-heading">{t({ en: "Parent Dashboard", bn: "অভিভাবক ড্যাশবোর্ড" })}</h1>
                    <p className="text-muted-foreground">
                        <span className="font-semibold text-foreground">{progressLabel}</span>
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-card p-2 pr-6 rounded-xl border border-border">
                    <div className={`h-12 w-12 rounded-lg ${child.avatar} flex items-center justify-center text-white font-bold text-xl`}>
                        {child.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-medium">{child.name}</p>
                        <p className="text-xs text-muted-foreground">{child.class} - {child.school}</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-xl border border-border bg-card p-6 flex flex-col items-center text-center">
                    <Clock className="h-8 w-8 text-primary mb-3" />
                    <h3 className="text-2xl font-bold">{weeklyHours} {t({ en: "hrs", bn: "ঘণ্টা" })}</h3>
                    <p className="text-sm text-muted-foreground">{t({ en: "Study Time (This Week)", bn: "পড়ার সময় (এই সপ্তাহে)" })}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-6 flex flex-col items-center text-center">
                    <TrendingUp className="h-8 w-8 text-green-500 mb-3" />
                    <h3 className="text-2xl font-bold">{dashboardStats.totalPoints} {t({ en: "pts", bn: "পয়েন্ট" })}</h3>
                    <p className="text-sm text-muted-foreground">{t({ en: "Total Learning Points", bn: "মোট লার্নিং পয়েন্ট" })}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-6 flex flex-col items-center text-center">
                    <BookOpen className="h-8 w-8 text-secondary mb-3" />
                    <h3 className="text-2xl font-bold">{dashboardStats.averageScore}%</h3>
                    <p className="text-sm text-muted-foreground">{t({ en: "Avg. Quiz Score", bn: "গড় কুইজ স্কোর" })}</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
                    <div className="p-6 border-b border-border">
                        <h3 className="font-semibold text-lg">{t({ en: "Course Activity", bn: "কোর্স কার্যক্রম" })}</h3>
                    </div>
                    <div>
                        {courses.map(course => {
                            const courseStats = progress[course.id as keyof typeof progress] || { completedLessons: [] };
                            const total = course.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0);
                            const completed = courseStats.completedLessons.length;
                            const percent = Math.round((completed / total) * 100) || 0;

                            return (
                                <div key={course.id} className="p-4 flex items-center justify-between border-b border-border last:border-0 hover:bg-muted/30">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-10 w-10 rounded-lg ${course.image} flex items-center justify-center text-xs font-bold`}>
                                            {course.title.substring(0, 2)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{course.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {completed}/{total} {t({ en: "Lessons", bn: "লেসন" })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-primary" style={{ width: `${percent}%` }} />
                                        </div>
                                        <span className="text-sm font-bold w-8 text-right">{percent}%</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-yellow-800">{t({ en: "Performance Alert", bn: "পারফরম্যান্স অ্যালার্ট" })}</h4>
                                <p className="text-sm text-yellow-700 mt-1">
                                    {t({
                                        en: "Quiz scores in Physics - Motion dropped by 10% this week. Suggested revision: \"Equations of Motion\".",
                                        bn: "এই সপ্তাহে পদার্থবিজ্ঞান - গতি বিষয়ে কুইজ স্কোর ১০% কমেছে। প্রস্তাবিত রিভিশন: \"গতি সমীকরণ\"।",
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6">
                        <h3 className="font-semibold text-lg mb-4">{t({ en: "Weekly Schedule", bn: "সাপ্তাহিক সময়সূচি" })}</h3>
                        <div className="space-y-3">
                            {scheduleItems.map((item) => (
                                <ScheduleItem key={item.id} day={t(item.day)} subject={t(item.subject)} time={item.time} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ScheduleItem({ day, subject, time }: { day: string; subject: string; time: string }) {
    return (
        <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
                <span className="w-16 text-muted-foreground">{day}</span>
                <span className="font-medium">{subject}</span>
            </div>
            <span className="text-xs bg-muted px-2 py-1 rounded">{time}</span>
        </div>
    );
}
