"use client";

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { usePageMeta } from "@/lib/usePageMeta";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  usePageMeta({
    title: "Sign in",
    description: "Sign in to access your HomeSchool learning dashboard.",
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
        setError("Please confirm your email before signing in.");
      } else {
        setError(authError.message);
      }
      setLoading(false);
      return;
    }

    navigate(redirectTo, { replace: true });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tighter text-primary">HomeSchool</h1>
          <p className="text-muted-foreground">Interactive Learning Platform for Class 6-12</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Sign in with your registered email.</CardDescription>
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
                  Email
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
                  Password
                </label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <Link to="/forgot-password" className="hover:text-primary">
                  Forgot password?
                </Link>
                <Link to="/signup" className="hover:text-primary">
                  Create account
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center text-xs text-muted-foreground">
            New here? <Link to="/signup" className="ml-1 text-primary hover:underline">Create an account</Link>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
