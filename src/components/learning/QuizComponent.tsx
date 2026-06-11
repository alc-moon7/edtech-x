"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle, RefreshCw, ChevronLeft, ChevronRight, Hourglass } from "lucide-react";
import { useStudent } from "@/lib/store";
import { useTranslate } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export type QuizQuestion = {
    id: string | number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
};

export function QuizComponent({
    courseId,
    quizId,
    questions,
    onComplete
}: {
    courseId: string;
    quizId?: string;
    questions?: QuizQuestion[];
    onComplete: () => void
}) {
    const { courses, saveQuizScore } = useStudent();
    const t = useTranslate();

    const activeQuestions = useMemo<QuizQuestion[]>(() => questions ?? [], [questions]);
    const course = courses.find((item) => item.id === courseId);
    const subjectName = course?.title || "English";
    const instructorName = "Atif Aslam";

    const QUESTIONS_PER_PAGE = 2;
    const totalPages = Math.ceil(activeQuestions.length / QUESTIONS_PER_PAGE);

    const [currentPage, setCurrentPage] = useState(1);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [timeLeft, setTimeLeft] = useState(10 * 60); // 10:00
    const [showResult, setShowResult] = useState(false);
    const [finalScore, setFinalScore] = useState<number | null>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleOptionSelect = (questionIndex: number, optionIndex: number) => {
        if (showResult) return;
        setAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
    };

    const handleSubmit = () => {
        let correctCount = 0;
        activeQuestions.forEach((q, idx) => {
            if (answers[idx] === q.correctAnswer) {
                correctCount++;
            }
        });
        const percentScore = Math.round((correctCount / activeQuestions.length) * 100);
        setFinalScore(percentScore);
        setShowResult(true);
        if (quizId) {
            void saveQuizScore(courseId, quizId, percentScore);
        }
    };

    const handleRetry = () => {
        setCurrentPage(1);
        setAnswers({});
        setShowResult(false);
        setFinalScore(null);
        setTimeLeft(10 * 60);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    if (!activeQuestions.length) {
        return (
            <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
                {t({ en: "No quiz questions available yet.", bn: "এখনও কোনো কুইজ প্রশ্ন নেই।" })}
            </div>
        );
    }

    if (showResult) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-white border border-slate-200 rounded-xl text-center space-y-4 shadow-sm w-full">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">{t({ en: "Quiz Completed!", bn: "কুইজ সম্পন্ন হয়েছে!" })}</h3>
                <p className="text-slate-500">{t({ en: "You scored", bn: "আপনার স্কোর" })} {finalScore ?? 0}%</p>
                <div className="flex gap-4">
                    <button onClick={handleRetry} className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline">
                        <RefreshCw className="h-4 w-4" /> {t({ en: "Try Again", bn: "আবার চেষ্টা করুন" })}
                    </button>
                    <button onClick={onComplete} className="bg-blue-500 text-white rounded-lg px-6 py-2 text-sm font-medium hover:bg-blue-600">
                        {t({ en: "Continue Learning", bn: "শেখা চালিয়ে যান" })}
                    </button>
                </div>
                <div className="w-full pt-4 border-t border-slate-200 text-left space-y-4 mt-4">
                    {activeQuestions.map((question, idx) => {
                        const selected = answers[idx];
                        const isCorrect = selected === question.correctAnswer;
                        return (
                            <div key={question.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                <p className="text-sm font-semibold text-slate-800">
                                    {t({ en: "Question", bn: "প্রশ্ন" })} {idx + 1}
                                </p>
                                <p className="mt-2 text-sm text-slate-700 whitespace-pre-line">{question.question}</p>
                                <div className="mt-4 text-sm">
                                    <p className={cn("font-medium", isCorrect ? "text-emerald-600" : "text-red-600")}>
                                        {t({ en: "Your answer", bn: "আপনার উত্তর" })}: {selected === undefined ? t({ en: "Not answered", bn: "উত্তর দেওয়া হয়নি" }) : question.options[selected]}
                                    </p>
                                    {!isCorrect && (
                                        <p className="mt-1 font-medium text-emerald-600">
                                            {t({ en: "Correct answer", bn: "সঠিক উত্তর" })}: {question.options[question.correctAnswer]}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    const currentQuestions = activeQuestions.slice((currentPage - 1) * QUESTIONS_PER_PAGE, currentPage * QUESTIONS_PER_PAGE);

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden text-slate-800">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap gap-4 items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                    <img src={course?.coverImage || "/assets/book-covers/Rectangle 62.png"} alt="Subject" className="w-14 h-14 rounded-lg object-cover shadow-sm border border-slate-200" />
                    <div>
                        <h2 className="text-xl font-bold text-[#4491e0]">{subjectName}</h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{instructorName}</p>
                    </div>
                </div>
                <div className="text-right flex flex-col items-end">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <Hourglass className="w-3.5 h-3.5 text-[#5fa3f8]" />
                        Remaining Time: {formatTime(timeLeft)}
                    </div>
                    <div className="w-40 h-1.5 bg-slate-200 rounded-full mt-2 mb-1.5 overflow-hidden">
                        <div className="h-full bg-[#5fa3f8] transition-all duration-1000" style={{ width: `${(timeLeft / (10 * 60)) * 100}%` }} />
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">Submit by Feb 27, 2026 11:59 PM</div>
                </div>
            </div>

            <div className="p-6">
                {/* Questions Title & Pagination */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-800">Questions</h3>
                    <div className="flex items-center gap-1.5">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={cn(
                                    "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors",
                                    currentPage === i + 1 ? "bg-[#5fa3f8] text-white shadow-sm" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                )}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid lg:grid-cols-[1fr_320px] gap-8">
                    {/* Left: Questions List */}
                    <div className="space-y-6">
                        {currentQuestions.map((q, idx) => {
                            const absoluteIndex = (currentPage - 1) * QUESTIONS_PER_PAGE + idx;
                            return (
                                <div key={q.id} className="border border-[#b9d2f0] rounded-xl overflow-hidden bg-white shadow-sm">
                                    <div className="bg-[#f4f9ff] px-5 py-3 border-b border-[#b9d2f0] font-semibold text-slate-700 text-sm">
                                        Question {absoluteIndex + 1}
                                    </div>
                                    <div className="p-5">
                                        <p className="mb-5 text-slate-800 text-sm font-medium">{q.question}</p>
                                        <div className="space-y-3">
                                            {q.options.map((opt, optIdx) => {
                                                const isSelected = answers[absoluteIndex] === optIdx;
                                                return (
                                                    <div
                                                        key={optIdx}
                                                        onClick={() => handleOptionSelect(absoluteIndex, optIdx)}
                                                        className={cn(
                                                            "flex items-center gap-3.5 p-3 rounded-lg border cursor-pointer transition-all duration-200",
                                                            isSelected ? "border-[#96c1f1] bg-[#d3e5f8]" : "border-[#d8e7f8] hover:border-[#b9d2f0] hover:bg-[#f4f9ff]"
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold uppercase shrink-0 transition-colors",
                                                            isSelected ? "border-[#4491e0] text-[#4491e0] bg-white" : "border-slate-300 text-slate-500 bg-white"
                                                        )}>
                                                            {String.fromCharCode(65 + optIdx)}
                                                        </div>
                                                        <span className="text-sm text-slate-700">{opt}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Bottom Actions */}
                        <div className="flex justify-between items-center pt-4">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className={cn(
                                    "px-4 py-2 rounded border flex items-center gap-2 text-sm font-semibold transition-colors",
                                    currentPage === 1 
                                        ? "border-slate-200 text-slate-400 cursor-not-allowed" 
                                        : "border-[#b9d2f0] text-[#5fa3f8] hover:bg-[#f4f9ff]"
                                )}
                            >
                                <ChevronLeft className="w-4 h-4" /> {t({ en: "Previous", bn: "পূর্ববর্তী" })}
                            </button>
                            
                            {currentPage === totalPages ? (
                                <button
                                    onClick={handleSubmit}
                                    className="px-8 py-2 bg-emerald-500 text-white rounded-md text-sm font-bold shadow-sm hover:bg-emerald-600 transition-colors"
                                >
                                    {t({ en: "Submit Quiz", bn: "কুইজ জমা দিন" })}
                                </button>
                            ) : (
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    className="px-6 py-2 rounded border border-[#b9d2f0] flex items-center gap-2 text-[#5fa3f8] hover:bg-[#f4f9ff] transition-colors text-sm font-semibold"
                                >
                                    {t({ en: "Next", bn: "পরবর্তী" })} <ChevronRight className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right: Answer Grid */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden h-fit bg-slate-50 shadow-sm">
                        <div className="grid grid-cols-[70px_1fr] bg-slate-100 border-b border-slate-200 text-[13px] font-semibold text-slate-600 text-center py-3">
                            <div>S. No</div>
                            <div>Answer Options</div>
                        </div>
                        <div className="divide-y divide-slate-200">
                            {activeQuestions.map((q, idx) => (
                                <div key={q.id} className="grid grid-cols-[70px_1fr] py-2 items-center text-center hover:bg-slate-100/50 transition-colors">
                                    <div className="flex justify-center">
                                        <div className={cn(
                                            "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold",
                                            answers[idx] !== undefined ? "bg-[#5fa3f8] text-white shadow-sm" : "bg-slate-200 text-slate-600"
                                        )}>
                                            {idx + 1}
                                        </div>
                                    </div>
                                    <div className="flex justify-center gap-2.5">
                                        {q.options.map((_, optIdx) => {
                                            const isSelected = answers[idx] === optIdx;
                                            return (
                                                <button
                                                    key={optIdx}
                                                    onClick={() => {
                                                        setCurrentPage(Math.floor(idx / QUESTIONS_PER_PAGE) + 1);
                                                        handleOptionSelect(idx, optIdx);
                                                    }}
                                                    className={cn(
                                                        "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all shadow-sm",
                                                        isSelected
                                                            ? "bg-slate-500 text-white"
                                                            : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                                                    )}
                                                >
                                                    {String.fromCharCode(65 + optIdx)}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-center">
                            <button
                                onClick={handleSubmit}
                                className="w-full py-2.5 bg-emerald-500 text-white rounded-md text-sm font-bold shadow-sm hover:bg-emerald-600 transition-colors"
                            >
                                {t({ en: "Submit Quiz", bn: "কুইজ জমা দিন" })}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

