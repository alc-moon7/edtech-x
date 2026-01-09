"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle, RefreshCw } from "lucide-react";
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
    const { saveQuizScore } = useStudent();
    const t = useTranslate();

    // Support generic fallback if no mock questions found
    const activeQuestions = useMemo<QuizQuestion[]>(() => {
        if (questions && questions.length) return questions;
        return [{ id: 1, question: "Sample Question 1?", options: ["A", "B", "C", "D"], correctAnswer: 0 }];
    }, [questions]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [finalScore, setFinalScore] = useState<number | null>(null);
    const [answerState, setAnswerState] = useState<'idle' | 'correct' | 'incorrect'>('idle');
    const [answers, setAnswers] = useState<(number | null)[]>([]);

    useEffect(() => {
        setCurrentIndex(0);
        setSelectedOption(null);
        setScore(0);
        setShowResult(false);
        setFinalScore(null);
        setAnswerState('idle');
        setAnswers(Array(activeQuestions.length).fill(null));
    }, [activeQuestions]);

    const handleOptionSelect = (index: number) => {
        if (answerState !== 'idle') return;
        setSelectedOption(index);
    };

    const handleSubmit = () => {
        const correct = activeQuestions[currentIndex].correctAnswer;
        const isCorrect = selectedOption === correct;
        const updatedScore = score + (isCorrect ? 1 : 0);
        setScore(updatedScore);
        setAnswerState(isCorrect ? 'correct' : 'incorrect');
        setAnswers(prev => {
            const next = [...prev];
            next[currentIndex] = selectedOption;
            return next;
        });

        setTimeout(() => {
            if (currentIndex < activeQuestions.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setSelectedOption(null);
                setAnswerState('idle');
            } else {
                finishQuiz(updatedScore);
            }
        }, 1200);
    };

    const finishQuiz = (correctCount: number) => {
        setShowResult(true);
        // Calculate percentage
        const percentScore = Math.round((correctCount / activeQuestions.length) * 100);
        setFinalScore(percentScore);
        if (quizId) {
            void saveQuizScore(courseId, quizId, percentScore);
        }
    };

    const handleRetry = () => {
        setCurrentIndex(0);
        setSelectedOption(null);
        setScore(0);
        setShowResult(false);
        setFinalScore(null);
        setAnswerState('idle');
        setAnswers(Array(activeQuestions.length).fill(null));
    };

    if (showResult) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-card border border-border rounded-xl text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold">{t({ en: "Quiz Completed!", bn: "কুইজ সম্পন্ন হয়েছে!" })}</h3>
                <p className="text-muted-foreground">{t({ en: "You scored", bn: "আপনার স্কোর" })} {finalScore ?? 0}%</p>
                <div className="flex gap-4">
                    <button
                        onClick={handleRetry}
                        className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                        <RefreshCw className="h-4 w-4" /> {t({ en: "Try Again", bn: "আবার চেষ্টা করুন" })}
                    </button>
                    <button
                        onClick={onComplete}
                        className="bg-primary text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90"
                    >
                        {t({ en: "Continue Learning", bn: "শেখা চালিয়ে যান" })}
                    </button>
                </div>
                <div className="w-full pt-4 border-t border-border text-left space-y-4">
                    {activeQuestions.map((question, idx) => {
                        const selected = answers[idx];
                        const isCorrect = selected === question.correctAnswer;
                        return (
                            <div key={question.id} className="rounded-lg border border-border bg-muted/20 p-4">
                                <p className="text-sm font-semibold text-foreground">
                                    {t({ en: "Question", bn: "প্রশ্ন" })} {idx + 1}
                                </p>
                                <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line">{question.question}</p>
                                <div className="mt-3 text-sm">
                                    <p className={cn("font-medium", isCorrect ? "text-green-600" : "text-red-600")}>
                                        {t({ en: "Your answer", bn: "আপনার উত্তর" })}: {selected === null ? t({ en: "Not answered", bn: "উত্তর দেওয়া হয়নি" }) : question.options[selected]}
                                    </p>
                                    {!isCorrect && (
                                        <p className="mt-1 font-medium text-green-600">
                                            {t({ en: "Correct answer", bn: "সঠিক উত্তর" })}: {question.options[question.correctAnswer]}
                                        </p>
                                    )}
                                    {question.explanation && (
                                        <p className="mt-2 text-xs text-muted-foreground">{question.explanation}</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    const currentQ = activeQuestions[currentIndex];

    return (
        <div className="max-w-2xl mx-auto bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="mb-6 flex justify-between items-center text-sm text-muted-foreground">
                <span>{t({ en: "Question", bn: "প্রশ্ন" })} {currentIndex + 1} {t({ en: "of", bn: "এর" })} {activeQuestions.length}</span>
                <span>{t({ en: "Score", bn: "স্কোর" })}: {score}</span>
            </div>

            <h3 className="text-xl font-bold mb-6">{currentQ.question}</h3>

            <div className="space-y-3">
                {currentQ.options.map((opt, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleOptionSelect(idx)}
                        disabled={answerState !== 'idle'}
                        className={cn(
                            "w-full text-left p-4 rounded-lg border border-border transition-all",
                            selectedOption === idx ? "ring-2 ring-primary border-primary bg-primary/5" : "hover:bg-muted",
                            answerState === 'correct' && idx === currentQ.correctAnswer && "bg-green-100 border-green-500 text-green-700",
                            answerState === 'incorrect' && selectedOption === idx && "bg-red-100 border-red-500 text-red-700"
                        )}
                    >
                        {opt}
                    </button>
                ))}
            </div>

            <div className="mt-8 flex justify-end">
                <button
                    onClick={handleSubmit}
                    disabled={selectedOption === null || answerState !== 'idle'}
                    className="bg-primary text-white rounded-lg px-6 py-3 font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {currentIndex === activeQuestions.length - 1
                        ? t({ en: "Finish Quiz", bn: "কুইজ শেষ করুন" })
                        : t({ en: "Next Question", bn: "পরবর্তী প্রশ্ন" })}
                </button>
            </div>
        </div>
    );
}
