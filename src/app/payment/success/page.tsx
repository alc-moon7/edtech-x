"use client";

import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useStudent } from "@/lib/store";
import { useTranslate } from "@/lib/i18n";

export default function PaymentSuccessPage() {
  const { refresh } = useStudent();
  const [searchParams] = useSearchParams();
  const t = useTranslate();
  const orderId = searchParams.get("order");

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-semibold text-slate-900">{t({ en: "Payment successful", bn: "পেমেন্ট সফল হয়েছে" })}</h1>
        <p className="mt-2 text-sm text-slate-500">
          {t({
            en: "Your course has been unlocked. You can start learning right away.",
            bn: "আপনার কোর্স আনলক হয়েছে। এখনই শেখা শুরু করতে পারেন।",
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
            {t({ en: "Go to Courses", bn: "কোর্স দেখুন" })}
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700"
          >
            {t({ en: "Back to Dashboard", bn: "ড্যাশবোর্ডে ফিরুন" })}
          </Link>
        </div>
      </div>
    </div>
  );
}
