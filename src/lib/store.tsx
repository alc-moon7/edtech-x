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
  type LeaderboardRecord,
  type PerformanceBar,
  type ProgressMap,
  type PurchasedChapterRecord,
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
  userId?: string;
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
  purchasedChapters: PurchasedChapterRecord[];
  refresh: () => Promise<void>;
  markLessonStarted: (courseId: string, lessonId?: string | null) => Promise<void>;
  markLessonComplete: (courseId: string, lessonId: string, content?: string) => Promise<void>;
  saveQuizScore: (courseId: string, quizId: string, score: number) => Promise<void>;
  logActivity: (
    type: string,
    options?: { refId?: string | null; meta?: Record<string, unknown>; courseId?: string }
  ) => Promise<void>;
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

const EMPTY_LEADERBOARD: LeaderboardEntry[] = [];

function normalizeClassLevel(value?: string | null) {
  if (!value) return null;
  const trimmed = value.trim();
  const numericMatch = trimmed.match(/^class\s*(\d{1,2})$/i) || trimmed.match(/^(\d{1,2})$/);
  if (numericMatch) {
    const level = numericMatch[1];
    if (level === "9" || level === "10") return "Class 9-10";
    if (level === "11" || level === "12") return "Class 11-12";
    return `Class ${level}`;
  }
  if (trimmed === "Class 9" || trimmed === "Class 10") return "Class 9-10";
  if (trimmed === "Class 11" || trimmed === "Class 12") return "Class 11-12";
  return trimmed;
}

function findLessonById(course: CourseData | undefined, lessonId?: string | null) {
  if (!course || !lessonId) return { lesson: undefined, chapter: undefined };
  for (const chapter of course.chapters ?? []) {
    const lesson = chapter.lessons.find((item) => item.id === lessonId);
    if (lesson) return { lesson, chapter };
  }
  return { lesson: undefined, chapter: undefined };
}

function isLessonUnlocked(course: CourseData | undefined, lessonId?: string | null) {
  if (!course || !lessonId) return false;
  if (course.isFree || course.isPurchased) return true;
  const { chapter } = findLessonById(course, lessonId);
  return Boolean(chapter?.isFree || chapter?.isPurchased);
}

function getFirstLessonId(course: CourseData | undefined) {
  if (!course) return null;
  for (const chapter of course.chapters ?? []) {
    if (chapter.lessons.length) {
      return chapter.lessons[0].id;
    }
  }
  return null;
}

function getLeaderboardAvatar(rank: number, highlight: boolean) {
  if (highlight) return "bg-primary";
  if (rank === 1) return "bg-yellow-500";
  if (rank === 2) return "bg-slate-400";
  if (rank === 3) return "bg-orange-400";
  return "bg-slate-300";
}

function buildLeaderboardEntries(
  rows: LeaderboardRecord[] | null | undefined,
  currentUserId?: string
) {
  const safeRows = rows ?? [];
  return safeRows.map((row, index) => {
    const rank = row.rank || index + 1;
    const isCurrentUser = Boolean(currentUserId && row.user_id === currentUserId);
    const name = row.full_name?.trim() || `Student ${rank}`;
    return {
      rank,
      name: isCurrentUser ? "You" : name,
      points: row.total_points ?? 0,
      avatar: getLeaderboardAvatar(rank, isCurrentUser),
      userId: row.user_id,
    } satisfies LeaderboardEntry;
  });
}

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [progress, setProgress] = useState<ProgressMap>({});
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(EMPTY_LEADERBOARD);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>(EMPTY_STATS);
  const [subjectCards, setSubjectCards] = useState<SubjectCard[]>([]);
  const [performanceBars, setPerformanceBars] = useState<PerformanceBar[]>([]);
  const [studyHours, setStudyHours] = useState<number[]>([0, 0, 0, 0]);
  const [upcomingTests, setUpcomingTests] = useState<UpcomingTest[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEventRecord[]>([]);
  const [studySessions, setStudySessions] = useState<StudySessionRecord[]>([]);
  const [purchasedCourses, setPurchasedCourses] = useState<PurchasedCourseRecord[]>([]);
  const [purchasedChapters, setPurchasedChapters] = useState<PurchasedChapterRecord[]>([]);

  const resetState = () => {
    setCourses([]);
    setProgress({});
    setLeaderboard(EMPTY_LEADERBOARD);
    setDashboardStats(EMPTY_STATS);
    setSubjectCards([]);
    setPerformanceBars([]);
    setStudyHours([0, 0, 0, 0]);
    setUpcomingTests([]);
    setCalendarEvents([]);
    setStudySessions([]);
    setPurchasedCourses([]);
    setPurchasedChapters([]);
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

    const classLevel = normalizeClassLevel(user.user_metadata?.class ?? null);

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
      setPurchasedChapters(data.purchasedChapters);
      setLeaderboard(buildLeaderboardEntries(data.leaderboard, user.id));
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

  const logActivity = async (
    type: string,
    options: { refId?: string | null; meta?: Record<string, unknown>; courseId?: string } = {}
  ) => {
    if (!user || !isSupabaseConfigured) return;
    const { refId = null, meta = {}, courseId } = options;

    if (courseId) {
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
    }

    const { error: activityError } = await supabase.from("student_activity_log").insert({
      user_id: user.id,
      type,
      ref_id: refId,
      meta,
    });

    if (activityError) {
      setError(activityError.message);
      return;
    }

    void refresh();
  };

  const markLessonStarted = async (courseId: string, lessonId?: string | null) => {
    if (!user || !isSupabaseConfigured) return;

    const course = courses.find((item) => item.id === courseId);
    const resolvedLessonId = lessonId ?? getFirstLessonId(course);
    const hasAccess = isLessonUnlocked(course, resolvedLessonId);

    if (!resolvedLessonId) {
      setError("Lesson not found.");
      return;
    }

    if (course && !hasAccess) {
      setError("Chapter locked.");
      return;
    }

    const alreadyCompleted = progress[courseId]?.completedLessons.includes(resolvedLessonId);
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
        lesson_id: resolvedLessonId,
        chapter_id: findLessonById(course, resolvedLessonId).chapter?.id ?? null,
        status: "started",
        progress: 1,
        completed: false,
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
      ref_id: resolvedLessonId,
      meta: { course_id: courseId },
    });

    if (activityError) {
      setError(activityError.message);
    }

    void refresh();
  };

  const markLessonComplete = async (courseId: string, lessonId: string, content?: string) => {
    if (!user || !isSupabaseConfigured) return;

    const course = courses.find((item) => item.id === courseId);
    const { lesson } = findLessonById(course, lessonId);
    const hasAccess = isLessonUnlocked(course, lessonId);

    if (course && !hasAccess) {
      setError("Chapter locked.");
      return;
    }
    const alreadyCompleted = progress[courseId]?.completedLessons.includes(lessonId);

    if (alreadyCompleted && !content) return;
    if (alreadyCompleted && content) {
      const { error: contentError } = await supabase
        .from("student_lessons")
        .update({ content })
        .eq("user_id", user.id)
        .eq("lesson_id", lessonId);

      if (contentError) {
        setError(contentError.message);
      }
      return;
    }

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

    const lessonPayload = {
      user_id: user.id,
      lesson_id: lessonId,
      chapter_id: findLessonById(course, lessonId).chapter?.id ?? course?.chapters?.[0]?.id ?? null,
      status: "completed",
      progress: 100,
      completed: true,
      ...(content ? { content } : {}),
    };
    const { error: progressError } = await supabase
      .from("student_lessons")
      .upsert(lessonPayload, { onConflict: "user_id,lesson_id" });

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
    const { lesson } = findLessonById(course, quizId);
    const resolvedLessonId = lesson?.id ?? quizId;
    const hasAccess = isLessonUnlocked(course, resolvedLessonId);

    if (course && !hasAccess) {
      setError("Chapter locked.");
      return;
    }

    const { error: quizError } = await supabase.from("student_quiz_attempts").insert({
      user_id: user.id,
      quiz_id: resolvedLessonId,
      score,
      total: 100,
    });

    if (quizError) {
      setError(quizError.message);
      return;
    }

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
          chapter_id: findLessonById(course, resolvedLessonId).chapter?.id ?? course?.chapters?.[0]?.id ?? null,
          status: "completed",
          progress: 100,
          completed: true,
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
        purchasedChapters,
        refresh,
        markLessonStarted,
        markLessonComplete,
        saveQuizScore,
        logActivity,
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
