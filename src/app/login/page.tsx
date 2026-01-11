"use client";

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { usePageMeta } from "@/lib/usePageMeta";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/auth";
import { useTranslate } from "@/lib/i18n";
import { AuthModal } from "@/components/AuthModal";
import HomePage from "@/app/page";

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
  const { user, signInDemo } = useAuth();

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
    // If demo credentials are used, sign in locally without calling backend
    if (email.trim().toLowerCase() === "admin@gmail.com" && password === "admin") {
      if (signInDemo) {
        try {
          await signInDemo("admin@gmail.com", "admin");
          navigate(redirectTo, { replace: true });
          return;
        } catch (err) {
          setError(String(err || "Demo sign-in failed"));
          setLoading(false);
          return;
        }
      }
    }

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
        onClose={() => navigate("/")}
        illustrationSrc={illustrationSrc}
        title={t({ en: "Sign in", bn: "সাইন ইন" })}
        subtitle={t({ en: "Start your learning journey today", bn: "আজই আপনার শেখার যাত্রা শুরু করুন" })}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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
              📱 {t({ en: "Continue with Mobile", bn: "মোবাইল দিয়ে চালিয়ে যান" })}
            </Button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="h-px flex-1 bg-slate-200" />
            <span>{t({ en: "Continue with Email", bn: "ইমেইল দিয়ে চালিয়ে যান" })}</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="space-y-2">
            <label htmlFor="login-email" className="text-sm font-medium text-slate-800">
              {t({ en: "Email", bn: "ইমেইল" })}
            </label>
            <Input
              id="login-email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              className="h-11 rounded-xl border-slate-200 bg-white/70 shadow-sm"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="login-password" className="text-sm font-medium text-slate-800">
              {t({ en: "Password", bn: "পাসওয়ার্ড" })}
            </label>
            <Input
              id="login-password"
              type="password"
              placeholder={t({ en: "Enter your password", bn: "আপনার পাসওয়ার্ড লিখুন" })}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              className="h-11 rounded-xl border-slate-200 bg-white/70 shadow-sm"
              required
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600">
            <Link to="/forgot-password" className="font-semibold text-blue-700 hover:text-blue-800">
              {t({ en: "Forgot password?", bn: "পাসওয়ার্ড ভুলে গেছেন?" })}
            </Link>
            <Link to="/signup" className="font-semibold text-blue-700 hover:text-blue-800">
              {t({ en: "Create account", bn: "অ্যাকাউন্ট তৈরি করুন" })}
            </Link>
          </div>

          <Button type="submit" className="w-full rounded-xl py-3 text-sm font-semibold" disabled={loading}>
            {loading ? t({ en: "Signing in...", bn: "সাইন ইন হচ্ছে..." }) : t({ en: "Sign in", bn: "সাইন ইন" })}
          </Button>
        </form>

        <p className="mt-4 text-center text-[12px] text-slate-500">
          {t({
            en: "By continuing, you agree to Homeschool's Terms of Service and Privacy Policy",
            bn: "চালিয়ে গেলে আপনি HomeSchool-এর সার্ভিসের শর্তাবলি ও প্রাইভেসি পলিসিতে সম্মত হচ্ছেন।",
          })}
        </p>
      </AuthModal>

      {showComingSoon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl ring-1 ring-slate-200">
            <div className="mb-3 text-center">
              <h2 className="text-lg font-semibold text-slate-900">{t({ en: "Coming Soon", bn: "শিগগিরই আসছে" })}</h2>
              <p className="mt-1 text-sm text-slate-600">
                {t({ en: "Mobile login is coming soon.", bn: "মোবাইল লগইন শিগগিরই আসছে।" })}
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
