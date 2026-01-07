import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";
import { useTranslate } from "@/lib/i18n";

export function Footer() {
  const t = useTranslate();

  return (
    <footer className="bg-[#f2f5fb] text-slate-700">
      <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="HomeSchool" className="h-10 w-auto" loading="lazy" />
            </Link>
            <p className="text-sm leading-relaxed">
              {t({
                en: "Interactive learning built for the NCTB syllabus with clear progress tracking for students and parents.",
                bn: "শিক্ষার্থী ও অভিভাবকদের জন্য স্পষ্ট অগ্রগতি ট্র্যাকিংসহ NCTB সিলেবাস অনুযায়ী ইন্টারঅ্যাকটিভ শেখা।",
              })}
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#1c75d8]" aria-hidden="true" />
                <a href="mailto:alc.moon@hotmail.com" className="hover:text-[#1c75d8]">
                  alc.moon@hotmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#1c75d8]" aria-hidden="true" />
                <span>{t({ en: "Rajshahi, Bangladesh", bn: "রাজশাহী, বাংলাদেশ" })}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <h3 className="font-semibold text-slate-900">{t({ en: "Platform", bn: "প্ল্যাটফর্ম" })}</h3>
            <div className="flex flex-col gap-2">
              <Link to="/courses" className="hover:text-[#1c75d8]">{t({ en: "Courses", bn: "কোর্সসমূহ" })}</Link>
              <Link to="/dashboard" className="hover:text-[#1c75d8]">{t({ en: "Student Dashboard", bn: "শিক্ষার্থী ড্যাশবোর্ড" })}</Link>
              <Link to="/parent" className="hover:text-[#1c75d8]">{t({ en: "Parent View", bn: "অভিভাবক ভিউ" })}</Link>
              <Link to="/help" className="hover:text-[#1c75d8]">{t({ en: "Help Center", bn: "সহায়তা কেন্দ্র" })}</Link>
              <Link to="/team" className="hover:text-[#1c75d8]">{t({ en: "Our Team", bn: "আমাদের দল" })}</Link>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <h3 className="font-semibold text-slate-900">{t({ en: "Company", bn: "প্রতিষ্ঠান" })}</h3>
            <div className="flex flex-col gap-2">
              <Link to="/about" className="hover:text-[#1c75d8]">{t({ en: "About", bn: "আমাদের সম্পর্কে" })}</Link>
              <Link to="/pricing" className="hover:text-[#1c75d8]">{t({ en: "Pricing", bn: "মূল্য" })}</Link>
              <Link to="/contact" className="hover:text-[#1c75d8]">{t({ en: "Contact", bn: "যোগাযোগ" })}</Link>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <h3 className="font-semibold text-slate-900">{t({ en: "Legal", bn: "আইনি" })}</h3>
            <div className="flex flex-col gap-2">
              <Link to="/privacy" className="hover:text-[#1c75d8]">{t({ en: "Privacy Policy", bn: "গোপনীয়তা নীতি" })}</Link>
              <Link to="/terms" className="hover:text-[#1c75d8]">{t({ en: "Terms of Service", bn: "সেবা শর্তাবলি" })}</Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-5">
          <div className="flex flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>{t({ en: "© 2025 HomeSchool. All rights reserved.", bn: "© ২০২৫ HomeSchool. সর্বস্বত্ব সংরক্ষিত।" })}</p>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="hover:text-[#1c75d8]">{t({ en: "Privacy", bn: "গোপনীয়তা" })}</Link>
              <Link to="/terms" className="hover:text-[#1c75d8]">{t({ en: "Terms", bn: "শর্তাবলি" })}</Link>
              <Link to="/contact" className="hover:text-[#1c75d8]">{t({ en: "Contact", bn: "যোগাযোগ" })}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
