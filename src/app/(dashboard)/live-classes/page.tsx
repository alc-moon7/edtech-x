"use client";

import { CalendarClock, Video, Users } from "lucide-react";
import { useTranslate } from "@/lib/i18n";

const upcomingClasses = [
    {
        id: "live-1",
        subject: { en: "Physics", bn: "পদার্থবিজ্ঞান" },
        topic: { en: "Equations of Motion", bn: "গতি সমীকরণ" },
        date: { en: "Sunday, 4:00 PM", bn: "রবিবার, 4:00 PM" },
        teacher: "Dr. Farzana Islam",
        status: { en: "Starts in 2 days", bn: "২ দিনের মধ্যে শুরু" },
    },
    {
        id: "live-2",
        subject: { en: "Mathematics", bn: "গণিত" },
        topic: { en: "Quadratic Equations", bn: "দ্বিঘাত সমীকরণ" },
        date: { en: "Tuesday, 6:30 PM", bn: "মঙ্গলবার, 6:30 PM" },
        teacher: "Mr. Tanvir Rahman",
        status: { en: "Starts in 4 days", bn: "৪ দিনের মধ্যে শুরু" },
    },
];

const recordings = [
    { id: "rec-1", title: { en: "Algebra Basics", bn: "বীজগণিতের ভিত্তি" }, duration: { en: "42 min", bn: "42 মিনিট" }, viewers: { en: "1.2k views", bn: "1.2k ভিউ" } },
    { id: "rec-2", title: { en: "English Grammar Revision", bn: "ইংরেজি ব্যাকরণ রিভিশন" }, duration: { en: "38 min", bn: "38 মিনিট" }, viewers: { en: "900 views", bn: "900 ভিউ" } },
    { id: "rec-3", title: { en: "Chemistry Lab Safety", bn: "রসায়ন ল্যাব নিরাপত্তা" }, duration: { en: "31 min", bn: "31 মিনিট" }, viewers: { en: "730 views", bn: "730 ভিউ" } },
];

export default function LiveClassesPage() {
    const t = useTranslate();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-heading">{t({ en: "Live Classes", bn: "লাইভ ক্লাস" })}</h1>
                <p className="text-muted-foreground">
                    {t({ en: "Join scheduled sessions or replay recordings when it suits you.", bn: "সময় অনুযায়ী নির্ধারিত সেশনগুলোতে যোগ দিন বা রেকর্ডিং দেখুন।" })}
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {upcomingClasses.map((session) => (
                    <div key={session.id} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-semibold text-primary">{t(session.subject)}</div>
                            <span className="text-xs text-muted-foreground">{t(session.status)}</span>
                        </div>
                        <h2 className="mt-3 text-xl font-semibold">{t(session.topic)}</h2>
                        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <CalendarClock className="h-4 w-4 text-primary" />
                                {t(session.date)}
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-primary" />
                                {t({ en: "Instructor:", bn: "শিক্ষক:" })} {session.teacher}
                            </div>
                        </div>
                        <button
                            type="button"
                            disabled
                            className="mt-6 inline-flex items-center justify-center rounded-lg border border-input bg-muted px-4 py-2 text-sm font-medium text-muted-foreground"
                        >
                            {t({ en: "Join session", bn: "সেশনে যোগ দিন" })}
                        </button>
                    </div>
                ))}
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{t({ en: "Recorded sessions", bn: "রেকর্ডেড সেশন" })}</h2>
                    <button type="button" className="text-sm font-medium text-primary hover:underline">
                        {t({ en: "View all", bn: "সব দেখুন" })}
                    </button>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                    {recordings.map((recording) => (
                        <div key={recording.id} className="rounded-xl border border-border p-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Video className="h-5 w-5" />
                            </div>
                            <h3 className="mt-3 text-sm font-semibold">{t(recording.title)}</h3>
                            <p className="text-xs text-muted-foreground">{t(recording.duration)}</p>
                            <p className="text-xs text-muted-foreground">{t(recording.viewers)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
