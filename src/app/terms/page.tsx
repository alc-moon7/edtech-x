import { MarketingShell } from "@/components/MarketingShell";
import { usePageMeta } from "@/lib/usePageMeta";

const sections = [
  {
    title: "Account responsibilities",
    content:
      "Users are responsible for maintaining the confidentiality of their account credentials and for all activities under their account.",
  },
  {
    title: "Acceptable use",
    content:
      "HomeSchool is intended for educational use only. Users must not misuse the platform or attempt unauthorized access.",
  },
  {
    title: "Subscription and billing",
    content:
      "Paid plans provide access to premium features. Billing cycles and pricing are shown before purchase and can be canceled at any time.",
  },
  {
    title: "Content availability",
    content:
      "We work to keep content accurate and available, but availability may change as the syllabus updates.",
  },
  {
    title: "Support",
    content:
      "Support is available during standard business hours. Response times may vary based on plan and request type.",
  },
];

export default function TermsPage() {
  usePageMeta({
    title: "Terms of Service",
    description: "Review the HomeSchool terms for account use, subscriptions, and platform access.",
  });

  return (
    <MarketingShell>
      <section className="bg-gradient-to-b from-background via-primary/5 to-background py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="text-sm font-semibold uppercase tracking-wider text-primary">Terms of service</div>
          <h1 className="mt-4 text-4xl font-bold font-heading sm:text-5xl">Using HomeSchool responsibly</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            These terms explain how the platform should be used by students, parents, and schools.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl space-y-6 px-4">
          {sections.map((section) => (
            <div key={section.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{section.content}</p>
            </div>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
