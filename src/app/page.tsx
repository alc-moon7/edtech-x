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
          <img
            src="/figma/hero-wave.svg"
            alt=""
            className="pointer-events-none absolute left-0 top-0 z-0 w-full -translate-y-[1px] rotate-180"
            aria-hidden="true"
          />
          <img
            src="/figma/hero-wave.svg"
            alt=""
            className="pointer-events-none absolute bottom-0 left-0 z-0 w-full translate-y-[1px]"
            aria-hidden="true"
          />
          <div className="relative z-10 mx-auto flex w-full max-w-[1728px] flex-col gap-10 px-4 pb-[180px] pt-[110px] sm:gap-12 sm:px-8 sm:pb-[210px] sm:pt-[140px] lg:flex-row lg:items-start lg:gap-[96px] lg:px-10 lg:pb-[240px] lg:pt-[180px] xl:gap-[120px] xl:px-[96px] xl:pb-[260px] xl:pt-[220px] 2xl:gap-[160px] 2xl:pb-[300px] 2xl:pt-[275px] 2xl:pl-[125px] 2xl:pr-[210px]">
            <div className="max-w-[640px] text-center lg:text-left xl:max-w-[700px] 2xl:max-w-[740px] animate-hero-up">
              <h1 className="text-[32px] font-bold leading-[1.08] text-transparent sm:text-[40px] md:text-[52px] lg:text-[64px] lg:leading-[80px] xl:text-[72px] xl:leading-[100px] 2xl:text-[80px] 2xl:leading-[116px] bg-[linear-gradient(180deg,_#000000_0%,_#060BF7_60%)] bg-clip-text">
                {t({ en: "Learn Smarter,", bn: "Learn Smarter," })}
                <br />
                {t({ en: "Not Harder", bn: "Not Harder" })}
              </h1>
              <p className="mx-auto mt-5 max-w-[520px] text-[14px] leading-[20px] text-black sm:mt-6 sm:max-w-[560px] sm:text-[15px] sm:leading-[22px] md:text-[16px] md:leading-[24px] lg:mx-0 lg:max-w-[620px] lg:text-[17px] lg:leading-[26px] xl:max-w-[700px] xl:text-[18px] xl:leading-[28px] 2xl:max-w-[802px] 2xl:text-[18px] 2xl:leading-[29px] animate-hero-up-delay-1">
                {t({
                  en: "HomeSchool turns study time into a clear journey with lessons, quizzes, and progress insights for students, parents, and schools.",
                  bn: "HomeSchool turns study time into a clear journey with lessons, quizzes, and progress insights for students, parents, and schools.",
                })}
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3 sm:mt-9 sm:gap-4 lg:justify-start lg:gap-6 animate-hero-up-delay-2">
                <Link to="/signup" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="h-[44px] w-full rounded-[24px] bg-[#060BF7] px-5 text-[14px] font-bold text-white shadow-none hover:bg-[#060BF7]/90 sm:h-[46px] sm:w-auto sm:px-6 sm:text-[14px] lg:h-[48px] lg:px-6 lg:text-[15px] xl:h-[52px] xl:px-7 xl:text-[16px] 2xl:h-[58px] 2xl:px-8 2xl:text-[16px]"
                  >
                    {t({ en: "Start Learning Free", bn: "Start Learning Free" })}
                  </Button>
                </Link>
                <Link to="/pricing" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="h-[44px] w-full rounded-[24px] bg-[#F3AB36] px-5 text-[14px] font-bold text-black shadow-none hover:bg-[#f0a529] sm:h-[46px] sm:w-auto sm:px-6 sm:text-[14px] lg:h-[48px] lg:px-6 lg:text-[15px] xl:h-[52px] xl:px-7 xl:text-[16px] 2xl:h-[58px] 2xl:px-8 2xl:text-[16px]"
                  >
                    {t({ en: "Try Homeschool AI Tutor", bn: "Try Homeschool AI Tutor" })}
                  </Button>
                </Link>
              </div>
              <div className="mt-7 flex flex-wrap justify-center gap-8 text-center sm:mt-9 sm:gap-10 lg:justify-start lg:gap-12 lg:text-left xl:gap-14 2xl:gap-16 animate-hero-up-delay-2">
                {heroStats.map((stat) => (
                  <div key={stat.value} className="min-w-[120px]">
                    <div className="text-[18px] font-bold leading-[24px] text-black sm:text-[20px] sm:leading-[26px] lg:text-[22px] lg:leading-[30px] xl:text-[24px] xl:leading-[32px]">
                      {stat.value}
                    </div>
                    <div className="text-[12px] font-semibold text-black sm:text-[13px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px]">
                      {t(stat.label)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[360px] sm:max-w-[420px] md:max-w-[460px] lg:mx-0 lg:max-w-[520px] lg:pt-2 xl:pt-4">
              <div className="relative w-full max-w-[320px] sm:max-w-[380px] md:max-w-[430px] lg:max-w-[460px] xl:max-w-[495px]">
                <img
                  src="/figma/hero-illustration.png"
                  alt={t({ en: "Student learning illustration", bn: "Student learning illustration" })}
                  className="w-full"
                  loading="eager"
                />

                {heroBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="absolute hidden h-[69px] w-[227px] rounded-[24px] bg-[#9FB7DD] px-4 text-center text-[14px] font-bold leading-[20px] text-black shadow-[0_12px_24px_rgba(15,23,42,0.18)] backdrop-blur-[12px] xl:flex xl:flex-col xl:items-center xl:justify-center"
                    style={{ left: badge.left, top: badge.top }}
                  >
                    <div>{t(badge.title)}</div>
                    {badge.subtitle && <div className="text-[13px] font-normal leading-[18px]">{t(badge.subtitle)}</div>}
                  </div>
                ))}

                <div className="absolute hidden xl:block" style={{ left: "553px", top: "337px" }}>
                  <div className="relative flex h-[86px] w-[84px] items-center justify-center rounded-full bg-white shadow-[0_12px_24px_rgba(15,23,42,0.16)]">
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
                    className="rounded-[20px] bg-[#9FB7DD] px-3 py-2 text-center text-[12px] font-bold text-black shadow-[0_12px_30px_rgba(15,23,42,0.2)] sm:px-4 sm:py-3 sm:text-[14px]"
                  >
                    <div>{t(badge.title)}</div>
                    {badge.subtitle && <div className="font-normal">{t(badge.subtitle)}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </section>

        <section id="features" className="mx-auto w-full max-w-[1728px] px-4 pb-[60px] pt-[80px] sm:px-8 sm:pb-[80px] sm:pt-[110px] lg:pt-[130px] xl:px-[96px] 2xl:px-[125px]">
          <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-y-5 sm:gap-y-7 lg:grid-cols-2 lg:gap-x-[72px] xl:max-w-[1120px] xl:gap-x-[120px] 2xl:max-w-[1172px]">
            {featureCards.map((card) => (
              <div className="flex h-[96px] items-center rounded-[16px] bg-white px-4 shadow-[0_12px_24px_rgba(15,23,42,0.08)] sm:h-[112px] sm:px-5 sm:shadow-none lg:h-[124px] lg:px-6" key={card.id}>
                <img src={card.icon} alt="" className="h-14 w-14" aria-hidden="true" />
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1728px] px-4 pb-[90px] sm:px-8 sm:pb-[120px] xl:px-[96px] 2xl:px-[125px]">
          <div
            className="relative mx-auto flex h-[170px] max-w-[1096px] flex-col justify-center bg-white px-5 sm:h-[210px] sm:px-8 lg:h-[228px] lg:px-10"
            style={{ borderRadius: "45px 16px 55px 16px" }}
          >
            <p className="text-[18px] font-bold leading-[24px] text-black/50 sm:text-[22px] sm:leading-[28px] lg:text-[24px] lg:leading-[29px]">
              {t({ en: "Message Homeschool AI", bn: "Message Homeschool AI" })}
            </p>
            <div className="absolute right-4 top-1/2 flex h-[62px] w-[64px] -translate-y-1/2 items-center justify-center rounded-[14px] bg-[linear-gradient(180deg,_#060BF7_0%,_#3B94DE_70%)] sm:-right-[12px] sm:h-[72px] sm:w-[76px] lg:h-[78px] lg:w-[81px] lg:rounded-[16px]">
              <img src="/figma/icon-arrow.svg" alt="" className="h-9 w-9" aria-hidden="true" />
            </div>
          </div>
        </section>

        <section id="reviews" className="relative mx-auto w-full max-w-[1728px] px-4 pb-[120px] sm:px-8 sm:pb-[150px] xl:px-[96px] 2xl:px-[125px]">
          <span id="subjects" className="absolute -top-24" aria-hidden="true" />
          <div className="text-center">
            <h2 className="text-[26px] font-bold leading-[34px] text-black sm:text-[32px] sm:leading-[40px] lg:text-[44px] lg:leading-[54px]">
              {t({ en: "Coverage across core subjects", bn: "Coverage across core subjects" })}
            </h2>
            <p className="mt-4 text-[14px] font-light leading-[20px] text-black sm:text-[15px] sm:leading-[22px] lg:text-[18px] lg:leading-[24px]">
              {t({
                en: "Each subject includes lessons, practice, and assessments tailored to the official syllabus.",
                bn: "Each subject includes lessons, practice, and assessments tailored to the official syllabus.",
              })}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 justify-center gap-y-7 md:mt-10 md:grid-cols-3 md:gap-x-12 md:gap-y-10 xl:gap-x-[140px]">
            {subjectColumns.map((column) => (
              <div key={column.id} className="flex flex-col items-center gap-8">
                {column.items.map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    className="w-full max-w-[300px] rounded-[18px] shadow-[0_12px_24px_rgba(15,23,42,0.12)] sm:max-w-[320px] sm:rounded-[20px] md:shadow-none xl:max-w-[342px]"
                    loading="lazy"
                  />
                ))}
              </div>
            ))}
          </div>
        </section>
      </div>
    </MarketingShell>
  );
}
