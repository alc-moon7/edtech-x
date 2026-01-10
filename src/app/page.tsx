import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { MarketingShell } from "@/components/MarketingShell";
import { usePageMeta } from "@/lib/usePageMeta";
import { useLanguage, useTranslate, type TranslationValue } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { invokeEdgeFunction } from "@/lib/supabaseClient";

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
    title: { en: "AI Tutor", bn: "এআই টিউটর" },
    className: "left-10 -top-10 sm:-top-6 md:-top-8 lg:-top-10",
  },
  {
    id: "coverage",
    title: { en: "Class 6-8", bn: "ক্লাস ৬-৮" },
    subtitle: { en: "Syllabus Coverage", bn: "সিলেবাস কভারেজ" },
    className: "left-[42%] -top-14 sm:-top-10 md:-top-12 lg:-top-16",
  },
  {
    id: "roles",
    title: { en: "Student and Parent", bn: "শিক্ষার্থী ও অভিভাবক" },
    subtitle: { en: "Learning Roles", bn: "শেখার ভূমিকা" },
    className: "-left-6 top-10 sm:top-6 md:top-8 lg:top-10",
  },
  {
    id: "tracking",
    title: { en: "Weekly Tracking", bn: "সাপ্তাহিক ট্র্যাকিং" },
    subtitle: { en: "Progress insights", bn: "অগ্রগতির ইনসাইট" },
    className: "right-6 -top-8 sm:-top-6 md:-top-8 lg:-top-10",
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
          alt={t({ en: "Student learning illustration", bn: "শিক্ষার্থী শেখার ইলাস্ট্রেশন" })}
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
  const { language } = useLanguage();
  const heroTitleClass = cn(
    "animate-hero-up font-bold leading-tight text-transparent bg-[linear-gradient(180deg,_#000000_0%,_#060BF7_60%)] bg-clip-text",
    language === "bn"
      ? "text-2xl sm:text-3xl md:text-4xl lg:text-[48px]"
      : "text-3xl sm:text-4xl md:text-5xl lg:text-[54px]"
  );

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
              <h1 className={heroTitleClass}>
                {t({ en: "Learn Smarter,", bn: "আরও স্মার্টভাবে শিখুন," })}
                <br />
                {t({ en: "Not Harder", bn: "কঠোরভাবে নয়" })}
              </h1>
              <p className="animate-hero-up-delay-1 mt-4 max-w-2xl text-sm leading-relaxed text-black sm:text-[15px] lg:text-base">
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
                <Link to="/pricing" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="h-10 w-full rounded-full bg-[#F3AB36] px-4 text-sm font-semibold text-black shadow-none hover:bg-[#f0a529] sm:w-auto md:h-11 md:px-5 md:text-base"
                  >
                    {t({ en: "Try Homeschool AI Tutor", bn: "হোমস্কুল এআই টিউটর চেষ্টা করুন" })}
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
            {t({ en: "How can I help you today?", bn: "আজ আমি কীভাবে সাহায্য করতে পারি?" })}
          </h2>
          <p className="text-sm text-black/70 sm:text-[15px]">
            {t({ en: "Your personal AI tutor for all subjects", bn: "সব বিষয়ের জন্য আপনার ব্যক্তিগত এআই টিউটর" })}
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
            bn: "হোমস্কুল এআই ভুল করতে পারে। গুরুত্বপূর্ণ তথ্য যাচাই করুন।",
          })}
        </p>

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
          {t({ en: "Coverage across core subjects", bn: "মূল বিষয়গুলোর কভারেজ" })}
        </h2>
        <p className="mt-2 text-sm text-black/70 sm:text-[15px] lg:text-base">
          {t({
            en: "Each subject includes lessons, practice, and assessments tailored to the official syllabus.",
            bn: "প্রতিটি বিষয়ে সরকারি সিলেবাস অনুযায়ী লেসন, অনুশীলন ও মূল্যায়ন রয়েছে।",
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
  const [messages, setMessages] = useState<Array<{ id: string; role: "user" | "assistant"; content: string }>>([]);
  const [thinking, setThinking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const [classLevel, setClassLevel] = useState("");
  const [subject, setSubject] = useState("");
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scrollEl = chatScrollRef.current;
    if (!scrollEl) return;
    const maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;
    if (maxScroll <= 0) return;
    scrollEl.scrollTo({ top: scrollEl.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const classOptions = [
    { value: "Class 6", label: t({ en: "Class 6", bn: "Class 6" }) },
    { value: "Class 7", label: t({ en: "Class 7", bn: "Class 7" }) },
    { value: "Class 8", label: t({ en: "Class 8", bn: "Class 8" }) },
    { value: "Class 9", label: t({ en: "Class 9", bn: "Class 9" }) },
    { value: "Class 10", label: t({ en: "Class 10", bn: "Class 10" }) },
    { value: "Class 11", label: t({ en: "Class 11", bn: "Class 11" }) },
    { value: "Class 12", label: t({ en: "Class 12", bn: "Class 12" }) },
  ];
  const subjectOptions = [
    { value: "Bangla", label: t({ en: "Bangla", bn: "Bangla" }) },
    { value: "English", label: t({ en: "English", bn: "English" }) },
    { value: "Mathematics", label: t({ en: "Mathematics", bn: "Mathematics" }) },
    { value: "Science", label: t({ en: "Science", bn: "Science" }) },
    { value: "ICT", label: t({ en: "ICT", bn: "ICT" }) },
    { value: "Agriculture Studies", label: t({ en: "Agriculture Studies", bn: "Agriculture Studies" }) },
  ];

  const parseFunctionError = async (fnError: unknown) => {
    if (fnError && typeof fnError === "object" && "error" in fnError) {
      return fnError as Record<string, unknown>;
    }
    const context = (fnError as { context?: { response?: Response } }).context;
    if (!context?.response) return null;
    const response = context.response.clone();
    return response.json().catch(() => null);
  };

  const handleAsk = async () => {
    const trimmed = question.trim();
    if (!trimmed) return;
    if (!classLevel || !subject) {
      setError(t({ en: "Select class and subject first.", bn: "Select class and subject first." }));
      return;
    }
    const userMessage = { id: `${Date.now()}-user`, role: "user" as const, content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);
    setThinking(true);
    setError(null);
    setLimitReached(false);

    const { data, error: fnError } = await invokeEdgeFunction<{ reply?: string }>("nctb-qa", {
      question: trimmed,
      classLevel,
      subject,
      language,
    });

    if (fnError || !data?.reply) {
      const payload = await parseFunctionError(fnError);
      if (payload?.code === "DAILY_LIMIT") {
        setLimitReached(true);
        setError(t({ en: "Daily limit reached. Upgrade your plan to continue.", bn: "Daily limit reached. Upgrade your plan to continue." }));
      } else if (payload?.error === "Unauthorized") {
        setError(t({ en: "Please sign in to use AI.", bn: "Please sign in to use AI." }));
      } else {
        setError(
          payload?.error ||
            fnError?.message ||
            t({ en: "AI reply failed. Please try again.", bn: "AI reply failed. Please try again." })
        );
      }
    } else {
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-assistant`, role: "assistant", content: data.reply as string },
      ]);
    }

    setLoading(false);
    setThinking(false);
  };

  return (
    <div>
      <div className="rounded-[18px] bg-white p-3.5 shadow-sm ring-1 ring-slate-100 sm:p-4">
        <div className="mb-3">
          <div className="text-sm font-semibold text-slate-900">Homeschool NCTB AI</div>
          <div className="text-xs text-slate-500">Class & subject based answers with notes</div>
        </div>
        <div ref={chatScrollRef} className="max-h-72 space-y-3 overflow-y-auto pr-1 sm:max-h-80">
          {messages.length === 0 && !thinking && (
            <p className="text-xs text-slate-400">Ask a question and get notes in bullet points.</p>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-6 shadow-sm",
                  message.role === "user"
                    ? "bg-[#060BF7] text-white"
                    : "bg-slate-50 text-slate-700 ring-1 ring-slate-100"
                )}
              >
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
              </div>
            </div>
          ))}
          {thinking && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-slate-50 px-4 py-2 text-sm text-slate-500 ring-1 ring-slate-100">
                <span className="animate-pulse">Thinking...</span>
              </div>
            </div>
          )}
        </div>
        <div className="mt-3 border-t border-slate-100 pt-3">
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder={t({ en: "Ask a question about the NCTB syllabus...", bn: "Ask a question about the NCTB syllabus..." })}
            rows={3}
            className="min-h-24 max-h-40 w-full resize-none overflow-y-auto overflow-x-hidden rounded-xl border border-slate-200 px-3 py-2 text-sm leading-6 text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 sm:max-h-48 sm:text-base"
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                if (!loading) handleAsk();
              }
            }}
          />
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
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
      </div>
      {error && (
        <div className="mt-2 space-y-1">
          <p className="text-xs text-red-600">{error}</p>
          {limitReached && (
            <Link to="/pricing" className="text-xs font-semibold text-blue-600 hover:underline">
              {t({ en: "Upgrade plan", bn: "Upgrade plan" })}
            </Link>
          )}
        </div>
      )}
    </div>
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
          <AssistSection t={t} />
          <SubjectsSection t={t} />
        </div>
      </div>
    </MarketingShell>
  );
}
