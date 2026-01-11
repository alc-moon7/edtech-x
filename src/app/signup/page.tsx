"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { usePageMeta } from "@/lib/usePageMeta";
import { supabase } from "@/lib/supabaseClient";
import { useTranslate } from "@/lib/i18n";
import { AuthModal } from "@/components/AuthModal";
import HomePage from "@/app/page";

type SignupForm = {
  full_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  school: string;
  class_name: string;
  section: string;
  student_id: string;
  guardian_name: string;
  phone: string;
};

const initialForm: SignupForm = {
  full_name: "",
  email: "",
  password: "",
  confirmPassword: "",
  school: "",
  class_name: "",
  section: "",
  student_id: "",
  guardian_name: "",
  phone: "",
};

export default function SignupPage() {
  const t = useTranslate();

  usePageMeta({
    title: t({ en: "Create account", bn: "অ্যাকাউন্ট তৈরি" }),
    description: t({ en: "Create a HomeSchool student account and profile.", bn: "HomeSchool শিক্ষার্থী অ্যাকাউন্ট ও প্রোফাইল তৈরি করুন।" }),
  });

  const [formData, setFormData] = useState<SignupForm>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handleChange = (field: keyof SignupForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.full_name.trim()) nextErrors.full_name = t({ en: "Full name is required.", bn: "পূর্ণ নাম আবশ্যক।" });
    if (!formData.email.trim()) nextErrors.email = t({ en: "Email is required.", bn: "ইমেইল আবশ্যক।" });
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) nextErrors.email = t({ en: "Enter a valid email.", bn: "সঠিক ইমেইল লিখুন।" });
    if (!formData.password) nextErrors.password = t({ en: "Password is required.", bn: "পাসওয়ার্ড আবশ্যক।" });
    if (formData.password.length < 6) nextErrors.password = t({ en: "Password must be at least 6 characters.", bn: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" });
    if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = t({ en: "Passwords do not match.", bn: "পাসওয়ার্ড মিলছে না।" });
    }
    if (!formData.school.trim()) nextErrors.school = t({ en: "School name is required.", bn: "স্কুলের নাম আবশ্যক।" });
    if (!formData.class_name.trim()) nextErrors.class_name = t({ en: "Class is required.", bn: "ক্লাস আবশ্যক।" });
    if (!formData.student_id.trim()) nextErrors.student_id = t({ en: "Student ID or roll is required.", bn: "শিক্ষার্থী আইডি বা রোল আবশ্যক।" });
    if (!formData.guardian_name.trim()) nextErrors.guardian_name = t({ en: "Guardian name is required.", bn: "অভিভাবকের নাম আবশ্যক।" });
    if (!formData.phone.trim()) nextErrors.phone = t({ en: "Phone number is required.", bn: "ফোন নম্বর আবশ্যক।" });
    return nextErrors;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});

    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {
          full_name: formData.full_name,
          school: formData.school,
          class: formData.class_name,
          section: formData.section,
          student_id: formData.student_id,
          guardian_name: formData.guardian_name,
          phone: formData.phone,
        },
      },
    });

    if (error) {
      setErrors({ form: error.message });
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    setFormData(initialForm);
  };

  const illustrationSrc = "/assets/Login_img.png";

  return (
    <>
      <div className="relative">
        <div className="pointer-events-none filter blur-[6px]">
          <HomePage />
        </div>
      </div>
      <AuthModal
        open
        onClose={() => window.history.back()}
        illustrationSrc={illustrationSrc}
        title={t({ en: "Create your account", bn: "আপনার অ্যাকাউন্ট তৈরি করুন" })}
        subtitle={t({ en: "Start your learning journey today", bn: "আজই আপনার শেখার যাত্রা শুরু করুন" })}
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          {errors.form && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {errors.form}
            </div>
          )}
          {success && (
            <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700" role="status">
              {t({ en: "Account created. Please check your email to confirm and then sign in.", bn: "অ্যাকাউন্ট তৈরি হয়েছে। ইমেইল যাচাই করে তারপর সাইন ইন করুন।" })}
            </div>
          )}

          <div className="grid grid-cols-1 gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 justify-center gap-2 text-sm font-semibold"
              onClick={() => setShowComingSoon(true)}
            >
              📱 {t({ en: "Continue with Mobile", bn: "মোবাইল দিয়ে চালিয়ে যান" })}
            </Button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600">
            <div className="h-px flex-1 bg-slate-200" />
            <span>{t({ en: "Continue with Email", bn: "ইমেইল দিয়ে চালিয়ে যান" })}</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="full_name" className="text-sm font-medium text-slate-800">
                {t({ en: "Full name *", bn: "পূর্ণ নাম *" })}
              </label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(event) => handleChange("full_name", event.target.value)}
                aria-invalid={!!errors.full_name}
                className="rounded-xl border-slate-200 bg-white/70 shadow-sm"
              />
              {errors.full_name && <p className="text-xs text-red-600">{errors.full_name}</p>}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-slate-800">
                {t({ en: "Email *", bn: "ইমেইল *" })}
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(event) => handleChange("email", event.target.value)}
                aria-invalid={!!errors.email}
                className="rounded-xl border-slate-200 bg-white/70 shadow-sm"
              />
              {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-slate-800">
                {t({ en: "Password *", bn: "পাসওয়ার্ড *" })}
              </label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(event) => handleChange("password", event.target.value)}
                aria-invalid={!!errors.password}
                className="rounded-xl border-slate-200 bg-white/70 shadow-sm"
              />
              {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-800">
                {t({ en: "Confirm password *", bn: "পাসওয়ার্ড নিশ্চিত করুন *" })}
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(event) => handleChange("confirmPassword", event.target.value)}
                aria-invalid={!!errors.confirmPassword}
                className="rounded-xl border-slate-200 bg-white/70 shadow-sm"
              />
              {errors.confirmPassword && <p className="text-xs text-red-600">{errors.confirmPassword}</p>}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="school" className="text-sm font-medium text-slate-800">
                {t({ en: "School *", bn: "স্কুল *" })}
              </label>
              <Input
                id="school"
                value={formData.school}
                onChange={(event) => handleChange("school", event.target.value)}
                aria-invalid={!!errors.school}
                className="rounded-xl border-slate-200 bg-white/70 shadow-sm"
              />
              {errors.school && <p className="text-xs text-red-600">{errors.school}</p>}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="class_name" className="text-sm font-medium text-slate-800">
                {t({ en: "Class *", bn: "ক্লাস *" })}
              </label>
              <select
                id="class_name"
                value={formData.class_name}
                onChange={(event) => handleChange("class_name", event.target.value)}
                aria-invalid={!!errors.class_name}
                className="flex h-11 w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-100"
              >
                <option value="">{t({ en: "Select class", bn: "ক্লাস নির্বাচন করুন" })}</option>
                <option value="Class 6">{t({ en: "Class 6", bn: "ক্লাস ৬" })}</option>
                <option value="Class 7">{t({ en: "Class 7", bn: "ক্লাস ৭" })}</option>
                <option value="Class 8">{t({ en: "Class 8", bn: "ক্লাস ৮" })}</option>
                <option value="Class 9">{t({ en: "Class 9", bn: "ক্লাস ৯" })}</option>
                <option value="Class 10">{t({ en: "Class 10", bn: "ক্লাস ১০" })}</option>
                <option value="Class 11">{t({ en: "Class 11", bn: "ক্লাস ১১" })}</option>
                <option value="Class 12">{t({ en: "Class 12", bn: "ক্লাস ১২" })}</option>
              </select>
              {errors.class_name && <p className="text-xs text-red-600">{errors.class_name}</p>}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="section" className="text-sm font-medium text-slate-800">
                {t({ en: "Section (optional)", bn: "সেকশন (ঐচ্ছিক)" })}
              </label>
              <Input
                id="section"
                value={formData.section}
                onChange={(event) => handleChange("section", event.target.value)}
                aria-invalid={!!errors.section}
                className="rounded-xl border-slate-200 bg-white/70 shadow-sm"
              />
              {errors.section && <p className="text-xs text-red-600">{errors.section}</p>}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="student_id" className="text-sm font-medium text-slate-800">
                {t({ en: "Student ID / Roll *", bn: "স্টুডেন্ট আইডি / রোল *" })}
              </label>
              <Input
                id="student_id"
                value={formData.student_id}
                onChange={(event) => handleChange("student_id", event.target.value)}
                aria-invalid={!!errors.student_id}
                className="rounded-xl border-slate-200 bg-white/70 shadow-sm"
              />
              {errors.student_id && <p className="text-xs text-red-600">{errors.student_id}</p>}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="guardian_name" className="text-sm font-medium text-slate-800">
                {t({ en: "Guardian name *", bn: "অভিভাবকের নাম *" })}
              </label>
              <Input
                id="guardian_name"
                value={formData.guardian_name}
                onChange={(event) => handleChange("guardian_name", event.target.value)}
                aria-invalid={!!errors.guardian_name}
                className="rounded-xl border-slate-200 bg-white/70 shadow-sm"
              />
              {errors.guardian_name && <p className="text-xs text-red-600">{errors.guardian_name}</p>}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-sm font-medium text-slate-800">
                {t({ en: "Phone *", bn: "ফোন *" })}
              </label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(event) => handleChange("phone", event.target.value)}
                aria-invalid={!!errors.phone}
                className="rounded-xl border-slate-200 bg-white/70 shadow-sm"
              />
              {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
            </div>
          </div>

          <Button type="submit" className="w-full rounded-xl py-3 text-sm font-semibold" disabled={loading}>
            {loading ? t({ en: "Creating account...", bn: "অ্যাকাউন্ট তৈরি হচ্ছে..." }) : t({ en: "Create account", bn: "অ্যাকাউন্ট তৈরি করুন" })}
          </Button>

          <p className="text-xs text-slate-500">
            {t({ en: "All data is used to personalize your learning profile.", bn: "আপনার শেখার প্রোফাইল ব্যক্তিগতকরণের জন্য সব তথ্য ব্যবহৃত হবে।" })}
          </p>
          <p className="text-sm text-slate-700">
            {t({ en: "Already have an account?", bn: "আগেই অ্যাকাউন্ট আছে?" })}{" "}
            <Link to="/login" className="font-semibold text-blue-700 hover:underline">
              {t({ en: "Sign in", bn: "সাইন ইন" })}
            </Link>
          </p>
        </form>
      </AuthModal>

      {showComingSoon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl ring-1 ring-slate-200">
            <div className="mb-3 text-center">
              <h2 className="text-lg font-semibold text-slate-900">{t({ en: "Coming Soon", bn: "শিগগিরই আসছে" })}</h2>
              <p className="mt-1 text-sm text-slate-600">
                {t({ en: "Mobile sign-up is coming soon.", bn: "মোবাইল সাইন-আপ শিগগিরই আসছে।" })}
              </p>
            </div>
            <div className="flex justify-center">
              <Button className="w-full sm:w-auto px-6" onClick={() => setShowComingSoon(false)}>
                {t({ en: "Close", bn: "বন্ধ করুন" })}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
