"use client";

import { useEffect, useState } from "react";
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

export default function SettingsPage() {
  const { user } = useAuth();
  const t = useTranslate();
  const [settings, setSettings] = useState<SettingsState>(initialState);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);

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
        <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-sm font-medium text-slate-500">
          <div className="relative pb-2 text-blue-600">
            {t({ en: "Your Information", bn: "আপনার তথ্য" })}
            <span className="absolute left-0 right-0 -bottom-[9px] h-0.5 rounded-full bg-blue-600" />
          </div>
          <div className="relative pb-2 text-slate-600">
            {t({ en: "Syllabus", bn: "সিলেবাস" })}
            <span className="absolute left-0 right-0 -bottom-[9px] h-0.5 rounded-full bg-slate-800/60" />
          </div>
        </div>

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
    </div>
  );
}
