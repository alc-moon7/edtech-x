import { Outlet } from "react-router-dom";
import { StudentProvider } from "@/lib/store";
import { AuthProvider } from "@/lib/auth";
import { LanguageProvider } from "@/lib/i18n";
import { ChatWidget } from "@/components/ChatWidget";
import { ScrollToTop } from "@/components/ScrollToTop";

export default function RootLayout() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <StudentProvider>
          <div className="min-h-screen bg-background font-sans antialiased">
            <ScrollToTop />
            <Outlet />
            <ChatWidget />
          </div>
        </StudentProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
