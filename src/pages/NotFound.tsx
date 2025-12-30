import { Link } from "react-router-dom";
import { MarketingShell } from "@/components/MarketingShell";
import { Button } from "@/components/ui/Button";
import { usePageMeta } from "@/lib/usePageMeta";
import { useTranslate } from "@/lib/i18n";

export default function NotFoundPage() {
  const t = useTranslate();

  usePageMeta({
    title: t({ en: "Page not found", bn: "পৃষ্ঠা খুঁজে পাওয়া যায়নি" }),
    description: t({ en: "The page you are looking for does not exist.", bn: "আপনি যে পৃষ্ঠাটি খুঁজছেন তা নেই।" }),
  });

  return (
    <MarketingShell>
      <section className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="text-center space-y-4">
          <div className="text-sm font-semibold uppercase tracking-wider text-primary">{t({ en: "404 error", bn: "৪০৪ ত্রুটি" })}</div>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{t({ en: "Page not found", bn: "পৃষ্ঠা খুঁজে পাওয়া যায়নি" })}</h1>
          <p className="text-muted-foreground">
            {t({ en: "The page you are looking for does not exist or has moved.", bn: "আপনি যে পৃষ্ঠাটি খুঁজছেন তা নেই বা স্থানান্তরিত হয়েছে।" })}
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/">
              <Button>{t({ en: "Back to Home", bn: "হোমে ফিরুন" })}</Button>
            </Link>
            <Link to="/help">
              <Button variant="outline">{t({ en: "Visit Help Center", bn: "হেল্প সেন্টার দেখুন" })}</Button>
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
