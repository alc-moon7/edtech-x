"use client";

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Brain,
  Calculator,
  ClipboardList,
  Clock,
  FlaskConical,
  Globe2,
  Lock,
  Monitor,
  PenLine,
  Send,
  Sparkles,
} from "lucide-react";
import { useStudent } from "@/lib/store";
import { useLanguage, useTranslate } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { QuizComponent, type QuizQuestion } from "@/components/learning/QuizComponent";
import { invokeEdgeFunction } from "@/lib/supabaseClient";
import { startCourseCheckout } from "@/lib/payments";

type TabKey = "brainbite" | "lesson" | "quiz";

const tabs: { key: TabKey; label: { en: string; bn: string }; icon: React.ElementType }[] = [
  { key: "brainbite", label: { en: "BrainBite", bn: "BrainBite" }, icon: Sparkles },
  { key: "lesson", label: { en: "AI Lesson Generator", bn: "AI Lesson Generator" }, icon: Brain },
  { key: "quiz", label: { en: "AI Quiz Generator", bn: "AI Quiz Generator" }, icon: ClipboardList },
];

function getSubjectIcon(subject: string) {
  const key = subject.toLowerCase();
  if (key.includes("math")) return Calculator;
  if (key.includes("science")) return FlaskConical;
  if (key.includes("english")) return PenLine;
  if (key.includes("social")) return Globe2;
  if (key.includes("ict")) return Monitor;
  return BookOpen;
}

function getChapterDurationMinutes(lessons: { durationMinutes?: number }[], fallback = 40) {
  const minutes = lessons.reduce((acc, lesson) => acc + (lesson.durationMinutes ?? 0), 0);
  return minutes > 0 ? minutes : fallback;
}

async function parseFunctionError(error: unknown) {
  if (error && typeof error === "object" && "error" in error) {
    return error as Record<string, unknown>;
  }
  const context = (error as { context?: { response?: Response } }).context;
  if (!context?.response) return null;
  const response = context.response.clone();
  const payload = await response.json().catch(() => null);
  return payload;
}

function LockedChapterNotice({
  onUpgrade,
  isPaying,
  errorMessage,
}: {
  onUpgrade: () => void;
  isPaying: boolean;
  errorMessage: string | null;
}) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-slate-700">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <Lock className="h-5 w-5" />
        </div>
        <div>
          <div className="text-lg font-semibold">Chapter locked</div>
          <div className="text-sm text-amber-800/80">
            Upgrade your plan to unlock this chapter and continue learning.
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button onClick={onUpgrade} disabled={isPaying}>
          {isPaying ? "Redirecting..." : "Upgrade plan"}
        </Button>
        {errorMessage && <span className="text-sm text-red-600">{errorMessage}</span>}
      </div>
    </div>
  );
}

function BrainBitePanel({
  classLevel,
  subject,
  chapter,
  disabled,
}: {
  courseId: string;
  classLevel: string;
  subject: string;
  chapter: string;
  disabled: boolean;
}) {
  const t = useTranslate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [entries, setEntries] = useState<string[]>([]);

  useEffect(() => {
    setEntries([]);
    setError(null);
  }, [classLevel, subject, chapter]);

  const handleGenerate = async () => {
    if (disabled || loading) return;
    setLoading(true);
    setError(null);
    const prompt = [
      `Create a short, fun BrainBite for ${subject}.`,
      `Topic: ${chapter}.`,
      `Class level: ${classLevel}.`,
      "Use 2-3 short sentences, add a friendly emoji, and keep it simple.",
      "End with a gentle prompt question.",
    ].join(" ");

    const { data, error: fnError } = await invokeEdgeFunction<{ reply?: string }>("site-chat", {
      message: prompt,
      mode: "brainbite",
      subject,
      chapter,
      classLevel,
    });

    if (fnError || !data?.reply) {
      setError(t({ en: "BrainBite failed. Please try again.", bn: "BrainBite failed. Please try again." }));
      setLoading(false);
      return;
    }

    setEntries((prev) => [...prev, data.reply as string]);
    setLoading(false);
  };

  const latest = entries[entries.length - 1];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <Sparkles className="h-6 w-6" />
        </div>
        <div className="text-lg font-semibold">{t({ en: "Hi, I am BrainBite", bn: "Hi, I am BrainBite" })}</div>
        <div className="mt-1 text-sm text-slate-500">
          {t({ en: "Topic", bn: "Topic" })}: {chapter}
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-center text-sm text-slate-700">
        {latest ?? t({ en: "Let's start!", bn: "Let's start!" })}
      </div>

      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}

      <div className="mt-6 flex justify-center">
        <Button onClick={handleGenerate} disabled={loading || disabled}>
          {loading ? t({ en: "Generating...", bn: "Generating..." }) : t({ en: "Continue", bn: "Continue" })}
        </Button>
      </div>
    </div>
  );
}

type LessonMessage = {
  role: "user" | "assistant";
  content: string;
};

function LessonGeneratorPanel({
  classLevel,
  subject,
  chapter,
  disabled,
}: {
  courseId: string;
  classLevel: string;
  subject: string;
  chapter: string;
  disabled: boolean;
}) {
  const t = useTranslate();
  const [messages, setMessages] = useState<LessonMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `Hi! I'm your AI tutor for ${subject}. Ask me anything about ${chapter}.`,
      },
    ]);
    setInput("");
    setError(null);
  }, [subject, chapter]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading || disabled) return;
    setLoading(true);
    setError(null);
    const nextHistory = [...messages, { role: "user", content: trimmed }];
    setMessages(nextHistory);
    setInput("");

    const { data, error: fnError } = await invokeEdgeFunction<{ reply?: string }>("site-chat", {
      message: trimmed,
      history: nextHistory,
      mode: "lesson",
      subject,
      chapter,
      classLevel,
    });

    if (fnError || !data?.reply) {
      setError(t({ en: "AI reply failed. Please try again.", bn: "AI reply failed. Please try again." }));
      setLoading(false);
      return;
    }

    setMessages((prev) => [...prev, { role: "assistant", content: data.reply as string }]);
    setLoading(false);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="rounded-xl bg-gradient-to-r from-blue-600 to-sky-400 px-4 py-3 text-white">
        <div className="text-sm font-semibold">{t({ en: "AI Tutor", bn: "AI Tutor" })}</div>
        <div className="text-xs text-white/80">
          {t({ en: `Ask about ${chapter}`, bn: `Ask about ${chapter}` })}
        </div>
      </div>

      <div className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1 text-sm text-slate-700">
        {messages.map((item, index) => (
          <div
            key={`${item.role}-${index}`}
            className={cn(
              "rounded-2xl px-4 py-3",
              item.role === "assistant" ? "bg-slate-100 text-slate-700" : "ml-auto bg-blue-600 text-white"
            )}
          >
            {item.content}
          </div>
        ))}
      </div>

      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}

      <div className="mt-4 flex items-center gap-3">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={t({ en: "Ask your question...", bn: "Ask your question..." })}
          className="h-11 flex-1 rounded-xl border border-slate-200 px-3 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={loading || disabled}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-60"
          aria-label={t({ en: "Send", bn: "Send" })}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function QuizGeneratorPanel({
  courseId,
  classLevel,
  subject,
  chapters,
  activeChapterId,
  disabled,
}: {
  courseId: string;
  classLevel: string;
  subject: string;
  chapters: { id: string; title: string }[];
  activeChapterId: string;
  disabled: boolean;
}) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const t = useTranslate();
  const [chapterId, setChapterId] = useState(activeChapterId);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const selectedChapter = chapters.find((chapter) => chapter.id === chapterId) ?? chapters[0];

  useEffect(() => {
    setChapterId(activeChapterId);
    setQuestions(null);
    setError(null);
  }, [activeChapterId]);

  const handleGenerate = async () => {
    if (!selectedChapter || disabled) return;
    setLoading(true);
    setError(null);
    const { data, error: fnError } = await invokeEdgeFunction<{ questions?: QuizQuestion[] }>("generate-quiz", {
      subject,
      chapter: selectedChapter.title,
      classLevel,
      language,
      count: 10,
      difficulty: "medium",
    });

    if (fnError) {
      const payload = await parseFunctionError(fnError);
      const message =
        payload?.error ||
        fnError.message ||
        t({ en: "Quiz generation failed. Please try again.", bn: "Quiz generation failed. Please try again." });
      setError(message);
      setLoading(false);
      return;
    }

    if (!data?.questions?.length) {
      setError(t({ en: "No questions returned. Try again.", bn: "No questions returned. Try again." }));
      setLoading(false);
      return;
    }

    setQuestions(data.questions as QuizQuestion[]);
    setLoading(false);
  };

  const handleReset = () => {
    setQuestions(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-blue-50 to-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold">{t({ en: "AI Quiz Generator", bn: "AI Quiz Generator" })}</h3>
        <p className="mt-1 text-xs text-slate-500">
          {t({ en: "Generate chapter-specific MCQs aligned with NCTB.", bn: "Generate chapter-specific MCQs aligned with NCTB." })}
        </p>

        <div className="mt-5 space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">{t({ en: "Course", bn: "Course" })}</label>
            <div className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm leading-10 text-slate-700">
              {subject}
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">{t({ en: "Chapter", bn: "Chapter" })}</label>
            <select
              value={selectedChapter?.id ?? ""}
              onChange={(event) => setChapterId(event.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700"
            >
              {chapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </div>
        )}

        <div className="mt-5 flex items-center gap-2">
          <Button onClick={handleGenerate} disabled={loading || disabled}>
            {loading ? t({ en: "Generating...", bn: "Generating..." }) : t({ en: "Generate Quiz", bn: "Generate Quiz" })}
          </Button>
          <Button variant="outline" onClick={handleReset} disabled={!questions}>
            {t({ en: "Reset", bn: "Reset" })}
          </Button>
        </div>
        {error?.toLowerCase().includes("limit") && (
          <button
            type="button"
            onClick={() => navigate("/pricing")}
            className="mt-3 text-xs font-semibold text-blue-600 hover:underline"
          >
            {t({ en: "Upgrade plan to continue", bn: "Upgrade plan to continue" })}
          </button>
        )}
        <div className="mt-3 text-[11px] text-slate-400">
          {t({ en: "10 questions - Medium difficulty - MCQ", bn: "10 questions - Medium difficulty - MCQ" })}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        {questions ? (
          <QuizComponent
            courseId={courseId}
            quizId={`ai-${selectedChapter?.id ?? "chapter"}`}
            questions={questions ?? undefined}
            onComplete={handleReset}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-sm text-slate-400">
            {t({ en: "Generate a quiz to see it here.", bn: "Generate a quiz to see it here." })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CourseDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { courses, progress } = useStudent();
  const t = useTranslate();
  const [activeTab, setActiveTab] = useState<TabKey>("brainbite");
  const [selectedChapterId, setSelectedChapterId] = useState<string>("");
  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const courseId = params.courseId as string;
  const course = courses.find((item) => item.id === courseId);
  const classCourses = useMemo(() => {
    if (!course) return courses;
    return courses.filter((item) => item.class === course.class);
  }, [courses, course]);

  useEffect(() => {
    if (!course) return;
    if (!selectedChapterId || !course.chapters.some((chapter) => chapter.id === selectedChapterId)) {
      setSelectedChapterId(course.chapters[0]?.id ?? "");
    }
  }, [course, selectedChapterId]);

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold mb-4">{t({ en: "Course not found", bn: "Course not found" })}</h2>
        <Link to="/courses" className="text-primary hover:underline flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> {t({ en: "Back to Courses", bn: "Back to Courses" })}
        </Link>
      </div>
    );
  }

  const chapters = course.chapters ?? [];
  const selectedChapter = chapters.find((chapter) => chapter.id === selectedChapterId) ?? chapters[0];
  const hasCourseAccess = course.isPurchased || course.isFree;
  const isChapterLocked = !hasCourseAccess && selectedChapter && !selectedChapter.isFree;
  const chapterLabel = selectedChapter?.order ? `Chapter ${selectedChapter.order}` : "Chapter";
  const chapterTitle = selectedChapter ? `${chapterLabel}: ${selectedChapter.title}` : "Chapter";
  const chapterDuration = selectedChapter
    ? getChapterDurationMinutes(selectedChapter.lessons, selectedChapter.durationMinutes ?? 40)
    : 40;
  const userProgress = progress[course.id as keyof typeof progress] || { completedLessons: [] };

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
    <div className="flex flex-col gap-6 lg:flex-row">
      <aside className="w-full lg:w-72">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <ArrowLeft className="h-4 w-4" />
            <button type="button" onClick={() => navigate("/courses")} className="hover:text-blue-600">
              {t({ en: "Class", bn: "Class" })}
            </button>
          </div>

          <div className="mt-4 text-xs font-semibold uppercase text-slate-400">
            {t({ en: "Select Subject", bn: "Select Subject" })}
          </div>
          <div className="mt-3 space-y-2">
            {classCourses.map((item) => {
              const isActive = item.id === course.id;
              const Icon = getSubjectIcon(item.title);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(`/courses/${item.id}`)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition",
                    isActive
                      ? "bg-gradient-to-r from-emerald-700 to-emerald-500 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.title}
                </button>
              );
            })}
          </div>

          <div className="mt-5 text-xs font-semibold uppercase text-slate-400">
            {t({ en: "Chapters", bn: "Chapters" })}
          </div>
          <div className="mt-3 space-y-3">
            {chapters.map((chapter) => {
              const isActive = chapter.id === selectedChapter?.id;
              const isFree = chapter.isFree || course.isFree;
              const isLocked = !course.isPurchased && !isFree;
              const completedCount = chapter.lessons.filter((lesson) =>
                userProgress.completedLessons.includes(lesson.id)
              ).length;
              const isCompleted = completedCount === chapter.lessons.length && chapter.lessons.length > 0;
              const duration = getChapterDurationMinutes(chapter.lessons, chapter.durationMinutes ?? 40);
              return (
                <button
                  key={chapter.id}
                  type="button"
                  onClick={() => setSelectedChapterId(chapter.id)}
                  className={cn(
                    "w-full rounded-2xl border px-3 py-3 text-left text-sm shadow-sm transition",
                    isActive ? "border-blue-500 bg-white" : "border-slate-200 bg-white hover:border-blue-200"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">
                      {chapter.order ? `Chapter ${chapter.order}` : "Chapter"}: {chapter.title}
                    </span>
                    {isLocked ? (
                      <Lock className="h-4 w-4 text-slate-400" />
                    ) : (
                      <span className="text-xs text-emerald-500">{isCompleted ? "Done" : ""}</span>
                    )}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">{duration} min</div>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      <div className="flex-1 space-y-6">
        <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-sky-300 px-6 py-6 text-white shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-white/70">
            {course.title} &nbsp; &gt; &nbsp; {course.class} &nbsp; &gt; &nbsp; {selectedChapter?.order ?? 1}
          </div>
          <div className="mt-3 text-2xl font-semibold sm:text-3xl">{chapterTitle}</div>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-white/80">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" /> {chapterDuration} min
            </span>
            <span className="inline-flex items-center gap-1">
              <BookOpen className="h-4 w-4" /> {course.title}
            </span>
          </div>
          {!course.isPurchased && !course.isFree && (
            <div className="mt-4">
              <Button onClick={handleBuyCourse} disabled={isPaying} variant="secondary">
                {isPaying ? "Redirecting..." : "Upgrade plan"}
              </Button>
              {paymentError && <div className="mt-2 text-sm text-amber-100">{paymentError}</div>}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center gap-4 border-b border-slate-200 px-4 py-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-semibold transition",
                    isActive ? "border-blue-600 text-blue-600" : "border-transparent text-slate-600 hover:text-slate-900"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {t(tab.label)}
                </button>
              );
            })}
          </div>

          <div className="p-6">
            {isChapterLocked ? (
              <LockedChapterNotice onUpgrade={handleBuyCourse} isPaying={isPaying} errorMessage={paymentError} />
            ) : (
              <>
                {activeTab === "brainbite" && selectedChapter && (
                  <BrainBitePanel
                    classLevel={course.class}
                    subject={course.title}
                    chapter={selectedChapter.title}
                    disabled={false}
                  />
                )}
                {activeTab === "lesson" && selectedChapter && (
                  <LessonGeneratorPanel
                    classLevel={course.class}
                    subject={course.title}
                    chapter={selectedChapter.title}
                    disabled={false}
                  />
                )}
                {activeTab === "quiz" && selectedChapter && (
                  <QuizGeneratorPanel
                    courseId={course.id}
                    classLevel={course.class}
                    subject={course.title}
                    chapters={chapters.map((chapter) => ({ id: chapter.id, title: chapter.title }))}
                    activeChapterId={selectedChapter.id}
                    disabled={false}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
