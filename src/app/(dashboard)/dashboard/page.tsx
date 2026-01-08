import { useState } from "react";
import { ChevronDown, UserCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth";
import { useTranslate } from "@/lib/i18n";

type TabKey = "info" | "syllabus" | "admission";

export default function DashboardPage() {
    const { user } = useAuth();
    const t = useTranslate();
    const displayName = user?.user_metadata?.full_name || t({ en: "Student", bn: "শিক্ষার্থী" });
    const displayClass = user?.user_metadata?.class || t({ en: "Class", bn: "ক্লাস" });

    const [activeTab, setActiveTab] = useState<TabKey>("info");

    return (
        <div className="flex flex-col gap-6">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <header className="flex flex-col gap-4 bg-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="HomeSchool" className="h-10 w-auto" />
                    </div>
                    <div className="flex items-center gap-3 rounded-full bg-white px-3 py-2 shadow-sm ring-1 ring-slate-200">
                        <UserCircle className="h-8 w-8 text-slate-500" />
                        <div className="leading-tight">
                            <div className="text-sm font-semibold text-slate-900">{displayName}</div>
                            <div className="text-xs text-slate-600">{t({ en: "Class", bn: "ক্লাস" })}: {displayClass}</div>
                        </div>
                        <ChevronDown className="h-4 w-4 text-slate-500" />
                    </div>
                </header>

                <div className="flex flex-wrap items-center gap-4 border-b border-slate-200 px-4 py-3 sm:px-6">
                    <TabButton label={t({ en: "Your Information", bn: "আপনার তথ্য" })} active={activeTab === "info"} onClick={() => setActiveTab("info")} />
                    <TabButton label={t({ en: "Syllabus", bn: "সিলেবাস" })} active={activeTab === "syllabus"} onClick={() => setActiveTab("syllabus")} />
                    <TabButton label={t({ en: "Admission Details", bn: "ভর্তি তথ্য" })} active={activeTab === "admission"} onClick={() => setActiveTab("admission")} />
                </div>

                <div className="px-4 py-5 sm:px-6 sm:py-6">
                    {activeTab === "info" && <InfoForm t={t} />}
                    {activeTab !== "info" && (
                        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-600 sm:px-6">
                            {t({ en: "This section is coming soon. Stay tuned!", bn: "এই অংশ শীঘ্রই আসছে। অপেক্ষায় থাকুন!" })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`relative pb-2 text-sm font-semibold transition-colors ${active ? "text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
        >
            {label}
            {active && <span className="absolute inset-x-0 -bottom-0.5 mx-auto h-0.5 w-full rounded-full bg-[#1d4ed8]" />}
        </button>
    );
}

function InfoForm({ t }: { t: ReturnType<typeof useTranslate> }) {
    return (
        <form className="space-y-4">
            <div className="flex flex-col items-center gap-3 py-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <UserCircle className="h-10 w-10" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800">{t({ en: "Name", bn: "নাম" })}</label>
                <Input placeholder={t({ en: "Enter your full name", bn: "আপনার পূর্ণ নাম লিখুন" })} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-800">{t({ en: "Mobile Number", bn: "মোবাইল নম্বর" })}</label>
                    <Input placeholder={t({ en: "01XXXXXXXXX", bn: "০১XXXXXXXXX" })} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-800">{t({ en: "Class", bn: "ক্লাস" })}</label>
                    <Input placeholder={t({ en: "e.g., Class 7", bn: "যেমন, ক্লাস ৭" })} />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800">{t({ en: "Birthday", bn: "জন্মতারিখ" })}</label>
                <Input type="date" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-800">{t({ en: "Institute Name", bn: "প্রতিষ্ঠানের নাম" })}</label>
                    <Input placeholder={t({ en: "Enter institute name", bn: "প্রতিষ্ঠানের নাম লিখুন" })} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-800">{t({ en: "Exam batch", bn: "পরীক্ষার ব্যাচ" })}</label>
                    <Input placeholder={t({ en: "e.g., SSC 2026", bn: "যেমন, এসএসসি ২০২৬" })} />
                </div>
            </div>

            <div className="flex justify-end">
                <Button type="button" className="h-10 px-4 text-sm font-semibold">
                    {t({ en: "Save changes", bn: "পরিবর্তন সংরক্ষণ করুন" })}
                </Button>
            </div>
        </form>
    );
}
