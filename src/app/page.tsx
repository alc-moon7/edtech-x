import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { MarketingShell } from "@/components/MarketingShell";
import { usePageMeta } from "@/lib/usePageMeta";
import { useLanguage, useTranslate, type TranslationValue } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { AiQuizCard } from "@/components/dashboard/AiQuizCard";
import { supabase } from "@/lib/supabaseClient";

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
    className: "left-10 -top-10 sm:-top-6 md:-top-8 lg:-top-10",
  },
  {
    id: "coverage",
    title: { en: "Class 6-8", bn: "Class 6-8" },
    subtitle: { en: "Syllabus Coverage", bn: "Syllabus Coverage" },
    className: "left-[42%] -top-14 sm:-top-10 md:-top-12 lg:-top-16",
  },
  {
    id: "roles",
    title: { en: "Student and Parent", bn: "Student and Parent" },
    subtitle: { en: "Learning Roles", bn: "Learning Roles" },
    className: "-left-6 top-10 sm:top-6 md:top-8 lg:top-10",
  },
  {
    id: "tracking",
    title: { en: "Weekly Tracking", bn: "Weekly Tracking" },
    subtitle: { en: "Progress insights", bn: "Progress insights" },
    className: "right-6 -top-8 sm:-top-6 md:-top-8 lg:-top-10",
  },
];

const heroStats = [
  { value: "2.5K +", label: { en: "Active Students", bn: "Active Students" } },
  { value: "98%", label: { en: "Satisfaction", bn: "Satisfaction" } },
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
        className="pointer-events-none absolute left-0 top-0 z-0 h-48 w-full -translate-y-14 object-cover sm:h-56 sm:-translate-y-16 lg:h-64 lg:-translate-y-18 rotate-180"
        aria-hidden="true"
      />
      <img
        src="/figma/hero-wave.svg"
        alt=""
        className="pointer-events-none absolute bottom-0 left-0 z-0 h-48 w-full translate-y-10 object-cover sm:h-56 sm:translate-y-12 lg:h-60 lg:translate-y-14"
        aria-hidden="true"
      />
      <div className="relative z-10">
        <Section className="pt-32 pb-28 sm:pt-36 sm:pb-32 lg:pt-40 lg:pb-36">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-8 lg:gap-10">
            <div className="max-w-3xl text-center md:text-left">
              <h1 className="animate-hero-up text-3xl font-bold leading-tight text-transparent sm:text-4xl md:text-5xl lg:text-[54px] bg-[linear-gradient(180deg,_#000000_0%,_#060BF7_60%)] bg-clip-text">
                {t({ en: "Learn Smarter,", bn: "Learn Smarter," })}
                <br />
                {t({ en: "Not Harder", bn: "Not Harder" })}
              </h1>
              <p className="animate-hero-up-delay-1 mt-4 max-w-2xl text-sm leading-relaxed text-black sm:text-[15px] lg:text-base">
                {t({
                  en: "HomeSchool turns study time into a clear journey with lessons, quizzes, and progress insights for students, parents, and schools.",
                  bn: "HomeSchool turns study time into a clear journey with lessons, quizzes, and progress insights for students, parents, and schools.",
                })}
              </p>
              <div className="animate-hero-up-delay-2 mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
                <Link to="/signup" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="h-10 w-full rounded-full bg-[#060BF7] px-4 text-sm font-semibold text-white shadow-none hover:bg-[#060BF7]/90 sm:w-auto md:h-11 md:px-5 md:text-base"
                  >
                    {t({ en: "Start Learning Free", bn: "Start Learning Free" })}
                  </Button>
                </Link>
                <Link to="/pricing" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="h-10 w-full rounded-full bg-[#F3AB36] px-4 text-sm font-semibold text-black shadow-none hover:bg-[#f0a529] sm:w-auto md:h-11 md:px-5 md:text-base"
                  >
                    {t({ en: "Try Homeschool AI Tutor", bn: "Try Homeschool AI Tutor" })}
                  </Button>
                </Link>
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

            <HeroVisual t={t} />
          </div>
        </Section>
      </div>
    </section>
  );
}

function AssistSection({ t }: { t: Translate }) {
  return (
    <section className="py-12 sm:py-16">
      <Section className="max-w-5xl">
        <div className="mb-4 space-y-2 text-center">
          <h2 className="text-xl font-bold text-black sm:text-2xl lg:text-3xl">
            {t({ en: "How can I help you today?", bn: "How can I help you today?" })}
          </h2>
          <p className="text-sm text-black/70 sm:text-[15px]">
            {t({ en: "Your personal AI tutor for all subjects", bn: "Your personal AI tutor for all subjects" })}
          </p>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {assistCards.map((card) => (
            <div
              key={card.id}
              className="flex items-start gap-3 rounded-2xl bg-white px-3.5 py-3 shadow-[0_6px_18px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 sm:px-4 sm:py-3.5"
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

        <NctbAsk t={t} />

        <p className="mt-4 text-center text-[11px] text-slate-500 sm:text-xs">
          {t({
            en: "Homeschool AI can make mistakes. Always verify important information",
            bn: "Homeschool AI can make mistakes. Always verify important information",
          })}
        </p>

        <div className="mt-8">
          <AiQuizCard context="home" />
        </div>
      </Section>
    </section>
  );
}

function SubjectsSection({ t }: { t: Translate }) {
  return (
    <Section id="reviews" className="relative pb-14 sm:pb-16">
      <span id="subjects" className="absolute -top-20" aria-hidden="true" />
      <div className="text-center">
        <h2 className="text-xl font-bold text-black sm:text-2xl lg:text-3xl">
          {t({ en: "Coverage across core subjects", bn: "Coverage across core subjects" })}
        </h2>
        <p className="mt-2 text-sm text-black/70 sm:text-[15px] lg:text-base">
          {t({
            en: "Each subject includes lessons, practice, and assessments tailored to the official syllabus.",
            bn: "Each subject includes lessons, practice, and assessments tailored to the official syllabus.",
          })}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
        {subjectCards.map((card) => (
          <div key={card.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold text-black sm:text-lg">{t(card.title)}</h3>
              <span className="rounded-full bg-[#EEF2FF] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5A6CFD]">
                {t(card.tag)}
              </span>
            </div>
            <p className="mt-2.5 text-sm leading-5 text-slate-600 sm:text-[15px] sm:leading-6">
              {t(subjectDescription)}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function NctbAsk({ t }: { t: Translate }) {
  const { language } = useLanguage();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [classLevel, setClassLevel] = useState("");
  const [subject, setSubject] = useState("");

  const classOptions = [{ value: "Class 6", label: t({ en: "Class 6", bn: "Class 6" }) }];
  const subjectOptions = [
    { value: "Bangla", label: t({ en: "Bangla", bn: "Bangla" }) },
    { value: "English", label: t({ en: "English", bn: "English" }) },
    { value: "Mathematics", label: t({ en: "Mathematics", bn: "Mathematics" }) },
    { value: "Science", label: t({ en: "Science", bn: "Science" }) },
    { value: "ICT", label: t({ en: "ICT", bn: "ICT" }) },
    { value: "Agriculture Studies", label: t({ en: "Agriculture Studies", bn: "Agriculture Studies" }) },
  ];

  const handleAsk = async () => {
    const trimmed = question.trim();
    if (!trimmed) return;
    if (!classLevel || !subject) {
      setError(t({ en: "Select class and subject first.", bn: "Select class and subject first." }));
      return;
    }
    setLoading(true);
    setError(null);
    setAnswer(null);

    const { data, error: fnError } = await supabase.functions.invoke("nctb-qa", {
      body: {
        question: trimmed,
        classLevel,
        subject,
        language,
      },
    });

    if (fnError || !data?.reply) {
      setError(t({ en: "AI reply failed. Please try again.", bn: "AI উত্তর পাওয়া যায়নি। আবার চেষ্টা করুন।" }));
    } else {
      setAnswer(data.reply as string);
    }

    setLoading(false);
  };

  return (
    <div>
      <div className="rounded-[18px] bg-white p-3.5 shadow-sm ring-1 ring-slate-100 sm:p-4">
        <div className="flex items-start gap-3">
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder={t({ en: "Message Homeschool AI", bn: "Message Homeschool AI" })}
            rows={3}
            className="min-h-24 max-h-40 w-full resize-none overflow-y-auto overflow-x-hidden border-none text-sm leading-6 text-black placeholder:text-slate-400 focus:outline-none focus:ring-0 sm:max-h-48 sm:text-base"
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                if (!loading) handleAsk();
              }
            }}
          />
        </div>
        <div className="mt-3 flex flex-col gap-3 border-t border-slate-100 pt-3 sm:flex-row sm:items-end">
          <div className="grid flex-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <select
                value={classLevel}
                onChange={(event) => {
                  setClassLevel(event.target.value);
                  setError(null);
                }}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm text-black shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">{t({ en: "Select class", bn: "Select class" })}</option>
                {classOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <select
                value={subject}
                onChange={(event) => {
                  setSubject(event.target.value);
                  setError(null);
                }}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm text-black shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">{t({ en: "Select subject", bn: "Select subject" })}</option>
                {subjectOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={handleAsk}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[linear-gradient(180deg,_#060BF7_0%,_#3B94DE_70%)] text-white shadow-sm transition hover:brightness-110 disabled:opacity-60 sm:h-11 sm:w-11"
            aria-label={t({ en: "Send message", bn: "Send message" })}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4l16 8-16 8 4-8-4-8z" />
            </svg>
          </button>
        </div>
      </div>
      {loading && <p className="mt-2 text-xs text-slate-500">{t({ en: "Thinking...", bn: "চিন্তা করছে..." })}</p>}
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      {answer && (
        <div className="mt-3 max-h-64 overflow-y-auto rounded-2xl bg-white/95 px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm ring-1 ring-slate-100 sm:max-h-72 sm:text-base">
          <p className="whitespace-pre-wrap break-words">{answer}</p>
        </div>
      )}
    </div>
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
      <div className="bg-[#F8FAFF]">
        <HeroSection t={t} />
        <div className="bg-[linear-gradient(180deg,#E6F0FF_0%,#D6E5FF_45%,#8BB2F1_100%)]">
          <AssistSection t={t} />
          <SubjectsSection t={t} />
        </div>
      </div>
    </MarketingShell>
  );
}
