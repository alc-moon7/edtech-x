import { CheckCircle2, GraduationCap, ShieldCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { MarketingShell } from "@/components/MarketingShell";
import { usePageMeta } from "@/lib/usePageMeta";

const values = [
  {
    title: "Student-first clarity",
    description: "Every lesson is designed to reduce confusion and build confidence.",
    icon: GraduationCap,
  },
  {
    title: "Trust and transparency",
    description: "Parents see clear progress data without extra pressure.",
    icon: Users,
  },
  {
    title: "Safe learning space",
    description: "No ads, no noise, and privacy-first data practices.",
    icon: ShieldCheck,
  },
];

const milestones = [
  { year: "2023", detail: "Pilot programs with Class 6-10 learners in Dhaka." },
  { year: "2024", detail: "Expanded to Class 6-12 syllabus coverage." },
  { year: "2025", detail: "Parent dashboards and progress alerts added." },
];

export default function AboutPage() {
  usePageMeta({
    title: "About",
    description:
      "Learn about HomeSchool, our mission, and how we support Class 6-12 students with structured learning.",
  });

  return (
    <MarketingShell>
      <section className="bg-gradient-to-b from-background via-primary/5 to-background py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <div className="text-sm font-semibold uppercase tracking-wider text-primary">About HomeSchool</div>
          <h1 className="mt-4 text-4xl font-bold font-heading sm:text-5xl">
            Building a clear path from lesson to mastery
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            HomeSchool is a structured learning platform for NCTB Class 6-12 students. We focus on
            clarity, practice, and feedback so learners always know what to study next.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/pricing">
              <Button size="lg" className="rounded-full px-8">
                View pricing
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="rounded-full px-8">
                Talk with us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="text-sm font-semibold uppercase tracking-wider text-primary">Our mission</div>
            <h2 className="text-3xl font-bold font-heading sm:text-4xl">
              Make every study session intentional
            </h2>
            <p className="text-muted-foreground">
              We replace passive watching with guided practice. Lessons are short, quizzes are
              frequent, and analytics show exactly where to focus next.
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {[
                "Clear daily goals tied to the syllabus",
                "Evidence-based practice through short quizzes",
                "Support for parents and teachers at every step",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="text-sm font-semibold uppercase tracking-wider text-primary">Milestones</div>
            <div className="mt-4 space-y-4">
              {milestones.map((milestone) => (
                <div key={milestone.year} className="rounded-2xl border border-border bg-muted/30 p-4">
                  <div className="text-xs font-semibold text-primary">{milestone.year}</div>
                  <p className="mt-2 text-sm text-muted-foreground">{milestone.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <div className="text-sm font-semibold uppercase tracking-wider text-primary">Our values</div>
            <h2 className="mt-3 text-3xl font-bold font-heading sm:text-4xl">
              What guides every product decision
            </h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{value.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-3xl font-bold font-heading sm:text-4xl">Ready to see HomeSchool in action?</h2>
          <p className="mt-3 text-muted-foreground">
            Start free today or explore the full platform.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/signup">
              <Button size="lg" className="rounded-full px-8">
                Start free
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" size="lg" className="rounded-full px-8">
                View pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
