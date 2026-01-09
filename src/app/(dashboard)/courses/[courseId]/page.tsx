"use client";

import { useState } from "react";
import { useStudent } from "@/lib/store";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Book, CheckCircle, Circle, FileText, HelpCircle, Lock, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { useTranslate } from "@/lib/i18n";
import { startCourseCheckout } from "@/lib/payments";

export default function CourseDetailPage() {
    const params = useParams();
    const { courses, progress } = useStudent();
    const t = useTranslate();
    const [isPaying, setIsPaying] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);

    // In a real app, you might validate params.courseId
    const courseId = params.courseId as string;
    const course = courses.find((c) => c.id === courseId);

    // Handle course not found
    if (!course) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <h2 className="text-2xl font-bold mb-4">{t({ en: "Course not found", bn: "কোর্স খুঁজে পাওয়া যায়নি" })}</h2>
                <Link to="/courses" className="text-primary hover:underline flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" /> {t({ en: "Back to Courses", bn: "কোর্সে ফিরে যান" })}
                </Link>
            </div>
        );
    }

    const userProgress = progress[courseId as keyof typeof progress] || { completedLessons: [] };
    const isPurchased = course.isPurchased === true;

    const handleBuyCourse = async () => {
        setPaymentError(null);
        setIsPaying(true);
        try {
            await startCourseCheckout(course.id, { planId: "premium" });
        } catch (error) {
            setPaymentError(error instanceof Error ? error.message : "Payment failed. Please try again.");
            setIsPaying(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Header */}
            <div>
                <Link to="/courses" className="text-muted-foreground hover:text-primary flex items-center gap-2 text-sm mb-4">
                    <ArrowLeft className="h-4 w-4" /> {t({ en: "Back to Courses", bn: "কোর্সে ফিরে যান" })}
                </Link>
                <div className={`rounded-3xl p-8 text-slate-800 ${course.image} bg-opacity-30`}>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <span className="inline-block px-3 py-1 rounded-full bg-white/50 text-xs font-bold mb-3 border border-white/20">
                                {course.class}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">{course.title}</h1>
                            <p className="text-slate-700 max-w-2xl">{course.description}</p>
                        </div>
                        <div className="flex flex-col items-start gap-2 sm:items-end">
                            {isPurchased ? (
                                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                                    <CheckCircle className="h-4 w-4" />
                                    {t({ en: "Purchased", bn: "ক্রয় করা হয়েছে" })}
                                </span>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleBuyCourse}
                                    disabled={isPaying}
                                    className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:opacity-60"
                                >
                                    {isPaying ? t({ en: "Redirecting...", bn: "রিডাইরেক্ট হচ্ছে..." }) : t({ en: "Buy Course", bn: "কোর্স কিনুন" })}
                                </button>
                            )}
                            {paymentError && <p className="text-xs text-red-500">{paymentError}</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Chapters List */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Book className="h-5 w-5 text-primary" />
                    {t({ en: "Course Content", bn: "কোর্স কন্টেন্ট" })}
                </h2>

                <div className="space-y-4">
                    {!isPurchased ? (
                        <Card className="p-6 text-center">
                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                <Lock className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-semibold">{t({ en: "Purchase required", bn: "ক্রয় করা প্রয়োজন" })}</h3>
                            <p className="mt-2 text-sm text-slate-500">
                                {t({
                                    en: "Buy this course to unlock lessons, quizzes, and progress tracking.",
                                    bn: "লেসন, কুইজ এবং প্রগ্রেস আনলক করতে কোর্সটি কিনুন।",
                                })}
                            </p>
                        </Card>
                    ) : (
                        course.chapters.map((chapter) => (
                            <Card key={chapter.id} className="overflow-hidden">
                                <div className="bg-muted/30 p-4 border-b">
                                    <h3 className="font-semibold text-lg">{chapter.title}</h3>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {chapter.lessons.length} {t({ en: "Lessons", bn: "লেসন" })}
                                    </div>
                                </div>
                                <div className="divide-y">
                                    {chapter.lessons.map((lesson) => {
                                        const isCompleted = userProgress.completedLessons.includes(lesson.id);

                                        let TypeIcon = PlayCircle;
                                        if (lesson.type === "article") TypeIcon = FileText;
                                        if (lesson.type === "quiz") TypeIcon = HelpCircle;

                                        return (
                                            <Link
                                                key={lesson.id}
                                                to={`/learn/${course.id}/${chapter.id}/${lesson.id}`}
                                                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={cn(
                                                            "p-2 rounded-lg transition-colors",
                                                            isCompleted
                                                                ? "bg-green-100 text-green-600"
                                                                : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                                                        )}
                                                    >
                                                        <TypeIcon className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium group-hover:text-primary transition-colors">
                                                            {lesson.title}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {lesson.type === "quiz"
                                                                ? `${"questions" in lesson ? lesson.questions : 5} ${t({
                                                                      en: "Questions",
                                                                      bn: "প্রশ্ন",
                                                                  })}`
                                                                : lesson.duration}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    {isCompleted ? (
                                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                                    ) : (
                                                        <Circle className="h-5 w-5 text-muted-foreground/30" />
                                                    )}
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
