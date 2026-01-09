"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";
import { formatDateKey } from "@/lib/date";
import {
  fetchDashboardData,
  type CalendarEventRecord,
  type CourseData,
  type DashboardStats,
  type PerformanceBar,
  type ProgressMap,
  type StudySessionRecord,
  type SubjectCard,
  type UpcomingTest,
} from "@/lib/dashboardData";

type LeaderboardEntry = {
  rank: number;
  name: string;
  points: number;
  avatar: string;
};

type StudentContextType = {
  loading: boolean;
  error: string | null;
  courses: CourseData[];
  progress: ProgressMap;
  leaderboard: LeaderboardEntry[];
  dashboardStats: DashboardStats;
  subjectCards: SubjectCard[];
  performanceBars: PerformanceBar[];
  studyHours: number[];
  upcomingTests: UpcomingTest[];
  calendarEvents: CalendarEventRecord[];
  studySessions: StudySessionRecord[];
  refresh: () => Promise<void>;
  markLessonComplete: (courseId: string, lessonId: string) => Promise<void>;
  saveQuizScore: (courseId: string, quizId: string, score: number) => Promise<void>;
};

const StudentContext = createContext<StudentContextType | undefined>(undefined);

const EMPTY_STATS: DashboardStats = {
  streakDays: 0,
  totalHours: 0,
  averageScore: 0,
  lessonsDone: 0,
  lessonsTotal: 0,
  weeklyActivity: Array(7).fill(false),
  weeklyStudyHours: [0, 0, 0, 0],
  totalPoints: 0,
};

const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: "Arian Ahmed", points: 2450, avatar: "bg-blue-500" },
  { rank: 2, name: "Sumaiya Islam", points: 2320, avatar: "bg-teal-500" },
  { rank: 3, name: "Rahim Uddin", points: 2100, avatar: "bg-purple-500" },
  { rank: 4, name: "You", points: 1850, avatar: "bg-primary" },
  { rank: 5, name: "Nusrat Jahan", points: 1780, avatar: "bg-orange-500" },
];

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [progress, setProgress] = useState<ProgressMap>({});
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(DEFAULT_LEADERBOARD);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>(EMPTY_STATS);
  const [subjectCards, setSubjectCards] = useState<SubjectCard[]>([]);
  const [performanceBars, setPerformanceBars] = useState<PerformanceBar[]>([]);
  const [studyHours, setStudyHours] = useState<number[]>([0, 0, 0, 0]);
  const [upcomingTests, setUpcomingTests] = useState<UpcomingTest[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEventRecord[]>([]);
  const [studySessions, setStudySessions] = useState<StudySessionRecord[]>([]);

  const resetState = () => {
    setCourses([]);
    setProgress({});
    setLeaderboard(DEFAULT_LEADERBOARD);
    setDashboardStats(EMPTY_STATS);
    setSubjectCards([]);
    setPerformanceBars([]);
    setStudyHours([0, 0, 0, 0]);
    setUpcomingTests([]);
    setCalendarEvents([]);
    setStudySessions([]);
  };

  const refresh = async () => {
    if (!user) {
      resetState();
      setLoading(false);
      return;
    }
    if (!isSupabaseConfigured) {
      setError("Supabase is not configured.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const classLevel = user.user_metadata?.class ?? null;

    if (classLevel) {
      const { error: profileError } = await supabase
        .from("user_profiles")
        .upsert(
          {
            user_id: user.id,
            full_name: user.user_metadata?.full_name ?? "",
            class_level: classLevel,
          },
          { onConflict: "user_id" }
        );

      if (profileError) {
        setError(profileError.message);
      }
    }

    try {
      const data = await fetchDashboardData(user.id, classLevel);
      setCourses(data.courses);
      setProgress(data.progress);
      setDashboardStats(data.stats);
      setSubjectCards(data.subjectCards);
      setPerformanceBars(data.performanceBars);
      setStudyHours(data.stats.weeklyStudyHours);
      setUpcomingTests(data.upcomingTests);
      setCalendarEvents(data.calendarEvents);
      setStudySessions(data.studySessions);

      const updatedLeaderboard = DEFAULT_LEADERBOARD.map((entry) =>
        entry.name === "You" ? { ...entry, points: data.stats.totalPoints } : entry
      );
      setLeaderboard(updatedLeaderboard);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      resetState();
      setLoading(false);
      return;
    }
    void refresh();
  }, [user?.id, user?.user_metadata?.class]);

  const markLessonComplete = async (courseId: string, lessonId: string) => {
    if (!user || !isSupabaseConfigured) return;

    const course = courses.find((item) => item.id === courseId);
    if (course && course.isPurchased === false) {
      setError("Course not purchased.");
      return;
    }
    const lesson = course?.chapters.flatMap((chapter) => chapter.lessons).find((item) => item.id === lessonId);
    const alreadyCompleted = progress[courseId]?.completedLessons.includes(lessonId);

    if (alreadyCompleted) return;

    const totalLessons = course?.chapters.reduce((acc, chapter) => acc + chapter.lessons.length, 0) ?? 0;
    const nextCompletedCount = (progress[courseId]?.completedLessons.length ?? 0) + 1;
    const nextStatus =
      totalLessons > 0 && nextCompletedCount >= totalLessons ? "completed" : "ongoing";

    const { error: progressError } = await supabase.from("lesson_progress").upsert(
      {
        user_id: user.id,
        lesson_id: lessonId,
        course_id: courseId,
        completed: true,
        progress_percent: 100,
      },
      { onConflict: "user_id,lesson_id" }
    );

    if (progressError) {
      setError(progressError.message);
      return;
    }

    if (courseId) {
      const { error: enrollmentError } = await supabase.from("enrollments").upsert(
        {
          user_id: user.id,
          course_id: courseId,
          status: nextStatus,
        },
        { onConflict: "user_id,course_id" }
      );

      if (enrollmentError) {
        setError(enrollmentError.message);
      }
    }

    const durationMinutes =
      lesson?.durationMinutes ?? (lesson?.type === "quiz" ? 10 : 20);

    const { error: sessionError } = await supabase.from("study_sessions").insert({
      user_id: user.id,
      subject_id: course?.subjectId ?? null,
      duration_minutes: durationMinutes,
      session_date: formatDateKey(new Date()),
    });

    if (sessionError) {
      setError(sessionError.message);
    }

    setProgress((prev) => {
      const next = { ...prev };
      const courseProgress = next[courseId] || { completedLessons: [], quizScores: {} };
      const updatedLessons = new Set(courseProgress.completedLessons);
      updatedLessons.add(lessonId);
      next[courseId] = {
        ...courseProgress,
        completedLessons: Array.from(updatedLessons),
      };
      return next;
    });

    void refresh();
  };

  const saveQuizScore = async (courseId: string, quizId: string, score: number) => {
    if (!user || !isSupabaseConfigured) return;

    const course = courses.find((item) => item.id === courseId);
    if (course && course.isPurchased === false) {
      setError("Course not purchased.");
      return;
    }
    const lesson = course?.chapters.flatMap((chapter) => chapter.lessons).find((item) => item.id === quizId);

    const { error: quizError } = await supabase.from("quiz_attempts").insert({
      user_id: user.id,
      subject_id: course?.subjectId ?? null,
      lesson_id: lesson?.id ?? null,
      score,
    });

    if (quizError) {
      setError(quizError.message);
      return;
    }

    setProgress((prev) => {
      const next = { ...prev };
      const courseProgress = next[courseId] || { completedLessons: [], quizScores: {} };
      next[courseId] = {
        ...courseProgress,
        quizScores: {
          ...courseProgress.quizScores,
          [quizId]: score,
        },
      };
      return next;
    });

    void refresh();
  };

  return (
    <StudentContext.Provider
      value={{
        loading,
        error,
        courses,
        progress,
        leaderboard,
        dashboardStats,
        subjectCards,
        performanceBars,
        studyHours,
        upcomingTests,
        calendarEvents,
        studySessions,
        refresh,
        markLessonComplete,
        saveQuizScore,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudent must be used within a StudentProvider");
  }
  return context;
}
