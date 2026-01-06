import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { MarketingShell } from "@/components/MarketingShell";
import { usePageMeta } from "@/lib/usePageMeta";
import { useTranslate, type TranslationValue } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Translate = ReturnType<typeof useTranslate>;

type HeroBadge = {
  id: string;
  title: TranslationValue;
  subtitle?: TranslationValue;
  className: string;
};

const heroBadges: HeroBadge[] = [
  {
    id: "ai-tutor",
    title: { en: "AI Tutor", bn: "AI Tutor" },
    className: "-left-10 -top-10",
  },
  {
    id: "coverage",
    title: { en: "Class 6-8", bn: "Class 6-8" },
    subtitle: { en: "Syllabus Coverage", bn: "Syllabus Coverage" },
    className: "left-40 -top-8",
  },
  {
    id: "roles",
    title: { en: "Student and Parent", bn: "Student and Parent" },
    subtitle: { en: "Learning Roles", bn: "Learning Roles" },
    className: "-left-12 top-12",
  },
  {
    id: "tracking",
    title: { en: "Weekly Tracking", bn: "Weekly Tracking" },
    subtitle: { en: "Progress insights", bn: "Progress insights" },
    className: "right-0 top-6 translate-x-6",
  },
];

const heroStats = [
  { value: "2.5K +", label: { en: "Active Students", bn: "Active Students" } },
  { value: "98%", label: { en: "Satisfaction", bn: "Satisfaction" } },
];

const featureCards = [
  { id: "card-1", icon: "/figma/icon-calculator.png" },
  { id: "card-2", icon: "/figma/icon-critical-thinking.png" },
  { id: "card-3", icon: "/figma/icon-book.svg" },
  { id: "card-4", icon: "/figma/icon-idea.svg" },
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
    title: { en: "Solve Math Problem", bn: "Solve Math Problem" },
    subtitle: { en: "Help me understand algebraic equations", bn: "Help me understand algebraic equations" },
    icon: "📊",
  },
  {
    id: "science",
    title: { en: "Science Concept", bn: "Science Concept" },
    subtitle: { en: "Explain photosynthesis step by step", bn: "Explain photosynthesis step by step" },
    icon: "🧪",
  },
  {
    id: "grammar",
    title: { en: "Grammar Help", bn: "Grammar Help" },
    subtitle: { en: "Teach me about verb tenses", bn: "Teach me about verb tenses" },
    icon: "✍️",
  },
  {
    id: "study",
    title: { en: "Study Tips", bn: "Study Tips" },
    subtitle: { en: "How to prepare for exams effectively", bn: "How to prepare for exams effectively" },
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
  bn: "Structured chapters, lesson notes, and quick checks.",
};

const subjectCards: SubjectCard[] = [
  { id: "bangla", title: { en: "Bangla", bn: "Bangla" }, tag: { en: "Language", bn: "Language" } },
  { id: "ict", title: { en: "ICT", bn: "ICT" }, tag: { en: "Tech", bn: "Tech" } },
  { id: "biology", title: { en: "Biology", bn: "Biology" }, tag: { en: "STEM", bn: "STEM" } },
  { id: "english", title: { en: "English", bn: "English" }, tag: { en: "Language", bn: "Language" } },
  { id: "business", title: { en: "Business Studies", bn: "Business Studies" }, tag: { en: "Commerce", bn: "Commerce" } },
  { id: "chemistry", title: { en: "Chemistry", bn: "Chemistry" }, tag: { en: "STEM", bn: "STEM" } },
  { id: "math", title: { en: "Mathematics", bn: "Mathematics" }, tag: { en: "Core", bn: "Core" } },
  { id: "physics", title: { en: "Physics", bn: "Physics" }, tag: { en: "STEM", bn: "STEM" } },
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
        "absolute hidden items-center justify-center rounded-2xl bg-[#9FB7DD]/80 px-3 py-2 text-center text-sm font-semibold text-black shadow-md backdrop-blur-md lg:flex",
        badge.className
      )}
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
    <div className="animate-hero-up-delay-1 relative mx-auto w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
      <div className="relative">
        <img
          src="/figma/hero-illustration.png"
          alt={t({ en: "Student learning illustration", bn: "Student learning illustration" })}
          className="w-full"
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
  return (
    <section id="home" className="relative overflow-hidden">
      <img
        src="/figma/hero-wave.svg"
        alt=""
        className="pointer-events-none absolute left-0 top-0 z-0 w-full -translate-y-2 sm:-translate-y-4 lg:-translate-y-6 rotate-180"
        aria-hidden="true"
      />
      <img
        src="/figma/hero-wave.svg"
        alt=""
        className="pointer-events-none absolute bottom-0 left-0 z-0 w-full translate-y-4 sm:translate-y-8 lg:translate-y-10"
        aria-hidden="true"
      />
      <div className="relative z-10">
        <Section className="pt-44 pb-40 sm:pt-48 sm:pb-44 lg:pt-52 lg:pb-48">
          <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:gap-10 lg:gap-12">
            <div className="max-w-3xl text-center md:text-left">
              <h1 className="animate-hero-up text-4xl font-bold leading-tight text-transparent sm:text-5xl md:text-[60px] xl:text-[66px] bg-[linear-gradient(180deg,_#000000_0%,_#060BF7_60%)] bg-clip-text">
                {t({ en: "Learn Smarter,", bn: "Learn Smarter," })}
                <br />
                {t({ en: "Not Harder", bn: "Not Harder" })}
              </h1>
              <p className="animate-hero-up-delay-1 mt-5 max-w-2xl text-sm leading-relaxed text-black sm:text-base lg:text-lg">
                {t({
                  en: "HomeSchool turns study time into a clear journey with lessons, quizzes, and progress insights for students, parents, and schools.",
                  bn: "HomeSchool turns study time into a clear journey with lessons, quizzes, and progress insights for students, parents, and schools.",
                })}
              </p>
              <div className="animate-hero-up-delay-2 mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
                <Link to="/signup" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="h-11 w-full rounded-full bg-[#060BF7] px-5 text-sm font-semibold text-white shadow-none hover:bg-[#060BF7]/90 sm:w-auto md:h-12 md:px-6 md:text-base"
                  >
                    {t({ en: "Start Learning Free", bn: "Start Learning Free" })}
                  </Button>
                </Link>
                <Link to="/pricing" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="h-11 w-full rounded-full bg-[#F3AB36] px-5 text-sm font-semibold text-black shadow-none hover:bg-[#f0a529] sm:w-auto md:h-12 md:px-6 md:text-base"
                  >
                    {t({ en: "Try Homeschool AI Tutor", bn: "Try Homeschool AI Tutor" })}
                  </Button>
                </Link>
              </div>
              <div className="animate-hero-up-delay-2 mt-6 flex flex-wrap justify-center gap-6 text-center md:justify-start md:text-left">
                {heroStats.map((stat) => (
                  <div key={stat.value}>
                    <div className="text-lg font-semibold text-black sm:text-xl">{stat.value}</div>
                    <div className="text-sm font-medium text-black sm:text-base">{t(stat.label)}</div>
                  </div>
                ))}
              </div>
            </div>

            <HeroVisual t={t} />
          </div>
        </Section>
      </div>
    </section>
  );
}

function FeatureSection() {
  return (
    <Section id="features" className="py-12 sm:py-16">
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 md:gap-6 lg:gap-8">
        {featureCards.map((card) => (
          <div key={card.id} className="flex items-center rounded-2xl bg-white p-4 shadow-sm sm:p-5">
            <img src={card.icon} alt="" className="h-10 w-10 sm:h-12 sm:w-12" aria-hidden="true" />
          </div>
        ))}
      </div>
    </Section>
  );
}

function AssistSection({ t }: { t: Translate }) {
  return (
    <section className="bg-[linear-gradient(180deg,#E7F0FF_0%,#F7F9FF_100%)] py-16 sm:py-20">
      <Section className="max-w-5xl">
        <div className="mb-4 space-y-2 text-center">
          <h2 className="text-2xl font-bold text-black sm:text-3xl lg:text-4xl">
            {t({ en: "How can I help you today?", bn: "How can I help you today?" })}
          </h2>
          <p className="text-sm text-black/70 sm:text-base">
            {t({ en: "Your personal AI tutor for all subjects", bn: "Your personal AI tutor for all subjects" })}
          </p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {assistCards.map((card) => (
            <div
              key={card.id}
              className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_6px_18px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 sm:px-5 sm:py-4"
            >
              <span className="mt-0.5 text-lg sm:text-xl" aria-hidden="true">
                {card.icon}
              </span>
              <div>
                <div className="text-sm font-semibold text-black sm:text-base">{t(card.title)}</div>
                <div className="text-xs text-slate-600 sm:text-sm">{t(card.subtitle)}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-5">
          <input
            type="text"
            placeholder={t({ en: "Message Homeschool AI", bn: "Message Homeschool AI" })}
            className="w-full border-none text-sm text-black placeholder:text-slate-400 focus:outline-none focus:ring-0 sm:text-base"
          />
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[linear-gradient(180deg,_#060BF7_0%,_#3B94DE_70%)] text-white shadow-sm transition hover:brightness-110"
            aria-label={t({ en: "Send message", bn: "Send message" })}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4l16 8-16 8 4-8-4-8z" />
            </svg>
          </button>
        </div>

        <p className="mt-4 text-center text-[11px] text-slate-500 sm:text-xs">
          {t({
            en: "Homeschool AI can make mistakes. Always verify important information",
            bn: "Homeschool AI can make mistakes. Always verify important information",
          })}
        </p>
      </Section>
    </section>
  );
}

function SubjectsSection({ t }: { t: Translate }) {
  return (
    <Section id="reviews" className="relative pb-16 sm:pb-20">
      <span id="subjects" className="absolute -top-20" aria-hidden="true" />
      <div className="text-center">
        <h2 className="text-2xl font-bold text-black sm:text-3xl lg:text-4xl">
          {t({ en: "Coverage across core subjects", bn: "Coverage across core subjects" })}
        </h2>
        <p className="mt-3 text-sm text-black/70 sm:text-base lg:text-lg">
          {t({
            en: "Each subject includes lessons, practice, and assessments tailored to the official syllabus.",
            bn: "Each subject includes lessons, practice, and assessments tailored to the official syllabus.",
          })}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
        {subjectCards.map((card) => (
          <div key={card.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold text-black sm:text-lg">{t(card.title)}</h3>
              <span className="rounded-full bg-[#EEF2FF] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5A6CFD]">
                {t(card.tag)}
              </span>
            </div>
            <p className="mt-3 text-sm leading-5 text-slate-600 sm:text-[15px] sm:leading-6">
              {t(subjectDescription)}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function FloatingChatButton({ t }: { t: Translate }) {
  return (
    <button
      type="button"
      aria-label={t({ en: "Open AI chat", bn: "Open AI chat" })}
      className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-slate-100 transition hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B94DE] sm:bottom-6 sm:right-6 sm:h-16 sm:w-16"
    >
      <img src="/figma/hero-chat.png" alt="" className="h-8 w-10" aria-hidden="true" />
      <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#66FF00]" />
    </button>
  );
}

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
      <div className="bg-[linear-gradient(180deg,#F8FAFF_0%,#E9F1FF_45%,#85B2F5_100%)]">
        <HeroSection t={t} />
        <AssistSection t={t} />
        <SubjectsSection t={t} />
        <FloatingChatButton t={t} />
      </div>
    </MarketingShell>
  );
}
