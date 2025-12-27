"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { COURSES, USER_PROGRESS, LEADERBOARD_DATA, USER_STATS } from './mockData';

type StudentContextType = {
    courses: typeof COURSES;
    progress: typeof USER_PROGRESS;
    leaderboard: typeof LEADERBOARD_DATA;
    userStats: typeof USER_STATS;
    markLessonComplete: (courseId: string, lessonId: string) => void;
    saveQuizScore: (courseId: string, quizId: string, score: number) => void;
};

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export function StudentProvider({ children }: { children: ReactNode }) {
    const [progress, setProgress] = useState(USER_PROGRESS);

    const markLessonComplete = (courseId: string, lessonId: string) => {
        setProgress(prev => {
            const courseProgress = prev[courseId as keyof typeof prev] || { completedLessons: [], quizScores: {} };
            const updatedLessons = [...courseProgress.completedLessons, lessonId];
            // simplified unique check
            const uniqueLessons = Array.from(new Set(updatedLessons));

            return {
                ...prev,
                [courseId]: {
                    ...courseProgress,
                    completedLessons: uniqueLessons
                }
            };
        });
    };

    const saveQuizScore = (courseId: string, quizId: string, score: number) => {
        setProgress(prev => {
            const courseProgress = prev[courseId as keyof typeof prev] || { completedLessons: [], quizScores: {} };
            return {
                ...prev,
                [courseId]: {
                    ...courseProgress,
                    quizScores: {
                        ...courseProgress.quizScores,
                        [quizId]: score
                    }
                }
            };
        });
    };

    return (
        <StudentContext.Provider value={{
            courses: COURSES,
            progress,
            leaderboard: LEADERBOARD_DATA,
            userStats: USER_STATS,
            markLessonComplete,
            saveQuizScore
        }}>
            {children}
        </StudentContext.Provider>
    );
}

export function useStudent() {
    const context = useContext(StudentContext);
    if (context === undefined) {
        throw new Error('useStudent must be used within a StudentProvider');
    }
    return context;
}
