import { MarketingShell } from "@/components/MarketingShell";
import { usePageMeta } from "@/lib/usePageMeta";

const sections = [
  {
    title: "Information we collect",
    content:
      "We collect account information, class selection, and learning activity data required to deliver lessons, quizzes, and analytics.",
  },
  {
    title: "How we use information",
    content:
      "Data is used to personalize learning, generate progress reports, and improve the platform. We do not sell student data.",
  },
  {
    title: "Parent visibility",
    content:
      "Parents can view linked student progress, scores, and study time. Parents cannot edit student responses or scores.",
  },
  {
    title: "Data protection",
    content:
      "We apply security controls to protect accounts and learning data. Access is limited to authorized roles only.",
  },
  {
    title: "Contact and updates",
    content:
      "If you have questions about privacy, contact support@homeschool.bd. We may update this policy and will post changes here.",
  },
];

export default function PrivacyPage() {
  usePageMeta({
    title: "Privacy Policy",
    description: "Read how HomeSchool collects, uses, and protects student data.",
  });

  return (
    <MarketingShell>
      <section className="bg-gradient-to-b from-background via-primary/5 to-background py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="text-sm font-semibold uppercase tracking-wider text-primary">Privacy policy</div>
          <h1 className="mt-4 text-4xl font-bold font-heading sm:text-5xl">Your data, protected</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            We collect only what we need to provide structured learning and progress analytics.
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
