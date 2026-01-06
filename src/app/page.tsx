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
          <div className="mx-auto flex w-full max-w-[1728px] flex-col gap-12 px-4 pb-[220px] pt-[120px] sm:gap-14 sm:px-8 sm:pb-[260px] sm:pt-[140px] lg:flex-row lg:items-start lg:gap-16 lg:px-12 lg:pb-[360px] lg:pt-[180px] xl:px-[125px]">
            <div className="max-w-[820px] animate-hero-up">
              <h1 className="text-[40px] font-bold leading-[1.1] text-transparent sm:text-[48px] md:text-[64px] lg:text-[96px] lg:leading-[116px] bg-[linear-gradient(180deg,_#000000_0%,_#060BF7_60%)] bg-clip-text">
                {t({ en: "Learn Smarter,", bn: "Learn Smarter," })}
                <br />
                {t({ en: "Not Harder", bn: "Not Harder" })}
              </h1>
              <p className="mt-6 text-[16px] leading-[24px] text-black sm:text-[18px] sm:leading-[26px] lg:text-[24px] lg:leading-[29px] animate-hero-up-delay-1">
                {t({
                  en: "HomeSchool turns study time into a clear journey with lessons, quizzes, and progress insights for students, parents, and schools.",
                  bn: "HomeSchool turns study time into a clear journey with lessons, quizzes, and progress insights for students, parents, and schools.",
                })}
              </p>
              <div className="mt-8 flex flex-wrap gap-4 sm:mt-10 sm:gap-6 animate-hero-up-delay-2">
                <Link to="/signup">
                  <Button
                    size="lg"
                    className="h-[46px] rounded-[28px] bg-[#060BF7] px-6 text-[14px] font-bold text-white shadow-none hover:bg-[#060BF7]/90 sm:h-[50px] sm:px-7 sm:text-[16px] lg:h-[58px] lg:px-8"
                  >
                    {t({ en: "Start Learning Free", bn: "Start Learning Free" })}
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button
                    size="lg"
                    className="h-[46px] rounded-[28px] bg-[#F3AB36] px-6 text-[14px] font-bold text-black shadow-none hover:bg-[#f0a529] sm:h-[50px] sm:px-7 sm:text-[16px] lg:h-[58px] lg:px-8"
                  >
                    {t({ en: "Try Homeschool AI Tutor", bn: "Try Homeschool AI Tutor" })}
                  </Button>
                </Link>
              </div>
              <div className="mt-8 text-[20px] font-bold leading-[26px] text-black sm:mt-10 sm:text-[24px] sm:leading-[30px] lg:text-[32px] lg:leading-[39px] animate-hero-up-delay-2">
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
                    className="absolute hidden w-[227px] rounded-[24px] bg-[#9FB7DD] px-4 py-3 text-center text-[14px] font-bold text-black shadow-[0_12px_30px_rgba(15,23,42,0.2)] backdrop-blur-[12px] xl:block"
                    style={{ left: badge.left, top: badge.top }}
                  >
                    <div>{t(badge.title)}</div>
                    {badge.subtitle && <div className="font-normal">{t(badge.subtitle)}</div>}
                  </div>
                ))}

                <div className="absolute hidden xl:block" style={{ left: "553px", top: "337px" }}>
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

              <div className="mt-8 flex flex-wrap justify-center gap-3 xl:hidden">
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

        <section id="features" className="mx-auto w-full max-w-[1728px] px-4 pb-[60px] pt-[90px] sm:px-8 sm:pb-[80px] sm:pt-[120px] lg:pt-[140px] xl:px-[125px]">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-y-6 sm:gap-y-8 lg:grid-cols-2 lg:gap-x-[96px] xl:gap-x-[148px]">
            {featureCards.map((card) => (
              <div key={card.id} className="flex h-[110px] items-center rounded-[16px] bg-white px-5 sm:h-[124px] sm:px-6">
                <img src={card.icon} alt="" className="h-14 w-14" aria-hidden="true" />
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1728px] px-4 pb-[100px] sm:px-8 sm:pb-[120px] xl:px-[125px]">
          <div
            className="relative mx-auto flex h-[180px] max-w-[1096px] flex-col justify-center bg-white px-6 sm:h-[228px] sm:px-10"
            style={{ borderRadius: "45px 16px 55px 16px" }}
          >
            <p className="text-[20px] font-bold leading-[26px] text-black/50 sm:text-[24px] sm:leading-[29px]">
              {t({ en: "Message Homeschool AI", bn: "Message Homeschool AI" })}
            </p>
            <div className="absolute right-4 top-1/2 flex h-[68px] w-[70px] -translate-y-1/2 items-center justify-center rounded-[16px] bg-[linear-gradient(180deg,_#060BF7_0%,_#3B94DE_70%)] sm:-right-[12px] sm:h-[78px] sm:w-[81px]">
              <img src="/figma/icon-arrow.svg" alt="" className="h-9 w-9" aria-hidden="true" />
            </div>
          </div>
        </section>

        <section id="reviews" className="mx-auto w-full max-w-[1728px] px-4 pb-[140px] sm:px-8 sm:pb-[160px] xl:px-[125px]">
          <div className="text-center">
            <h2 className="text-[28px] font-bold leading-[36px] text-black sm:text-[36px] sm:leading-[44px] lg:text-[48px] lg:leading-[58px]">
              {t({ en: "Coverage across core subjects", bn: "Coverage across core subjects" })}
            </h2>
            <p className="mt-4 text-[14px] font-light leading-[20px] text-black sm:text-[16px] sm:leading-[22px] lg:text-[20px] lg:leading-[24px]">
              {t({
                en: "Each subject includes lessons, practice, and assessments tailored to the official syllabus.",
                bn: "Each subject includes lessons, practice, and assessments tailored to the official syllabus.",
              })}
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 justify-center gap-y-8 md:mt-12 md:grid-cols-3 md:gap-x-16 md:gap-y-10 xl:gap-x-[160px]">
            {subjectColumns.map((column) => (
              <div key={column.id} className="flex flex-col items-center gap-8">
                {column.items.map((src) => (
                  <img key={src} src={src} alt="" className="w-full max-w-[320px] sm:max-w-[342px]" loading="lazy" />
                ))}
              </div>
            ))}
          </div>
        </section>
      </div>
    </MarketingShell>
  );
}
