import {
  BadgeCheck,
  BarChart3,
  BookOpen,
  CalendarClock,
  LineChart,
  MessageSquare,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { MarketingShell } from "@/components/MarketingShell";
import { usePageMeta } from "@/lib/usePageMeta";

const featureGroups = [
  {
    title: "Learning experience",
    description: "Clear lessons that keep students focused on the exam outcomes.",
    items: [
      {
        title: "Chapter-wise lessons",
        description: "Every topic follows the NCTB sequence for Class 6-12.",
        icon: BookOpen,
      },
      {
        title: "Practice-rich content",
        description: "Quick checks and quizzes after each concept.",
        icon: BadgeCheck,
      },
      {
        title: "Study schedule",
        description: "Weekly goals and task reminders keep momentum steady.",
        icon: CalendarClock,
      },
    ],
  },
  {
    title: "Assessment and analytics",
    description: "Measure what matters and improve results quickly.",
    items: [
      {
        title: "Progress dashboards",
        description: "Track lesson completion and time spent.",
        icon: LineChart,
      },
      {
        title: "Quiz insights",
        description: "Instant scores with weak topic detection.",
        icon: BarChart3,
      },
      {
        title: "Performance trends",
        description: "Weekly improvement highlights for students and parents.",
        icon: LineChart,
      },
    ],
  },
  {
    title: "Parent and school tools",
    description: "Shared visibility without adding pressure.",
    items: [
      {
        title: "Parent dashboard",
        description: "See progress, quiz scores, and study habits in one view.",
        icon: Users,
      },
      {
        title: "Help and support",
        description: "Guides and support for students, parents, and teachers.",
        icon: MessageSquare,
      },
      {
        title: "Privacy-first platform",
        description: "No ads and careful data handling for student safety.",
        icon: ShieldCheck,
      },
    ],
  },
];

export default function FeaturesPage() {
  usePageMeta({
    title: "Features",
    description:
      "Explore the HomeSchool feature set for structured lessons, quizzes, analytics, and parent visibility.",
  });

  return (
    <MarketingShell>
      <section className="bg-gradient-to-b from-background via-primary/5 to-background py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <div className="text-sm font-semibold uppercase tracking-wider text-primary">Features</div>
          <h1 className="mt-4 text-4xl font-bold font-heading sm:text-5xl">
            A complete learning system for Class 6-12
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            HomeSchool combines lessons, practice, analytics, and parent visibility to help every
            learner stay on track.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/pricing">
              <Button size="lg" className="rounded-full px-8">
                Compare plans
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="rounded-full px-8">
                Request a demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {featureGroups.map((group) => (
        <section key={group.title} className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex flex-col gap-3">
              <div className="text-sm font-semibold uppercase tracking-wider text-primary">{group.title}</div>
              <h2 className="text-3xl font-bold font-heading sm:text-4xl">{group.description}</h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      <section className="bg-gradient-to-r from-primary to-secondary py-14">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center text-white">
          <h2 className="text-3xl font-bold font-heading sm:text-4xl">
            Want to see the full feature set in action?
          </h2>
          <p className="max-w-2xl text-white/90">
            Try the platform free or reach out for a guided walkthrough.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Link to="/signup">
              <Button size="lg" className="rounded-full bg-white text-primary hover:bg-white/90">
                Start free
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="rounded-full border-white text-white hover:bg-white/10">
                Contact us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
