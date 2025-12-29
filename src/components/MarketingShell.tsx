import type { ReactNode } from "react";
import { MarketingNav } from "@/components/MarketingNav";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";

export function MarketingShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary"
      >
        Skip to content
      </a>
      <MarketingNav />
      <main id="main-content" className={cn("flex-1", className)}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
