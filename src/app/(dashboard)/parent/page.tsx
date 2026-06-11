"use client";

import { useStudent } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { Navigate } from "react-router-dom";
import { BookOpen, AlertCircle, TrendingUp, Clock } from "lucide-react";
import { useLanguage, useTranslate } from "@/lib/i18n";



export default function ParentDashboard() {
    const { user, loading } = useAuth();
    const { dashboardStats, subjectCards, upcomingTests } = useStudent();
    const t = useTranslate();
    const { language } = useLanguage();

    if (loading) return null;
    if (!user) return <Navigate to="/login" replace />;

    const childName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Student";
    const childClass = user?.user_metadata?.class || "Class 7";

    const child = {
        name: childName,
        class: childClass,
        school: "HomeSchool Academy",
        avatar: "bg-blue-500"
    };
    const progressLabel = language === "bn"
        ? `${child.name} এর অগ্রগতি পর্যবেক্ষণ`
        : `Monitoring progress for ${child.name}`;

    const weeklyHours = dashboardStats.weeklyStudyHours[dashboardStats.weeklyStudyHours.length - 1] ?? 0;

    const lowestSubject = subjectCards.length 
        ? [...subjectCards].sort((a, b) => a.progress - b.progress)[0]
        : null;

    const needsAlert = lowestSubject && lowestSubject.progress < 50;

    const alertMessage = needsAlert
        ? t({
            en: `Progress in ${lowestSubject.title} is at ${lowestSubject.progress}%. Suggested to review recent lessons.`,
            bn: `${lowestSubject.title}-এ অগ্রগতি ${lowestSubject.progress}%। সাম্প্রতিক লেসনগুলো রিভিশন করার পরামর্শ দেওয়া হলো।`
          })
        : t({
            en: "No performance alerts at this time. Keep up the good work!",
            bn: "এই মুহূর্তে কোনো পারফরম্যান্স অ্যালার্ট নেই। ভালো কাজ চালিয়ে যান!"
          });

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
                    <div className="divide-y divide-border">
                        {subjectCards.length ? subjectCards.map(subject => (
                            <div key={subject.key} className="p-4 flex items-center justify-between hover:bg-muted/30">
                                <div className="flex items-center gap-4">
                                    <div className={`h-10 w-10 rounded-lg ${subject.accent} flex items-center justify-center text-xs font-bold text-white`}>
                                        {subject.title.substring(0, 2)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{subject.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {subject.lessons} {t({ en: "Lessons", bn: "লেসন" })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="hidden sm:block w-24 h-2 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${subject.progress}%` }} />
                                    </div>
                                    <span className="text-sm font-bold w-9 text-right">{subject.progress}%</span>
                                </div>
                            </div>
                        )) : (
                            <div className="p-6 text-center text-sm text-muted-foreground">
                                {t({ en: "No activity yet.", bn: "কোনো কার্যক্রম নেই।" })}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className={needsAlert ? "rounded-xl border border-yellow-200 bg-yellow-50 p-6" : "rounded-xl border border-emerald-200 bg-emerald-50 p-6"}>
                        <div className="flex items-start gap-3">
                            <AlertCircle className={`h-5 w-5 shrink-0 mt-0.5 ${needsAlert ? "text-yellow-600" : "text-emerald-600"}`} />
                            <div>
                                <h4 className={`font-semibold ${needsAlert ? "text-yellow-800" : "text-emerald-800"}`}>{t({ en: "Performance Alert", bn: "পারফরম্যান্স অ্যালার্ট" })}</h4>
                                <p className={`text-sm mt-1 ${needsAlert ? "text-yellow-700" : "text-emerald-700"}`}>
                                    {alertMessage}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6">
                        <h3 className="font-semibold text-lg mb-4">{t({ en: "Upcoming Schedule", bn: "আসন্ন সময়সূচি" })}</h3>
                        <div className="space-y-3">
                            {upcomingTests.length ? upcomingTests.map((test) => (
                                <ScheduleItem key={test.id} day={test.date} subject={test.title} time={test.time} />
                            )) : (
                                <div className="text-sm text-muted-foreground">{t({ en: "No upcoming schedule.", bn: "কোনো আসন্ন সময়সূচি নেই।" })}</div>
                            )}
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
