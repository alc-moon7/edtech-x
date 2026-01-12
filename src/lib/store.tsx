"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";
import { formatDateKey, getBangladeshToday } from "@/lib/date";
import {
  fetchDashboardData,
  type CalendarEventRecord,
  type CourseData,
  type DashboardStats,
  type PerformanceBar,
  type ProgressMap,
  type PurchasedCourseRecord,
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
  purchasedCourses: PurchasedCourseRecord[];
  refresh: () => Promise<void>;
  markLessonStarted: (courseId: string, lessonId: string) => Promise<void>;
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
  lastActivity: null,
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
  const [purchasedCourses, setPurchasedCourses] = useState<PurchasedCourseRecord[]>([]);

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
    setPurchasedCourses([]);
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
      setPurchasedCourses(data.purchasedCourses);

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

  const markLessonStarted = async (courseId: string, lessonId: string) => {
    if (!user || !isSupabaseConfigured) return;

    const course = courses.find((item) => item.id === courseId);
    const hasAccess = course?.isPurchased ?? false;

    if (course && !hasAccess) {
      setError("Course locked.");
      return;
    }

    const alreadyCompleted = progress[courseId]?.completedLessons.includes(lessonId);
    if (alreadyCompleted) return;

    const { error: courseError } = await supabase.from("student_courses").upsert(
      {
        user_id: user.id,
        course_id: courseId,
      },
      { onConflict: "user_id,course_id" }
    );

    if (courseError) {
      setError(courseError.message);
      return;
    }

    const { error: lessonError } = await supabase.from("student_lessons").upsert(
      {
        user_id: user.id,
        lesson_id: lessonId,
        status: "started",
        progress: 1,
      },
      { onConflict: "user_id,lesson_id", ignoreDuplicates: true }
    );

    if (lessonError) {
      setError(lessonError.message);
      return;
    }

    const { error: activityError } = await supabase.from("student_activity_log").insert({
      user_id: user.id,
      type: "lesson_started",
      ref_id: lessonId,
      meta: { course_id: courseId },
    });

    if (activityError) {
      setError(activityError.message);
    }

    void refresh();
  };

  const markLessonComplete = async (courseId: string, lessonId: string) => {
    if (!user || !isSupabaseConfigured) return;

    const course = courses.find((item) => item.id === courseId);
    const lesson = course?.chapters.flatMap((chapter) => chapter.lessons).find((item) => item.id === lessonId);
    const hasAccess = course?.isPurchased ?? false;

    if (course && !hasAccess) {
      setError("Course locked.");
      return;
    }
    const alreadyCompleted = progress[courseId]?.completedLessons.includes(lessonId);

    if (alreadyCompleted) return;

    const { error: courseError } = await supabase.from("student_courses").upsert(
      {
        user_id: user.id,
        course_id: courseId,
      },
      { onConflict: "user_id,course_id" }
    );

    if (courseError) {
      setError(courseError.message);
      return;
    }

    const { error: progressError } = await supabase.from("student_lessons").upsert(
      {
        user_id: user.id,
        lesson_id: lessonId,
        status: "completed",
        progress: 100,
      },
      { onConflict: "user_id,lesson_id" }
    );

    if (progressError) {
      setError(progressError.message);
      return;
    }

    const { error: activityError } = await supabase.from("student_activity_log").insert({
      user_id: user.id,
      type: "lesson_completed",
      ref_id: lessonId,
      meta: { course_id: courseId },
    });

    if (activityError) {
      setError(activityError.message);
    }

    const durationMinutes =
      lesson?.durationMinutes ?? (lesson?.type === "quiz" ? 10 : 20);

    const { error: sessionError } = await supabase.from("study_sessions").insert({
      user_id: user.id,
      subject_id: course?.subjectId ?? null,
      duration_minutes: durationMinutes,
      session_date: formatDateKey(getBangladeshToday()),
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
    const lesson = course?.chapters.flatMap((chapter) => chapter.lessons).find((item) => item.id === quizId);
    const hasAccess = course?.isPurchased ?? false;

    if (course && !hasAccess) {
      setError("Course locked.");
      return;
    }

    const { error: quizError } = await supabase.from("student_quiz_attempts").insert({
      user_id: user.id,
      quiz_id: lesson?.id ?? quizId,
      score,
      total: 100,
    });

    if (quizError) {
      setError(quizError.message);
      return;
    }

    const resolvedLessonId = lesson?.id ?? quizId;
    const alreadyCompleted = progress[courseId]?.completedLessons.includes(resolvedLessonId);

    if (!alreadyCompleted) {
      const { error: courseError } = await supabase.from("student_courses").upsert(
        {
          user_id: user.id,
          course_id: courseId,
        },
        { onConflict: "user_id,course_id" }
      );

      if (courseError) {
        setError(courseError.message);
      }

      const { error: progressError } = await supabase.from("student_lessons").upsert(
        {
          user_id: user.id,
          lesson_id: resolvedLessonId,
          status: "completed",
          progress: 100,
        },
        { onConflict: "user_id,lesson_id" }
      );

      if (progressError) {
        setError(progressError.message);
      }

      const { error: activityError } = await supabase.from("student_activity_log").insert({
        user_id: user.id,
        type: "lesson_completed",
        ref_id: resolvedLessonId,
        meta: { course_id: courseId },
      });

      if (activityError) {
        setError(activityError.message);
      }

      const durationMinutes = lesson?.durationMinutes ?? 10;
      const { error: sessionError } = await supabase.from("study_sessions").insert({
        user_id: user.id,
        subject_id: course?.subjectId ?? null,
        duration_minutes: durationMinutes,
        session_date: formatDateKey(getBangladeshToday()),
      });

      if (sessionError) {
        setError(sessionError.message);
      }
    }

    setProgress((prev) => {
      const next = { ...prev };
      const courseProgress = next[courseId] || { completedLessons: [], quizScores: {} };
      const updatedLessons = new Set(courseProgress.completedLessons);
      updatedLessons.add(resolvedLessonId);
      next[courseId] = {
        ...courseProgress,
        completedLessons: Array.from(updatedLessons),
        quizScores: {
          ...courseProgress.quizScores,
          [resolvedLessonId]: score,
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
        purchasedCourses,
        refresh,
        markLessonStarted,
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
