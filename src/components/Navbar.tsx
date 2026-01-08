"use client";

import { Bell, Search, Menu, User } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useTranslate } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";

export function Navbar() {
  const { user } = useAuth();
  const t = useTranslate();
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || t({ en: "Student", bn: "শিক্ষার্থী" });
  const displayClass = user?.user_metadata?.class || t({ en: "Class", bn: "ক্লাস" });

  return (
    <div className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-4 md:px-6 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="md:hidden text-muted-foreground hover:text-foreground"
          aria-label={t({ en: "Open sidebar", bn: "সাইডবার খুলুন" })}
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder={t({ en: "Search courses...", bn: "কোর্স খুঁজুন..." })}
            aria-label={t({ en: "Search courses", bn: "কোর্স খুঁজুন" })}
            className="h-9 w-64 rounded-xl border border-border bg-accent/50 py-2 pl-9 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <LanguageToggle variant="ghost" />
        <button
          type="button"
          className="relative rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          aria-label={t({ en: "Notifications", bn: "নোটিফিকেশন" })}
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-medium text-foreground">{displayName}</span>
            <span className="text-xs text-muted-foreground">{displayClass}</span>
          </div>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-all border border-primary/20"
            aria-label={t({ en: "User menu", bn: "ইউজার মেনু" })}
          >
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
