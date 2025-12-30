"use client";

import { Crown } from "lucide-react";
import { useStudent } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useTranslate } from "@/lib/i18n";

export function Leaderboard() {
    const { leaderboard } = useStudent();
    const t = useTranslate();

    return (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <Crown className="h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-semibold">{t({ en: "Leaderboard", bn: "লিডারবোর্ড" })}</h3>
            </div>

            <div className="space-y-4">
                {leaderboard.map((user) => (
                    <div
                        key={user.rank}
                        className={cn(
                            "flex items-center justify-between p-3 rounded-lg transition-colors",
                            user.name === "You" ? "bg-primary/10 border border-primary/20" : "hover:bg-muted"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold font-mono text-white",
                                user.rank === 1 ? "bg-yellow-500" :
                                    user.rank === 2 ? "bg-gray-400" :
                                        user.rank === 3 ? "bg-orange-400" : "bg-muted-foreground"
                            )}>
                                #{user.rank}
                            </div>
                            <div>
                                <p className={cn("text-sm font-medium", user.name === "You" && "text-primary")}>
                                    {user.name === "You" ? t({ en: "You", bn: "আপনি" }) : user.name}
                                </p>
                            </div>
                        </div>
                        <div className="font-bold text-sm">{user.points} {t({ en: "pts", bn: "পয়েন্ট" })}</div>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-border text-center">
                <button className="text-xs text-muted-foreground hover:text-primary transition-colors">
                    {t({ en: "View All Rankings", bn: "সব র‍্যাঙ্কিং দেখুন" })}
                </button>
            </div>
        </div>
    );
}
