"use client";

import { useEffect, useState } from "react";
import { useStudent } from "@/lib/store";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    CheckCircle,
    ChevronRight,
    FileText,
    HelpCircle,
    LayoutList,
    PlayCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { QuizComponent } from "@/components/learning/QuizComponent";
import { useLanguage, useTranslate } from "@/lib/i18n";

const typeLabels: Record<string, { en: string; bn: string }> = {
    video: { en: "Video", bn: "ভিডিও" },
    article: { en: "Article", bn: "আর্টিকেল" },
    quiz: { en: "Quiz", bn: "কুইজ" },
};

export default function LessonPlayerPage() {
    const params = useParams();
    const navigate = useNavigate();
    const { courses, progress, markLessonStarted, markLessonComplete } = useStudent();
    const { language } = useLanguage();
    const t = useTranslate();
    const [quizCompleted, setQuizCompleted] = useState(false);

    const courseId = params.courseId as string;
    const chapterId = params.chapterId as string;
    const lessonId = params.lessonId as string;

    const course = courses.find((c) => c.id === courseId);
    const chapter = course?.chapters.find((ch) => ch.id === chapterId);
    const lesson = chapter?.lessons.find((l) => l.id === lessonId);
    const hasAccess =
        course?.isPurchased === true || course?.isFree === true || chapter?.isFree === true;

    if (course && !hasAccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
                <h2 className="text-2xl font-bold mb-3">{t({ en: "Course locked", bn: "কোর্স লক করা আছে" })}</h2>
                <p className="text-sm text-muted-foreground mb-4">
                    {t({
                        en: "Upgrade your plan to unlock the next chapter.",
                        bn: "লেসন এবং কুইজ দেখতে কোর্সটি কিনুন।",
                    })}
                </p>
                <Link to={`/courses/${course.id}`} className="text-primary hover:underline">
                    {t({ en: "Go to course", bn: "কোর্সে যান" })}
                </Link>
            </div>
        );
    }

    if (!course || !chapter || !lesson) {
        return <div className="p-8 text-center">{t({ en: "Lesson not found.", bn: "পাঠ খুঁজে পাওয়া যায়নি।" })}</div>;
    }

    const userProgress = progress[courseId as keyof typeof progress] || { completedLessons: [] };
    const isCompleted = userProgress.completedLessons.includes(lessonId);
    const isQuiz = lesson.type === "quiz";
    const quizCount =
        lesson.type === "quiz" && "questions" in lesson ? lesson.questions : undefined;

    const questionLabel = t({ en: "Questions", bn: "প্রশ্ন" });
    const lessonMeta = lesson.type === "quiz"
        ? `${quizCount ?? 5} ${questionLabel}`
        : lesson.duration ?? t({ en: "10 min", bn: "10 মিনিট" });

    useEffect(() => {
        setQuizCompleted(isCompleted);
    }, [isCompleted, lessonId]);

    useEffect(() => {
        if (!course || !lesson || !hasAccess) return;
        void markLessonStarted(courseId, lessonId);
    }, [courseId, lessonId, course?.id, lesson?.id, hasAccess]);

    const handleComplete = async () => {
        await markLessonComplete(courseId, lessonId);
        if (isQuiz) {
            setQuizCompleted(true);
        }
    };

    const lessonSequence = course.chapters.flatMap((ch) =>
        ch.lessons.map((item) => ({
            ...item,
            chapterId: ch.id,
        }))
    );
    const currentIndex = lessonSequence.findIndex((item) => item.id === lessonId);
    const nextLesson = currentIndex >= 0 ? lessonSequence[currentIndex + 1] : undefined;
    const typeLabel = t(typeLabels[lesson.type] ?? { en: lesson.type, bn: lesson.type });
    const readingCopy = language === "bn"
        ? `এই পাঠে ${lesson.title} বিষয়ের মূল ধারণাগুলো উদাহরণ ও দ্রুত চেকসহ ব্যাখ্যা করা হয়েছে। নিচের মূল পয়েন্টগুলো রিভিশনের জন্য ব্যবহার করুন।`
        : `This reading explains the core ideas of ${lesson.title} with examples and quick checks. Use the key takeaways below to guide your revision.`;

    const lessonGoals = [
        language === "bn"
            ? `${lesson.title} এর মূল ধারণাগুলো বুঝুন`
            : `Understand the key ideas behind ${lesson.title}`,
        language === "bn"
            ? "সাধারণ পরীক্ষার প্রশ্নে ধারণাটি প্রয়োগ করুন"
            : "Apply the concept to common exam questions",
        language === "bn"
            ? "সাধারণ ভুলগুলো চিহ্নিত করে এড়িয়ে চলুন"
            : "Identify common mistakes and avoid them",
    ];

    const keyTakeaways = [
        { en: "Definitions and core formulas", bn: "সংজ্ঞা ও মূল সূত্র" },
        { en: "Worked examples you can revisit", bn: "ফিরে দেখার মতো উদাহরণ" },
        { en: "Quick checks to confirm understanding", bn: "বোঝা নিশ্চিত করতে দ্রুত চেক" },
        { en: "Revision notes for exam prep", bn: "পরীক্ষার প্রস্তুতির জন্য রিভিশন নোট" },
    ];

    return (
        <div className="flex h-[calc(100vh-theme(spacing.16))] overflow-hidden">
            <div className="hidden md:flex w-80 flex-col border-r bg-card overflow-y-auto">
                <div className="p-4 border-b">
                    <Link
                        to={`/courses/${courseId}`}
                        className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2 mb-2"
                    >
                        <ArrowLeft className="h-4 w-4" /> {t({ en: "Back to Course", bn: "কোর্সে ফিরে যান" })}
                    </Link>
                    <h2 className="font-bold line-clamp-1">{course.title}</h2>
                    <p className="text-xs text-muted-foreground">{chapter.title}</p>
                </div>

                <div className="flex-1 overflow-y-auto py-2">
                    {chapter.lessons.map((l) => {
                        const lCompleted = userProgress.completedLessons.includes(l.id);
                        const isActive = l.id === lessonId;

                        let TypeIcon = PlayCircle;
                        if (l.type === "article") TypeIcon = FileText;
                        if (l.type === "quiz") TypeIcon = HelpCircle;

                        return (
                            <Link
                                key={l.id}
                                to={`/learn/${courseId}/${chapterId}/${l.id}`}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-l-2",
                                    isActive ? "bg-primary/5 border-primary" : "border-transparent",
                                    lCompleted && !isActive ? "text-muted-foreground" : ""
                                )}
                            >
                                <div
                                    className={cn(
                                        "p-1.5 rounded-md",
                                        isActive ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                                    )}
                                >
                                    <TypeIcon className="h-4 w-4" />
                                </div>
                                <div className="flex-1 text-sm line-clamp-2">{l.title}</div>
                                {lCompleted && <CheckCircle className="h-4 w-4 text-green-500" />}
                            </Link>
                        );
                    })}
                </div>
            </div>

            <div className="flex-1 flex flex-col h-full overflow-y-auto bg-background/50">
                <div className="md:hidden p-4 border-b bg-card flex items-center justify-between">
                    <Link to={`/courses/${courseId}`} className="text-muted-foreground">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <span className="font-semibold truncate mx-4">{lesson.title}</span>
                    <Button variant="ghost" size="sm" aria-label={t({ en: "Open lesson list", bn: "লেসন তালিকা খুলুন" })}>
                        <LayoutList className="h-5 w-5" />
                    </Button>
                </div>

                <div className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full">
                    {!isQuiz && (
                        <div className="aspect-video bg-black rounded-xl shadow-lg mb-8 flex items-center justify-center relative overflow-hidden group">
                            {lesson.type === "video" ? (
                                <div className="text-center">
                                    <PlayCircle className="h-20 w-20 text-white/50 group-hover:text-white transition-colors mx-auto mb-4" />
                                    <p className="text-white/70">{t({ en: "Video lesson preview", bn: "ভিডিও লেসন প্রিভিউ" })}</p>
                                    <p className="text-xs text-white/50">{lesson.id}</p>
                                </div>
                            ) : (
                                <div className="bg-white text-black w-full h-full p-8 overflow-y-auto text-left">
                                    <h2 className="text-2xl font-bold mb-4">{lesson.title}</h2>
                                    <p className="text-base leading-relaxed text-gray-700">
                                        {readingCopy}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-6 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">{lesson.title}</h1>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-medium uppercase text-[10px] tracking-wider">
                                    {typeLabel}
                                </span>
                                <span>{lessonMeta}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <Button
                                onClick={handleComplete}
                                variant={isCompleted ? "outline" : "default"}
                                className={cn(
                                    "flex-1 md:flex-none gap-2",
                                    isCompleted ? "text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700" : ""
                                )}
                                disabled={isQuiz && !quizCompleted && !isCompleted}
                            >
                                {isCompleted ? (
                                    <>
                                        <CheckCircle className="h-4 w-4" /> {t({ en: "Completed", bn: "সম্পন্ন" })}
                                    </>
                                ) : (
                                    t({ en: "Mark Complete", bn: "সম্পন্ন হিসেবে চিহ্নিত করুন" })
                                )}
                            </Button>

                            {nextLesson && (
                                <Button
                                    variant="ghost"
                                    className="gap-2"
                                    onClick={() => navigate(`/learn/${courseId}/${nextLesson.chapterId}/${nextLesson.id}`)}
                                >
                                    {t({ en: "Next", bn: "পরবর্তী" })} <ChevronRight className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>

                    {isQuiz ? (
                        <div className="space-y-6">
                            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                                <h2 className="text-lg font-semibold">{t({ en: "Quiz instructions", bn: "কুইজ নির্দেশনা" })}</h2>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {t({ en: "Answer each question to test your understanding. Your score is saved automatically for progress tracking.", bn: "বোঝা যাচাই করতে প্রতিটি প্রশ্নের উত্তর দিন। আপনার স্কোর স্বয়ংক্রিয়ভাবে অগ্রগতি ট্র্যাকিংয়ের জন্য সংরক্ষিত হবে।" })}
                                </p>
                            </div>
                            <QuizComponent
                                courseId={courseId}
                                quizId={lesson.id}
                                onComplete={handleComplete}
                            />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                                <h3 className="text-lg font-semibold">{t({ en: "Lesson goals", bn: "লেসনের লক্ষ্য" })}</h3>
                                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                                    {lessonGoals.map((item) => (
                                        <li key={item} className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-primary" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                                <h3 className="text-lg font-semibold">{t({ en: "Key takeaways", bn: "মূল পয়েন্ট" })}</h3>
                                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                    {keyTakeaways.map((item) => (
                                        <div key={item.en} className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                                            {t(item)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

