import { Outlet } from "react-router-dom";
import { StudentProvider } from "@/lib/store";
import { AuthProvider } from "@/lib/auth";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StudentProvider>
        <div className="min-h-screen bg-background font-sans antialiased">
          <Outlet />
        </div>
      </StudentProvider>
    </AuthProvider>
  );
}
