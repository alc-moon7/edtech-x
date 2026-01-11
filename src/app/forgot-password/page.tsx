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

export default function ForgotPasswordPage() {
  const t = useTranslate();

  usePageMeta({
    title: t({ en: "Forgot password", bn: "পাসওয়ার্ড ভুলে গেছেন" }),
    description: t({
      en: "Request a password reset link for your HomeSchool account.",
      bn: "HomeSchool অ্যাকাউন্টের জন্য পাসওয়ার্ড রিসেট লিংক অনুরোধ করুন।",
    }),
  });

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset_pass`,
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSuccess(
      t({
        en: "Password reset link sent. Check your email.",
        bn: "পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে। আপনার ইমেইল দেখুন।",
      })
    );
    setLoading(false);
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
        title={t({ en: "Reset your password", bn: "পাসওয়ার্ড রিসেট করুন" })}
        subtitle={t({ en: "We will send a reset link to your email.", bn: "আমরা আপনার ইমেইলে রিসেট লিংক পাঠাব।" })}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
              {success}
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="reset-email" className="text-sm font-medium text-slate-800">
              {t({ en: "Email", bn: "ইমেইল" })}
            </label>
            <Input
              id="reset-email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-11 rounded-xl border-slate-200 bg-white/70 shadow-sm"
              required
            />
          </div>
          <Button type="submit" className="w-full rounded-xl py-3 text-sm font-semibold" disabled={loading}>
            {loading ? t({ en: "Sending link...", bn: "লিংক পাঠানো হচ্ছে..." }) : t({ en: "Send reset link", bn: "রিসেট লিংক পাঠান" })}
          </Button>
          <p className="text-center text-xs text-slate-600">
            {t({ en: "Remembered your password?", bn: "পাসওয়ার্ড মনে পড়েছে?" })}{" "}
            <Link to="/login" className="font-semibold text-blue-700 hover:underline">
              {t({ en: "Sign in", bn: "সাইন ইন" })}
            </Link>
          </p>
        </form>
      </AuthModal>
    </>
  );
}
