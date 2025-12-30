"use client";

import React from "react";
import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const current = i18n.language ? i18n.language.split("-")[0] : "en";

  const setLang = (lng: string) => {
    if (lng === current) return;
    i18n.changeLanguage(lng);
    try {
      localStorage.setItem("i18nextLng", lng);
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`rounded px-2 py-1 text-sm ${current === "en" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
        aria-pressed={current === "en"}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("bn")}
        className={`rounded px-2 py-1 text-sm ${current === "bn" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
        aria-pressed={current === "bn"}
      >
        BN
      </button>
    </div>
  );
}
