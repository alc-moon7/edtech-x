"use client";

import { supabase } from "@/lib/supabaseClient";
import { formatDateKey, getBangladeshToday, parseDateKey } from "@/lib/date";

const MS_DAY = 24 * 60 * 60 * 1000;

export type SubjectRecord = {
  id: string;
  name: string;
  class_level: string;
};

export type CourseRecord = {
  id: string;
  title: string;
  class_level: string;
  description: string | null;
  is_free: boolean;
  subject_id: string;
  subject?: { id: string; name: string } | null;
};

export type ChapterRecord = {
  id: string;
  course_id: string;
  title: string;
  order_no: number;
  is_free: boolean;
  duration_minutes: number | null;
};

export type LessonRecord = {
  id: string;
  course_id: string;
  chapter_id: string;
  title: string;
  order_no: number;
  type: "video" | "article" | "quiz";
  duration_minutes: number | null;
  quiz_question_count: number | null;
};

export type EnrollmentRecord = {
  course_id: string;
  status: "ongoing" | "completed";
};

export type StudentCourseRecord = {
  course_id: string;
  started_at: string | null;
};

export type StudentLessonRecord = {
  lesson_id: string;
  status: "started" | "completed";
  progress: number;
  updated_at: string;
};

export type StudentQuizAttemptRecord = {
  quiz_id: string;
  score: number;
  total: number;
  created_at: string;
};

export type StudentActivityRecord = {
  type: string;
  ref_id: string | null;
  created_at: string;
};

export type LeaderboardRecord = {
  user_id: string;
  full_name: string | null;
  total_points: number;
  rank: number;
};

export type PurchasedCourseRecord = {
  course_id: string;
  purchased_at: string;
  plan_id?: string | null;
  expires_at?: string | null;
};

export type LessonProgressRecord = {
  lesson_id: string;
  course_id: string;
  completed: boolean;
  progress_percent: number;
};

export type QuizAttemptRecord = {
  lesson_id: string | null;
  subject_id: string | null;
  score: number;
  created_at: string;
};

export type StudySessionRecord = {
  subject_id: string | null;
  duration_minutes: number;
  session_date: string;
};

export type CalendarEventRecord = {
  id: string;
  title: string;
  date: string;
  type: "holiday" | "exam" | "study";
  class_level: string | null;
};

export type CourseLesson = {
  id: string;
  title: string;
  type: "video" | "article" | "quiz";
  duration?: string;
  durationMinutes?: number;
  questions?: number;
};

export type CourseChapter = {
  id: string;
  title: string;
  order?: number;
  isFree?: boolean;
  durationMinutes?: number;
  lessons: CourseLesson[];
};

export type CourseData = {
  id: string;
  title: string;
  class: string;
  description: string;
  subjectId?: string;
  subjectName?: string;
  image: string;
  color: string;
  cover: string;
  status?: "ongoing" | "completed";
  isPurchased?: boolean;
  isFree?: boolean;
  chapters: CourseChapter[];
};

export type ProgressMap = Record<
  string,
  {
    completedLessons: string[];
    quizScores: Record<string, number>;
  }
>;

export type SubjectCard = {
  key: string;
  title: string;
  lessons: string;
  progress: number;
  accent: string;
};

export type PerformanceBar = {
  key: string;
  label: string;
  value: number;
};

export type UpcomingTest = {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  accent: string;
};

export type DashboardStats = {
  streakDays: number;
  totalHours: number;
  averageScore: number;
  lessonsDone: number;
  lessonsTotal: number;
  weeklyActivity: boolean[];
  weeklyStudyHours: number[];
  totalPoints: number;
  lastActivity?: string | null;
};

export type DashboardData = {
  classLevel: string | null;
  subjects: SubjectRecord[];
  courses: CourseData[];
  progress: ProgressMap;
  stats: DashboardStats;
  leaderboard: LeaderboardRecord[];
  subjectCards: SubjectCard[];
  performanceBars: PerformanceBar[];
  upcomingTests: UpcomingTest[];
  calendarEvents: CalendarEventRecord[];
  studySessions: StudySessionRecord[];
  enrollments: EnrollmentRecord[];
  quizAttempts: QuizAttemptRecord[];
  purchasedCourses: PurchasedCourseRecord[];
};

const SUBJECT_STYLES: Record<
  string,
  {
    accent: string;
    cover: string;
    color: string;
    image: string;
  }
> = {
  mathematics: {
    accent: "bg-blue-500",
    cover: "from-indigo-600 via-blue-500 to-indigo-700",
    color: "primary",
    image: "bg-blue-100",
  },
  science: {
    accent: "bg-emerald-500",
    cover: "from-emerald-600 via-emerald-500 to-emerald-700",
    color: "secondary",
    image: "bg-emerald-100",
  },
  english: {
    accent: "bg-fuchsia-500",
    cover: "from-fuchsia-600 via-purple-500 to-indigo-600",
    color: "secondary",
    image: "bg-fuchsia-100",
  },
  "social studies": {
    accent: "bg-orange-500",
    cover: "from-orange-600 via-amber-500 to-orange-700",
    color: "secondary",
    image: "bg-orange-100",
  },
  ict: {
    accent: "bg-slate-500",
    cover: "from-slate-600 via-slate-500 to-slate-700",
    color: "secondary",
    image: "bg-slate-100",
  },
  bangla: {
    accent: "bg-emerald-500",
    cover: "from-emerald-600 via-teal-500 to-emerald-700",
    color: "secondary",
    image: "bg-emerald-100",
  },
};

const DEFAULT_STYLE = {
  accent: "bg-blue-500",
  cover: "from-blue-600 via-blue-500 to-blue-700",
  color: "primary",
  image: "bg-blue-100",
};

export function getSubjectStyle(name?: string | null) {
  if (!name) return DEFAULT_STYLE;
  const key = name.trim().toLowerCase();
  return SUBJECT_STYLES[key] ?? DEFAULT_STYLE;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * MS_DAY);
}

function toDateKey(date: Date) {
  return formatDateKey(date);
}

function startOfDay(date: Date) {
  return parseDateKey(formatDateKey(date));
}

function formatMinutes(minutes: number | null) {
  if (!minutes || minutes <= 0) return undefined;
  return `${minutes} min`;
}

function isPurchaseActive(purchase: PurchasedCourseRecord) {
  if (!purchase.expires_at) return true;
  const expiry = new Date(purchase.expires_at).getTime();
  return Number.isFinite(expiry) && expiry > Date.now();
}

function buildActivityDateSet(activityLog: StudentActivityRecord[]) {
  const dates = new Set<string>();
  activityLog.forEach((item) => {
    dates.add(formatDateKey(new Date(item.created_at)));
  });
  return dates;
}

function calculateWeeklyActivity(activityDates: Set<string>) {
  const activity = Array(7).fill(false);
  const now = startOfDay(new Date());
  const weekStart = addDays(now, -now.getUTCDay());

  for (let i = 0; i < 7; i += 1) {
    const dateKey = toDateKey(addDays(weekStart, i));
    activity[i] = activityDates.has(dateKey);
  }
  return activity;
}

function calculateStreakDays(activityDates: Set<string>) {
  if (!activityDates.size) return 0;
  const today = startOfDay(new Date());
  let streak = 0;

  for (let i = 0; i < 365; i += 1) {
    const dateKey = toDateKey(addDays(today, -i));
    if (activityDates.has(dateKey)) {
      streak += 1;
    } else {
      break;
    }
  }
  return streak;
}

function mergeActivityIntoStudySessions(
  sessions: StudySessionRecord[],
  activityDates: Set<string>
) {
  const sessionDates = new Set(sessions.map((item) => item.session_date));
  const merged = [...sessions];

  activityDates.forEach((date) => {
    if (!sessionDates.has(date)) {
      merged.push({ subject_id: null, duration_minutes: 0, session_date: date });
    }
  });

  return merged;
}

function calculateWeeklyStudyHours(sessions: StudySessionRecord[]) {
  const now = startOfDay(new Date());
  const start = addDays(now, -27);
  const buckets = [0, 0, 0, 0];

  sessions.forEach((session) => {
    const date = parseDateKey(session.session_date);
    const diff = date.getTime() - start.getTime();
    const dayOffset = Math.floor(diff / MS_DAY);
    if (dayOffset < 0 || dayOffset >= 28) return;
    const weekIndex = Math.floor(dayOffset / 7);
    buckets[weekIndex] += session.duration_minutes;
  });

  return buckets.map((minutes) => Math.round((minutes / 60) * 10) / 10);
}

function calculateTotalHours(sessions: StudySessionRecord[]) {
  const totalMinutes = sessions.reduce((acc, session) => acc + session.duration_minutes, 0);
  return Math.round(totalMinutes / 60);
}

function calculateAverageScore(attempts: QuizAttemptRecord[]) {
  if (!attempts.length) return 0;
  const total = attempts.reduce((acc, attempt) => acc + attempt.score, 0);
  return Math.round(total / attempts.length);
}

function calculateTotalPoints(attempts: QuizAttemptRecord[]) {
  return Math.round(attempts.reduce((acc, attempt) => acc + attempt.score, 0));
}

function buildProgressMap(
  lessons: LessonRecord[],
  lessonProgress: LessonProgressRecord[],
  quizAttempts: QuizAttemptRecord[]
) {
  const progress: ProgressMap = {};
  const lessonToCourse = new Map<string, string>();

  lessons.forEach((lesson) => {
    lessonToCourse.set(lesson.id, lesson.course_id);
  });

  lessonProgress.forEach((item) => {
    if (!progress[item.course_id]) {
      progress[item.course_id] = { completedLessons: [], quizScores: {} };
    }
    if (item.completed) {
      progress[item.course_id].completedLessons.push(item.lesson_id);
    }
  });

  const sortedAttempts = [...quizAttempts].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  sortedAttempts.forEach((attempt) => {
    if (!attempt.lesson_id) return;
    const courseId = lessonToCourse.get(attempt.lesson_id);
    if (!courseId) return;
    if (!progress[courseId]) {
      progress[courseId] = { completedLessons: [], quizScores: {} };
    }
    progress[courseId].quizScores[attempt.lesson_id] = attempt.score;
  });

  return progress;
}

function buildEnrollmentsFromProgress(
  studentCourses: StudentCourseRecord[],
  lessons: LessonRecord[],
  lessonProgress: LessonProgressRecord[]
) {
  const lessonsByCourse = lessons.reduce<Record<string, LessonRecord[]>>((acc, lesson) => {
    if (!acc[lesson.course_id]) acc[lesson.course_id] = [];
    acc[lesson.course_id].push(lesson);
    return acc;
  }, {});
  const completedByCourse = lessonProgress.reduce<Record<string, number>>((acc, item) => {
    if (!item.completed) return acc;
    acc[item.course_id] = (acc[item.course_id] ?? 0) + 1;
    return acc;
  }, {});
  const courseIds = new Set<string>();
  studentCourses.forEach((record) => courseIds.add(record.course_id));
  lessonProgress.forEach((record) => courseIds.add(record.course_id));

  return Array.from(courseIds).map((courseId) => {
    const total = lessonsByCourse[courseId]?.length ?? 0;
    const completed = completedByCourse[courseId] ?? 0;
    return {
      course_id: courseId,
      status: total > 0 && completed >= total ? "completed" : "ongoing",
    } satisfies EnrollmentRecord;
  });
}

function buildCourses(
  courses: CourseRecord[],
  chapters: ChapterRecord[],
  lessons: LessonRecord[],
  enrollments: EnrollmentRecord[],
  purchasedCourses: PurchasedCourseRecord[]
) {
  const lessonsByChapter = lessons.reduce<Record<string, LessonRecord[]>>((acc, lesson) => {
    if (!acc[lesson.chapter_id]) acc[lesson.chapter_id] = [];
    acc[lesson.chapter_id].push(lesson);
    return acc;
  }, {});
  const chaptersByCourse = chapters.reduce<Record<string, ChapterRecord[]>>((acc, chapter) => {
    if (!acc[chapter.course_id]) acc[chapter.course_id] = [];
    acc[chapter.course_id].push(chapter);
    return acc;
  }, {});
  const enrollmentMap = new Map(enrollments.map((enrollment) => [enrollment.course_id, enrollment.status]));
  const purchasedSet = new Set(
    purchasedCourses.filter((purchase) => isPurchaseActive(purchase)).map((item) => item.course_id)
  );

  return courses.map((course) => {
    const subjectName = course.subject?.name ?? "";
    const style = getSubjectStyle(subjectName || course.title);
    const courseChapters = (chaptersByCourse[course.id] ?? []).sort((a, b) => a.order_no - b.order_no);
    const isFree = course.is_free ?? false;
    const isPurchased = purchasedSet.has(course.id);
    const resolvedChapters = courseChapters.length
      ? courseChapters
      : [
          {
            id: `${course.id}-chapter-1`,
            course_id: course.id,
            title: "Chapter 1",
            order_no: 1,
            is_free: true,
            duration_minutes: null,
          } satisfies ChapterRecord,
        ];
    const chapterData: CourseChapter[] = resolvedChapters.map((chapter) => {
      const chapterLessons = (lessonsByChapter[chapter.id] ?? []).sort((a, b) => a.order_no - b.order_no);
      return {
        id: chapter.id,
        title: chapter.title,
        order: chapter.order_no,
        isFree: chapter.is_free ?? false,
        durationMinutes: chapter.duration_minutes ?? undefined,
        lessons: chapterLessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          type: lesson.type,
          duration: formatMinutes(lesson.duration_minutes),
          durationMinutes: lesson.duration_minutes ?? undefined,
          questions: lesson.quiz_question_count ?? undefined,
        })),
      };
    });

    return {
      id: course.id,
      title: course.title,
      class: course.class_level,
      description: course.description ?? "",
      subjectId: course.subject_id,
      subjectName,
      image: style.image,
      color: style.color,
      cover: style.cover,
      status: enrollmentMap.get(course.id),
      isPurchased,
      isFree,
      chapters: chapterData,
    } satisfies CourseData;
  });
}

function buildSubjectCards(
  subjects: SubjectRecord[],
  courses: CourseRecord[],
  lessons: LessonRecord[],
  lessonProgress: LessonProgressRecord[]
) {
  const lessonCompleted = new Set(
    lessonProgress.filter((item) => item.completed).map((item) => item.lesson_id)
  );
  const progressByLesson = new Map(
    lessonProgress.map((item) => [item.lesson_id, item.progress_percent])
  );
  const lessonsByCourse = lessons.reduce<Record<string, LessonRecord[]>>((acc, lesson) => {
    if (!acc[lesson.course_id]) acc[lesson.course_id] = [];
    acc[lesson.course_id].push(lesson);
    return acc;
  }, {});

  return subjects.map((subject) => {
    const subjectCourses = courses.filter((course) => course.subject_id === subject.id);
    const allLessons = subjectCourses.flatMap((course) => lessonsByCourse[course.id] ?? []);
    const total = allLessons.length;
    const completed = allLessons.filter((lesson) => lessonCompleted.has(lesson.id)).length;
    const totalProgress = allLessons.reduce(
      (acc, lesson) => acc + (progressByLesson.get(lesson.id) ?? 0),
      0
    );
    const progress = total ? Math.round(totalProgress / total) : 0;
    const clampedProgress = Math.min(progress, 100);
    const style = getSubjectStyle(subject.name);

    return {
      key: slugify(subject.name),
      title: subject.name,
      lessons: `${completed}/${total || 0}`,
      progress: clampedProgress,
      accent: style.accent,
    } satisfies SubjectCard;
  });
}

function buildPerformanceBars(subjects: SubjectRecord[], attempts: QuizAttemptRecord[]) {
  const attemptsBySubject = attempts.reduce<Record<string, QuizAttemptRecord[]>>((acc, attempt) => {
    if (!attempt.subject_id) return acc;
    if (!acc[attempt.subject_id]) acc[attempt.subject_id] = [];
    acc[attempt.subject_id].push(attempt);
    return acc;
  }, {});

  return subjects.map((subject) => {
    const items = attemptsBySubject[subject.id] ?? [];
    const avg = calculateAverageScore(items);
    return {
      key: slugify(subject.name),
      label: subject.name,
      value: avg,
    } satisfies PerformanceBar;
  });
}

function buildUpcomingTests(events: CalendarEventRecord[]) {
  const today = toDateKey(new Date());
  const upcoming = events
    .filter((event) => event.type === "exam" && event.date >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return upcoming.map((event, index) => ({
    id: event.id,
    title: event.title,
    subtitle: "Upcoming exam",
    date: event.date,
    time: "10:00 AM",
    accent:
      index === 0
        ? "bg-purple-100 text-purple-600"
        : index === 1
          ? "bg-blue-100 text-blue-600"
          : "bg-emerald-100 text-emerald-600",
  }));
}

function getLessonsTotal(courses: CourseRecord[], lessons: LessonRecord[], enrollments: EnrollmentRecord[]) {
  const lessonsByCourse = lessons.reduce<Record<string, LessonRecord[]>>((acc, lesson) => {
    if (!acc[lesson.course_id]) acc[lesson.course_id] = [];
    acc[lesson.course_id].push(lesson);
    return acc;
  }, {});

  if (enrollments.length) {
    return enrollments.reduce((acc, enrollment) => acc + (lessonsByCourse[enrollment.course_id]?.length ?? 0), 0);
  }

  return courses.reduce((acc, course) => acc + (lessonsByCourse[course.id]?.length ?? 0), 0);
}

function getLessonsDone(lessonProgress: LessonProgressRecord[], enrollments: EnrollmentRecord[]) {
  if (!lessonProgress.length) return 0;
  if (!enrollments.length) return lessonProgress.filter((item) => item.completed).length;
  const enrolledCourses = new Set(enrollments.map((item) => item.course_id));
  return lessonProgress.filter((item) => item.completed && enrolledCourses.has(item.course_id)).length;
}

export async function fetchDashboardData(userId: string, classLevel?: string | null): Promise<DashboardData> {
  let resolvedClassLevel = classLevel ?? null;

  const { data: profileData, error: profileError } = await supabase
    .from("user_profiles")
    .select("class_level")
    .eq("user_id", userId)
    .maybeSingle();

  if (profileError) {
    throw new Error(profileError.message);
  }

  resolvedClassLevel = resolvedClassLevel ?? profileData?.class_level ?? null;

  if (!resolvedClassLevel) {
    return {
      classLevel: null,
      subjects: [],
      courses: [],
      progress: {},
      stats: {
        streakDays: 0,
        totalHours: 0,
        averageScore: 0,
        lessonsDone: 0,
        lessonsTotal: 0,
        weeklyActivity: Array(7).fill(false),
        weeklyStudyHours: [0, 0, 0, 0],
        totalPoints: 0,
        lastActivity: null,
      },
      leaderboard: [],
      subjectCards: [],
      performanceBars: [],
      upcomingTests: [],
      calendarEvents: [],
      studySessions: [],
      enrollments: [],
      quizAttempts: [],
      purchasedCourses: [],
    };
  }

  const { data: subjects, error: subjectsError } = await supabase
    .from("subjects")
    .select("id,name,class_level")
    .eq("class_level", resolvedClassLevel);
  if (subjectsError) {
    throw new Error(subjectsError.message);
  }

  const { data: courses, error: coursesError } = await supabase
    .from("courses")
    .select("id,title,class_level,description,is_free,subject_id,subject:subjects(id,name)")
    .eq("class_level", resolvedClassLevel);
  if (coursesError) {
    throw new Error(coursesError.message);
  }

  const courseIds = (courses ?? []).map((course) => course.id);

  const { data: chapters, error: chapterError } = courseIds.length
    ? await supabase
        .from("chapters")
        .select("id,course_id,title,order_no,is_free,duration_minutes")
        .in("course_id", courseIds)
        .order("order_no", { ascending: true })
    : { data: [], error: null };
  if (chapterError) {
    throw new Error(chapterError.message);
  }

  const { data: lessons, error: lessonsError } = courseIds.length
    ? await supabase
        .from("lessons")
        .select("id,course_id,chapter_id,title,order_no,type,duration_minutes,quiz_question_count")
        .in("course_id", courseIds)
        .order("order_no", { ascending: true })
    : { data: [], error: null };
  if (lessonsError) {
    throw new Error(lessonsError.message);
  }

  const { data: purchasedCourses, error: purchaseError } = await supabase
    .from("purchased_courses")
    .select("course_id,purchased_at,plan_id,expires_at")
    .eq("user_id", userId);
  if (purchaseError) {
    throw new Error(purchaseError.message);
  }

  const { data: studentCourses, error: studentCoursesError } = await supabase
    .from("student_courses")
    .select("course_id,started_at")
    .eq("user_id", userId);
  if (studentCoursesError) {
    throw new Error(studentCoursesError.message);
  }

  const { data: studentLessons, error: studentLessonsError } = await supabase
    .from("student_lessons")
    .select("lesson_id,status,progress,updated_at")
    .eq("user_id", userId);
  if (studentLessonsError) {
    throw new Error(studentLessonsError.message);
  }

  const ninetyDaysAgo = toDateKey(addDays(startOfDay(new Date()), -90));
  const { data: studentQuizAttempts, error: studentQuizError } = await supabase
    .from("student_quiz_attempts")
    .select("quiz_id,score,total,created_at")
    .eq("user_id", userId)
    .gte("created_at", `${ninetyDaysAgo}T00:00:00Z`);
  if (studentQuizError) {
    throw new Error(studentQuizError.message);
  }

  const activityStart = toDateKey(addDays(startOfDay(new Date()), -365));
  const { data: activityLog, error: activityError } = await supabase
    .from("student_activity_log")
    .select("type,ref_id,created_at")
    .eq("user_id", userId)
    .gte("created_at", `${activityStart}T00:00:00Z`)
    .order("created_at", { ascending: false });
  if (activityError) {
    throw new Error(activityError.message);
  }

  const sixtyDaysAgo = toDateKey(addDays(startOfDay(new Date()), -60));
  const { data: studySessions, error: sessionsError } = await supabase
    .from("study_sessions")
    .select("subject_id,duration_minutes,session_date")
    .eq("user_id", userId)
    .gte("session_date", sixtyDaysAgo);
  if (sessionsError) {
    throw new Error(sessionsError.message);
  }

  const now = getBangladeshToday();
  const monthStart = toDateKey(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)));
  const monthEnd = toDateKey(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0)));
  const { data: classEvents, error: classEventError } = await supabase
    .from("calendar_events")
    .select("id,title,date,type,class_level")
    .eq("class_level", resolvedClassLevel)
    .gte("date", monthStart)
    .lte("date", monthEnd);
  if (classEventError) {
    throw new Error(classEventError.message);
  }

  const { data: globalEvents, error: globalEventError } = await supabase
    .from("calendar_events")
    .select("id,title,date,type,class_level")
    .is("class_level", null)
    .gte("date", monthStart)
    .lte("date", monthEnd);
  if (globalEventError) {
    throw new Error(globalEventError.message);
  }

  const { data: leaderboardRows, error: leaderboardError } = await supabase.rpc("get_leaderboard", {
    limit_count: 5,
  });
  const leaderboard = leaderboardError ? [] : (leaderboardRows as LeaderboardRecord[] | null) ?? [];

  const calendarEvents = [...(classEvents ?? []), ...(globalEvents ?? [])];
  const activityDateSet = buildActivityDateSet(activityLog ?? []);
  const mergedStudySessions = mergeActivityIntoStudySessions(studySessions ?? [], activityDateSet);
  const lessonToCourse = new Map((lessons ?? []).map((lesson) => [lesson.id, lesson.course_id]));
  const courseToSubject = new Map((courses ?? []).map((course) => [course.id, course.subject_id]));
  const lessonProgress = (studentLessons ?? [])
    .map((item) => {
      const courseId = lessonToCourse.get(item.lesson_id);
      if (!courseId) return null;
      return {
        lesson_id: item.lesson_id,
        course_id: courseId,
        completed: item.status === "completed",
        progress_percent: item.progress,
      } satisfies LessonProgressRecord;
    })
    .filter(Boolean) as LessonProgressRecord[];
  const quizAttempts = (studentQuizAttempts ?? [])
    .map((attempt) => {
      const courseId = lessonToCourse.get(attempt.quiz_id);
      const subjectId = courseId ? courseToSubject.get(courseId) ?? null : null;
      const total = attempt.total || 0;
      const percentScore = total > 0 ? Math.round((attempt.score / total) * 100) : attempt.score;
      return {
        lesson_id: attempt.quiz_id,
        subject_id: subjectId,
        score: percentScore,
        created_at: attempt.created_at,
      } satisfies QuizAttemptRecord;
    })
    .filter(Boolean) as QuizAttemptRecord[];
  const enrollments = buildEnrollmentsFromProgress(studentCourses ?? [], lessons ?? [], lessonProgress);
  const progress = buildProgressMap(lessons ?? [], lessonProgress ?? [], quizAttempts);
  const coursesData = buildCourses(
    courses ?? [],
    chapters ?? [],
    lessons ?? [],
    enrollments,
    purchasedCourses ?? []
  );
  const subjectCards = buildSubjectCards(subjects ?? [], courses ?? [], lessons ?? [], lessonProgress);
  const performanceBars = buildPerformanceBars(subjects ?? [], quizAttempts);
  const weeklyActivity = calculateWeeklyActivity(activityDateSet);
  const weeklyStudyHours = calculateWeeklyStudyHours(mergedStudySessions);
  const streakDays = calculateStreakDays(activityDateSet);
  const totalHours = calculateTotalHours(mergedStudySessions);
  const averageScore = calculateAverageScore(quizAttempts);
  const totalPoints = calculateTotalPoints(quizAttempts);
  const lessonsTotal = getLessonsTotal(courses ?? [], lessons ?? [], enrollments);
  const lessonsDone = getLessonsDone(lessonProgress, enrollments);
  const upcomingTests = buildUpcomingTests(calendarEvents);
  const lastActivity = activityLog?.[0]?.created_at ?? null;

  return {
    classLevel: resolvedClassLevel,
    subjects: subjects ?? [],
    courses: coursesData,
    progress,
    stats: {
      streakDays,
      totalHours,
      averageScore,
      lessonsDone,
      lessonsTotal,
      weeklyActivity,
      weeklyStudyHours,
      totalPoints,
      lastActivity,
    },
    leaderboard,
    subjectCards,
    performanceBars,
    upcomingTests,
    calendarEvents,
    studySessions: mergedStudySessions,
    enrollments,
    quizAttempts,
    purchasedCourses: purchasedCourses ?? [],
  };
}
