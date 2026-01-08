"use client";

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { usePageMeta } from "@/lib/usePageMeta";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/auth";
import { useTranslate } from "@/lib/i18n";
import { MarketingNav } from "@/components/MarketingNav";
import { Footer } from "@/components/Footer";

export default function LoginPage() {
  const t = useTranslate();

  usePageMeta({
    title: t({ en: "Sign in", bn: "সাইন ইন" }),
    description: t({
      en: "Sign in to access your HomeSchool learning dashboard.",
      bn: "HomeSchool শেখার ড্যাশবোর্ডে যেতে সাইন ইন করুন।",
    }),
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showComingSoon, setShowComingSoon] = useState(false);

  const redirectTo = (location.state as { from?: string })?.from ?? "/dashboard";

  useEffect(() => {
    if (user) {
      navigate(redirectTo, { replace: true });
    }
  }, [user, navigate, redirectTo]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      if (authError.message.toLowerCase().includes("confirm")) {
        setError(t({ en: "Please confirm your email before signing in.", bn: "সাইন ইন করার আগে ইমেইল নিশ্চিত করুন।" }));
      } else {
        setError(authError.message);
      }
      setLoading(false);
      return;
    }

    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MarketingNav />
      <div className="mx-auto mt-6 flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 md:mt-8 md:min-h-[calc(100vh-152px)] md:flex-row">
        <div className="w-full px-6 py-7 sm:px-8 md:max-w-md md:py-9">
          <div className="space-y-2 text-center">
            <img src="/logo.png" alt="HomeSchool" className="mx-auto h-11 w-auto" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{t({ en: "Sign in", bn: "সাইন ইন" })}</h1>
            <p className="text-sm text-muted-foreground">
              {t({ en: "Start your learning journey today", bn: "আজই আপনার শেখার যাত্রা শুরু করুন" })}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                {error}
              </div>
            )}
            {message && (
              <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700" role="status">
                {message}
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

            <div className="space-y-2">
              <label htmlFor="login-email" className="text-sm font-medium">
                {t({ en: "Email", bn: "ইমেইল" })}
              </label>
              <Input
                id="login-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                className="h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="login-password" className="text-sm font-medium">
                {t({ en: "Password", bn: "পাসওয়ার্ড" })}
              </label>
              <Input
                id="login-password"
                type="password"
                placeholder={t({ en: "Enter your password", bn: "আপনার পাসওয়ার্ড লিখুন" })}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                className="h-11"
                required
              />
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <Link to="/forgot-password" className="hover:text-primary">
                {t({ en: "Forgot password?", bn: "পাসওয়ার্ড ভুলে গেছেন?" })}
              </Link>
              <Link to="/signup" className="hover:text-primary">
                {t({ en: "Create account", bn: "অ্যাকাউন্ট তৈরি করুন" })}
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t({ en: "Signing in...", bn: "সাইন ইন হচ্ছে..." }) : t({ en: "Sign in", bn: "সাইন ইন" })}
            </Button>
          </form>

          <p className="mt-4 text-center text-[12px] text-muted-foreground">
            {t({
              en: "By continuing, you agree to Homeschool's Terms of Service and Privacy Policy",
              bn: "চালিয়ে গেলে আপনি HomeSchool-এর সার্ভিসের শর্তাবলি ও প্রাইভেসি পলিসিতে সম্মত হচ্ছেন।",
            })}
          </p>
        </div>

        <div className="relative hidden flex-1 md:block">
          <img src="/Login.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        </div>
      </div>

      {showComingSoon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl ring-1 ring-slate-200">
            <div className="mb-3 text-center">
              <h2 className="text-lg font-semibold text-slate-900">{t({ en: "Coming Soon", bn: "শিগগিরই আসছে" })}</h2>
              <p className="mt-1 text-sm text-slate-600">
                {t({ en: "Google and Facebook sign-in are coming soon.", bn: "গুগল ও ফেসবুক সাইন-ইন শিগগিরই আসছে।" })}
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
