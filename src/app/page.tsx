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

        <div className="absolute hidden items-center justify-center rounded-full bg-white shadow-md lg:flex lg:-right-6 lg:bottom-8 lg:h-16 lg:w-16">
          <img src="/figma/hero-chat.png" alt={t({ en: "AI helper", bn: "AI helper" })} className="h-10 w-12" />
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#66FF00]" />
        </div>
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
        className="pointer-events-none absolute left-0 top-0 z-0 w-full -translate-y-px rotate-180"
        aria-hidden="true"
      />
      <img
        src="/figma/hero-wave.svg"
        alt=""
        className="pointer-events-none absolute bottom-0 left-0 z-0 w-full translate-y-px"
        aria-hidden="true"
      />
      <div className="relative z-10">
        <Section className="pt-20 pb-24 sm:pt-24 sm:pb-32 lg:pt-28 lg:pb-40">
          <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:gap-10 lg:gap-12">
            <div className="max-w-xl text-center md:text-left">
              <h1 className="animate-hero-up text-3xl font-bold leading-tight text-transparent sm:text-4xl md:text-5xl xl:text-6xl bg-[linear-gradient(180deg,_#000000_0%,_#060BF7_60%)] bg-clip-text">
                {t({ en: "Learn Smarter,", bn: "Learn Smarter," })}
                <br />
                {t({ en: "Not Harder", bn: "Not Harder" })}
              </h1>
              <p className="animate-hero-up-delay-1 mt-4 text-sm leading-relaxed text-black sm:text-base lg:text-lg">
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

function CallToAction({ t }: { t: Translate }) {
  return (
    <Section className="pb-12 sm:pb-16">
      <div className="relative mx-auto max-w-4xl rounded-3xl bg-white px-6 py-8 shadow-sm sm:px-8 sm:py-10">
        <p className="text-base font-semibold text-black/60 sm:text-lg">
          {t({ en: "Message Homeschool AI", bn: "Message Homeschool AI" })}
        </p>
        <div className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-xl bg-[linear-gradient(180deg,_#060BF7_0%,_#3B94DE_70%)] sm:right-6 sm:h-14 sm:w-14">
          <img src="/figma/icon-arrow.svg" alt="" className="h-6 w-6" aria-hidden="true" />
        </div>
      </div>
    </Section>
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
      <div className="bg-[linear-gradient(180deg,#FFFFFF_0%,#85B2F5_100%)]">
        <HeroSection t={t} />
        <FeatureSection />
        <CallToAction t={t} />
        <SubjectsSection t={t} />
      </div>
    </MarketingShell>
  );
}
