"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabaseClient";
import { syncProfile } from "@/lib/profile";

type SettingsState = {
    name: string;
    email: string;
    studentClass: string;
    school: string;
    section: string;
    studentId: string;
    guardianName: string;
    phone: string;
    language: string;
    notifications: {
        weeklySummary: boolean;
        quizAlerts: boolean;
        parentUpdates: boolean;
    };
};

const initialState: SettingsState = {
    name: "Student Name",
    email: "student@example.com",
    studentClass: "Class 10",
    school: "School name",
    section: "",
    studentId: "",
    guardianName: "",
    phone: "",
    language: "English",
    notifications: {
        weeklySummary: true,
        quizAlerts: true,
        parentUpdates: false,
    },
};

export default function SettingsPage() {
    const { user } = useAuth();
    const [settings, setSettings] = useState<SettingsState>(initialState);
    const [status, setStatus] = useState<"idle" | "saved">("idle");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;
        setSettings((prev) => ({
            ...prev,
            name: user.user_metadata?.full_name || prev.name,
            email: user.email || prev.email,
            studentClass: user.user_metadata?.class || prev.studentClass,
            school: user.user_metadata?.school || prev.school,
            section: user.user_metadata?.section || prev.section,
            studentId: user.user_metadata?.student_id || prev.studentId,
            guardianName: user.user_metadata?.guardian_name || prev.guardianName,
            phone: user.user_metadata?.phone || prev.phone,
            language: user.user_metadata?.language || prev.language,
            notifications: user.user_metadata?.notifications || prev.notifications,
        }));
    }, [user]);

    const handleToggle = (key: keyof SettingsState["notifications"]) => {
        setSettings((prev) => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [key]: !prev.notifications[key],
            },
        }));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!user) return;
        setError(null);
        supabase.auth
            .updateUser({
                data: {
                    full_name: settings.name,
                    class: settings.studentClass,
                    language: settings.language,
                    school: settings.school,
                    section: settings.section,
                    student_id: settings.studentId,
                    guardian_name: settings.guardianName,
                    phone: settings.phone,
                    notifications: settings.notifications,
                },
            })
            .then(({ data, error: updateError }) => {
                if (updateError) {
                    setError(updateError.message);
                    return;
                }
                if (data.user) {
                    syncProfile(data.user);
                }
                setStatus("saved");
                setTimeout(() => setStatus("idle"), 2000);
            });
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-heading">Settings</h1>
                <p className="text-muted-foreground">Update your profile and notification preferences.</p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-6">
                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold">Profile</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">
                                    Full name
                                </label>
                                <Input
                                    id="name"
                                    value={settings.name}
                                    onChange={(event) => setSettings((prev) => ({ ...prev, name: event.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">
                                    Email address
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={settings.email}
                                    disabled
                                />
                                <p className="text-xs text-muted-foreground">Contact support to change your email.</p>
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label htmlFor="studentClass" className="text-sm font-medium">
                                    Class
                                </label>
                                <select
                                    id="studentClass"
                                    value={settings.studentClass}
                                    onChange={(event) =>
                                        setSettings((prev) => ({ ...prev, studentClass: event.target.value }))
                                    }
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                >
                                    <option>Class 6</option>
                                    <option>Class 7</option>
                                    <option>Class 8</option>
                                    <option>Class 9</option>
                                    <option>Class 10</option>
                                    <option>Class 11</option>
                                    <option>Class 12</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="language" className="text-sm font-medium">
                                    Language
                                </label>
                                <select
                                    id="language"
                                    value={settings.language}
                                    onChange={(event) => setSettings((prev) => ({ ...prev, language: event.target.value }))}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                >
                                    <option>English</option>
                                    <option>Bangla</option>
                                    <option>Bilingual</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label htmlFor="school" className="text-sm font-medium">
                                    School
                                </label>
                                <Input
                                    id="school"
                                    value={settings.school}
                                    onChange={(event) => setSettings((prev) => ({ ...prev, school: event.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="section" className="text-sm font-medium">
                                    Section
                                </label>
                                <Input
                                    id="section"
                                    value={settings.section}
                                    onChange={(event) => setSettings((prev) => ({ ...prev, section: event.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label htmlFor="studentId" className="text-sm font-medium">
                                    Student ID / Roll
                                </label>
                                <Input
                                    id="studentId"
                                    value={settings.studentId}
                                    onChange={(event) => setSettings((prev) => ({ ...prev, studentId: event.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="guardianName" className="text-sm font-medium">
                                    Guardian name
                                </label>
                                <Input
                                    id="guardianName"
                                    value={settings.guardianName}
                                    onChange={(event) => setSettings((prev) => ({ ...prev, guardianName: event.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="phone" className="text-sm font-medium">
                                Phone
                            </label>
                            <Input
                                id="phone"
                                type="tel"
                                value={settings.phone}
                                onChange={(event) => setSettings((prev) => ({ ...prev, phone: event.target.value }))}
                            />
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold">Notification preferences</h2>
                        <div className="space-y-3">
                            <ToggleRow
                                label="Weekly progress summary"
                                description="Receive a weekly report of lessons and quiz scores."
                                checked={settings.notifications.weeklySummary}
                                onChange={() => handleToggle("weeklySummary")}
                            />
                            <ToggleRow
                                label="Quiz performance alerts"
                                description="Get alerts when scores drop below target."
                                checked={settings.notifications.quizAlerts}
                                onChange={() => handleToggle("quizAlerts")}
                            />
                            <ToggleRow
                                label="Parent updates"
                                description="Share weekly highlights with linked parents."
                                checked={settings.notifications.parentUpdates}
                                onChange={() => handleToggle("parentUpdates")}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <h2 className="text-lg font-semibold">Account actions</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Update your preferences anytime. Changes apply immediately.
                    </p>
                    {error && (
                        <p className="mt-3 text-xs text-red-600" role="alert">
                            {error}
                        </p>
                    )}
                    <Button type="submit" className="mt-6 w-full">
                        Save changes
                    </Button>
                        {status === "saved" && (
                            <p className="mt-3 text-xs text-green-600" role="status">
                                Settings saved successfully.
                            </p>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}

function ToggleRow({
    label,
    description,
    checked,
    onChange,
}: {
    label: string;
    description: string;
    checked: boolean;
    onChange: () => void;
}) {
    return (
        <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
            <div>
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <button
                type="button"
                onClick={onChange}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    checked ? "bg-primary" : "bg-muted"
                }`}
                aria-pressed={checked}
            >
                <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                        checked ? "translate-x-5" : "translate-x-1"
                    }`}
                />
            </button>
        </div>
    );
}
