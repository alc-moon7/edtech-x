"use client";

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { usePageMeta } from "@/lib/usePageMeta";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/auth";
import { useTranslate } from "@/lib/i18n";
import { AuthShell } from "@/components/AuthShell";

export default function LoginPage() {
  const t = useTranslate();

  usePageMeta({
    title: t({ en: "Sign in", bn: "সাইন ইন" }),
    description: t({ en: "Sign in to access your HomeSchool learning dashboard.", bn: "HomeSchool লার্নিং ড্যাশবোর্ডে প্রবেশ করতে সাইন ইন করুন।" }),
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

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
        setError(t({ en: "Please confirm your email before signing in.", bn: "সাইন ইন করার আগে ইমেইলটি নিশ্চিত করুন।" }));
      } else {
        setError(authError.message);
      }
      setLoading(false);
      return;
    }

    navigate(redirectTo, { replace: true });
  };

  return (
    <AuthShell>
      <div className="flex items-center justify-center py-10">
        <div className="w-full max-w-md space-y-4">
          <div className="text-center space-y-3 mb-8">
            <img src="/logo.png" alt="HomeSchool" className="mx-auto h-12 w-auto" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{t({ en: "Sign in", bn: "সাইন ইন" })}</h1>
            <p className="text-muted-foreground">{t({ en: "Interactive Learning Platform for Class 6-12", bn: "ক্লাস ৬-১২ এর ইন্টারঅ্যাকটিভ লার্নিং প্ল্যাটফর্ম" })}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t({ en: "Welcome back", bn: "আবার স্বাগতম" })}</CardTitle>
              <CardDescription>{t({ en: "Sign in with your registered email.", bn: "আপনার নিবন্ধিত ইমেইল দিয়ে সাইন ইন করুন।" })}</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
            <CardFooter className="justify-center text-xs text-muted-foreground">
              {t({ en: "New here?", bn: "নতুন?" })}{" "}
              <Link to="/signup" className="ml-1 text-primary hover:underline">
                {t({ en: "Create an account", bn: "একটি অ্যাকাউন্ট তৈরি করুন" })}
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AuthShell>
  );
}
