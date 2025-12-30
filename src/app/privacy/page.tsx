import { MarketingShell } from "@/components/MarketingShell";
import { usePageMeta } from "@/lib/usePageMeta";
import { useTranslate } from "@/lib/i18n";

const sections = [
  {
    id: "privacy-1",
    title: { en: "Information we collect", bn: "যে তথ্য আমরা সংগ্রহ করি" },
    content: {
      en: "We collect account information, class selection, and learning activity data required to deliver lessons, quizzes, and analytics.",
      bn: "লেসন, কুইজ ও অ্যানালিটিক্স দিতে আমরা অ্যাকাউন্ট তথ্য, ক্লাস নির্বাচন ও শেখার কার্যক্রমের ডেটা সংগ্রহ করি।",
    },
  },
  {
    id: "privacy-2",
    title: { en: "How we use information", bn: "তথ্য আমরা কীভাবে ব্যবহার করি" },
    content: {
      en: "Data is used to personalize learning, generate progress reports, and improve the platform. We do not sell student data.",
      bn: "ডেটা ব্যবহার হয় ব্যক্তিগতকৃত শেখা, অগ্রগতি রিপোর্ট তৈরি এবং প্ল্যাটফর্ম উন্নত করতে। আমরা শিক্ষার্থীর ডেটা বিক্রি করি না।",
    },
  },
  {
    id: "privacy-3",
    title: { en: "Parent visibility", bn: "অভিভাবক ভিজিবিলিটি" },
    content: {
      en: "Parents can view linked student progress, scores, and study time. Parents cannot edit student responses or scores.",
      bn: "অভিভাবকরা যুক্ত শিক্ষার্থীর অগ্রগতি, স্কোর ও পড়ার সময় দেখতে পারেন। তারা শিক্ষার্থীর উত্তর বা স্কোর পরিবর্তন করতে পারেন না।",
    },
  },
  {
    id: "privacy-4",
    title: { en: "Data protection", bn: "ডেটা সুরক্ষা" },
    content: {
      en: "We apply security controls to protect accounts and learning data. Access is limited to authorized roles only.",
      bn: "অ্যাকাউন্ট ও শেখার ডেটা সুরক্ষায় আমরা নিরাপত্তা নিয়ন্ত্রণ প্রয়োগ করি। প্রবেশাধিকার কেবল অনুমোদিত ভূমিকায় সীমিত।",
    },
  },
  {
    id: "privacy-5",
    title: { en: "Contact and updates", bn: "যোগাযোগ ও আপডেট" },
    content: {
      en: "If you have questions about privacy, contact support@homeschool.bd. We may update this policy and will post changes here.",
      bn: "গোপনীয়তা সম্পর্কে প্রশ্ন থাকলে support@homeschool.bd এ যোগাযোগ করুন। আমরা এই নীতি আপডেট করতে পারি এবং পরিবর্তন এখানে জানাব।",
    },
  },
];

export default function PrivacyPage() {
  const t = useTranslate();

  usePageMeta({
    title: t({ en: "Privacy Policy", bn: "গোপনীয়তা নীতি" }),
    description: t({ en: "Read how HomeSchool collects, uses, and protects student data.", bn: "HomeSchool কীভাবে শিক্ষার্থীর ডেটা সংগ্রহ, ব্যবহার ও সুরক্ষা করে তা পড়ুন।" }),
  });

  return (
    <MarketingShell>
      <section className="bg-gradient-to-b from-background via-primary/5 to-background py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="text-sm font-semibold uppercase tracking-wider text-primary">{t({ en: "Privacy policy", bn: "গোপনীয়তা নীতি" })}</div>
          <h1 className="mt-4 text-4xl font-bold font-heading sm:text-5xl">{t({ en: "Your data, protected", bn: "আপনার ডেটা, সুরক্ষিত" })}</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t({ en: "We collect only what we need to provide structured learning and progress analytics.", bn: "গঠিত শেখা ও অগ্রগতি অ্যানালিটিক্স দিতে আমরা কেবল প্রয়োজনীয় তথ্যই সংগ্রহ করি।" })}
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl space-y-6 px-4">
          {sections.map((section) => (
            <div key={section.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold">{t(section.title)}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{t(section.content)}</p>
            </div>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
