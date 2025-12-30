"use client";

import { useLanguage } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const setLang = (lng: "en" | "bn") => {
    if (lng === language) return;
    setLanguage(lng);
  };

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`rounded px-2 py-1 text-sm ${language === "en" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
        aria-pressed={language === "en"}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("bn")}
        className={`rounded px-2 py-1 text-sm ${language === "bn" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
        aria-pressed={language === "bn"}
      >
        BN
      </button>
    </div>
  );
}
