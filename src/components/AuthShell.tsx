import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useTranslate } from "@/lib/i18n";

export function AuthShell({ children }: { children: ReactNode }) {
  const t = useTranslate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-xs font-medium text-muted-foreground hover:text-foreground">
          {t({ en: "Back to Home", bn: "হোমে ফিরে যান" })}
        </Link>
        <LanguageToggle />
      </header>
      <main className="px-4 pb-10">{children}</main>
    </div>
  );
}
