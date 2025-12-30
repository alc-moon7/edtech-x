import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className, variant = "outline" }: { className?: string; variant?: "outline" | "ghost" }) {
  const { language, toggleLanguage } = useLanguage();
  const isEnglish = language === "en";
  const ariaLabel = isEnglish ? "Switch to Bangla" : "Switch to English";

  return (
    <Button
      type="button"
      variant={variant}
      size="sm"
      onClick={toggleLanguage}
      className={cn("gap-2", className)}
      aria-label={ariaLabel}
    >
      <span className={cn("text-xs font-semibold", isEnglish ? "text-foreground" : "text-muted-foreground")}>EN</span>
      <span className="text-xs text-muted-foreground">/</span>
      <span className={cn("text-xs font-semibold", !isEnglish ? "text-foreground" : "text-muted-foreground")}>বাংলা</span>
    </Button>
  );
}
