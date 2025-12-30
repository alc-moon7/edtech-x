import { CheckCircle2, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { MarketingShell } from "@/components/MarketingShell";
import { usePageMeta } from "@/lib/usePageMeta";
import { useTranslate } from "@/lib/i18n";

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

export default function PricingPage() {
  const t = useTranslate();

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
                <Link to="/signup" className="mt-6 inline-block w-full">
                  <Button className="w-full" variant={plan.highlight ? "default" : "outline"}>
                    {t(plan.cta)}
                  </Button>
                </Link>
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
    </MarketingShell>
  );
}
