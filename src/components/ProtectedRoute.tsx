import type { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";

export function ProtectedRoute({ children }: { children?: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
        Loading your account...
      </div>
    );
  }

  if (!user) {
    const redirectPath = `${location.pathname}${location.search}`;
    return <Navigate to="/login" replace state={{ from: redirectPath }} />;
  }

  return children ? <>{children}</> : <Outlet />;
}
