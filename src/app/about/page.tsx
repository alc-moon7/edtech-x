import { CheckCircle2, GraduationCap, ShieldCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { MarketingShell } from "@/components/MarketingShell";
import { usePageMeta } from "@/lib/usePageMeta";
import { useTranslate } from "@/lib/i18n";

const values = [
  {
    id: "value-1",
    title: { en: "Student-first clarity", bn: "শিক্ষার্থী-কেন্দ্রিক স্পষ্টতা" },
    description: { en: "Every lesson is designed to reduce confusion and build confidence.", bn: "প্রতিটি লেসন বিভ্রান্তি কমিয়ে আত্মবিশ্বাস বাড়ানোর জন্য তৈরি।" },
    icon: GraduationCap,
  },
  {
    id: "value-2",
    title: { en: "Trust and transparency", bn: "বিশ্বাস ও স্বচ্ছতা" },
    description: { en: "Parents see clear progress data without extra pressure.", bn: "অভিভাবকেরা অতিরিক্ত চাপ ছাড়াই স্পষ্ট অগ্রগতি ডেটা দেখেন।" },
    icon: Users,
  },
  {
    id: "value-3",
    title: { en: "Safe learning space", bn: "নিরাপদ শেখার পরিবেশ" },
    description: { en: "No ads, no noise, and privacy-first data practices.", bn: "কোনো বিজ্ঞাপন নেই, অপ্রয়োজনীয় ঝামেলা নেই, এবং গোপনীয়তা-প্রথম ডেটা নীতি।" },
    icon: ShieldCheck,
  },
];

const milestones = [
  { year: "2023", detail: { en: "Pilot programs with Class 6-10 learners in Dhaka.", bn: "ঢাকায় ক্লাস ৬-১০ শিক্ষার্থীদের সাথে পাইলট প্রোগ্রাম।" } },
  { year: "2024", detail: { en: "Expanded to Class 6-12 syllabus coverage.", bn: "ক্লাস ৬-১২ সিলেবাস কভারেজে সম্প্রসারণ।" } },
  { year: "2025", detail: { en: "Parent dashboards and progress alerts added.", bn: "অভিভাবক ড্যাশবোর্ড ও অগ্রগতি অ্যালার্ট যুক্ত হয়েছে।" } },
];

export default function AboutPage() {
  const t = useTranslate();

  usePageMeta({
    title: t({ en: "About", bn: "আমাদের সম্পর্কে" }),
    description: t({
      en: "Learn about HomeSchool, our mission, and how we support Class 6-12 students with structured learning.",
      bn: "HomeSchool, আমাদের লক্ষ্য এবং ক্লাস ৬-১২ শিক্ষার্থীদের জন্য আমরা কীভাবে গঠিত শেখা দিই তা জানুন।",
    }),
  });

  return (
    <MarketingShell>
      <section className="bg-gradient-to-b from-background via-primary/5 to-background py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <div className="text-sm font-semibold uppercase tracking-wider text-primary">{t({ en: "About HomeSchool", bn: "HomeSchool সম্পর্কে" })}</div>
          <h1 className="mt-4 text-4xl font-bold font-heading sm:text-5xl">
            {t({ en: "Building a clear path from lesson to mastery", bn: "লেসন থেকে দক্ষতায় স্পষ্ট পথ তৈরি" })}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t({
              en: "HomeSchool is a structured learning platform for NCTB Class 6-12 students. We focus on clarity, practice, and feedback so learners always know what to study next.",
              bn: "HomeSchool হলো NCTB ক্লাস ৬-১২ শিক্ষার্থীদের জন্য একটি গঠিত শেখার প্ল্যাটফর্ম। আমরা স্পষ্টতা, অনুশীলন ও ফিডব্যাকের উপর জোর দিই যাতে শিক্ষার্থীরা সবসময় জানে পরের বার কী পড়তে হবে।",
            })}
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/pricing">
              <Button size="lg" className="rounded-full px-8">
                {t({ en: "View pricing", bn: "মূল্য দেখুন" })}
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="rounded-full px-8">
                {t({ en: "Talk with us", bn: "আমাদের সাথে কথা বলুন" })}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="text-sm font-semibold uppercase tracking-wider text-primary">{t({ en: "Our mission", bn: "আমাদের মিশন" })}</div>
            <h2 className="text-3xl font-bold font-heading sm:text-4xl">
              {t({ en: "Make every study session intentional", bn: "প্রতিটি পড়াশোনার সেশনকে উদ্দেশ্যমূলক করা" })}
            </h2>
            <p className="text-muted-foreground">
              {t({
                en: "We replace passive watching with guided practice. Lessons are short, quizzes are frequent, and analytics show exactly where to focus next.",
                bn: "আমরা প্যাসিভ দেখা থেকে গাইডেড অনুশীলনে নিয়ে আসি। লেসন ছোট, কুইজ ঘন ঘন, আর অ্যানালিটিক্স দেখায় পরের বার ঠিক কোথায় ফোকাস করতে হবে।",
              })}
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {[
                { en: "Clear daily goals tied to the syllabus", bn: "সিলেবাসের সাথে যুক্ত স্পষ্ট দৈনিক লক্ষ্য" },
                { en: "Evidence-based practice through short quizzes", bn: "ছোট কুইজের মাধ্যমে প্রমাণভিত্তিক অনুশীলন" },
                { en: "Support for parents and teachers at every step", bn: "প্রতিটি ধাপে অভিভাবক ও শিক্ষকদের সহায়তা" },
              ].map((item) => (
                <li key={item.en} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {t(item)}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="text-sm font-semibold uppercase tracking-wider text-primary">{t({ en: "Milestones", bn: "মাইলস্টোন" })}</div>
            <div className="mt-4 space-y-4">
              {milestones.map((milestone) => (
                <div key={milestone.year} className="rounded-2xl border border-border bg-muted/30 p-4">
                  <div className="text-xs font-semibold text-primary">{milestone.year}</div>
                  <p className="mt-2 text-sm text-muted-foreground">{t(milestone.detail)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <div className="text-sm font-semibold uppercase tracking-wider text-primary">{t({ en: "Our values", bn: "আমাদের মূল্যবোধ" })}</div>
            <h2 className="mt-3 text-3xl font-bold font-heading sm:text-4xl">
              {t({ en: "What guides every product decision", bn: "প্রতিটি পণ্য সিদ্ধান্তকে যা পথ দেখায়" })}
            </h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{t(value.title)}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t(value.description)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-3xl font-bold font-heading sm:text-4xl">{t({ en: "Ready to see HomeSchool in action?", bn: "HomeSchool কাজ করতে দেখতে প্রস্তুত?" })}</h2>
          <p className="mt-3 text-muted-foreground">
            {t({ en: "Start free today or explore the full platform.", bn: "আজই ফ্রি শুরু করুন অথবা পুরো প্ল্যাটফর্ম দেখে নিন।" })}
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/signup">
              <Button size="lg" className="rounded-full px-8">
                {t({ en: "Start free", bn: "ফ্রি শুরু করুন" })}
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" size="lg" className="rounded-full px-8">
                {t({ en: "View pricing", bn: "মূল্য দেখুন" })}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
