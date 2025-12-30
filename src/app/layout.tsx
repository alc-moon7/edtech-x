import { Outlet } from "react-router-dom";
import { StudentProvider } from "@/lib/store";
import { AuthProvider } from "@/lib/auth";
import { LanguageProvider } from "@/lib/i18n";

export default function RootLayout() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <StudentProvider>
          <div className="min-h-screen bg-background font-sans antialiased">
            <Outlet />
          </div>
        </StudentProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
