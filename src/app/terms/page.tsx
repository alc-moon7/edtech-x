import { MarketingShell } from "@/components/MarketingShell";
import { usePageMeta } from "@/lib/usePageMeta";
import { useTranslate } from "@/lib/i18n";

const sections = [
  {
    id: "terms-1",
    title: { en: "Account responsibilities", bn: "অ্যাকাউন্টের দায়িত্ব" },
    content: {
      en: "Users are responsible for maintaining the confidentiality of their account credentials and for all activities under their account.",
      bn: "ব্যবহারকারীরা তাদের অ্যাকাউন্ট তথ্য গোপন রাখা এবং অ্যাকাউন্টের সব কার্যকলাপের জন্য দায়ী।",
    },
  },
  {
    id: "terms-2",
    title: { en: "Acceptable use", bn: "গ্রহণযোগ্য ব্যবহার" },
    content: {
      en: "HomeSchool is intended for educational use only. Users must not misuse the platform or attempt unauthorized access.",
      bn: "HomeSchool শুধুমাত্র শিক্ষামূলক ব্যবহারের জন্য। ব্যবহারকারীরা প্ল্যাটফর্মের অপব্যবহার বা অননুমোদিত প্রবেশের চেষ্টা করতে পারবেন না।",
    },
  },
  {
    id: "terms-3",
    title: { en: "Subscription and billing", bn: "সাবস্ক্রিপশন ও বিলিং" },
    content: {
      en: "Paid plans provide access to premium features. Billing cycles and pricing are shown before purchase and can be canceled at any time.",
      bn: "পেইড প্ল্যানে প্রিমিয়াম ফিচার অ্যাক্সেস পাওয়া যায়। বিলিং সাইকেল ও মূল্য কেনার আগে দেখানো হয় এবং যেকোনো সময় বাতিল করা যায়।",
    },
  },
  {
    id: "terms-4",
    title: { en: "Content availability", bn: "কন্টেন্টের প্রাপ্যতা" },
    content: {
      en: "We work to keep content accurate and available, but availability may change as the syllabus updates.",
      bn: "আমরা কন্টেন্ট সঠিক ও উপলভ্য রাখতে কাজ করি, তবে সিলেবাস আপডেট হলে প্রাপ্যতা বদলাতে পারে।",
    },
  },
  {
    id: "terms-5",
    title: { en: "Support", bn: "সাপোর্ট" },
    content: {
      en: "Support is available during standard business hours. Response times may vary based on plan and request type.",
      bn: "সাপোর্ট স্ট্যান্ডার্ড অফিস সময়ে উপলভ্য। প্ল্যান ও অনুরোধের ধরন অনুযায়ী উত্তর দিতে সময় ভিন্ন হতে পারে।",
    },
  },
];

export default function TermsPage() {
  const t = useTranslate();

  usePageMeta({
    title: t({ en: "Terms of Service", bn: "সেবা শর্তাবলি" }),
    description: t({ en: "Review the HomeSchool terms for account use, subscriptions, and platform access.", bn: "অ্যাকাউন্ট ব্যবহার, সাবস্ক্রিপশন ও প্ল্যাটফর্ম অ্যাক্সেস সম্পর্কে HomeSchool এর শর্তাবলি দেখুন।" }),
  });

  return (
    <MarketingShell>
      <section className="bg-gradient-to-b from-background via-primary/5 to-background py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="text-sm font-semibold uppercase tracking-wider text-primary">{t({ en: "Terms of service", bn: "সেবা শর্তাবলি" })}</div>
          <h1 className="mt-4 text-4xl font-bold font-heading sm:text-5xl">{t({ en: "Using HomeSchool responsibly", bn: "HomeSchool দায়িত্বশীলভাবে ব্যবহার" })}</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t({ en: "These terms explain how the platform should be used by students, parents, and schools.", bn: "এই শর্তাবলি ব্যাখ্যা করে শিক্ষার্থী, অভিভাবক ও স্কুল কীভাবে প্ল্যাটফর্ম ব্যবহার করবে।" })}
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
