"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { usePageMeta } from "@/lib/usePageMeta";
import { supabase } from "@/lib/supabaseClient";

export default function ResetPasswordPage() {
  usePageMeta({
    title: "Reset password",
    description: "Set a new password for your HomeSchool account.",
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
          setError("This reset link is invalid or has expired.");
          setReady(false);
          return;
        }
      }

      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        setError("This reset link is invalid or has expired.");
        setReady(false);
        return;
      }
      setReady(true);
    };

    initSession();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
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
    setSuccess("Password updated. Please sign in with your new password.");
    setLoading(false);
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tighter text-primary">Set a new password</h1>
          <p className="text-muted-foreground">Create a secure password to continue.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reset password</CardTitle>
            <CardDescription>Use a strong password that you have not used before.</CardDescription>
          </CardHeader>
          <CardContent>
            {!ready && !error && (
              <div className="text-sm text-muted-foreground">Checking your link...</div>
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
                    New password
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
                    Confirm password
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
                  {loading ? "Updating..." : "Update password"}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="justify-center text-xs text-muted-foreground">
            Back to <Link to="/login" className="ml-1 text-primary hover:underline">Sign in</Link>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
