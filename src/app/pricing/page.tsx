import { useState } from "react";
import { CheckCircle2, HelpCircle, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { MarketingShell } from "@/components/MarketingShell";
import { useAuth } from "@/lib/auth";
import { useStudent } from "@/lib/store";
import { supabase } from "@/lib/supabaseClient";
import { usePageMeta } from "@/lib/usePageMeta";
import { useTranslate } from "@/lib/i18n";
import { startCourseCheckout } from "@/lib/payments";

const CLASS_OPTIONS = [
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9-10",
  "Class 11-12",
];

const plans = [
  {
    id: "plan-free",
    name: { en: "Free", bn: "ফ্রি" },
    price: "0",
    period: { en: "Always free", bn: "সবসময় ফ্রি" },
    description: { en: "Explore the platform with core lessons and basic practice.", bn: "মূল লেসন ও বেসিক অনুশীলন দিয়ে প্ল্যাটফর্ম ঘুরে দেখুন।" },
    features: [
      { en: "Intro lessons for each subject", bn: "প্রতিটি বিষয়ে ইন্ট্রো লেসন" },
      { en: "Basic quizzes", bn: "বেসিক কুইজ" },
      { en: "Limited analytics", bn: "সীমিত অ্যানালিটিক্স" },
    ],
    cta: { en: "Choose Free", bn: "ফ্রি নির্বাচন করুন" },
  },
  {
    id: "plan-standard",
    name: { en: "Standard", bn: "স্ট্যান্ডার্ড" },
    price: "299",
    period: { en: "per month", bn: "প্রতি মাসে" },
    description: { en: "Full syllabus access with weekly progress tracking.", bn: "সাপ্তাহিক অগ্রগতি ট্র্যাকিংসহ পূর্ণ সিলেবাস অ্যাক্সেস।" },
    features: [
      { en: "Full lesson library", bn: "পূর্ণ লেসন লাইব্রেরি" },
      { en: "Chapter quizzes", bn: "অধ্যায়ভিত্তিক কুইজ" },
      { en: "Weekly progress reports", bn: "সাপ্তাহিক অগ্রগতি রিপোর্ট" },
      { en: "Basic parent view", bn: "বেসিক অভিভাবক ভিউ" },
    ],
    highlight: true,
    cta: { en: "Choose Standard", bn: "স্ট্যান্ডার্ড নির্বাচন করুন" },
  },
  {
    id: "plan-premium",
    name: { en: "Premium", bn: "প্রিমিয়াম" },
    price: "499",
    period: { en: "per month", bn: "প্রতি মাসে" },
    description: { en: "Advanced analytics and dedicated parent tools.", bn: "অ্যাডভান্সড অ্যানালিটিক্স ও বিশেষ অভিভাবক টুলস।" },
    features: [
      { en: "Everything in Standard", bn: "স্ট্যান্ডার্ডের সবকিছু" },
      { en: "Advanced analytics", bn: "অ্যাডভান্সড অ্যানালিটিক্স" },
      { en: "Parent alerts and insights", bn: "অভিভাবক অ্যালার্ট ও ইনসাইটস" },
      { en: "Priority support", bn: "প্রায়োরিটি সাপোর্ট" },
    ],
    cta: { en: "Choose Premium", bn: "প্রিমিয়াম নির্বাচন করুন" },
  },
];

const faqs = [
  {
    id: "faq-1",
    question: { en: "Can I upgrade later?", bn: "পরে কি আপগ্রেড করতে পারি?" },
    answer: { en: "Yes, you can upgrade at any time from the settings page.", bn: "হ্যাঁ, আপনি সেটিংস পেজ থেকে যেকোনো সময় আপগ্রেড করতে পারেন।" },
  },
  {
    id: "faq-2",
    question: { en: "Do you offer yearly discounts?", bn: "বার্ষিক ছাড় কি আছে?" },
    answer: { en: "Yearly plans are available on request for schools and institutions.", bn: "স্কুল ও প্রতিষ্ঠানের জন্য অনুরোধে বার্ষিক প্ল্যান পাওয়া যায়।" },
  },
  {
    id: "faq-3",
    question: { en: "Is there a plan for parents?", bn: "অভিভাবকদের জন্য আলাদা প্ল্যান আছে?" },
    answer: { en: "Parent access is included in Standard and Premium plans.", bn: "স্ট্যান্ডার্ড ও প্রিমিয়াম প্ল্যানে অভিভাবক অ্যাক্সেস অন্তর্ভুক্ত।" },
  },
];

function formatExpiryLabel(value?: string | null) {
  if (!value) return "No expiry";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No expiry";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function resolvePlanLabel(planId?: string | null) {
  if (planId === "standard") return "Standard";
  if (planId === "premium") return "Premium";
  return "Premium";
}

export default function PricingPage() {
  const { user } = useAuth();
  const { courses, refresh, purchasedCourses } = useStudent();
  const paidCourses = courses.filter((course) => course.isFree !== true);
  const navigate = useNavigate();
  const t = useTranslate();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedClassLevel, setSelectedClassLevel] = useState("");
  const [isUpdatingClass, setIsUpdatingClass] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId) ?? null;
  const nowMs = Date.now();
  const activePurchases = purchasedCourses.filter((purchase) => {
    if (!purchase.expires_at) return true;
    const expiry = new Date(purchase.expires_at).getTime();
    return Number.isFinite(expiry) && expiry > nowMs;
  });
  const activePurchaseByCourse = new Map(
    activePurchases.map((purchase) => [purchase.course_id, purchase])
  );
  const selectedPurchase = selectedCourseId ? activePurchaseByCourse.get(selectedCourseId) : null;
  const courseTitleMap = new Map(courses.map((course) => [course.id, course.title]));
  const selectedCourse = selectedCourseId
    ? courses.find((course) => course.id === selectedCourseId)
    : null;
  const selectedCoursePrice = selectedCourse?.priceFull ?? null;

  const openCheckout = (planId: string) => {
    if (!user) {
      navigate("/login");
      return;
    }
    setSelectedPlanId(planId);
    setPaymentError(null);
    const firstCourseId = paidCourses[0]?.id ?? "";
    setSelectedCourseId(firstCourseId);
    if (!firstCourseId) {
      setSelectedClassLevel(user?.user_metadata?.class ?? "");
    }
  };

  const closeCheckout = () => {
    if (isPaying) return;
    setSelectedPlanId(null);
    setPaymentError(null);
  };

  const handleClassUpdate = async () => {
    if (!user || !selectedClassLevel) {
      setPaymentError(t({ en: "Please select a class.", bn: "একটি ক্লাস নির্বাচন করুন।" }));
      return;
    }
    setIsUpdatingClass(true);
    setPaymentError(null);
    const { error } = await supabase
      .from("user_profiles")
      .upsert({ user_id: user.id, class_level: selectedClassLevel }, { onConflict: "user_id" });
    if (error) {
      setPaymentError(error.message);
      setIsUpdatingClass(false);
      return;
    }
    await refresh();
    setIsUpdatingClass(false);
    setSelectedCourseId("");
    setSelectedClassLevel(user?.user_metadata?.class ?? "");
  };

  const handleCheckout = async () => {
    if (!selectedPlan || !selectedCourseId) {
      setPaymentError(t({ en: "Please select a course.", bn: "একটি কোর্স নির্বাচন করুন।" }));
      return;
    }

    if (selectedPurchase) {
      setPaymentError(
        `You already have an active ${resolvePlanLabel(selectedPurchase.plan_id)} plan until ${formatExpiryLabel(
          selectedPurchase.expires_at
        )}.`
      );
      return;
    }

    setIsPaying(true);
    setPaymentError(null);
    try {
      await startCourseCheckout(selectedCourseId, {
        planId: selectedPlan.id === "plan-standard" ? "standard" : "premium",
        amount: selectedCoursePrice ?? undefined,
      });
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : "Payment failed. Please try again.");
      setIsPaying(false);
    }
  };

  usePageMeta({
    title: t({ en: "Pricing", bn: "মূল্য" }),
    description: t({ en: "Compare HomeSchool plans for Class 6-12 learning and parent visibility.", bn: "ক্লাস ৬-১২ শেখা ও অভিভাবক ভিজিবিলিটির জন্য HomeSchool প্ল্যান তুলনা করুন।" }),
  });

  return (
    <MarketingShell>
      <section className="bg-gradient-to-b from-background via-primary/5 to-background py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <div className="text-sm font-semibold uppercase tracking-wider text-primary">{t({ en: "Pricing", bn: "মূল্য" })}</div>
          <h1 className="mt-4 text-4xl font-bold font-heading sm:text-5xl">
            {t({ en: "Plans built for learners and families", bn: "শিক্ষার্থী ও পরিবারের জন্য তৈরি প্ল্যান" })}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t({ en: "Start free, then upgrade when you need full access and analytics.", bn: "ফ্রি দিয়ে শুরু করুন, তারপর পূর্ণ অ্যাক্সেস ও অ্যানালিটিক্স দরকার হলে আপগ্রেড করুন।" })}
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          {user && activePurchases.length > 0 && (
            <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-5 text-left shadow-sm">
              <div className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
                Active plan
              </div>
              <div className="mt-3 space-y-2 text-sm text-emerald-700">
                {activePurchases.map((purchase) => {
                  const courseTitle = courseTitleMap.get(purchase.course_id) ?? "Course";
                  return (
                    <div key={purchase.course_id} className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-semibold text-emerald-900">{courseTitle}</span>
                      <span>
                        {resolvePlanLabel(purchase.plan_id)} • expires{" "}
                        {formatExpiryLabel(purchase.expires_at)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-3xl border p-6 shadow-sm ${
                  plan.highlight ? "border-primary bg-primary/5" : "border-border bg-card"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{t(plan.name)}</h3>
                  {plan.highlight && (
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {t({ en: "Most popular", bn: "সবচেয়ে জনপ্রিয়" })}
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-bold">BDT {plan.price}</span>
                  <span className="text-sm text-muted-foreground">{t(plan.period)}</span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{t(plan.description)}</p>
                <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                  {plan.features.map((feature) => (
                    <li key={feature.en} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      {t(feature)}
                    </li>
                  ))}
                </ul>
                {plan.id === "plan-free" ? (
                  <Link to={user ? "/courses" : "/signup"} className="mt-6 inline-block w-full">
                    <Button className="w-full" variant={plan.highlight ? "default" : "outline"}>
                      {t(plan.cta)}
                    </Button>
                  </Link>
                ) : (
                  <div className="mt-6">
                    <Button
                      className="w-full"
                      variant={plan.highlight ? "default" : "outline"}
                      onClick={() => openCheckout(plan.id)}
                    >
                      {t({ en: "Pay now", bn: "এখনই পেমেন্ট করুন" })}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center">
            <div className="text-sm font-semibold uppercase tracking-wider text-primary">{t({ en: "Pricing FAQ", bn: "মূল্য FAQ" })}</div>
            <h2 className="mt-3 text-3xl font-bold font-heading sm:text-4xl">{t({ en: "Questions, answered", bn: "প্রশ্নের উত্তর" })}</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {faqs.map((faq) => (
              <div key={faq.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <HelpCircle className="h-5 w-5 text-primary" />
                <h3 className="mt-4 text-lg font-semibold">{t(faq.question)}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t(faq.answer)}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/contact">
              <Button variant="outline">{t({ en: "Talk to sales", bn: "সেলস টিমের সাথে কথা বলুন" })}</Button>
            </Link>
          </div>
        </div>
      </section>

      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {t({ en: "Choose a course", bn: "কোর্স নির্বাচন করুন" })}
                </h3>
                <p className="text-sm text-slate-500">
                  {t({
                    en: "Select which course to unlock with this plan.",
                    bn: "এই প্ল্যান দিয়ে কোন কোর্স আনলক করবেন তা নির্বাচন করুন।",
                  })}
                </p>
              </div>
              <button
                type="button"
                onClick={closeCheckout}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
                aria-label={t({ en: "Close", bn: "বন্ধ করুন" })}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {paidCourses.length === 0 ? (
                courses.length === 0 ? (
                  <>
                    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                      {t({
                        en: "No courses are available for your class yet. Select your class and refresh.",
                        bn: "আপনার ক্লাসের জন্য এখনো কোর্স নেই। ক্লাস নির্বাচন করে রিফ্রেশ করুন।",
                      })}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        {t({ en: "Class", bn: "ক্লাস" })}
                      </label>
                      <select
                        value={selectedClassLevel}
                        onChange={(event) => setSelectedClassLevel(event.target.value)}
                        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="" disabled>
                          {t({ en: "Select class", bn: "ক্লাস নির্বাচন করুন" })}
                        </option>
                        {CLASS_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleClassUpdate}
                      disabled={!selectedClassLevel || isUpdatingClass}
                      className="w-full"
                    >
                      {isUpdatingClass
                        ? t({ en: "Refreshing...", bn: "রিফ্রেশ হচ্ছে..." })
                        : t({ en: "Refresh courses", bn: "কোর্স রিফ্রেশ করুন" })}
                    </Button>
                  </>
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                    {t({
                      en: "All available courses are free right now. No payment required.",
                      bn: "এখন সব উপলব্ধ কোর্স ফ্রি। পেমেন্ট প্রয়োজন নেই।",
                    })}
                  </div>
                )
              ) : (
                <>
                  <label className="text-sm font-medium text-slate-700">{t({ en: "Course", bn: "কোর্স" })}</label>
                  <select
                    value={selectedCourseId}
                    onChange={(event) => setSelectedCourseId(event.target.value)}
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="" disabled>
                      {t({ en: "Select a course", bn: "কোর্স নির্বাচন করুন" })}
                    </option>
                    {paidCourses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>

            {selectedPurchase && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                Active {resolvePlanLabel(selectedPurchase.plan_id)} plan until{" "}
                {formatExpiryLabel(selectedPurchase.expires_at)}.
              </div>
            )}

            {paymentError && <p className="mt-3 text-sm text-red-500">{paymentError}</p>}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-500">
                {t({ en: "Plan price", bn: "প্ল্যান মূল্য" })}:{" "}
                <span className="font-semibold text-slate-800">
                  BDT {selectedCoursePrice ?? selectedPlan.price}
                </span>
              </div>
              <Button
                onClick={handleCheckout}
                disabled={
                  isPaying ||
                  !selectedCourseId ||
                  paidCourses.length === 0 ||
                  Boolean(selectedPurchase)
                }
              >
                {isPaying ? t({ en: "Redirecting...", bn: "রিডাইরেক্ট হচ্ছে..." }) : t({ en: "Pay now", bn: "পেমেন্ট করুন" })}
              </Button>
            </div>
          </div>
        </div>
      )}
    </MarketingShell>
  );
}
