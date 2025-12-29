import { BookOpen, Clock, Trophy, Target } from "lucide-react";
import { StreakCard } from "@/components/dashboard/StreakCard";
import { Leaderboard } from "@/components/dashboard/Leaderboard";
import { useAuth } from "@/lib/auth";

export default function DashboardPage() {
    const { user } = useAuth();
    const displayName = user?.user_metadata?.full_name || "Student";

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold font-heading text-foreground">Welcome back, {displayName}!</h1>
                <p className="text-muted-foreground">Here's an overview of your learning progress today.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Courses in Progress"
                    value="4"
                    icon={BookOpen}
                    description="2 due this week"
                    trend="+1 from last month"
                    color="primary"
                />
                <StatsCard
                    title="Hours Learned"
                    value="12.5"
                    icon={Clock}
                    description="Total this week"
                    trend="+2.4 hours"
                    color="secondary"
                />
                <StatsCard
                    title="Quiz Score"
                    value="85%"
                    icon={Trophy}
                    description="Average score"
                    trend="+5% improvement"
                    color="accent"
                />
                <StatsCard
                    title="Daily Goals"
                    value="2/3"
                    icon={Target}
                    description="Tasks completed"
                    trend="Keep it up!"
                    color="primary"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Area - 2 Cols */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-semibold">Recent Activity</h3>
                        <div className="space-y-4">
                            {/* Placeholder for activity feed */}
                            <div className="flex items-center gap-4">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Completed Chapter 3: Geometry</p>
                                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-2 w-2 rounded-full bg-secondary" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Started New Course: Physics</p>
                                    <p className="text-xs text-muted-foreground">Yesterday</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-semibold">Recommended for You</h3>
                        <div className="space-y-4">
                            {/* Placeholder for recommendations */}
                            <div className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/50">
                                <div>
                                    <p className="font-medium">Advanced Algebra</p>
                                    <p className="text-xs text-muted-foreground">Mathematics - Class 10</p>
                                </div>
                                <button className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90">
                                    View
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Area - 1 Col */}
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
    // Map color prop to generic classes if needed, or just use primary for now. 
    // I am using simple styles for now.

    const colorStyles = {
        primary: "text-primary bg-primary/10",
        secondary: "text-secondary bg-secondary/10",
        accent: "text-accent bg-accent/10"
    }

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
