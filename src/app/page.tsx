import { Link } from "react-router-dom";
import {
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  LineChart,
  MessageSquare,
  PlayCircle,
  ShieldCheck,
  Star,
  Target,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MarketingShell } from "@/components/MarketingShell";
import { usePageMeta } from "@/lib/usePageMeta";

const stats = [
  { label: "Syllabus coverage", value: "Class 6-12", icon: Target },
  { label: "Learning roles", value: "Student, Parent, Admin", icon: Users },
  { label: "Progress insights", value: "Weekly tracking", icon: LineChart },
];

const steps = [
  {
    title: "Learn in small steps",
    description: "Short lessons with clear outcomes keep every chapter manageable.",
    icon: PlayCircle,
  },
  {
    title: "Practice with intent",
    description: "Concept checks and quizzes reinforce what matters for exams.",
    icon: ClipboardCheck,
  },
  {
    title: "See real progress",
    description: "Analytics highlight strengths, gaps, and next actions.",
    icon: LineChart,
  },
];

const features = [
  {
    title: "Syllabus aligned",
    description: "Every chapter is mapped to the NCTB structure for Class 6-12.",
    icon: BookOpen,
  },
  {
    title: "Active learning",
    description: "Quizzes and quick checks keep students engaged, not passive.",
    icon: BadgeCheck,
  },
  {
    title: "Parent visibility",
    description: "Parents can monitor progress, scores, and study time.",
    icon: Users,
  },
  {
    title: "Smart analytics",
    description: "Weekly trends show improvements and weak topics fast.",
    icon: LineChart,
  },
  {
    title: "Safe learning space",
    description: "No ads, no distractions, and privacy-first data handling.",
    icon: ShieldCheck,
  },
  {
    title: "Teacher support",
    description: "Dedicated help resources for course guidance and platform use.",
    icon: MessageSquare,
  },
];

const subjects = [
  { title: "Mathematics", tag: "Core" },
  { title: "Physics", tag: "STEM" },
  { title: "Chemistry", tag: "STEM" },
  { title: "Biology", tag: "STEM" },
  { title: "English", tag: "Language" },
  { title: "Bangla", tag: "Language" },
  { title: "ICT", tag: "Tech" },
  { title: "Business Studies", tag: "Commerce" },
];

const testimonials = [
  {
    quote:
      "The short lessons and quizzes keep me focused. I finally know what to study next.",
    name: "Arian Ahmed",
    role: "Class 10 Student",
  },
  {
    quote:
      "I can see my child is consistent every week. The parent view makes it easy to help.",
    name: "Nusrat Jahan",
    role: "Parent",
  },
  {
    quote:
      "The syllabus mapping makes class planning simple. Students revise the exact topics.",
    name: "Imran Kabir",
    role: "Teacher",
  },
];

const faqs = [
  {
    question: "Is HomeSchool aligned with the NCTB syllabus?",
    answer:
      "Yes. Every chapter and lesson follows the official structure for Class 6-12.",
  },
  {
    question: "Can parents track student progress?",
    answer:
      "Parents get a dedicated dashboard with quiz scores, time spent, and alerts.",
  },
  {
    question: "Does the platform work on mobile?",
    answer:
      "Yes. The layout is mobile-first and works smoothly on phones and tablets.",
  },
  {
    question: "How do quizzes help learning?",
    answer:
      "Quick checks highlight weak topics and guide revision before exams.",
  },
  {
    question: "Do you offer support?",
    answer:
      "We provide a help center and support team for both students and parents.",
  },
];

const pricingPreview = [
  {
    name: "Free",
    price: "0",
    period: "Always free",
    description: "Try core lessons and basic quizzes for every subject.",
    features: ["Intro lessons", "Basic quizzes", "Limited analytics"],
  },
  {
    name: "Standard",
    price: "299",
    period: "per month",
    description: "Full syllabus access with weekly progress reports.",
    features: ["Full lessons", "All quizzes", "Weekly progress reports"],
    highlight: true,
  },
  {
    name: "Premium",
    price: "499",
    period: "per month",
    description: "Advanced analytics, parent tools, and priority support.",
    features: ["Parent dashboard", "Advanced analytics", "Priority support"],
  },
];

export default function Home() {
  usePageMeta({
    title: "HomeSchool - Interactive Learning",
    description:
      "Interactive learning for Class 6-12 students aligned to the NCTB syllabus with quizzes, analytics, and parent visibility.",
  });

  return (
    <MarketingShell>
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background py-20 sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-70" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
              NCTB aligned learning for Class 6-12
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl font-heading">
              Master the syllabus with structured, interactive learning
            </h1>
            <p className="text-lg text-muted-foreground sm:text-xl">
              HomeSchool turns study time into a clear journey with lessons, quizzes, and progress
              insights for students, parents, and schools.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/login">
                <Button size="lg" className="rounded-full px-8 text-base">
                  Get started free
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg" className="rounded-full px-8 text-base">
                  View pricing
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card/80 p-5 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-base font-semibold text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4">
          <div className="space-y-3">
            <div className="text-sm font-semibold uppercase tracking-wider text-primary">How it works</div>
            <h2 className="text-3xl font-bold font-heading sm:text-4xl">A simple learning loop</h2>
            <p className="text-muted-foreground max-w-2xl">
              Students follow a proven sequence that keeps them consistent and prepared for exams.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-3 text-center">
            <div className="text-sm font-semibold uppercase tracking-wider text-primary">Features</div>
            <h2 className="text-3xl font-bold font-heading sm:text-4xl">
              Everything students need to stay on track
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Clear structure, focused content, and analytics that guide daily learning decisions.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-3">
            <div className="text-sm font-semibold uppercase tracking-wider text-primary">Subjects</div>
            <h2 className="text-3xl font-bold font-heading sm:text-4xl">Coverage across core subjects</h2>
            <p className="text-muted-foreground max-w-2xl">
              Each subject includes lessons, practice, and assessments tailored to the official syllabus.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {subjects.map((subject) => (
              <div key={subject.title} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">{subject.title}</h3>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary">
                    {subject.tag}
                  </span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  Structured chapters, lesson notes, and quick checks.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="text-sm font-semibold uppercase tracking-wider text-primary">Parent view</div>
            <h2 className="text-3xl font-bold font-heading sm:text-4xl">
              Parents stay informed without pressure
            </h2>
            <p className="text-muted-foreground">
              Track study time, quiz scores, and weekly trends. Know when to encourage and when to
              step in.
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Progress alerts for weak topics
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Weekly summaries for time and scores
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Clear goals for the next study session
              </li>
            </ul>
            <Link to="/parent">
              <Button variant="outline" className="mt-2">
                View parent dashboard
              </Button>
            </Link>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This week</p>
                <p className="text-xl font-semibold">82% quiz accuracy</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {["Mathematics", "Physics", "English"].map((subject) => (
                <div key={subject} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{subject}</span>
                    <span className="text-muted-foreground">On track</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 w-3/4 rounded-full bg-primary" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl bg-muted/50 p-4 text-sm text-muted-foreground">
              Next focus: revise equations of motion before Friday.
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-3 text-center">
            <div className="text-sm font-semibold uppercase tracking-wider text-primary">Pricing</div>
            <h2 className="text-3xl font-bold font-heading sm:text-4xl">Simple plans for every learner</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Start free, then upgrade when you need full access and analytics.
            </p>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {pricingPreview.map((plan) => (
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
                <Link to="/pricing" className="mt-6 inline-block w-full">
                  <Button className="w-full" variant={plan.highlight ? "default" : "outline"}>
                    View plan details
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-3 text-center">
            <div className="text-sm font-semibold uppercase tracking-wider text-primary">Testimonials</div>
            <h2 className="text-3xl font-bold font-heading sm:text-4xl">Trusted by students and parents</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Real progress from learners who want clear direction and steady momentum.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">"{testimonial.quote}"</p>
                <div className="mt-4 text-sm font-semibold text-foreground">{testimonial.name}</div>
                <div className="text-xs text-muted-foreground">{testimonial.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-3">
            <div className="text-sm font-semibold uppercase tracking-wider text-primary">FAQ</div>
            <h2 className="text-3xl font-bold font-heading sm:text-4xl">Answers to common questions</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm open:ring-1 open:ring-primary/20"
              >
                <summary className="cursor-pointer text-sm font-semibold text-foreground">
                  {faq.question}
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-primary to-secondary py-14">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center text-white">
          <h2 className="text-3xl font-bold font-heading sm:text-4xl">
            Ready to build a stronger study routine?
          </h2>
          <p className="max-w-2xl text-white/90">
            Start free today and upgrade when you are ready for full access and advanced analytics.
          </p>
          <Link to="/login">
            <Button size="lg" className="rounded-full bg-white text-primary hover:bg-white/90">
              Start learning
            </Button>
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}
