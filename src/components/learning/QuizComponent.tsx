"use client";

import { useState } from "react";
import { CheckCircle, RefreshCw } from "lucide-react";
import { useStudent } from "@/lib/store";
import { MOCK_QUIZ_Questions } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export function QuizComponent({
    courseId,
    quizId,
    onComplete
}: {
    courseId: string,
    quizId: string,
    onComplete: () => void
}) {
    const { saveQuizScore } = useStudent();
    const questions = MOCK_QUIZ_Questions[quizId as keyof typeof MOCK_QUIZ_Questions];

    // Support generic fallback if no mock questions found
    const activeQuestions = questions || [
        { id: 1, question: "Sample Question 1?", options: ["A", "B", "C", "D"], correctAnswer: 0 }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [finalScore, setFinalScore] = useState<number | null>(null);
    const [answerState, setAnswerState] = useState<'idle' | 'correct' | 'incorrect'>('idle');

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
        saveQuizScore(courseId, quizId, percentScore);
    };

    const handleRetry = () => {
        setCurrentIndex(0);
        setSelectedOption(null);
        setScore(0);
        setShowResult(false);
        setFinalScore(null);
        setAnswerState('idle');
    };

    if (showResult) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-card border border-border rounded-xl text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold">Quiz Completed!</h3>
                <p className="text-muted-foreground">You scored {finalScore ?? 0}%</p>
                <div className="flex gap-4">
                    <button
                        onClick={handleRetry}
                        className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                        <RefreshCw className="h-4 w-4" /> Try Again
                    </button>
                    <button
                        onClick={onComplete}
                        className="bg-primary text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90"
                    >
                        Continue Learning
                    </button>
                </div>
            </div>
        );
    }

    const currentQ = activeQuestions[currentIndex];

    return (
        <div className="max-w-2xl mx-auto bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="mb-6 flex justify-between items-center text-sm text-muted-foreground">
                <span>Question {currentIndex + 1} of {activeQuestions.length}</span>
                <span>Score: {score}</span>
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
                    {currentIndex === activeQuestions.length - 1 ? "Finish Quiz" : "Next Question"}
                </button>
            </div>
        </div>
    );
}
