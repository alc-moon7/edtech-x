import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { MarketingShell } from "@/components/MarketingShell";
import { NctbAsk } from "@/components/NctbAsk";
import { usePageMeta } from "@/lib/usePageMeta";
import { useLanguage, useTranslate, type TranslationValue } from "@/lib/i18n";
import { cn } from "@/lib/utils";


type Translate = ReturnType<typeof useTranslate>;

type HeroBadge = {
  id: string;
  title: TranslationValue;
  subtitle?: TranslationValue;
  className: string;
  delay?: string;
};

const heroBadges: HeroBadge[] = [
  {
    id: "ai-tutor",
    title: { en: "AI Tutor", bn: "এআই টিউটর" },
    className: "left-14 -top-12 sm:-top-8 md:-top-10 lg:-top-12",
    delay: "0s",
  },
  {
    id: "coverage",
    title: { en: "Class 6-8", bn: "ক্লাস ৬-৮" },
    subtitle: { en: "Syllabus Coverage", bn: "সিলেবাস কভারেজ" },
    className: "left-[44%] -top-20 sm:-top-14 md:-top-16 lg:-top-20",
    delay: "0.4s",
  },
  {
    id: "roles",
    title: { en: "Student and Parent", bn: "শিক্ষার্থী ও অভিভাবক" },
    subtitle: { en: "Learning Roles", bn: "শেখার ভূমিকা" },
    className: "-left-6 top-14 sm:top-10 md:top-12 lg:top-14",
    delay: "0.2s",
  },
  {
    id: "tracking",
    title: { en: "Weekly Tracking", bn: "সাপ্তাহিক ট্র্যাকিং" },
    subtitle: { en: "Progress insights", bn: "অগ্রগতির ইনসাইট" },
    className: "right-6 top-6 sm:top-6 md:top-8 lg:top-10",
    delay: "0.6s",
  },
];

const heroStats = [
  { value: "2.5K +", label: { en: "Active Students", bn: "সক্রিয় শিক্ষার্থী" } },
  { value: "98%", label: { en: "Satisfaction", bn: "সন্তুষ্টি" } },
];

type AssistCard = {
  id: string;
  title: TranslationValue;
  subtitle: TranslationValue;
  icon: string;
};

const assistCards: AssistCard[] = [
  {
    id: "math",
    title: { en: "Solve Math Problem", bn: "গণিত সমস্যা সমাধান" },
    subtitle: { en: "Help me understand algebraic equations", bn: "বীজগণিতের সমীকরণ বুঝতে সাহায্য করুন" },
    icon: "📊",
  },
  {
    id: "science",
    title: { en: "Science Concept", bn: "বিজ্ঞান ধারণা" },
    subtitle: { en: "Explain photosynthesis step by step", bn: "ফটোসিন্থেসিস ধাপে ধাপে ব্যাখ্যা করুন" },
    icon: "🧪",
  },
  {
    id: "grammar",
    title: { en: "Grammar Help", bn: "ব্যাকরণ সহায়তা" },
    subtitle: { en: "Teach me about verb tenses", bn: "ক্রিয়ার কাল সম্পর্কে শেখান" },
    icon: "✍️",
  },
  {
    id: "study",
    title: { en: "Study Tips", bn: "পড়াশোনার টিপস" },
    subtitle: { en: "How to prepare for exams effectively", bn: "পরীক্ষার জন্য কার্যকরভাবে প্রস্তুতি নিন" },
    icon: "🎓",
  },
];

type SubjectCard = {
  id: string;
  title: TranslationValue;
  tag: TranslationValue;
};

const subjectDescription = {
  en: "Structured chapters, lesson notes, and quick checks.",
  bn: "গোছানো অধ্যায়, লেসন নোট এবং দ্রুত যাচাই।",
};

const subjectCards: SubjectCard[] = [
  { id: "bangla", title: { en: "Bangla", bn: "বাংলা" }, tag: { en: "Language", bn: "ভাষা" } },
  { id: "ict", title: { en: "ICT", bn: "আইসিটি" }, tag: { en: "Tech", bn: "প্রযুক্তি" } },
  { id: "biology", title: { en: "Biology", bn: "জীববিজ্ঞান" }, tag: { en: "STEM", bn: "স্টেম" } },
  { id: "english", title: { en: "English", bn: "ইংরেজি" }, tag: { en: "Language", bn: "ভাষা" } },
  { id: "business", title: { en: "Business Studies", bn: "ব্যবসায় শিক্ষা" }, tag: { en: "Commerce", bn: "বাণিজ্য" } },
  { id: "chemistry", title: { en: "Chemistry", bn: "রসায়ন" }, tag: { en: "STEM", bn: "স্টেম" } },
  { id: "math", title: { en: "Mathematics", bn: "গণিত" }, tag: { en: "Core", bn: "মূল" } },
  { id: "physics", title: { en: "Physics", bn: "পদার্থবিজ্ঞান" }, tag: { en: "STEM", bn: "স্টেম" } },
];

type SectionProps = {
  id?: string;
  className?: string;
  children: ReactNode;
};

function Section({ id, className, children }: SectionProps) {
  return (
    <section id={id} className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </section>
  );
}

function HeroBadgeItem({ badge, t }: { badge: HeroBadge; t: Translate }) {
  return (
    <div
      className={cn(
        "absolute hidden items-center justify-center rounded-2xl bg-[#9FB7DD]/80 px-3 py-2 text-center text-sm font-semibold text-black shadow-md backdrop-blur-md lg:flex animate-hero-float will-change-transform",
        badge.className
      )}
      style={{ animationDelay: badge.delay ?? "0s" }}
    >
      <div>
        <div>{t(badge.title)}</div>
        {badge.subtitle && <div className="text-xs font-normal">{t(badge.subtitle)}</div>}
      </div>
    </div>
  );
}

function HeroBadgeStack({ t }: { t: Translate }) {
  return (
    <div className="mt-6 flex flex-wrap justify-center gap-3 lg:hidden">
      {heroBadges.map((badge) => (
        <div
          key={`${badge.id}-stack`}
          className="rounded-xl bg-[#9FB7DD]/80 px-3 py-2 text-center text-sm font-semibold text-black shadow-sm backdrop-blur-sm"
        >
          <div>{t(badge.title)}</div>
          {badge.subtitle && <div className="font-normal">{t(badge.subtitle)}</div>}
        </div>
      ))}
    </div>
  );
}

function HeroVisual({ t }: { t: Translate }) {
  return (
    <div className="animate-hero-up-delay-1 relative mx-auto w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl -mt-6 sm:-mt-8 md:-mt-10 lg:-mt-12">
      <div className="relative">
        <img
          src="/assets/hero_image.png"
          alt={t({ en: "Student learning illustration", bn: "শিক্ষার্থী শেখার ইলাস্ট্রেশন" })}
          className="mx-auto w-[85%] -translate-x-12 lg:-translate-x-16 -translate-y-10 sm:-translate-y-14 lg:-translate-y-20"
          loading="eager"
        />

        {heroBadges.map((badge) => (
          <HeroBadgeItem key={badge.id} badge={badge} t={t} />
        ))}
      </div>

      <HeroBadgeStack t={t} />
    </div>
  );
}

function HeroSection({ t }: { t: Translate }) {
  const { language } = useLanguage();
  const heroTitleClass = cn(
    "animate-hero-up font-bold leading-tight text-transparent bg-[linear-gradient(180deg,_#000000_0%,_#060BF7_60%)] bg-clip-text",
    language === "bn"
      ? "text-2xl sm:text-3xl md:text-4xl lg:text-[48px]"
      : "text-3xl sm:text-4xl md:text-5xl lg:text-[54px]"
  );

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[#F8FAFF]"
    >
      <img
        src="/figma/hero-wave.svg"
        alt=""
        className="pointer-events-none absolute bottom-0 left-0 z-0 h-44 w-full translate-y-12 object-cover object-bottom sm:h-52 sm:translate-y-14 lg:h-56 lg:translate-y-16"
        aria-hidden="true"
      />
      <div className="relative z-10">
        <Section className="pt-14 pb-24 sm:pt-20 md:pt-24 sm:pb-28 lg:pt-28 lg:pb-32">
          <div className="flex flex-col items-center gap-12 md:flex-row md:items-center md:gap-14">
            <div className="max-w-3xl text-center md:-mt-6 md:text-left lg:-mt-8 xl:-mt-10">
              <h1 className={heroTitleClass}>
                {t({ en: "Learn Smarter,", bn: "আরও স্মার্টভাবে শিখুন," })}
                <br />
                {t({ en: "Not Harder", bn: "কঠোরভাবে নয়" })}
              </h1>
              <p className="animate-hero-up-delay-1 mt-4 max-w-2xl text-base leading-relaxed text-black sm:text-[15px] lg:text-base">
                {t({
                  en: "HomeSchool turns study time into a clear journey with lessons, quizzes, and progress insights for students, parents, and schools.",
                  bn: "HomeSchool পড়াশোনার সময়কে স্পষ্ট একটি যাত্রায় রূপ দেয়—লেসন, কুইজ ও অগ্রগতির তথ্য দিয়ে শিক্ষার্থী, অভিভাবক ও স্কুলের জন্য।",
                })}
              </p>
              <div className="animate-hero-up-delay-2 mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
                <Link to="/signup" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="h-10 w-full rounded-full bg-[#060BF7] px-4 text-sm font-semibold text-white shadow-none hover:bg-[#060BF7]/90 sm:w-auto md:h-11 md:px-5 md:text-base"
                  >
                    {t({ en: "Start Learning Free", bn: "বিনামূল্যে শেখা শুরু করুন" })}
                  </Button>
                </Link>
                <div className="w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window === "undefined") return;
                      const el = document.getElementById("homeschool-ai");
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="h-10 w-full rounded-full bg-[#F3AB36] px-4 text-sm font-semibold text-black shadow-none hover:bg-[#f0a529] sm:w-auto md:h-11 md:px-5 md:text-base"
                  >
                    {t({ en: "Try Homeschool AI Tutor", bn: "হোমস্কুল এআই টিউটর চেষ্টা করুন" })}
                  </button>
                </div>
              </div>
              <div className="animate-hero-up-delay-2 mt-5 flex flex-wrap justify-center gap-4 text-center md:justify-start md:text-left">
                {heroStats.map((stat) => (
                  <div key={stat.value}>
                    <div className="text-base font-semibold text-black sm:text-lg">{stat.value}</div>
                    <div className="text-sm font-medium text-black sm:text-[15px]">{t(stat.label)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-2 sm:mt-6 md:mt-10 lg:mt-12">
              <HeroVisual t={t} />
            </div>
          </div>
        </Section>
      </div>
    </section>
  );
}

function HomeschoolAISection({ t }: { t: Translate }) {
  return (
    <Section className="py-14 sm:py-16 lg:py-18">
      <div className="mx-auto max-w-4xl">
        <NctbAsk />
      </div>
    </Section>
  );
}

function SubjectsSection({ t }: { t: Translate }) {
  return (
    <Section className="py-14 text-center sm:py-16 lg:py-20">
      <div className="mx-auto max-w-3xl space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Coverage</p>
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          {t({ en: "Coverage across core subjects", bn: "মূল বিষয়গুলোর কভারেজ" })}
        </h2>
        <p className="text-sm text-slate-600">
          {t({
            en: "Structured chapters, lesson notes, and quick checks, just like the Figma reference.",
            bn: "গোছানো অধ্যায়, লেসন নোট এবং দ্রুত যাচাই—ঠিক Figma অনুসারে।",
          })}
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {subjectCards.map((subject) => (
          <div key={subject.id} className="rounded-2xl bg-white/90 p-5 shadow-lg ring-1 ring-white/40">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-slate-900">{t(subject.title)}</div>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                {t(subject.tag)}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-600">{t(subjectDescription)}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function ParentsSection({ t }: { t: Translate }) {
  return (
    <section className="bg-[radial-gradient(circle_at_top,_#D7EEFF_0%,_#B9DDFE_45%,_#8BB2F1_100%)]">
      <Section className="py-14 sm:py-16 lg:py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black sm:text-2xl lg:text-3xl">
            {t({ en: "Parents stay informed without pressure", bn: "অভিভাবকরা চাপ ছাড়াই আপডেট পান" })}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-black/70 sm:text-base">
            {t({
              en: "Track study time, quiz scores, and weekly trends. Know when to encourage and when to step in.",
              bn: "পড়ার সময়, কুইজ স্কোর ও সাপ্তাহিক ট্রেন্ড দেখুন। কখন উৎসাহ দেবেন আর কখন সাহায্য করবেন—তা বুঝতে পারবেন।",
            })}
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center gap-8 lg:flex-row lg:items-start">
          <div className="w-full max-w-md space-y-5 text-left">
            {[
              {
                en: "Progress alerts for weak topics",
                bn: "দুর্বল টপিকের জন্য প্রগ্রেস অ্যালার্ট",
              },
              {
                en: "Weekly summaries for time and scores",
                bn: "সময় ও স্কোরের সাপ্তাহিক সারসংক্ষেপ",
              },
              {
                en: "Clear goals for the next study session",
                bn: "পরের স্টাডি সেশনের জন্য পরিষ্কার লক্ষ্য",
              },
            ].map((item) => (
              <div key={item.en} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#2B6EF6] shadow-sm">
                  <svg width="16" height="14" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 8l4.5 4L18 2" stroke="#2B6EF6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <p className="text-base font-semibold text-black">{t(item)}</p>
              </div>
            ))}
            <div className="mt-2 flex justify-center lg:justify-start">
              <Link
                to="/parent"
                className="inline-flex items-center justify-center rounded-full bg-[#2B6EF6] px-8 py-3 text-sm font-semibold text-white shadow-xl transition hover:bg-[#1F59D4]"
              >
                {t({ en: "View Parents Dashboard", bn: "প্যারেন্টস ড্যাশবোর্ড দেখুন" })}
              </Link>
            </div>
          </div>

          <div className="relative lg:flex-1">
            <div className="absolute -top-6 right-0 w-full max-w-sm rounded-lg border border-[#F4D58A] bg-[#FFF2C7] p-4 shadow-lg">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFFBF0] text-[#F59E0B]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8v5m0 4h.01" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="text-sm font-semibold text-[#A16207]">{t({ en: "Performance Alert", bn: "পারফরম্যান্স অ্যালার্ট" })}</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[#9A6A0A] sm:text-sm">
                {t({
                  en: "Quiz scores in Physics - Motion dropped by 10% this week. Suggested revision: 'Equations of Motion'.",
                  bn: "এই সপ্তাহে পদার্থবিজ্ঞান - গতি বিষয়ে কুইজ স্কোর ১০% কমেছে। পরামর্শ: 'গতি সমীকরণ' রিভিশন দিন।",
                })}
              </p>
            </div>

            <div className="mt-24 w-full rounded-2xl bg-white p-4 shadow-lg ring-1 ring-slate-100 lg:mt-12 lg:w-96">
              <div className="text-xs font-semibold text-slate-700">{t({ en: "This week", bn: "এই সপ্তাহে" })}</div>
              <div className="mt-2 text-sm font-semibold text-slate-700">{t({ en: "82% quiz accuracy", bn: "কুইজ এক্যুরেসি ৮২%" })}</div>
              <div className="mt-3 space-y-3">
                {[
                  { label: t({ en: "Mathematics", bn: "গণিত" }), value: 72 },
                  { label: t({ en: "Physics", bn: "পদার্থবিজ্ঞান" }), value: 85 },
                  { label: t({ en: "English", bn: "ইংরেজি" }), value: 60 },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{item.label}</span>
                      <span>{t({ en: "On track", bn: "ভালো চলছে" })}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200">
                      <div className="h-2 rounded-full bg-[#4F6EF7]" style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[11px] text-slate-400">
                {t({
                  en: "Next focus: revise equations of motion before Friday.",
                  bn: "পরের ফোকাস: শুক্রবারের আগে গতি সমীকরণ রিভিশন দিন।",
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              quote: {
                en: "The short lessons and quizzes keep me focused. I finally know what to study next.",
                bn: "ছোট ছোট লেসন আর কুইজ আমাকে ফোকাসড রাখে। এখন বুঝতে পারি পরেরটা কী পড়ব।",
              },
              name: "Arian Ahmed",
              role: { en: "Class 10 Student", bn: "ক্লাস ১০ শিক্ষার্থী" },
            },
            {
              quote: {
                en: "The syllabus mapping makes class planning simple. Students revise the exact topics.",
                bn: "সিলেবাস ম্যাপিংয়ের ফলে ক্লাস পরিকল্পনা সহজ হয়। ছাত্ররা ঠিক টপিকগুলোই রিভিশন করে।",
              },
              name: "Imran Kabir",
              role: { en: "Teacher", bn: "শিক্ষক" },
            },
            {
              quote: {
                en: "I can see my child is consistent every week. The parent view makes it easy to help.",
                bn: "আমি দেখি আমার সন্তান প্রতি সপ্তাহে নিয়মিত থাকে। প্যারেন্ট ভিউ-তে সাহায্য করা সহজ।",
              },
              name: "Nusrat Jahan",
              role: { en: "Parent", bn: "অভিভাবক" },
            },
          ].map((item) => (
            <div key={item.name} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <div className="text-yellow-400 text-sm">⭐⭐⭐⭐⭐</div>
              <p className="mt-3 text-sm text-slate-700">{t(item.quote)}</p>
              <div className="mt-4">
                <div className="text-sm font-semibold text-slate-900">{item.name}</div>
                <div className="text-xs text-slate-500">{t(item.role)}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </section>
  );
}

export default function Home() {
  const t = useTranslate();

  usePageMeta({
    title: t({ en: "HomeSchool - Learn Smarter", bn: "HomeSchool - স্মার্টভাবে শিখুন" }),
    description: t({
      en: "Learn smarter with HomeSchool: lessons, quizzes, and progress insights for students and parents.",
      bn: "HomeSchool এর সাথে স্মার্টভাবে শিখুন: শিক্ষার্থী ও অভিভাবকদের জন্য লেসন, কুইজ ও অগ্রগতির তথ্য।",
    }),
  });

  return (
    <MarketingShell>
      <div className="bg-[#F8FAFF]">
        <HeroSection t={t} />
        <div className="bg-[linear-gradient(180deg,#E6F0FF_0%,#D6E5FF_45%,#8BB2F1_100%)]">
          <HomeschoolAISection t={t} />
          <SubjectsSection t={t} />
          <ParentsSection t={t} />
        </div>
      </div>
    </MarketingShell>
  );
}
