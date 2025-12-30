"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { usePageMeta } from "@/lib/usePageMeta";
import { supabase } from "@/lib/supabaseClient";
import { useTranslate } from "@/lib/i18n";
import { AuthShell } from "@/components/AuthShell";

export default function ResetPasswordPage() {
  const t = useTranslate();

  usePageMeta({
    title: t({ en: "Reset password", bn: "পাসওয়ার্ড রিসেট" }),
    description: t({ en: "Set a new password for your HomeSchool account.", bn: "আপনার HomeSchool অ্যাকাউন্টের জন্য নতুন পাসওয়ার্ড সেট করুন।" }),
  });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    const initSession = async () => {
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          setError(t({ en: "This reset link is invalid or has expired.", bn: "এই রিসেট লিংকটি অবৈধ বা মেয়াদোত্তীর্ণ।" }));
          setReady(false);
          return;
        }
      }

      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !data.session) {
        setError(t({ en: "This reset link is invalid or has expired.", bn: "এই রিসেট লিংকটি অবৈধ বা মেয়াদোত্তীর্ণ।" }));
        setReady(false);
        return;
      }
      setReady(true);
    };

    initSession();
  }, [t]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (password.length < 6) {
      setError(t({ en: "Password must be at least 6 characters.", bn: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" }));
      return;
    }
    if (password !== confirmPassword) {
      setError(t({ en: "Passwords do not match.", bn: "পাসওয়ার্ড মিলছে না।" }));
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    await supabase.auth.signOut();
    setSuccess(t({ en: "Password updated. Please sign in with your new password.", bn: "পাসওয়ার্ড আপডেট হয়েছে। নতুন পাসওয়ার্ড দিয়ে সাইন ইন করুন।" }));
    setLoading(false);
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <AuthShell>
      <div className="flex items-center justify-center py-10">
        <div className="w-full max-w-md space-y-4">
          <div className="text-center space-y-3 mb-8">
            <img src="/logo.png" alt="HomeSchool" className="mx-auto h-12 w-auto" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{t({ en: "Set a new password", bn: "নতুন পাসওয়ার্ড সেট করুন" })}</h1>
            <p className="text-muted-foreground">{t({ en: "Create a secure password to continue.", bn: "চালিয়ে যেতে নিরাপদ পাসওয়ার্ড তৈরি করুন।" })}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t({ en: "Reset password", bn: "পাসওয়ার্ড রিসেট" })}</CardTitle>
              <CardDescription>{t({ en: "Use a strong password that you have not used before.", bn: "আগে ব্যবহার করেননি এমন শক্তিশালী পাসওয়ার্ড ব্যবহার করুন।" })}</CardDescription>
            </CardHeader>
            <CardContent>
              {!ready && !error && (
                <div className="text-sm text-muted-foreground">{t({ en: "Checking your link...", bn: "লিংক যাচাই করা হচ্ছে..." })}</div>
              )}
              {error && (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700" role="status">
                  {success}
                </div>
              )}
              {ready && !success && (
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label htmlFor="new-password" className="text-sm font-medium">
                      {t({ en: "New password", bn: "নতুন পাসওয়ার্ড" })}
                    </label>
                    <Input
                      id="new-password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="confirm-password" className="text-sm font-medium">
                      {t({ en: "Confirm password", bn: "পাসওয়ার্ড নিশ্চিত করুন" })}
                    </label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? t({ en: "Updating...", bn: "আপডেট হচ্ছে..." }) : t({ en: "Update password", bn: "পাসওয়ার্ড আপডেট করুন" })}
                  </Button>
                </form>
              )}
            </CardContent>
            <CardFooter className="justify-center text-xs text-muted-foreground">
              {t({ en: "Back to", bn: "ফিরে যান" })}{" "}
              <Link to="/login" className="ml-1 text-primary hover:underline">
                {t({ en: "Sign in", bn: "সাইন ইন" })}
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AuthShell>
  );
}
