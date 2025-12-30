"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { usePageMeta } from "@/lib/usePageMeta";
import { supabase } from "@/lib/supabaseClient";
import { useTranslate } from "@/lib/i18n";
import { AuthShell } from "@/components/AuthShell";

export default function ForgotPasswordPage() {
  const t = useTranslate();

  usePageMeta({
    title: t({ en: "Forgot password", bn: "পাসওয়ার্ড ভুলে গেছেন" }),
    description: t({ en: "Request a password reset link for your HomeSchool account.", bn: "HomeSchool অ্যাকাউন্টের জন্য পাসওয়ার্ড রিসেট লিংক অনুরোধ করুন।" }),
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

    setSuccess(t({ en: "Password reset link sent. Check your email.", bn: "পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে। আপনার ইমেইল দেখুন।" }));
    setLoading(false);
  };

  return (
    <AuthShell>
      <div className="flex items-center justify-center py-10">
        <div className="w-full max-w-md space-y-4">
          <div className="text-center space-y-3 mb-8">
            <img src="/logo.png" alt="HomeSchool" className="mx-auto h-12 w-auto" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{t({ en: "Reset your password", bn: "পাসওয়ার্ড রিসেট করুন" })}</h1>
            <p className="text-muted-foreground">{t({ en: "We will send a reset link to your email.", bn: "আমরা আপনার ইমেইলে রিসেট লিংক পাঠাব।" })}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t({ en: "Forgot password", bn: "পাসওয়ার্ড ভুলে গেছেন" })}</CardTitle>
              <CardDescription>{t({ en: "Enter the email you used to register.", bn: "রেজিস্ট্রেশনের সময় ব্যবহৃত ইমেইল দিন।" })}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="space-y-2">
                  <label htmlFor="reset-email" className="text-sm font-medium">
                    {t({ en: "Email", bn: "ইমেইল" })}
                  </label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t({ en: "Sending link...", bn: "লিংক পাঠানো হচ্ছে..." }) : t({ en: "Send reset link", bn: "রিসেট লিংক পাঠান" })}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="justify-center text-xs text-muted-foreground">
              {t({ en: "Remembered your password?", bn: "পাসওয়ার্ড মনে পড়েছে?" })}{" "}
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
