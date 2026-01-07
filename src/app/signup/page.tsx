"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { usePageMeta } from "@/lib/usePageMeta";
import { supabase } from "@/lib/supabaseClient";
import { useTranslate } from "@/lib/i18n";
import { MarketingNav } from "@/components/MarketingNav";
import { Footer } from "@/components/Footer";

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

  return (
    <div className="min-h-screen bg-gray-50">
      <MarketingNav />
      <div className="mx-auto mt-4 flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 md:mt-6">
        <div className="w-full px-5 py-6 sm:px-8">
          <div className="text-center space-y-2 mb-4">
            <img src="/logo.png" alt="HomeSchool" className="mx-auto h-12 w-auto" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{t({ en: "Create your account", bn: "আপনার অ্যাকাউন্ট তৈরি করুন" })}</h1>
            <p className="text-sm text-muted-foreground">
              {t({ en: "Start your learning journey today", bn: "আজই আপনার শেখার যাত্রা শুরু করুন" })}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t({ en: "Student profile", bn: "শিক্ষার্থী প্রোফাইল" })}</CardTitle>
              <CardDescription>{t({ en: "All fields marked * are required.", bn: "* চিহ্নিত সব ঘর বাধ্যতামূলক।" })}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
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

                <div className="grid grid-cols-1 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 justify-center gap-2 text-sm font-semibold"
                    onClick={() => setShowComingSoon(true)}
                  >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="" className="h-5 w-5" />
                    {t({ en: "Continue with Google", bn: "গুগল দিয়ে চালিয়ে যান" })}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 justify-center gap-2 text-sm font-semibold"
                    onClick={() => setShowComingSoon(true)}
                  >
                    <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="" className="h-5 w-5" />
                    {t({ en: "Continue with Facebook", bn: "ফেসবুক দিয়ে চালিয়ে যান" })}
                  </Button>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span>{t({ en: "Continue with Email", bn: "ইমেইল দিয়ে চালিয়ে যান" })}</span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="full_name" className="text-sm font-medium">
                      {t({ en: "Full name *", bn: "পূর্ণ নাম *" })}
                    </label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(event) => handleChange("full_name", event.target.value)}
                      aria-invalid={!!errors.full_name}
                    />
                    {errors.full_name && <p className="text-xs text-red-600">{errors.full_name}</p>}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      {t({ en: "Email *", bn: "ইমেইল *" })}
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(event) => handleChange("email", event.target.value)}
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      {t({ en: "Password *", bn: "পাসওয়ার্ড *" })}
                    </label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(event) => handleChange("password", event.target.value)}
                      aria-invalid={!!errors.password}
                    />
                    {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium">
                      {t({ en: "Confirm password *", bn: "পাসওয়ার্ড নিশ্চিত করুন *" })}
                    </label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(event) => handleChange("confirmPassword", event.target.value)}
                      aria-invalid={!!errors.confirmPassword}
                    />
                    {errors.confirmPassword && <p className="text-xs text-red-600">{errors.confirmPassword}</p>}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="school" className="text-sm font-medium">
                      {t({ en: "School *", bn: "স্কুল *" })}
                    </label>
                    <Input
                      id="school"
                      value={formData.school}
                      onChange={(event) => handleChange("school", event.target.value)}
                      aria-invalid={!!errors.school}
                    />
                    {errors.school && <p className="text-xs text-red-600">{errors.school}</p>}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="class_name" className="text-sm font-medium">
                      {t({ en: "Class *", bn: "ক্লাস *" })}
                    </label>
                    <select
                      id="class_name"
                      value={formData.class_name}
                      onChange={(event) => handleChange("class_name", event.target.value)}
                      aria-invalid={!!errors.class_name}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="section" className="text-sm font-medium">
                      {t({ en: "Section (optional)", bn: "সেকশন (ঐচ্ছিক)" })}
                    </label>
                    <Input
                      id="section"
                      value={formData.section}
                      onChange={(event) => handleChange("section", event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="student_id" className="text-sm font-medium">
                      {t({ en: "Student ID / Roll *", bn: "শিক্ষার্থী আইডি / রোল *" })}
                    </label>
                    <Input
                      id="student_id"
                      value={formData.student_id}
                      onChange={(event) => handleChange("student_id", event.target.value)}
                      aria-invalid={!!errors.student_id}
                    />
                    {errors.student_id && <p className="text-xs text-red-600">{errors.student_id}</p>}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="guardian_name" className="text-sm font-medium">
                      {t({ en: "Guardian name *", bn: "অভিভাবকের নাম *" })}
                    </label>
                    <Input
                      id="guardian_name"
                      value={formData.guardian_name}
                      onChange={(event) => handleChange("guardian_name", event.target.value)}
                      aria-invalid={!!errors.guardian_name}
                    />
                    {errors.guardian_name && <p className="text-xs text-red-600">{errors.guardian_name}</p>}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      {t({ en: "Phone *", bn: "ফোন *" })}
                    </label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(event) => handleChange("phone", event.target.value)}
                      aria-invalid={!!errors.phone}
                    />
                    {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t({ en: "Creating account...", bn: "অ্যাকাউন্ট তৈরি হচ্ছে..." }) : t({ en: "Create account", bn: "অ্যাকাউন্ট তৈরি করুন" })}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="justify-center text-xs text-muted-foreground">
              {t({ en: "Already have an account?", bn: "ইতিমধ্যে অ্যাকাউন্ট আছে?" })}{" "}
              <Link to="/login" className="ml-1 text-primary hover:underline">
                {t({ en: "Sign in", bn: "সাইন ইন" })}
              </Link>
            </CardFooter>
          </Card>

          <p className="mt-4 text-center text-[12px] text-muted-foreground">
            {t({ en: "By continuing, you agree to Homeschool's Terms of Service and Privacy Policy", bn: "অগ্রসর হয়ে আপনি Homeschool-এর Terms of Service ও Privacy Policy মেনে নিচ্ছেন" })}
          </p>
        </div>

      </div>

      {showComingSoon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl ring-1 ring-slate-200">
            <div className="mb-3 text-center">
              <h2 className="text-lg font-semibold text-slate-900">Coming Soon</h2>
              <p className="mt-1 text-sm text-slate-600">
                {t({ en: "Google and Facebook sign-in are coming soon.", bn: "গুগল ও ফেসবুক সাইন-ইন শীঘ্রই আসছে।" })}
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

      <Footer />
    </div>
  );
}
