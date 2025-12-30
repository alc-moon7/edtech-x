import { Link } from "react-router-dom";
import { CheckCircle2, ClipboardCheck, LineChart, PlayCircle, Star, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MarketingShell } from "@/components/MarketingShell";
import { usePageMeta } from "@/lib/usePageMeta";
import { useTranslate } from "@/lib/i18n";

const stats = [
  {
    id: "coverage",
    label: { en: "Syllabus coverage", bn: "সিলেবাস কভারেজ" },
    value: { en: "Class 6-12", bn: "ক্লাস ৬-১২" },
    icon: Target,
  },
  {
    id: "roles",
    label: { en: "Learning roles", bn: "শিক্ষার ভূমিকা" },
    value: { en: "Student, Parent, Admin", bn: "শিক্ষার্থী, অভিভাবক, প্রশাসক" },
    icon: Users,
  },
  {
    id: "insights",
    label: { en: "Progress insights", bn: "অগ্রগতি বিশ্লেষণ" },
    value: { en: "Weekly tracking", bn: "সাপ্তাহিক ট্র্যাকিং" },
    icon: LineChart,
  },
];

const steps = [
  {
    id: "steps-1",
    title: { en: "Learn in small steps", bn: "ছোট ধাপে শিখুন" },
    description: {
      en: "Short lessons with clear outcomes keep every chapter manageable.",
      bn: "স্পষ্ট ফলাফলের ছোট লেসন প্রতিটি অধ্যায়কে সহজে পরিচালনাযোগ্য রাখে।",
    },
    icon: PlayCircle,
  },
  {
    id: "steps-2",
    title: { en: "Practice with intent", bn: "উদ্দেশ্যভিত্তিক অনুশীলন" },
    description: {
      en: "Concept checks and quizzes reinforce what matters for exams.",
      bn: "কনসেপ্ট চেক ও কুইজ পরীক্ষার জন্য গুরুত্বপূর্ণ বিষয়গুলো দৃঢ় করে।",
    },
    icon: ClipboardCheck,
  },
  {
    id: "steps-3",
    title: { en: "See real progress", bn: "বাস্তব অগ্রগতি দেখুন" },
    description: {
      en: "Analytics highlight strengths, gaps, and next actions.",
      bn: "অ্যানালিটিক্স শক্তি, ঘাটতি ও পরবর্তী করণীয় দেখায়।",
    },
    icon: LineChart,
  },
];

const subjects = [
  { id: "math", title: { en: "Mathematics", bn: "গণিত" }, tag: { en: "Core", bn: "মূল" } },
  { id: "physics", title: { en: "Physics", bn: "পদার্থবিজ্ঞান" }, tag: { en: "STEM", bn: "স্টেম" } },
  { id: "chemistry", title: { en: "Chemistry", bn: "রসায়ন" }, tag: { en: "STEM", bn: "স্টেম" } },
  { id: "biology", title: { en: "Biology", bn: "জীববিজ্ঞান" }, tag: { en: "STEM", bn: "স্টেম" } },
  { id: "english", title: { en: "English", bn: "ইংরেজি" }, tag: { en: "Language", bn: "ভাষা" } },
  { id: "bangla", title: { en: "Bangla", bn: "বাংলা" }, tag: { en: "Language", bn: "ভাষা" } },
  { id: "ict", title: { en: "ICT", bn: "আইসিটি" }, tag: { en: "Tech", bn: "প্রযুক্তি" } },
  { id: "business", title: { en: "Business Studies", bn: "ব্যবসায় শিক্ষা" }, tag: { en: "Commerce", bn: "বাণিজ্য" } },
];

const testimonialItems = [
  {
    id: "test-1",
    quote: {
      en: "The short lessons and quizzes keep me focused. I finally know what to study next.",
      bn: "ছোট লেসন আর কুইজ আমাকে মনোযোগী রাখে। এখন বুঝতে পারি পরের বার কী পড়তে হবে।",
    },
    name: "Arian Ahmed",
    role: { en: "Class 10 Student", bn: "ক্লাস ১০ শিক্ষার্থী" },
  },
  {
    id: "test-2",
    quote: {
      en: "I can see my child is consistent every week. The parent view makes it easy to help.",
      bn: "আমি দেখি আমার সন্তান প্রতি সপ্তাহে ধারাবাহিক। অভিভাবক ভিউ সাহায্য করা সহজ করে।",
    },
    name: "Nusrat Jahan",
    role: { en: "Parent", bn: "অভিভাবক" },
  },
  {
    id: "test-3",
    quote: {
      en: "The syllabus mapping makes class planning simple. Students revise the exact topics.",
      bn: "সিলেবাস ম্যাপিং ক্লাস পরিকল্পনা সহজ করে। শিক্ষার্থীরা ঠিক সেই বিষয়গুলোই রিভিশন করে।",
    },
    name: "Imran Kabir",
    role: { en: "Teacher", bn: "শিক্ষক" },
  },
];

const faqs = [
  {
    id: "faq-1",
    question: { en: "Is HomeSchool aligned with the NCTB syllabus?", bn: "HomeSchool কি NCTB সিলেবাসের সাথে সামঞ্জস্যপূর্ণ?" },
    answer: { en: "Yes. Every chapter and lesson follows the official structure for Class 6-12.", bn: "হ্যাঁ। প্রতিটি অধ্যায় ও পাঠ ক্লাস ৬-১২ এর অফিসিয়াল কাঠামো অনুসরণ করে।" },
  },
  {
    id: "faq-2",
    question: { en: "Can parents track student progress?", bn: "অভিভাবকরা কি শিক্ষার্থীর অগ্রগতি ট্র্যাক করতে পারেন?" },
    answer: { en: "Parents get a dedicated dashboard with quiz scores, time spent, and alerts.", bn: "অভিভাবকের জন্য আলাদা ড্যাশবোর্ডে কুইজ স্কোর, সময় ব্যয় ও অ্যালার্ট দেখা যায়।" },
  },
  {
    id: "faq-3",
    question: { en: "Does the platform work on mobile?", bn: "প্ল্যাটফর্মটি কি মোবাইলে কাজ করে?" },
    answer: { en: "Yes. The layout is mobile-first and works smoothly on phones and tablets.", bn: "হ্যাঁ। লেআউট মোবাইল-ফার্স্ট এবং ফোন ও ট্যাবলেটে ভালোভাবে কাজ করে।" },
  },
  {
    id: "faq-4",
    question: { en: "How do quizzes help learning?", bn: "কুইজ কীভাবে শেখায় সাহায্য করে?" },
    answer: { en: "Quick checks highlight weak topics and guide revision before exams.", bn: "দ্রুত চেক দুর্বল বিষয়গুলো ধরিয়ে দেয় এবং পরীক্ষার আগে রিভিশনে পথ দেখায়।" },
  },
  {
    id: "faq-5",
    question: { en: "Do you offer support?", bn: "আপনারা কি সাপোর্ট দেন?" },
    answer: { en: "We provide a help center and support team for both students and parents.", bn: "শিক্ষার্থী ও অভিভাবক উভয়ের জন্য আমরা হেল্প সেন্টার ও সাপোর্ট টিম দিই।" },
  },
];

const pricingPreview = [
  {
    id: "price-free",
    name: { en: "Free", bn: "ফ্রি" },
    price: "0",
    period: { en: "Always free", bn: "সবসময় ফ্রি" },
    description: { en: "Try core lessons and basic quizzes for every subject.", bn: "প্রতিটি বিষয়ে মূল লেসন ও বেসিক কুইজ দিয়ে শুরু করুন।" },
    features: [
      { en: "Intro lessons", bn: "ইন্ট্রো লেসন" },
      { en: "Basic quizzes", bn: "বেসিক কুইজ" },
      { en: "Limited analytics", bn: "সীমিত অ্যানালিটিক্স" },
    ],
  },
  {
    id: "price-standard",
    name: { en: "Standard", bn: "স্ট্যান্ডার্ড" },
    price: "299",
    period: { en: "per month", bn: "প্রতি মাসে" },
    description: { en: "Full syllabus access with weekly progress reports.", bn: "সাপ্তাহিক অগ্রগতি রিপোর্টসহ পূর্ণ সিলেবাস অ্যাক্সেস।" },
    features: [
      { en: "Full lessons", bn: "পূর্ণ লেসন" },
      { en: "All quizzes", bn: "সব কুইজ" },
      { en: "Weekly progress reports", bn: "সাপ্তাহিক অগ্রগতি রিপোর্ট" },
    ],
    highlight: true,
  },
  {
    id: "price-premium",
    name: { en: "Premium", bn: "প্রিমিয়াম" },
    price: "499",
    period: { en: "per month", bn: "প্রতি মাসে" },
    description: { en: "Advanced analytics, parent tools, and priority support.", bn: "অ্যাডভান্সড অ্যানালিটিক্স, অভিভাবক টুলস ও প্রায়োরিটি সাপোর্ট।" },
    features: [
      { en: "Parent dashboard", bn: "অভিভাবক ড্যাশবোর্ড" },
      { en: "Advanced analytics", bn: "অ্যাডভান্সড অ্যানালিটিক্স" },
      { en: "Priority support", bn: "প্রায়োরিটি সাপোর্ট" },
    ],
  },
];

const parentSubjects = [
  { id: "parent-math", label: { en: "Mathematics", bn: "গণিত" } },
  { id: "parent-physics", label: { en: "Physics", bn: "পদার্থবিজ্ঞান" } },
  { id: "parent-english", label: { en: "English", bn: "ইংরেজি" } },
];

export default function Home() {
  const t = useTranslate();

  usePageMeta({
    title: t({ en: "HomeSchool - Interactive Learning", bn: "HomeSchool - ইন্টারঅ্যাকটিভ লার্নিং" }),
    description: t({
      en: "Interactive learning for Class 6-12 students aligned to the NCTB syllabus with quizzes, analytics, and parent visibility.",
      bn: "ক্লাস ৬-১২ শিক্ষার্থীদের জন্য কুইজ, অ্যানালিটিক্স ও অভিভাবক ভিজিবিলিটিসহ NCTB-সমন্বিত ইন্টারঅ্যাকটিভ শেখা।",
    }),
  });

  return (
    <MarketingShell>
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background py-20 sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-70" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
              {t({ en: "NCTB aligned learning for Class 6-12", bn: "ক্লাস ৬-১২ এর জন্য NCTB-সমন্বিত শেখা" })}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl font-heading">
              {t({ en: "Master the syllabus with structured, interactive learning", bn: "গঠিত ও ইন্টারঅ্যাকটিভ শেখার মাধ্যমে সিলেবাস আয়ত্ত করুন" })}
            </h1>
            <p className="text-lg text-muted-foreground sm:text-xl">
              {t({
                en: "HomeSchool turns study time into a clear journey with lessons, quizzes, and progress insights for students, parents, and schools.",
                bn: "HomeSchool পড়াশোনাকে স্পষ্ট এক যাত্রায় বদলে দেয়—লেসন, কুইজ ও অগ্রগতি বিশ্লেষণের মাধ্যমে শিক্ষার্থী, অভিভাবক ও স্কুলের জন্য।",
              })}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/signup">
                <Button size="lg" className="rounded-full px-8 text-base">
                  {t({ en: "Get started free", bn: "ফ্রি শুরু করুন" })}
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg" className="rounded-full px-8 text-base">
                  {t({ en: "View pricing", bn: "মূল্য দেখুন" })}
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.id}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card/80 p-5 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-base font-semibold text-foreground">{t(stat.value)}</div>
                    <div className="text-xs text-muted-foreground">{t(stat.label)}</div>
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
            <div className="text-sm font-semibold uppercase tracking-wider text-primary">{t({ en: "How it works", bn: "কিভাবে কাজ করে" })}</div>
            <h2 className="text-3xl font-bold font-heading sm:text-4xl">{t({ en: "A simple learning loop", bn: "সহজ শেখার লুপ" })}</h2>
            <p className="text-muted-foreground max-w-2xl">
              {t({ en: "Students follow a proven sequence that keeps them consistent and prepared for exams.", bn: "শিক্ষার্থীরা পরীক্ষার জন্য ধারাবাহিক ও প্রস্তুত থাকতে প্রমাণিত একটি ধারাবাহিকতা অনুসরণ করে।" })}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{t(step.title)}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t(step.description)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-3">
            <div className="text-sm font-semibold uppercase tracking-wider text-primary">{t({ en: "Subjects", bn: "বিষয়সমূহ" })}</div>
            <h2 className="text-3xl font-bold font-heading sm:text-4xl">{t({ en: "Coverage across core subjects", bn: "মূল বিষয়গুলো জুড়ে কভারেজ" })}</h2>
            <p className="text-muted-foreground max-w-2xl">
              {t({ en: "Each subject includes lessons, practice, and assessments tailored to the official syllabus.", bn: "প্রতিটি বিষয়ে অফিসিয়াল সিলেবাস অনুযায়ী লেসন, অনুশীলন ও মূল্যায়ন রয়েছে।" })}
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {subjects.map((subject) => (
              <div key={subject.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">{t(subject.title)}</h3>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary">
                    {t(subject.tag)}
                  </span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {t({ en: "Structured chapters, lesson notes, and quick checks.", bn: "গঠিত অধ্যায়, লেসন নোট ও দ্রুত চেক।" })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="text-sm font-semibold uppercase tracking-wider text-primary">{t({ en: "Parent view", bn: "অভিভাবক ভিউ" })}</div>
            <h2 className="text-3xl font-bold font-heading sm:text-4xl">
              {t({ en: "Parents stay informed without pressure", bn: "চাপ ছাড়াই অভিভাবকেরা তথ্য পান" })}
            </h2>
            <p className="text-muted-foreground">
              {t({ en: "Track study time, quiz scores, and weekly trends. Know when to encourage and when to step in.", bn: "পড়ার সময়, কুইজ স্কোর ও সাপ্তাহিক প্রবণতা ট্র্যাক করুন। কখন উৎসাহ দেবেন আর কখন সাহায্য করবেন—জানুন।" })}
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {[
                { en: "Progress alerts for weak topics", bn: "দুর্বল বিষয়ের জন্য অগ্রগতি অ্যালার্ট" },
                { en: "Weekly summaries for time and scores", bn: "সময় ও স্কোরের সাপ্তাহিক সারাংশ" },
                { en: "Clear goals for the next study session", bn: "পরবর্তী স্টাডি সেশনের জন্য স্পষ্ট লক্ষ্য" },
              ].map((item) => (
                <li key={item.en} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {t(item)}
                </li>
              ))}
            </ul>
            <Link to="/parent">
              <Button variant="outline" className="mt-2">
                {t({ en: "View parent dashboard", bn: "অভিভাবক ড্যাশবোর্ড দেখুন" })}
              </Button>
            </Link>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t({ en: "This week", bn: "এই সপ্তাহে" })}</p>
                <p className="text-xl font-semibold">{t({ en: "82% quiz accuracy", bn: "82% কুইজ সঠিকতা" })}</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {parentSubjects.map((subject) => (
                <div key={subject.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{t(subject.label)}</span>
                    <span className="text-muted-foreground">{t({ en: "On track", bn: "সঠিক পথে" })}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 w-3/4 rounded-full bg-primary" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl bg-muted/50 p-4 text-sm text-muted-foreground">
              {t({ en: "Next focus: revise equations of motion before Friday.", bn: "পরবর্তী ফোকাস: শুক্রবারের আগে গতি সমীকরণ রিভিশন।" })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-3 text-center">
            <div className="text-sm font-semibold uppercase tracking-wider text-primary">{t({ en: "Pricing", bn: "মূল্য" })}</div>
            <h2 className="text-3xl font-bold font-heading sm:text-4xl">{t({ en: "Simple plans for every learner", bn: "প্রতিটি শিক্ষার্থীর জন্য সহজ প্ল্যান" })}</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              {t({ en: "Start free, then upgrade when you need full access and analytics.", bn: "ফ্রি দিয়ে শুরু করুন, তারপর পূর্ণ অ্যাক্সেস ও অ্যানালিটিক্স দরকার হলে আপগ্রেড করুন।" })}
            </p>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {pricingPreview.map((plan) => (
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
                <Link to="/pricing" className="mt-6 inline-block w-full">
                  <Button className="w-full" variant={plan.highlight ? "default" : "outline"}>
                    {t({ en: "View plan details", bn: "প্ল্যান বিস্তারিত দেখুন" })}
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
            <div className="text-sm font-semibold uppercase tracking-wider text-primary">{t({ en: "Testimonials", bn: "প্রশংসাপত্র" })}</div>
            <h2 className="text-3xl font-bold font-heading sm:text-4xl">{t({ en: "Trusted by students and parents", bn: "শিক্ষার্থী ও অভিভাবকদের আস্থাভাজন" })}</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              {t({ en: "Real progress from learners who want clear direction and steady momentum.", bn: "স্পষ্ট দিকনির্দেশনা ও স্থির গতি চাই এমন শিক্ষার্থীদের বাস্তব অগ্রগতি।" })}
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonialItems.map((testimonial) => (
              <div key={testimonial.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">"{t(testimonial.quote)}"</p>
                <div className="mt-4 text-sm font-semibold text-foreground">{testimonial.name}</div>
                <div className="text-xs text-muted-foreground">{t(testimonial.role)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-3">
            <div className="text-sm font-semibold uppercase tracking-wider text-primary">{t({ en: "FAQ", bn: "এফএকিউ" })}</div>
            <h2 className="text-3xl font-bold font-heading sm:text-4xl">{t({ en: "Answers to common questions", bn: "সাধারণ প্রশ্নের উত্তর" })}</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {faqs.map((faq) => (
              <details
                key={faq.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm open:ring-1 open:ring-primary/20"
              >
                <summary className="cursor-pointer text-sm font-semibold text-foreground">
                  {t(faq.question)}
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{t(faq.answer)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-primary to-secondary py-14">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center text-white">
          <h2 className="text-3xl font-bold font-heading sm:text-4xl">
            {t({ en: "Ready to build a stronger study routine?", bn: "আরও শক্তিশালী পড়াশোনার রুটিন গড়তে প্রস্তুত?" })}
          </h2>
          <p className="max-w-2xl text-white/90">
            {t({ en: "Start free today and upgrade when you are ready for full access and advanced analytics.", bn: "আজই ফ্রি শুরু করুন, পূর্ণ অ্যাক্সেস ও উন্নত অ্যানালিটিক্সের জন্য প্রস্তুত হলে আপগ্রেড করুন।" })}
          </p>
          <Link to="/signup">
            <Button size="lg" className="rounded-full bg-white text-primary hover:bg-white/90">
              {t({ en: "Start learning", bn: "শেখা শুরু করুন" })}
            </Button>
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}
