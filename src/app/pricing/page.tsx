import { CheckCircle2, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { MarketingShell } from "@/components/MarketingShell";
import { usePageMeta } from "@/lib/usePageMeta";

const plans = [
  {
    name: "Free",
    price: "0",
    period: "Always free",
    description: "Explore the platform with core lessons and basic practice.",
    features: ["Intro lessons for each subject", "Basic quizzes", "Limited analytics"],
  },
  {
    name: "Standard",
    price: "299",
    period: "per month",
    description: "Full syllabus access with weekly progress tracking.",
    features: [
      "Full lesson library",
      "Chapter quizzes",
      "Weekly progress reports",
      "Basic parent view",
    ],
    highlight: true,
  },
  {
    name: "Premium",
    price: "499",
    period: "per month",
    description: "Advanced analytics and dedicated parent tools.",
    features: [
      "Everything in Standard",
      "Advanced analytics",
      "Parent alerts and insights",
      "Priority support",
    ],
  },
];

const faqs = [
  {
    question: "Can I upgrade later?",
    answer: "Yes, you can upgrade at any time from the settings page.",
  },
  {
    question: "Do you offer yearly discounts?",
    answer: "Yearly plans are available on request for schools and institutions.",
  },
  {
    question: "Is there a plan for parents?",
    answer: "Parent access is included in Standard and Premium plans.",
  },
];

export default function PricingPage() {
  usePageMeta({
    title: "Pricing",
    description: "Compare HomeSchool plans for Class 6-12 learning and parent visibility.",
  });

  return (
    <MarketingShell>
      <section className="bg-gradient-to-b from-background via-primary/5 to-background py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <div className="text-sm font-semibold uppercase tracking-wider text-primary">Pricing</div>
          <h1 className="mt-4 text-4xl font-bold font-heading sm:text-5xl">
            Plans built for learners and families
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free, then upgrade when you need full access and analytics.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-3xl border p-6 shadow-sm ${
                  plan.highlight ? "border-primary bg-primary/5" : "border-border bg-card"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  {plan.highlight && (
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      Most popular
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-bold">BDT {plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{plan.description}</p>
                <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/login" className="mt-6 inline-block w-full">
                  <Button className="w-full" variant={plan.highlight ? "default" : "outline"}>
                    Choose {plan.name}
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
            <div className="text-sm font-semibold uppercase tracking-wider text-primary">Pricing FAQ</div>
            <h2 className="mt-3 text-3xl font-bold font-heading sm:text-4xl">Questions, answered</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <HelpCircle className="h-5 w-5 text-primary" />
                <h3 className="mt-4 text-lg font-semibold">{faq.question}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/contact">
              <Button variant="outline">Talk to sales</Button>
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
