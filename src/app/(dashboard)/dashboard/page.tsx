import { BookOpen, Clock, Trophy, Target } from "lucide-react";
import { StreakCard } from "@/components/dashboard/StreakCard";
import { Leaderboard } from "@/components/dashboard/Leaderboard";
import { useAuth } from "@/lib/auth";
import { useTranslate } from "@/lib/i18n";

export default function DashboardPage() {
    const { user } = useAuth();
    const t = useTranslate();
    const displayName = user?.user_metadata?.full_name || t({ en: "Student", bn: "শিক্ষার্থী" });

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold font-heading text-foreground">
                    {t({ en: "Welcome back,", bn: "আবার স্বাগতম," })} {displayName}!
                </h1>
                <p className="text-muted-foreground">
                    {t({ en: "Here's an overview of your learning progress today.", bn: "আজকের শেখার অগ্রগতির সংক্ষিপ্তসার এখানে।" })}
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title={t({ en: "Courses in Progress", bn: "চলমান কোর্স" })}
                    value="4"
                    icon={BookOpen}
                    description={t({ en: "2 due this week", bn: "এই সপ্তাহে ২টি বাকি" })}
                    trend={t({ en: "+1 from last month", bn: "গত মাসের তুলনায় +১" })}
                    color="primary"
                />
                <StatsCard
                    title={t({ en: "Hours Learned", bn: "শেখার ঘন্টা" })}
                    value="12.5"
                    icon={Clock}
                    description={t({ en: "Total this week", bn: "এই সপ্তাহের মোট" })}
                    trend={t({ en: "+2.4 hours", bn: "+২.৪ ঘন্টা" })}
                    color="secondary"
                />
                <StatsCard
                    title={t({ en: "Quiz Score", bn: "কুইজ স্কোর" })}
                    value="85%"
                    icon={Trophy}
                    description={t({ en: "Average score", bn: "গড় স্কোর" })}
                    trend={t({ en: "+5% improvement", bn: "+৫% উন্নতি" })}
                    color="accent"
                />
                <StatsCard
                    title={t({ en: "Daily Goals", bn: "দৈনিক লক্ষ্য" })}
                    value="2/3"
                    icon={Target}
                    description={t({ en: "Tasks completed", bn: "কাজ সম্পন্ন" })}
                    trend={t({ en: "Keep it up!", bn: "চালিয়ে যান!" })}
                    color="primary"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-semibold">{t({ en: "Recent Activity", bn: "সাম্প্রতিক কার্যক্রম" })}</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{t({ en: "Completed Chapter 3: Geometry", bn: "অধ্যায় ৩ সম্পন্ন: জ্যামিতি" })}</p>
                                    <p className="text-xs text-muted-foreground">{t({ en: "2 hours ago", bn: "২ ঘন্টা আগে" })}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-2 w-2 rounded-full bg-secondary" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{t({ en: "Started New Course: Physics", bn: "নতুন কোর্স শুরু: পদার্থবিজ্ঞান" })}</p>
                                    <p className="text-xs text-muted-foreground">{t({ en: "Yesterday", bn: "গতকাল" })}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-semibold">{t({ en: "Recommended for You", bn: "আপনার জন্য প্রস্তাবিত" })}</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/50">
                                <div>
                                    <p className="font-medium">{t({ en: "Advanced Algebra", bn: "উন্নত বীজগণিত" })}</p>
                                    <p className="text-xs text-muted-foreground">{t({ en: "Mathematics - Class 10", bn: "গণিত - ক্লাস ১০" })}</p>
                                </div>
                                <button className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90">
                                    {t({ en: "View", bn: "দেখুন" })}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <StreakCard />
                    <Leaderboard />
                </div>
            </div>
        </div>
    );
}

function StatsCard({
    title,
    value,
    icon: Icon,
    description,
    trend,
    color,
}: {
    title: string;
    value: string;
    icon: any;
    description: string;
    trend: string;
    color: "primary" | "secondary" | "accent";
}) {
    const colorStyles = {
        primary: "text-primary bg-primary/10",
        secondary: "text-secondary bg-secondary/10",
        accent: "text-accent bg-accent/10"
    };

    return (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
                <div className={`rounded-lg p-2 ${colorStyles[color] || colorStyles.primary}`}>
                    <Icon className="h-4 w-4" />
                </div>
            </div>
            <div className="mt-4">
                <div className="text-2xl font-bold text-foreground">{value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-green-500 font-medium">{trend}</span> {description}
                </p>
            </div>
        </div>
    );
}
