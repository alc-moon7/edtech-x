"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { UserCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabaseClient";
import { syncProfile } from "@/lib/profile";
import { useTranslate } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type SettingsState = {
  name: string;
  phone: string;
  studentClass: string;
  birthday: string;
  school: string;
  examBatch: string;
};

const initialState: SettingsState = {
  name: "",
  phone: "",
  studentClass: "",
  birthday: "",
  school: "",
  examBatch: "",
};

const tabs = [
  { key: "info", label: { en: "Your Information", bn: "আপনার তথ্য" } },
  { key: "syllabus", label: { en: "Syllabus", bn: "সিলেবাস" } },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const t = useTranslate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [settings, setSettings] = useState<SettingsState>(initialState);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);
  const activeTab = searchParams.get("tab") === "syllabus" ? "syllabus" : "info";

  useEffect(() => {
    if (!user) return;
    setSettings({
      name: user.user_metadata?.full_name || "",
      phone: user.user_metadata?.phone || "",
      studentClass: user.user_metadata?.class || "",
      birthday: user.user_metadata?.birthday || "",
      school: user.user_metadata?.school || "",
      examBatch: user.user_metadata?.exam_batch || "",
    });
  }, [user]);

  const classDisplay = useMemo(() => {
    const value = settings.studentClass?.trim();
    if (!value) return "7";
    const normalized = value.toLowerCase();
    if (normalized.startsWith("class")) {
      return value.replace(/class/i, "").trim() || value;
    }
    return value;
  }, [settings.studentClass]);

  const groupDisplay = settings.examBatch?.trim() || "S.S.C. 2032";

  const handleTabChange = (tabKey: string) => {
    const next = new URLSearchParams(searchParams);
    if (tabKey === "info") {
      next.delete("tab");
    } else {
      next.set("tab", tabKey);
    }
    setSearchParams(next, { replace: true });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;
    setError(null);
    setStatus("saving");

    const { data, error: updateError } = await supabase.auth.updateUser({
      data: {
        full_name: settings.name,
        phone: settings.phone,
        class: settings.studentClass,
        birthday: settings.birthday,
        school: settings.school,
        exam_batch: settings.examBatch,
      },
    });

    if (updateError) {
      setError(updateError.message);
      setStatus("idle");
      return;
    }

    if (data.user) {
      syncProfile(data.user);
    }

    setStatus("saved");
    setTimeout(() => setStatus("idle"), 2000);
  };

  const inputClass =
    "h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60">
        <div
          className="flex items-center justify-between border-b border-slate-200 pb-2 text-sm font-medium text-slate-500"
          role="tablist"
          aria-label="Settings tabs"
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabChange(tab.key)}
              className={cn("relative pb-2", activeTab === tab.key ? "text-blue-600" : "text-slate-600")}
              role="tab"
              aria-selected={activeTab === tab.key}
              aria-controls={`settings-${tab.key}`}
            >
              {t(tab.label)}
              {activeTab === tab.key && (
                <span className="absolute left-0 right-0 -bottom-[9px] h-0.5 rounded-full bg-blue-600" />
              )}
            </button>
          ))}
        </div>

        {activeTab === "info" ? (
          <div id="settings-info">
            <div className="flex flex-col items-center gap-6 py-8">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-slate-300">
                <UserCircle className="h-14 w-14" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  {t({ en: "Name", bn: "নাম" })}
                </label>
                <input
                  value={settings.name}
                  onChange={(event) => setSettings((prev) => ({ ...prev, name: event.target.value }))}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  {t({ en: "Mobile Number", bn: "মোবাইল নম্বর" })}
                </label>
                <input
                  value={settings.phone}
                  onChange={(event) => setSettings((prev) => ({ ...prev, phone: event.target.value }))}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  {t({ en: "Class", bn: "শ্রেণি" })}
                </label>
                <input
                  value={settings.studentClass}
                  onChange={(event) => setSettings((prev) => ({ ...prev, studentClass: event.target.value }))}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  {t({ en: "Birthday", bn: "জন্মদিন" })}
                </label>
                <input
                  type="date"
                  value={settings.birthday}
                  onChange={(event) => setSettings((prev) => ({ ...prev, birthday: event.target.value }))}
                  className={cn(inputClass, "pr-3")}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  {t({ en: "Institute Name", bn: "প্রতিষ্ঠানের নাম" })}
                </label>
                <input
                  value={settings.school}
                  onChange={(event) => setSettings((prev) => ({ ...prev, school: event.target.value }))}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  {t({ en: "Exam batch", bn: "এক্সাম ব্যাচ" })}
                </label>
                <input
                  value={settings.examBatch}
                  onChange={(event) => setSettings((prev) => ({ ...prev, examBatch: event.target.value }))}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2 flex flex-wrap items-center justify-end gap-3 pt-2">
                {error && (
                  <span className="text-xs text-red-600" role="alert">
                    {error}
                  </span>
                )}
                {status === "saved" && (
                  <span className="text-xs text-emerald-600" role="status">
                    {t({ en: "Saved", bn: "সেভ হয়েছে" })}
                  </span>
                )}
                <button
                  type="submit"
                  disabled={status === "saving"}
                  className={cn(
                    "h-11 rounded-full px-6 text-sm font-semibold text-white transition-colors",
                    status === "saving" ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                  )}
                >
                  {status === "saving" ? t({ en: "Saving...", bn: "সেভ হচ্ছে..." }) : t({ en: "Save", bn: "সেভ" })}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div id="settings-syllabus" className="space-y-8 py-8">
            <h2 className="text-center text-lg font-semibold text-slate-800">
              {t({ en: "Class & Group", bn: "শ্রেণি ও গ্রুপ" })}
            </h2>
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
              <div className="flex items-center justify-center">
                <ChalkboardIllustration />
              </div>
              <div className="space-y-8 text-center lg:text-left">
                <div>
                  <div className="text-sm font-semibold text-slate-800">{t({ en: "Class", bn: "শ্রেণি" })}</div>
                  <div className="mx-auto mt-2 h-px w-20 bg-slate-800/80 lg:mx-0" />
                  <div className="mt-2 text-sm text-slate-600">
                    {t({ en: "Class", bn: "শ্রেণি" })} : {classDisplay}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">{t({ en: "Group", bn: "গ্রুপ" })}</div>
                  <div className="mx-auto mt-2 h-px w-20 bg-slate-800/80 lg:mx-0" />
                  <div className="mt-2 text-sm text-slate-600">{groupDisplay}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ChalkboardIllustration() {
  return (
    <div className="relative w-full max-w-sm">
      <div className="rounded-[28px] bg-gradient-to-b from-[#D9A46B] to-[#B37438] p-4 shadow-md">
        <div className="rounded-[22px] bg-[#2F3437] p-3">
          <div className="h-52 rounded-[18px] bg-gradient-to-br from-[#3A3F44] via-[#2F3437] to-[#24292D]" />
        </div>
      </div>
      <div className="absolute left-1/2 top-full h-14 w-3 -translate-x-1/2 rounded-b-full bg-gradient-to-b from-[#D9A46B] to-[#B37438]" />
      <div className="absolute -bottom-8 left-8 h-20 w-4 rotate-6 rounded-full bg-[#7A4A24]" />
      <div className="absolute -bottom-8 right-8 h-20 w-4 -rotate-6 rounded-full bg-[#7A4A24]" />
      <div className="absolute -bottom-2 left-1/2 h-3 w-28 -translate-x-1/2 rounded-full bg-[#9A6035]" />
    </div>
  );
}
