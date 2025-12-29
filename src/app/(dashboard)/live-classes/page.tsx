"use client";

import { CalendarClock, Video, Users } from "lucide-react";

const upcomingClasses = [
    {
        id: "live-1",
        subject: "Physics",
        topic: "Equations of Motion",
        date: "Sunday, 4:00 PM",
        teacher: "Dr. Farzana Islam",
        status: "Starts in 2 days",
    },
    {
        id: "live-2",
        subject: "Mathematics",
        topic: "Quadratic Equations",
        date: "Tuesday, 6:30 PM",
        teacher: "Mr. Tanvir Rahman",
        status: "Starts in 4 days",
    },
];

const recordings = [
    { id: "rec-1", title: "Algebra Basics", duration: "42 min", viewers: "1.2k views" },
    { id: "rec-2", title: "English Grammar Revision", duration: "38 min", viewers: "900 views" },
    { id: "rec-3", title: "Chemistry Lab Safety", duration: "31 min", viewers: "730 views" },
];

export default function LiveClassesPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-heading">Live Classes</h1>
                <p className="text-muted-foreground">
                    Join scheduled sessions or replay recordings when it suits you.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {upcomingClasses.map((session) => (
                    <div key={session.id} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-semibold text-primary">{session.subject}</div>
                            <span className="text-xs text-muted-foreground">{session.status}</span>
                        </div>
                        <h2 className="mt-3 text-xl font-semibold">{session.topic}</h2>
                        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <CalendarClock className="h-4 w-4 text-primary" />
                                {session.date}
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-primary" />
                                Instructor: {session.teacher}
                            </div>
                        </div>
                        <button
                            type="button"
                            disabled
                            className="mt-6 inline-flex items-center justify-center rounded-lg border border-input bg-muted px-4 py-2 text-sm font-medium text-muted-foreground"
                        >
                            Join session
                        </button>
                    </div>
                ))}
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Recorded sessions</h2>
                    <button type="button" className="text-sm font-medium text-primary hover:underline">View all</button>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                    {recordings.map((recording) => (
                        <div key={recording.id} className="rounded-xl border border-border p-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Video className="h-5 w-5" />
                            </div>
                            <h3 className="mt-3 text-sm font-semibold">{recording.title}</h3>
                            <p className="text-xs text-muted-foreground">{recording.duration}</p>
                            <p className="text-xs text-muted-foreground">{recording.viewers}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
