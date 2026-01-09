"use client";

import { Link, useSearchParams } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { useTranslate } from "@/lib/i18n";

export default function PaymentFailPage() {
  const [searchParams] = useSearchParams();
  const t = useTranslate();
  const orderId = searchParams.get("order");

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-semibold text-slate-900">{t({ en: "Payment failed", bn: "পেমেন্ট ব্যর্থ হয়েছে" })}</h1>
        <p className="mt-2 text-sm text-slate-500">
          {t({
            en: "We could not complete the payment. Please try again or choose another method.",
            bn: "পেমেন্ট সম্পন্ন হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।",
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
            {t({ en: "Try again", bn: "আবার চেষ্টা করুন" })}
          </Link>
          <Link
            to="/help"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700"
          >
            {t({ en: "Contact support", bn: "সাপোর্টে যোগাযোগ করুন" })}
          </Link>
        </div>
      </div>
    </div>
  );
}
