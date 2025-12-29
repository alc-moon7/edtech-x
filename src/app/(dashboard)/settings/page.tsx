"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type SettingsState = {
    name: string;
    email: string;
    studentClass: string;
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
    language: "English",
    notifications: {
        weeklySummary: true,
        quizAlerts: true,
        parentUpdates: false,
    },
};

export default function SettingsPage() {
    const [settings, setSettings] = useState<SettingsState>(initialState);
    const [status, setStatus] = useState<"idle" | "saved">("idle");

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
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 2000);
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
                                    onChange={(event) => setSettings((prev) => ({ ...prev, email: event.target.value }))}
                                />
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
