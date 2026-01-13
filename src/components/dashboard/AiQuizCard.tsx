"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { useStudent } from "@/lib/store";
import { useLanguage, useTranslate } from "@/lib/i18n";
import { invokeEdgeFunction, supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/Button";
import { QuizComponent, type QuizQuestion } from "@/components/learning/QuizComponent";
import { startChapterCheckout, startCourseCheckout } from "@/lib/payments";

const DEFAULT_HOME_CLASS = "Class 9-10";

type AiQuizCardProps = {
    context?: "dashboard" | "home";
};

export function AiQuizCard({ context = "dashboard" }: AiQuizCardProps) {
    const { courses } = useStudent();
    const { language } = useLanguage();
    const t = useTranslate();
    const isHome = context === "home";
    const [availableClasses, setAvailableClasses] = useState<string[]>([]);

    const derivedClasses = useMemo(() => {
        const unique = new Set<string>();
        courses.forEach((course) => {
            if (course.class) {
                unique.add(course.class);
            }
        });
        return Array.from(unique);
    }, [courses]);

    useEffect(() => {
        if (!isHome) return;
        let isActive = true;

        const loadClasses = async () => {
            const classOrder = ["Class 6", "Class 7", "Class 8", "Class 9-10", "Class 11-12"];
            const { data } = await supabase
                .from("classes")
                .select("name,level")
                .in("level", ["school", "ssc", "hsc"])
                .order("name", { ascending: true });
            if (!isActive) return;
            const sorted = (data ?? []).sort((a, b) => {
                const aIndex = classOrder.indexOf(a.name);
                const bIndex = classOrder.indexOf(b.name);
                if (aIndex === -1 && bIndex === -1) {
                    return a.name.localeCompare(b.name);
                }
                if (aIndex === -1) return 1;
                if (bIndex === -1) return -1;
                return aIndex - bIndex;
            });
            setAvailableClasses(sorted.map((item) => item.name));
        };

        void loadClasses();

        return () => {
            isActive = false;
        };
    }, [isHome]);

    const classOptions = useMemo(
        () =>
            isHome
                ? (derivedClasses.length ? derivedClasses : availableClasses)
                : derivedClasses,
        [isHome, availableClasses, derivedClasses]
    );

    const [classLevel, setClassLevel] = useState(() =>
        isHome ? DEFAULT_HOME_CLASS : derivedClasses[0] ?? ""
    );
    const [courseId, setCourseId] = useState(() => courses[0]?.id ?? "");
    const [chapterId, setChapterId] = useState("");
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [isPaying, setIsPaying] = useState(false);

    useEffect(() => {
        if (classOptions.length && (!classLevel || !classOptions.includes(classLevel))) {
            const fallback = classOptions.includes(DEFAULT_HOME_CLASS)
                ? DEFAULT_HOME_CLASS
                : classOptions[0];
            setClassLevel(fallback);
        }
    }, [classLevel, classOptions]);

    const filteredCourses = useMemo(() => {
        if (!classLevel) return courses;
        const matches = courses.filter((course) => course.class === classLevel);
        return matches.length ? matches : courses;
    }, [courses, classLevel]);

    const courseOptions = isHome ? filteredCourses : courses;

    useEffect(() => {
        if (!courseOptions.length) return;
        if (!courseId || !courseOptions.some((course) => course.id === courseId)) {
            setCourseId(courseOptions[0].id);
            setChapterId("");
            setQuestions(null);
        }
    }, [courseOptions, courseId]);
    const selectedCourse = useMemo(
        () => courseOptions.find((course) => course.id === courseId) ?? courseOptions[0] ?? null,
        [courseOptions, courseId]
    );
    const chapters = selectedCourse?.chapters ?? [];
    const selectedChapter = chapters.find((chapter) => chapter.id === chapterId) ?? chapters[0];
    const quizLessonId =
        selectedChapter?.lessons.find((lesson) => lesson.type === "quiz")?.id ??
        selectedChapter?.lessons[0]?.id;
    const isChapterUnlocked =
        Boolean(selectedChapter?.isFree) ||
        Boolean(selectedChapter?.isPurchased) ||
        Boolean(selectedCourse?.isPurchased) ||
        Boolean(selectedCourse?.isFree);

    useEffect(() => {
        if (!chapterId && selectedChapter?.id) {
            setChapterId(selectedChapter.id);
        }
    }, [chapterId, selectedChapter]);

    useEffect(() => {
        setQuestions(null);
    }, [language]);

    const handleGenerate = async () => {
        if (!selectedCourse || !selectedChapter) {
            setError(t({ en: "Select a class, subject, and chapter first.", bn: "প্রথমে ক্লাস, বিষয় ও অধ্যায় নির্বাচন করুন।" }));
            return;
        }
        if (!isChapterUnlocked) {
            setError(t({ en: "Chapter locked. Buy to continue.", bn: "চ্যাপ্টার লক করা আছে। কিনে চালু করুন।" }));
            return;
        }
        setLoading(true);
        setError(null);
        setPaymentError(null);

        const resolvedClassLevel = isHome ? classLevel : selectedCourse.class ?? classLevel;
        const { data, error: fnError } = await invokeEdgeFunction<{ questions?: QuizQuestion[] }>("generate-quiz", {
            subject: selectedCourse.title,
            chapter: selectedChapter.title,
            classLevel: resolvedClassLevel,
            language,
            count: 10,
            difficulty: "medium",
            chapterId: selectedChapter.id,
            courseId: selectedCourse.id,
        });

        if (fnError) {
            const message =
                (fnError as { error?: string }).error ??
                t({ en: "Quiz generation failed. Please try again.", bn: "Quiz generation failed. Please try again." });
            setError(message);
            setLoading(false);
            return;
        }

        if (!data?.questions?.length) {
            setError(t({ en: "No questions returned. Try again.", bn: "কোনো প্রশ্ন পাওয়া যায়নি। আবার চেষ্টা করুন।" }));
            setLoading(false);
            return;
        }

        setQuestions(data.questions as QuizQuestion[]);
        setLoading(false);
    };

    const handleReset = () => {
        setQuestions(null);
    };

    const handleBuyChapter = async () => {
        if (!selectedChapter || selectedChapter.isFree) return;
        setIsPaying(true);
        setPaymentError(null);
        try {
            await startChapterCheckout(selectedChapter.id, {
                amount: selectedChapter.price ?? undefined,
            });
        } catch (err) {
            setPaymentError(err instanceof Error ? err.message : "Payment failed. Please try again.");
            setIsPaying(false);
        }
    };

    const handleBuySubject = async () => {
        if (!selectedCourse) return;
        setIsPaying(true);
        setPaymentError(null);
        try {
            await startCourseCheckout(selectedCourse.id, {
                planId: "premium",
                amount: selectedCourse.priceFull ?? undefined,
            });
        } catch (err) {
            setPaymentError(err instanceof Error ? err.message : "Payment failed. Please try again.");
            setIsPaying(false);
        }
    };

    const selectionGridClass = isHome
        ? "mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        : "mt-5 grid gap-4 sm:grid-cols-2";

    const cardClass = isHome
        ? "relative overflow-hidden rounded-2xl border border-primary/20 bg-card/95 p-6 shadow-lg ring-1 ring-primary/10 backdrop-blur transition-shadow hover:shadow-xl"
        : "relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm";

    return (
        <div className={cardClass}>
            {isHome && (
                <>
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/40 via-secondary/40 to-primary/40" />
                    <div className="pointer-events-none absolute -right-20 -top-16 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-20 left-10 h-32 w-32 rounded-full bg-secondary/20 blur-3xl" />
                </>
            )}
            <div className="relative z-10">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        {t({ en: "AI Quiz Generator", bn: "এআই কুইজ জেনারেটর" })}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {t({
                            en: "Generate chapter-specific MCQs on demand aligned with the NCTB syllabus.",
                            bn: "NCTB সিলেবাস অনুযায়ী অধ্যায়ভিত্তিক অন-ডিমান্ড MCQ তৈরি করুন।",
                        })}
                    </p>
                </div>
                <Button onClick={handleReset} variant="outline" disabled={!questions}>
                    {t({ en: "Reset", bn: "রিসেট" })}
                </Button>
            </div>

            <div className={selectionGridClass}>
                {isHome && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium">{t({ en: "Class", bn: "ক্লাস" })}</label>
                        <select
                            value={classLevel}
                            onChange={(event) => {
                                const nextClass = event.target.value;
                                setClassLevel(nextClass);
                                const nextCourse = courses.find((course) => course.class === nextClass);
                                setCourseId(nextCourse?.id ?? "");
                                setChapterId("");
                                setQuestions(null);
                                setError(null);
                            }}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            {classOptions.map((value) => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        {isHome ? t({ en: "Subject", bn: "বিষয়" }) : t({ en: "Course", bn: "কোর্স" })}
                    </label>
                    <select
                        value={selectedCourse?.id ?? ""}
                        onChange={(event) => {
                            setCourseId(event.target.value);
                            setChapterId("");
                            setQuestions(null);
                            setError(null);
                        }}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                        {courseOptions.map((course) => (
                            <option key={course.id} value={course.id}>
                                {course.title}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">{t({ en: "Chapter", bn: "অধ্যায়" })}</label>
                    <select
                        value={selectedChapter?.id ?? ""}
                        onChange={(event) => {
                            setChapterId(event.target.value);
                            setQuestions(null);
                            setError(null);
                        }}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                        {chapters.map((chapter) => (
                            <option key={chapter.id} value={chapter.id}>
                                {chapter.title}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {error && (
                <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                </div>
            )}
            {!isChapterUnlocked && selectedChapter && (
                <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-800">
                    <div className="font-semibold">{t({ en: "Chapter locked", bn: "চ্যাপ্টার লক করা" })}</div>
                    <p className="mt-1 text-xs text-amber-700">
                        {t({ en: "Buy this chapter or the full subject to unlock quizzes.", bn: "কুইজ আনলক করতে চ্যাপ্টার বা পুরো বিষয় কিনুন।" })}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Button onClick={handleBuyChapter} disabled={isPaying}>
                            {isPaying ? t({ en: "Redirecting...", bn: "রিডাইরেক্ট হচ্ছে..." }) : t({ en: "Buy Chapter", bn: "চ্যাপ্টার কিনুন" })}
                        </Button>
                        <Button onClick={handleBuySubject} variant="outline" disabled={isPaying}>
                            {t({ en: "Buy Subject", bn: "বিষয় কিনুন" })}
                        </Button>
                        {paymentError && <span className="text-xs text-red-600">{paymentError}</span>}
                    </div>
                </div>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-3">
                <Button onClick={handleGenerate} disabled={loading}>
                    {loading ? t({ en: "Generating...", bn: "তৈরি হচ্ছে..." }) : t({ en: "Generate Quiz", bn: "কুইজ তৈরি করুন" })}
                </Button>
                <span className="text-xs text-muted-foreground">
                    {t({ en: "10 questions - Medium difficulty - MCQ", bn: "১০টি প্রশ্ন - মিডিয়াম লেভেল - MCQ" })}
                </span>
            </div>

            {questions && (
                <div className="mt-6">
                    <QuizComponent
                        courseId={selectedCourse?.id ?? ""}
                        quizId={quizLessonId}
                        questions={questions ?? undefined}
                        onComplete={handleReset}
                    />
                </div>
            )}
            </div>
        </div>
    );
}
