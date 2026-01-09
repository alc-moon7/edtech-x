"use client";

import { Link, useSearchParams } from "react-router-dom";
import { XCircle } from "lucide-react";
import { useTranslate } from "@/lib/i18n";

export default function PaymentCancelPage() {
  const [searchParams] = useSearchParams();
  const t = useTranslate();
  const orderId = searchParams.get("order");

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600">
          <XCircle className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-semibold text-slate-900">{t({ en: "Payment cancelled", bn: "পেমেন্ট বাতিল হয়েছে" })}</h1>
        <p className="mt-2 text-sm text-slate-500">
          {t({
            en: "You cancelled the payment. Your course is still locked.",
            bn: "আপনি পেমেন্ট বাতিল করেছেন। কোর্সটি এখনও লক আছে।",
          })}
        </p>
        {orderId && (
          <p className="mt-3 text-xs text-slate-400">
            {t({ en: "Order", bn: "অর্ডার" })}: {orderId}
          </p>
        )}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/courses"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm"
          >
            {t({ en: "Return to courses", bn: "কোর্সে ফিরে যান" })}
          </Link>
          <Link
            to="/pricing"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700"
          >
            {t({ en: "View pricing", bn: "মূল্য দেখুন" })}
          </Link>
        </div>
      </div>
    </div>
  );
}
