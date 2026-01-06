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
          <div className="mx-auto flex w-full max-w-[1728px] flex-col gap-10 px-4 pb-[200px] pt-[96px] sm:gap-12 sm:px-8 sm:pb-[240px] sm:pt-[120px] lg:flex-row lg:items-start lg:gap-14 lg:px-12 lg:pb-[320px] lg:pt-[160px] xl:px-[125px]">
            <div className="max-w-[820px] text-center lg:text-left animate-hero-up">
              <h1 className="text-[32px] font-bold leading-[1.08] text-transparent sm:text-[40px] md:text-[56px] lg:text-[76px] lg:leading-[92px] xl:text-[88px] bg-[linear-gradient(180deg,_#000000_0%,_#060BF7_60%)] bg-clip-text">
                {t({ en: "Learn Smarter,", bn: "Learn Smarter," })}
                <br />
                {t({ en: "Not Harder", bn: "Not Harder" })}
              </h1>
              <p className="mt-5 text-[15px] leading-[22px] text-black sm:mt-6 sm:text-[17px] sm:leading-[25px] lg:text-[20px] lg:leading-[28px] animate-hero-up-delay-1">
                {t({
                  en: "HomeSchool turns study time into a clear journey with lessons, quizzes, and progress insights for students, parents, and schools.",
                  bn: "HomeSchool turns study time into a clear journey with lessons, quizzes, and progress insights for students, parents, and schools.",
                })}
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3 sm:mt-9 sm:gap-4 lg:justify-start lg:gap-6 animate-hero-up-delay-2">
                <Link to="/signup">
                  <Button
                    size="lg"
                    className="h-[44px] rounded-[24px] bg-[#060BF7] px-5 text-[14px] font-bold text-white shadow-none hover:bg-[#060BF7]/90 sm:h-[48px] sm:px-6 sm:text-[15px] lg:h-[54px] lg:px-7 lg:text-[16px]"
                  >
                    {t({ en: "Start Learning Free", bn: "Start Learning Free" })}
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button
                    size="lg"
                    className="h-[44px] rounded-[24px] bg-[#F3AB36] px-5 text-[14px] font-bold text-black shadow-none hover:bg-[#f0a529] sm:h-[48px] sm:px-6 sm:text-[15px] lg:h-[54px] lg:px-7 lg:text-[16px]"
                  >
                    {t({ en: "Try Homeschool AI Tutor", bn: "Try Homeschool AI Tutor" })}
                  </Button>
                </Link>
              </div>
              <div className="mt-7 text-[18px] font-bold leading-[24px] text-black sm:mt-9 sm:text-[22px] sm:leading-[28px] lg:text-[28px] lg:leading-[34px] animate-hero-up-delay-2">
                <div>2.5K +</div>
                <div>Active Students</div>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[480px] lg:mx-0 lg:max-w-[520px] lg:pt-4 xl:pt-6">
              <div className="relative w-full max-w-[460px] lg:max-w-[495px]">
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
                    className="rounded-[20px] bg-[#9FB7DD] px-3 py-2 text-center text-[12px] font-bold text-black shadow-[0_12px_30px_rgba(15,23,42,0.2)] sm:px-4 sm:py-3 sm:text-[14px]"
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

        <section id="features" className="mx-auto w-full max-w-[1728px] px-4 pb-[60px] pt-[80px] sm:px-8 sm:pb-[80px] sm:pt-[110px] lg:pt-[130px] xl:px-[125px]">
          <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-y-5 sm:gap-y-7 lg:grid-cols-2 lg:gap-x-[72px] xl:max-w-[1200px] xl:gap-x-[120px]">
            {featureCards.map((card) => (
              <div key={card.id} className="flex h-[96px] items-center rounded-[16px] bg-white px-4 sm:h-[112px] sm:px-5 lg:h-[124px] lg:px-6">
                <img src={card.icon} alt="" className="h-14 w-14" aria-hidden="true" />
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1728px] px-4 pb-[90px] sm:px-8 sm:pb-[120px] xl:px-[125px]">
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

        <section id="reviews" className="mx-auto w-full max-w-[1728px] px-4 pb-[120px] sm:px-8 sm:pb-[150px] xl:px-[125px]">
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
