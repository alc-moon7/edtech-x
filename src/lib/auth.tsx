import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";
import { syncProfile } from "@/lib/profile";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInDemo?: (email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setLoading(false);
      if (data.session?.user) {
        syncProfile(data.session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
      if (nextSession?.user) {
        syncProfile(nextSession.user);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [isSupabaseConfigured]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      signOut: async () => {
        try {
          await supabase.auth.signOut({ scope: "local" });
        } catch {
          // ignore; we still clear local state below
        }
        // clear demo flag if set
        try {
          localStorage.removeItem("homeschool_demo_user");
        } catch {}
        setSession(null);
        setLoading(false);
      },
      signInDemo: async (email: string, password: string) => {
        // create a minimal fake session/user and store demo flag locally
        const demoUser: User = {
          id: "demo-user",
          app_metadata: {},
          user_metadata: { demo: true },
          aud: "authenticated",
          email: email,
          phone: null,
          created_at: new Date().toISOString(),
          confirmed_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          role: "authenticated",
        } as unknown as User;

        const fakeSession = {
          provider_token: null,
          provider_refresh_token: null,
          access_token: "demo-token",
          token_type: "bearer",
          expires_in: 3600,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          refresh_token: "",
          user: demoUser,
        } as unknown as Session;

        try {
          localStorage.setItem("homeschool_demo_user", JSON.stringify({ email }));
        } catch {}

        setSession(fakeSession);
        setLoading(false);
      },
    }),
    [session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
