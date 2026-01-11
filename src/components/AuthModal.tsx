import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type AuthModalProps = {
  open: boolean;
  onClose?: () => void;
  children: ReactNode;
  illustrationSrc: string;
  title: string;
  subtitle?: string;
};

/**
 * Reusable auth modal shell. Desktop renders a centered popup with glass effect.
 * Mobile renders full screen with the same content.
 */
export function AuthModal({ open, onClose, children, illustrationSrc, title, subtitle }: AuthModalProps) {
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-3 py-4 sm:px-4">
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.35)] backdrop-blur-[12px]" aria-hidden />
      <div
        className={cn(
          "relative z-10 flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/40 bg-white/60 shadow-2xl backdrop-blur-2xl",
          "md:h-auto md:flex-row"
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-slate-500 shadow-md ring-1 ring-white/60 transition hover:text-slate-700"
        >
          ✕
        </button>

        <div className="flex-1 overflow-y-auto bg-[linear-gradient(180deg,#FFF6E5_0%,#F6D39B_100%)] px-6 py-7 sm:px-8 lg:px-10">
          <div className="text-center text-slate-900">
            <img src="/logo.png" alt="HomeSchool" className="mx-auto mb-4 h-12 w-auto" />
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-slate-700">{subtitle}</p>}
          </div>
          <div className="mt-5 sm:mt-6">{children}</div>
        </div>

        <div className="relative hidden w-full max-w-[45%] items-center justify-center bg-white/30 px-4 pb-4 pt-12 md:flex">
          <div className="relative w-full">
            <img
              src={illustrationSrc}
              alt="Auth Illustration"
              className="mx-auto max-h-[520px] w-full max-w-sm object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
