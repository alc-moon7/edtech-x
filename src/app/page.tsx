import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { MarketingShell } from "@/components/MarketingShell";
import { usePageMeta } from "@/lib/usePageMeta";
import { useTranslate } from "@/lib/i18n";

const heroBadges = [
  {
    id: "ai-tutor",
    title: { en: "AI Tutor", bn: "AI Tutor" },
    left: "-91px",
    top: "-104px",
  },
  {
    id: "coverage",
    title: { en: "Class 6-8", bn: "Class 6-8" },
    subtitle: { en: "Syllabus Coverage", bn: "Syllabus Coverage" },
    left: "278px",
    top: "-69px",
  },
  {
    id: "roles",
    title: { en: "Student and Parent", bn: "Student and Parent" },
    subtitle: { en: "Learning Roles", bn: "Learning Roles" },
    left: "-124px",
    top: "72px",
  },
  {
    id: "tracking",
    title: { en: "Weekly Tracking", bn: "Weekly Tracking" },
    subtitle: { en: "Progress insights", bn: "Progress insights" },
    left: "451px",
    top: "43px",
  },
];

const featureCards = [
  { id: "card-1", icon: "/figma/icon-calculator.png" },
  { id: "card-2", icon: "/figma/icon-critical-thinking.png" },
  { id: "card-3", icon: "/figma/icon-book.svg" },
  { id: "card-4", icon: "/figma/icon-idea.svg" },
];

const subjectColumns = [
  {
    id: "column-left",
    items: ["/figma/subject-01.png", "/figma/subject-02.png", "/figma/subject-05.png"],
  },
  {
    id: "column-middle",
    items: ["/figma/subject-07.png", "/figma/subject-03.png"],
  },
  {
    id: "column-right",
    items: ["/figma/subject-06.png", "/figma/subject-04.png", "/figma/subject-08.png"],
  },
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
      <div className="bg-[linear-gradient(180deg,#FFFFFF_0%,#85B2F5_100%)]">
        <section id="home" className="relative overflow-hidden">
          <div className="mx-auto flex w-full max-w-[1728px] flex-col gap-16 px-4 pb-[360px] pt-[180px] sm:px-8 lg:flex-row lg:items-start xl:px-[125px]">
            <div className="max-w-[820px] animate-hero-up">
              <h1 className="text-[48px] font-bold leading-[1.1] text-transparent sm:text-[64px] lg:text-[96px] lg:leading-[116px] bg-[linear-gradient(180deg,_#000000_0%,_#060BF7_60%)] bg-clip-text">
                {t({ en: "Learn Smarter,", bn: "Learn Smarter," })}
                <br />
                {t({ en: "Not Harder", bn: "Not Harder" })}
              </h1>
              <p className="mt-6 text-[18px] leading-[26px] text-black sm:text-[20px] lg:text-[24px] lg:leading-[29px] animate-hero-up-delay-1">
                {t({
                  en: "HomeSchool turns study time into a clear journey with lessons, quizzes, and progress insights for students, parents, and schools.",
                  bn: "HomeSchool turns study time into a clear journey with lessons, quizzes, and progress insights for students, parents, and schools.",
                })}
              </p>
              <div className="mt-10 flex flex-wrap gap-6 animate-hero-up-delay-2">
                <Link to="/signup">
                  <Button
                    size="lg"
                    className="h-[50px] rounded-[28px] bg-[#060BF7] px-8 text-[16px] font-bold text-white shadow-none hover:bg-[#060BF7]/90 sm:h-[58px]"
                  >
                    {t({ en: "Start Learning Free", bn: "Start Learning Free" })}
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button
                    size="lg"
                    className="h-[50px] rounded-[28px] bg-[#F3AB36] px-8 text-[16px] font-bold text-black shadow-none hover:bg-[#f0a529] sm:h-[58px]"
                  >
                    {t({ en: "Try Homeschool AI Tutor", bn: "Try Homeschool AI Tutor" })}
                  </Button>
                </Link>
              </div>
              <div className="mt-10 text-[24px] font-bold leading-[30px] text-black sm:text-[28px] lg:text-[32px] lg:leading-[39px] animate-hero-up-delay-2">
                <div>2.5K +</div>
                <div>Active Students</div>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[520px] lg:mx-0 lg:pt-6">
              <div className="relative w-full max-w-[495px]">
                <img
                  src="/figma/hero-illustration.png"
                  alt={t({ en: "Student learning illustration", bn: "Student learning illustration" })}
                  className="w-full"
                  loading="eager"
                />

                {heroBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="absolute hidden w-[227px] rounded-[24px] bg-[#9FB7DD] px-4 py-3 text-center text-[14px] font-bold text-black shadow-[0_12px_30px_rgba(15,23,42,0.2)] backdrop-blur-[12px] lg:block"
                    style={{ left: badge.left, top: badge.top }}
                  >
                    <div>{t(badge.title)}</div>
                    {badge.subtitle && <div className="font-normal">{t(badge.subtitle)}</div>}
                  </div>
                ))}

                <div className="absolute hidden lg:block" style={{ left: "553px", top: "337px" }}>
                  <div className="relative flex h-[86px] w-[84px] items-center justify-center rounded-full bg-white">
                    <img
                      src="/figma/hero-chat.png"
                      alt={t({ en: "AI helper", bn: "AI helper" })}
                      className="h-[57px] w-[76px]"
                    />
                    <span className="absolute right-[6px] top-[8px] h-[11px] w-[11px] rounded-full bg-[#66FF00]" />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-3 lg:hidden">
                {heroBadges.map((badge) => (
                  <div
                    key={`${badge.id}-stack`}
                    className="rounded-[24px] bg-[#9FB7DD] px-4 py-3 text-center text-[14px] font-bold text-black shadow-[0_12px_30px_rgba(15,23,42,0.2)]"
                  >
                    <div>{t(badge.title)}</div>
                    {badge.subtitle && <div className="font-normal">{t(badge.subtitle)}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <img
            src="/figma/hero-wave.svg"
            alt=""
            className="pointer-events-none absolute bottom-0 left-0 w-full"
            aria-hidden="true"
          />
        </section>

        <section id="features" className="mx-auto w-full max-w-[1728px] px-4 pb-[80px] pt-[140px] sm:px-8 xl:px-[125px]">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-y-8 lg:grid-cols-2 lg:gap-x-[148px]">
            {featureCards.map((card) => (
              <div key={card.id} className="flex h-[124px] items-center rounded-[16px] bg-white px-6">
                <img src={card.icon} alt="" className="h-14 w-14" aria-hidden="true" />
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1728px] px-4 pb-[120px] sm:px-8 xl:px-[125px]">
          <div
            className="relative mx-auto flex h-[228px] max-w-[1096px] flex-col justify-center bg-white px-10"
            style={{ borderRadius: "45px 16px 55px 16px" }}
          >
            <p className="text-[24px] font-bold leading-[29px] text-black/50">
              {t({ en: "Message Homeschool AI", bn: "Message Homeschool AI" })}
            </p>
            <div className="absolute -right-[12px] top-1/2 flex h-[78px] w-[81px] -translate-y-1/2 items-center justify-center rounded-[16px] bg-[linear-gradient(180deg,_#060BF7_0%,_#3B94DE_70%)]">
              <img src="/figma/icon-arrow.svg" alt="" className="h-9 w-9" aria-hidden="true" />
            </div>
          </div>
        </section>

        <section id="reviews" className="mx-auto w-full max-w-[1728px] px-4 pb-[160px] sm:px-8 xl:px-[125px]">
          <div className="text-center">
            <h2 className="text-[32px] font-bold leading-[40px] text-black sm:text-[40px] lg:text-[48px] lg:leading-[58px]">
              {t({ en: "Coverage across core subjects", bn: "Coverage across core subjects" })}
            </h2>
            <p className="mt-4 text-[16px] font-light leading-[22px] text-black sm:text-[18px] lg:text-[20px] lg:leading-[24px]">
              {t({
                en: "Each subject includes lessons, practice, and assessments tailored to the official syllabus.",
                bn: "Each subject includes lessons, practice, and assessments tailored to the official syllabus.",
              })}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 justify-center gap-y-10 md:grid-cols-3 md:gap-x-[160px]">
            {subjectColumns.map((column) => (
              <div key={column.id} className="flex flex-col items-center gap-8">
                {column.items.map((src) => (
                  <img key={src} src={src} alt="" className="w-full max-w-[342px]" loading="lazy" />
                ))}
              </div>
            ))}
          </div>
        </section>
      </div>
    </MarketingShell>
  );
}
