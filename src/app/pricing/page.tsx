import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MarketingShell } from "@/components/MarketingShell";
import { useAuth } from "@/lib/auth";
import { useStudent } from "@/lib/store";
import { supabase } from "@/lib/supabaseClient";
import { usePageMeta } from "@/lib/usePageMeta";
import { useTranslate } from "@/lib/i18n";
import { startChapterCheckout, startCourseCheckout } from "@/lib/payments";
import { cn } from "@/lib/utils";

const CLASS_ORDER = ["Class 6", "Class 7", "Class 8", "Class 9-10", "Class 11-12", "Admission"];

type ClassRecord = {
  id: string;
  name: string;
  level: string;
};

type SubjectRecord = {
  id: string;
  name: string;
  class_id: string | null;
  class_level: string | null;
  price_full: number | null;
  first_chapter_free: boolean | null;
  free_first_chapter?: boolean | null;
};

type ChapterRecord = {
  id: string;
  subject_id: string | null;
  title: string | null;
  name?: string | null;
  order_no: number;
  is_free: boolean | null;
  price: number | null;
};

type CourseRecord = {
  id: string;
  subject_id: string;
  title: string;
  class_level: string;
};

function formatPrice(price: number | null | undefined) {
  if (!price || price <= 0) return "BDT 0";
  return `BDT ${price}`;
}

function isCoursePurchaseActive(expiresAt?: string | null) {
  if (!expiresAt) return true;
  const expiry = new Date(expiresAt).getTime();
  return Number.isFinite(expiry) && expiry > Date.now();
}

export default function PricingPage() {
  const { user } = useAuth();
  const { purchasedCourses, purchasedChapters } = useStudent();
  const navigate = useNavigate();
  const t = useTranslate();
  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const [subjects, setSubjects] = useState<SubjectRecord[]>([]);
  const [chapters, setChapters] = useState<ChapterRecord[]>([]);
  const [courses, setCourses] = useState<CourseRecord[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  usePageMeta({
    title: t({ en: "Pricing", bn: "Pricing" }),
    description: t({ en: "Buy subjects or chapters. First chapter is free.", bn: "Buy subjects or chapters. First chapter is free." }),
  });

  useEffect(() => {
    let isActive = true;

    const loadCatalog = async () => {
      setLoading(true);
      setError(null);

      const { data: classRows, error: classError } = await supabase
        .from("classes")
        .select("id,name,level")
        .order("name", { ascending: true });

      if (classError) {
        if (isActive) {
          setError(classError.message);
          setLoading(false);
        }
        return;
      }

      const { data: subjectRows, error: subjectError } = await supabase
        .from("subjects")
        .select("id,name,class_id,class_level,price_full,first_chapter_free,free_first_chapter")
        .order("name", { ascending: true });

      if (subjectError) {
        if (isActive) {
          setError(subjectError.message);
          setLoading(false);
        }
        return;
      }

      const { data: chapterRows, error: chapterError } = await supabase
        .from("chapters")
        .select("id,subject_id,title,name,order_no,is_free,price")
        .order("order_no", { ascending: true });

      if (chapterError) {
        if (isActive) {
          setError(chapterError.message);
          setLoading(false);
        }
        return;
      }

      const { data: courseRows, error: courseError } = await supabase
        .from("courses")
        .select("id,subject_id,title,class_level")
        .order("title", { ascending: true });

      if (courseError) {
        if (isActive) {
          setError(courseError.message);
          setLoading(false);
        }
        return;
      }

      if (!isActive) return;

      const sortedClasses = (classRows ?? []).sort((a, b) => {
        const aIndex = CLASS_ORDER.indexOf(a.name);
        const bIndex = CLASS_ORDER.indexOf(b.name);
        if (aIndex === -1 && bIndex === -1) return a.name.localeCompare(b.name);
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      });

      setClasses(sortedClasses);
      setSubjects(subjectRows ?? []);
      setChapters(chapterRows ?? []);
      setCourses(courseRows ?? []);
      setSelectedClassId((prev) => prev || sortedClasses[0]?.id || "");
      setLoading(false);
    };

    void loadCatalog();

    return () => {
      isActive = false;
    };
  }, []);

  const classMap = useMemo(() => new Map(classes.map((item) => [item.id, item])), [classes]);
  const courseBySubject = useMemo(() => {
    const map = new Map<string, CourseRecord>();
    courses.forEach((course) => {
      if (!map.has(course.subject_id)) {
        map.set(course.subject_id, course);
      }
    });
    return map;
  }, [courses]);

  const selectedClass = selectedClassId ? classMap.get(selectedClassId) ?? null : null;
  const filteredSubjects = useMemo(() => {
    if (!selectedClass) return subjects;
    return subjects.filter(
      (subject) => subject.class_id === selectedClass.id || subject.class_level === selectedClass.name
    );
  }, [subjects, selectedClass]);

  const chaptersBySubject = useMemo(() => {
    const map = new Map<string, ChapterRecord[]>();
    chapters.forEach((chapter) => {
      if (!chapter.subject_id) return;
      const list = map.get(chapter.subject_id) ?? [];
      list.push(chapter);
      map.set(chapter.subject_id, list);
    });
    map.forEach((list) => list.sort((a, b) => a.order_no - b.order_no));
    return map;
  }, [chapters]);

  const activePurchases = purchasedCourses.filter((purchase) => isCoursePurchaseActive(purchase.expires_at));
  const purchasedChapterSet = new Set(purchasedChapters.map((item) => item.chapter_id));
  const purchasedCourseSet = new Set(activePurchases.map((item) => item.course_id));

  const handleBuySubject = async (courseId: string, amount: number | null | undefined) => {
    if (!courseId) return;
    if (!user) {
      navigate("/login");
      return;
    }
    if (!amount || amount <= 0) {
      setPaymentError(t({ en: "Subject price is missing.", bn: "Subject price is missing." }));
      return;
    }
    setPaymentError(null);
    setIsPaying(true);
    try {
      await startCourseCheckout(courseId, { planId: "premium", amount });
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : "Payment failed. Please try again.");
      setIsPaying(false);
    }
  };

  const handleBuyChapter = async (chapterId: string, amount: number | null | undefined) => {
    if (!chapterId) return;
    if (!user) {
      navigate("/login");
      return;
    }
    if (!amount || amount <= 0) {
      setPaymentError(t({ en: "Chapter price is missing.", bn: "Chapter price is missing." }));
      return;
    }
    setPaymentError(null);
    setIsPaying(true);
    try {
      await startChapterCheckout(chapterId, { amount });
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : "Payment failed. Please try again.");
      setIsPaying(false);
    }
  };

  return (
    <MarketingShell>
      <section className="bg-gradient-to-b from-background via-primary/5 to-background py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <div className="text-sm font-semibold uppercase tracking-wider text-primary">
            {t({ en: "Pricing", bn: "Pricing" })}
          </div>
          <h1 className="mt-4 text-4xl font-bold font-heading sm:text-5xl">
            {t({ en: "Choose a class, then unlock subjects or chapters", bn: "Choose a class, then unlock subjects or chapters" })}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t({ en: "First chapter is free. Buy a full subject or unlock chapters one by one.", bn: "First chapter is free. Buy a full subject or unlock chapters one by one." })}
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-center gap-3">
            {classes.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedClassId(item.id)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-semibold transition",
                  item.id === selectedClassId
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-blue-200"
                )}
              >
                {t({ en: item.name, bn: item.name })}
              </button>
            ))}
          </div>

          {loading && (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
              {t({ en: "Loading pricing...", bn: "Loading pricing..." })}
            </div>
          )}

          {error && (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
              {error}
            </div>
          )}

          {!loading && !error && filteredSubjects.length === 0 && (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
              {t({ en: "No subjects found for this class yet.", bn: "No subjects found for this class yet." })}
            </div>
          )}

          {!loading && !error && filteredSubjects.length > 0 && (
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {filteredSubjects.map((subject) => {
                const subjectCourse = courseBySubject.get(subject.id);
                const subjectChapters = chaptersBySubject.get(subject.id) ?? [];
                const subjectPrice = subject.price_full ?? 0;
                const subjectFirstFree = subject.first_chapter_free ?? subject.free_first_chapter ?? false;
                const isSubjectPurchased = subjectCourse ? purchasedCourseSet.has(subjectCourse.id) : false;

                return (
                  <div key={subject.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          {t({ en: selectedClass?.name ?? "Class", bn: selectedClass?.name ?? "Class" })}
                        </div>
                        <h3 className="mt-2 text-xl font-semibold text-slate-900">
                          {t({ en: subject.name, bn: subject.name })}
                        </h3>
                        <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                          <span>{t({ en: "Subject price", bn: "Subject price" })}:</span>
                          <span className="font-semibold text-slate-700">{formatPrice(subjectPrice)}</span>
                          {subjectFirstFree && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                              {t({ en: "First chapter free", bn: "First chapter free" })}
                            </span>
                          )}
                        </div>
                      </div>

                      {isSubjectPurchased ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          <CheckCircle2 className="h-4 w-4" />
                          {t({ en: "Unlocked", bn: "Unlocked" })}
                        </span>
                      ) : (
                        <Button
                          onClick={() => handleBuySubject(subjectCourse?.id ?? "", subjectPrice)}
                          disabled={isPaying || !subjectCourse?.id}
                        >
                          {isPaying ? t({ en: "Redirecting...", bn: "Redirecting..." }) : t({ en: "Buy Subject", bn: "Buy Subject" })}
                        </Button>
                      )}
                    </div>

                    <div className="mt-5 space-y-3">
                      {subjectChapters.map((chapter) => {
                        const chapterTitle = chapter.name ?? chapter.title ?? "Chapter";
                        const isFirstChapter = chapter.order_no === 1;
                        const isFree = Boolean(chapter.is_free) || (subjectFirstFree && isFirstChapter);
                        const isUnlocked = isFree || purchasedChapterSet.has(chapter.id) || isSubjectPurchased;
                        const priceLabel = isFree ? t({ en: "FREE", bn: "FREE" }) : formatPrice(chapter.price ?? 0);

                        return (
                          <div key={chapter.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                            <div>
                              <div className="text-sm font-semibold text-slate-800">
                                {t({ en: "Chapter", bn: "Chapter" })} {chapter.order_no}: {chapterTitle}
                              </div>
                              <div className="text-xs text-slate-500">{priceLabel}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              {isUnlocked ? (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                                  <CheckCircle2 className="h-4 w-4" />
                                  {t({ en: "Unlocked", bn: "Unlocked" })}
                                </span>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleBuyChapter(chapter.id, chapter.price ?? 0)}
                                  disabled={isPaying}
                                  className="flex items-center gap-2"
                                >
                                  <Lock className="h-4 w-4" />
                                  {t({ en: "Buy Chapter", bn: "Buy Chapter" })}
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {paymentError && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {paymentError}
            </div>
          )}

          <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            <div className="font-semibold text-slate-800">{t({ en: "How unlocking works", bn: "How unlocking works" })}</div>
            <ul className="mt-3 space-y-2">
              <li>• {t({ en: "Free chapters are always unlocked.", bn: "Free chapters are always unlocked." })}</li>
              <li>• {t({ en: "Buying a subject unlocks all its chapters.", bn: "Buying a subject unlocks all its chapters." })}</li>
              <li>• {t({ en: "Buying a chapter unlocks only that chapter.", bn: "Buying a chapter unlocks only that chapter." })}</li>
            </ul>
            {!user && (
              <div className="mt-4">
                <Link to="/login" className="text-sm font-semibold text-blue-600 hover:underline">
                  {t({ en: "Sign in to purchase", bn: "Sign in to purchase" })}
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
