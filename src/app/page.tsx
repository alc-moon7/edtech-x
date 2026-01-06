import { Link } from "react-router-dom";
import { CheckCircle2, ClipboardCheck, LineChart, MessageCircle, PlayCircle, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MarketingShell } from "@/components/MarketingShell";
import { usePageMeta } from "@/lib/usePageMeta";
import { useTranslate } from "@/lib/i18n";

const heroBadges = [
  {
    id: "ai-tutor",
    title: { en: "AI Tutor", bn: "AI Tutor" },
    position: "left-6 top-6",
  },
  {
    id: "coverage",
    title: { en: "Class 6-8", bn: "Class 6-8" },
    subtitle: { en: "Syllabus Coverage", bn: "Syllabus Coverage" },
    position: "right-2 top-10",
  },
  {
    id: "roles",
    title: { en: "Student and Parent", bn: "Student and Parent" },
    subtitle: { en: "Learning Roles", bn: "Learning Roles" },
    position: "left-0 bottom-24",
  },
  {
    id: "tracking",
    title: { en: "Weekly Tracking", bn: "Weekly Tracking" },
    subtitle: { en: "Progress insights", bn: "Progress insights" },
    position: "right-4 bottom-20",
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
    title: t({ en: "HomeSchool - Learn Smarter", bn: "HomeSchool - Learn Smarter" }),
    description: t({
      en: "Learn smarter with HomeSchool: lessons, quizzes, and progress insights for students and parents.",
      bn: "Learn smarter with HomeSchool: lessons, quizzes, and progress insights for students and parents.",
    }),
  });

  return (
    <MarketingShell>
      <section
        id="home"
        className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-gradient-to-b from-[#fdfefe] via-[#eef4ff] to-[#dbe8ff] pb-28 pt-16 sm:pt-20 lg:pt-24"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(60,110,255,0.18),_transparent_55%),radial-gradient(circle_at_70%_35%,_rgba(96,196,255,0.22),_transparent_60%)]" />
        <div className="absolute -left-16 top-24 h-48 w-48 rounded-full bg-blue-200/40 blur-3xl sm:h-64 sm:w-64" />
        <div className="absolute -right-20 top-10 h-56 w-56 rounded-full bg-indigo-200/50 blur-3xl sm:h-72 sm:w-72" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <h1 className="text-4xl font-heading font-extrabold leading-tight text-[#0b1b62] sm:text-5xl lg:text-[56px] animate-hero-up">
              {t({ en: "Learn Smarter,", bn: "Learn Smarter," })}
              <br />
              {t({ en: "Not Harder", bn: "Not Harder" })}
            </h1>
            <p className="max-w-xl text-base text-[#2b3b73]/90 sm:text-lg animate-hero-up-delay-1">
              {t({
                en: "HomeSchool turns study time into a clear journey with lessons, quizzes, and progress insights for students, parents, and schools.",
                bn: "HomeSchool turns study time into a clear journey with lessons, quizzes, and progress insights for students, parents, and schools.",
              })}
            </p>
            <div className="flex flex-wrap gap-3 animate-hero-up-delay-2">
              <Link to="/signup">
                <Button
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-[#1f2efb] to-[#2c4bff] px-7 text-sm font-semibold text-white shadow-[0_18px_30px_-16px_rgba(31,46,251,0.8)] hover:opacity-95"
                >
                  {t({ en: "Start Learning Free", bn: "Start Learning Free" })}
                </Button>
              </Link>
              <Link to="/pricing">
                <Button
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-[#f9c76d] to-[#f29b38] px-7 text-sm font-semibold text-[#1f2937] shadow-[0_18px_30px_-16px_rgba(241,155,56,0.8)] hover:opacity-95"
                >
                  {t({ en: "Try Homeschool AI Tutor", bn: "Try Homeschool AI Tutor" })}
                </Button>
              </Link>
            </div>
            <div className="flex flex-col gap-1 pt-2 text-[#0b1b62] animate-hero-up-delay-2">
              <span className="text-2xl font-bold">2.5K +</span>
              <span className="text-sm font-semibold">Active Students</span>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[520px]">
            <div className="relative flex items-center justify-center">
              <img
                src="/hero-illustration.svg"
                alt={t({ en: "Student learning illustration", bn: "Student learning illustration" })}
                className="w-full max-w-[420px] drop-shadow-[0_24px_40px_rgba(30,64,175,0.25)] animate-hero-float"
                loading="eager"
              />
              <div className="hidden sm:block">
                {heroBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`absolute ${badge.position} rounded-2xl bg-white/95 px-4 py-2 text-center text-[11px] font-semibold text-[#1f2d63] shadow-[0_12px_26px_-18px_rgba(15,23,42,0.6)] backdrop-blur`}
                  >
                    <div>{t(badge.title)}</div>
                    {badge.subtitle && (
                      <div className="text-[10px] font-medium text-slate-500">{t(badge.subtitle)}</div>
                    )}
                  </div>
                ))}
              </div>
              <div className="absolute -bottom-2 right-8 hidden h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_12px_24px_-16px_rgba(15,23,42,0.5)] sm:flex">
                <MessageCircle className="h-5 w-5 text-[#1f2efb]" />
              </div>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3 sm:hidden">
              {heroBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="rounded-2xl bg-white/95 px-4 py-2 text-center text-[11px] font-semibold text-[#1f2d63] shadow-[0_12px_26px_-18px_rgba(15,23,42,0.6)]"
                >
                  <div>{t(badge.title)}</div>
                  {badge.subtitle && (
                    <div className="text-[10px] font-medium text-slate-500">{t(badge.subtitle)}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="#3b8fdd"
            fillOpacity="0.35"
            d="M0,96L80,85.3C160,75,320,53,480,42.7C640,32,800,32,960,53.3C1120,75,1280,117,1360,138.7L1440,160L1440,160L0,160Z"
          />
          <path
            fill="#2a7ed1"
            fillOpacity="0.55"
            d="M0,128L60,112C120,96,240,64,360,53.3C480,43,600,53,720,74.7C840,96,960,128,1080,138.7C1200,149,1320,139,1380,133.3L1440,128L1440,160L0,160Z"
          />
          <path
            fill="#1f6cc3"
            fillOpacity="0.8"
            d="M0,144L120,133.3C240,123,480,101,720,101.3C960,101,1200,123,1320,133.3L1440,144L1440,160L0,160Z"
          />
        </svg>
      </section>

      <section id="features" className="py-16 sm:py-20">
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

      <section id="reviews" className="bg-muted/40 py-16 sm:py-20">
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






