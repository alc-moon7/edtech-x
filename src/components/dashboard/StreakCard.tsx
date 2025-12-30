"use client";

import { Flame } from "lucide-react";
import { useStudent } from "@/lib/store";
import { useTranslate } from "@/lib/i18n";

export function StreakCard() {
    const { userStats } = useStudent();
    const t = useTranslate();
    const days = [
        { en: "S", bn: "র" },
        { en: "M", bn: "সো" },
        { en: "T", bn: "ম" },
        { en: "W", bn: "বু" },
        { en: "T", bn: "বৃ" },
        { en: "F", bn: "শু" },
        { en: "S", bn: "শ" },
    ];

    return (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="mb-2 relative">
                <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full animate-pulse" />
                <Flame className="h-12 w-12 text-orange-500 relative z-10" />
            </div>

            <div className="mb-6">
                <div className="text-3xl font-bold font-heading">
                    {userStats.streak} {t({ en: "Days", bn: "দিন" })}
                </div>
                <p className="text-sm text-muted-foreground">{t({ en: "Current Streak", bn: "বর্তমান ধারাবাহিকতা" })}</p>
            </div>

            <div className="flex gap-2">
                {userStats.weeklyActivity.map((active, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1">
                        <div className={`h-8 w-2 rounded-full ${active ? 'bg-orange-500' : 'bg-muted'}`} />
                        <span className="text-[10px] text-muted-foreground font-medium">{t(days[idx])}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
