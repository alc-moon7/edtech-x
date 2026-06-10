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
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useStudent } from "@/lib/store";
import { useLanguage, useTranslate } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { QuizComponent, type QuizQuestion } from "@/components/learning/QuizComponent";
import ReactMarkdown from "react-markdown";
import { invokeEdgeFunction, supabase } from "@/lib/supabaseClient";
import { startChapterCheckout, startCourseCheckout } from "@/lib/payments";
import type { CourseChapter } from "@/lib/dashboardData";
import { useAuth } from "@/lib/auth";

type TabKey = "brainbite" | "lesson" | "quiz";

const tabs: { key: TabKey; label: { en: string; bn: string }; icon: React.ElementType }[] = [
  { key: "brainbite", label: { en: "BrainBite", bn: "BrainBite" }, icon: Sparkles },
  { key: "lesson", label: { en: "AI Lesson Generator", bn: "AI Lesson Generator" }, icon: Brain },
  { key: "quiz", label: { en: "AI Quiz Generator", bn: "AI Quiz Generator" }, icon: ClipboardList },
];

function getSubjectIcon(subject: string) {
  const key = subject.toLowerCase();
  if (key.includes("math")) return Calculator;
  if (key.includes("higher")) return Calculator;
  if (key.includes("science")) return FlaskConical;
  if (key.includes("physics") || key.includes("chemistry") || key.includes("biology")) return FlaskConical;
  if (key.includes("english")) return PenLine;
  if (key.includes("social") || key.includes("bangladesh") || key.includes("global")) return Globe2;
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
  ctaLabel,
}: {
  onUpgrade: () => void;
  isPaying: boolean;
  errorMessage: string | null;
  ctaLabel?: string;
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
            Buy this chapter to unlock it and continue learning.
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button onClick={onUpgrade} disabled={isPaying}>
          {isPaying ? "Redirecting..." : ctaLabel ?? "Upgrade plan"}
        </Button>
        {errorMessage && <span className="text-sm text-red-600">{errorMessage}</span>}
      </div>
    </div>
  );
}

function BrainBitePanel({
  courseId,
  lessonId,
  classLevel,
  subject,
  chapter,
  subjectId,
  chapterId,
  disabled,
}: {
  courseId: string;
  lessonId?: string;
  classLevel: string;
  subject: string;
  chapter: string;
  subjectId?: string;
  chapterId?: string;
  disabled: boolean;
}) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { logActivity, markLessonComplete } = useStudent();
  const t = useTranslate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [entries, setEntries] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [userInput, setUserInput] = useState("");
  const [resolvedLessonId, setResolvedLessonId] = useState<string | null>(lessonId ?? null);

  useEffect(() => {
    setEntries([]);
    setError(null);
  }, [classLevel, subject, chapter]);

  useEffect(() => {
    let isActive = true;

    const resolveLessonId = async () => {
      if (lessonId) {
        setResolvedLessonId(lessonId);
        return;
      }
      if (!chapterId) {
        setResolvedLessonId(null);
        return;
      }
      const { data } = await supabase
        .from("lessons")
        .select("id")
        .eq("chapter_id", chapterId)
        .order("order_no", { ascending: true })
        .limit(1);
      if (!isActive) return;
      setResolvedLessonId(data?.[0]?.id ?? null);
    };

    void resolveLessonId();

    return () => {
      isActive = false;
    };
  }, [lessonId, chapterId]);

  const loadFallbackEntry = async () => {
    if (!user || !chapterId) return null;
    const { data } = await supabase
      .from("student_activity_log")
      .select("meta,created_at")
      .eq("user_id", user.id)
      .eq("type", "brainbite_generated")
      .filter("meta->>chapter_id", "eq", chapterId)
      .order("created_at", { ascending: false })
      .limit(1);
    const meta = (data?.[0]?.meta ?? {}) as Record<string, unknown>;
    const content = typeof meta.content === "string" ? meta.content : null;
    return content ? { role: "assistant" as const, content } : null;
  };

  const handleGenerate = async () => {
    if (disabled || loading) return;
    setLoading(true);
    setError(null);
    let prompt = "";
    let systemInstruction = "";

    const isEnglishSubject = subject.toLowerCase().includes("english");
    const aiLang = isEnglishSubject ? "en" : language;

    const langInstruction = aiLang === "bn" ? "RESPOND STRICTLY IN BENGALI (বাংলা) ONLY. Translate all your explanations to Bengali." : "RESPOND IN ENGLISH ONLY.";

    if (entries.length === 0 && !userInput) {
      prompt = [
        `Class: ${classLevel}. Subject: ${subject}. Chapter: ${chapter}.`,
        aiLang === "bn" ? "একটি বাচ্চার জন্য এই অধ্যায়ের প্রথম মূল ধারণার একটি মজার, সহজ এবং ছোট সারসংক্ষেপ তৈরি করুন।" : "Create a fun, simple, and short recap for a kid of the first main concept.",
        aiLang === "bn" ? "বিষয়বস্তুর সাথে প্রাসঙ্গিক একটি আকর্ষণীয় এবং গাঢ় শিরোনাম দিয়ে শুরু করুন।" : "Start with a catchy, bold title relevant to the topic.",
        aiLang === "bn" ? "তারপর ২-৩ লাইনে ইমোজি দিয়ে সহজে ব্যাখ্যা করুন।" : "Then 2-3 short lines with emojis, explaining it simply.",
        aiLang === "bn" ? "তাদের বোঝাপড়া যাচাই করতে একটি মজার, সহজ প্রশ্ন দিয়ে শেষ করুন।" : "End with a fun, simple question to check their understanding.",
        langInstruction
      ].join(" ");
    } else if (userInput) {
      prompt = userInput;
      systemInstruction = [
        `Class: ${classLevel}. Subject: ${subject}. Chapter: ${chapter}.`,
        aiLang === "bn" ? "ব্যবহারকারী আপনার আগের প্রশ্নের উত্তর দিচ্ছেন বা একটি প্রশ্ন জিজ্ঞাসা করছেন।" : "The user is replying to your previous question or asking a question.",
        aiLang === "bn" ? "একটি বাচ্চার জন্য মজার, সহজ এবং ছোট উপায়ে উত্তর দিন। ইমোজি ব্যবহার করুন।" : "Respond in a fun, simple, short way for a kid. Use emojis.",
        aiLang === "bn" ? "তাদের যুক্ত রাখতে আরেকটি সহজ প্রশ্ন দিয়ে শেষ করুন।" : "End with another simple question to keep them engaged.",
        langInstruction
      ].join(" ");
    } else {
      prompt = [
        `Class: ${classLevel}. Subject: ${subject}. Chapter: ${chapter}.`,
        aiLang === "bn" ? "একটি বাচ্চার জন্য এই অধ্যায়ের পরবর্তী মূল ধারণার একটি মজার, সহজ এবং ছোট সারসংক্ষেপ তৈরি করুন।" : "Create a fun, simple, and short recap for a kid of the NEXT main concept in this chapter.",
        aiLang === "bn" ? "নিশ্চিত করুন যে এটি আগের বিষয়গুলোর চেয়ে ভিন্ন একটি বিষয়।" : "Make sure it is about a different topic than the previous ones.",
        aiLang === "bn" ? "একটি গাঢ় শিরোনাম দিয়ে শুরু করুন।" : "Start with a bold title.",
        aiLang === "bn" ? "তারপর ২-৩ লাইনে ইমোজি দিয়ে সহজে ব্যাখ্যা করুন।" : "Then 2-3 short lines with emojis, explaining it simply.",
        aiLang === "bn" ? "তাদের বোঝাপড়া যাচাই করতে একটি মজার, সহজ প্রশ্ন দিয়ে শেষ করুন।" : "End with a fun, simple question to check their understanding.",
        langInstruction
      ].join(" ");
    }

    const history = [...entries];
    if (userInput) {
      history.push({ role: "user", content: userInput });
      setEntries(history);
      setUserInput("");
    }

    const { data, error: fnError } = await invokeEdgeFunction<{ reply?: string }>("site-chat", {
      message: prompt,
      system: systemInstruction,
      history,
      mode: "brainbite",
      subject,
      chapter,
      classLevel,
      language: aiLang,
      chapterId,
      subjectId,
      courseId,
    });

    if (fnError || !data?.reply) {
      const fallback = entries.length ? entries[entries.length - 1] : await loadFallbackEntry();
      if (fallback) {
        setEntries((prev) => (prev.length ? prev : [fallback]));
        setError(t({ en: "Showing your last BrainBite instead.", bn: "আপনার আগের ব্রেইনবাইট দেখানো হচ্ছে।" }));
      } else {
        setError(t({ en: "BrainBite failed. Please try again.", bn: "ব্রেইনবাইট ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।" }));
      }
      setLoading(false);
      return;
    }

    const newEntry = { role: "assistant" as const, content: data.reply as string };
    setEntries((prev) => [...prev, newEntry]);
    if (resolvedLessonId) {
      void markLessonComplete(courseId, resolvedLessonId, data.reply as string, {
        chapterId,
      });
    }
    void logActivity("brainbite_generated", {
      courseId,
      refId: chapterId ?? null,
      meta: {
        class_level: classLevel,
        subject,
        chapter,
        subject_id: subjectId ?? null,
        chapter_id: chapterId ?? null,
        content: data.reply as string,
      },
    });
    setLoading(false);
  };

  const latestAssistantEntry = [...entries].reverse().find(e => e.role === "assistant");
  const latestText = latestAssistantEntry?.content;

  return (
    <div className="flex flex-col items-center rounded-[20px] bg-white p-8 min-h-[450px] shadow-sm border border-slate-100">
      <div className="flex-1 flex flex-col items-center w-full relative">
        <img src="/assets/brainbite_logo.png" alt="BrainBite" className="mb-6 h-[72px] w-[72px] object-contain" />

        <div className="w-full max-w-2xl mt-4">
          {latestText ? (
            <div className="relative w-full flex flex-col items-center justify-center bg-white p-6 md:px-10 md:pt-4 md:pb-8 rounded-[24px]">
              <div className="absolute right-4 top-4 flex flex-col items-center">
                <button
                  onClick={handleGenerate}
                  disabled={loading || disabled}
                  className="flex h-[42px] w-[42px] items-center justify-center rounded-[10px] bg-[#89a2b8] text-white shadow-sm transition hover:bg-[#728ba1] disabled:opacity-50"
                  title={t({ en: "Next concept", bn: "পরবর্তী ধারণা" })}
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
                <span className="mt-1.5 text-[10px] font-medium text-slate-700">{t({ en: "Next concept", bn: "পরবর্তী ধারণা" })}</span>
              </div>
              <div className="prose prose-lg mx-auto text-center font-medium leading-relaxed text-black px-4 sm:px-16 [&>h1]:text-[22px] [&>h1]:font-bold [&>h1]:mb-4 [&>h2]:text-[22px] [&>h2]:font-bold [&>h2]:mb-4 [&>h3]:text-[20px] [&>h3]:font-bold [&>h3]:mb-3 [&>p]:mb-4 [&>p:first-child]:mt-0 [&>p]:leading-snug [&>ul]:text-left [&>ol]:text-left">
                <ReactMarkdown>{latestText}</ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[160px]">
              <div className="text-[24px] font-bold text-black text-center mb-4">
                {t({ en: "Hi, I am BrainBite", bn: "হ্যালো, আমি ব্রেইনবাইট" })}
              </div>
            </div>
          )}

          {entries.length > 0 && (
            <div className="mt-6">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={t({ en: "Type your answer or question here...", bn: "এখানে আপনার উত্তর বা প্রশ্ন টাইপ করুন..." })}
                className="w-full resize-none rounded-[16px] border border-slate-400 p-4 text-[15px] font-medium text-slate-700 outline-none transition focus:border-[#F2A430]"
                rows={3}
                disabled={loading || disabled}
              />
            </div>
          )}
        </div>
      </div>

      {error && <div className="mt-4 text-sm font-medium text-red-600">{error}</div>}

      <div className="mt-8 flex w-full justify-center">
        <button
          onClick={handleGenerate}
          disabled={loading || disabled}
          className="w-48 rounded-[12px] bg-[#F2A430] px-6 py-3.5 text-[15px] font-bold text-white shadow-sm transition hover:bg-[#e09329] disabled:opacity-50"
        >
          {loading ? t({ en: "Thinking...", bn: "ভাবছে..." }) : t({ en: "Continue", bn: "চালিয়ে যান" })}
        </button>
      </div>
    </div>
  );
}

type LessonMessage = {
  role: "user" | "assistant";
  content: string;
};

function LessonGeneratorPanel({
  courseId,
  lessonId,
  classLevel,
  subject,
  chapter,
  subjectId,
  chapterId,
  disabled,
}: {
  courseId: string;
  lessonId?: string;
  classLevel: string;
  subject: string;
  chapter: string;
  subjectId?: string;
  chapterId?: string;
  disabled: boolean;
}) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { logActivity, markLessonComplete } = useStudent();
  const t = useTranslate();
  const [messages, setMessages] = useState<LessonMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resolvedLessonId, setResolvedLessonId] = useState<string | null>(lessonId ?? null);

  useEffect(() => {
    const isEnglishSubject = subject.toLowerCase().includes("english");
    const aiLang = isEnglishSubject ? "en" : language;

    setMessages([
      {
        role: "assistant",
        content: aiLang === "bn" 
          ? `হ্যালো! আমি আপনার ${subject} এর জন্য এআই টিউটর। ${chapter} সম্পর্কে আমাকে যেকোনো কিছু জিজ্ঞাসা করুন।`
          : `Hi! I'm your AI tutor for ${subject}. Ask me anything about ${chapter}.`,
      },
    ]);
    setInput("");
    setError(null);
  }, [subject, chapter]);

  useEffect(() => {
    let isActive = true;

    const resolveLessonId = async () => {
      if (lessonId) {
        setResolvedLessonId(lessonId);
        return;
      }
      if (!chapterId) {
        setResolvedLessonId(null);
        return;
      }
      const { data } = await supabase
        .from("lessons")
        .select("id")
        .eq("chapter_id", chapterId)
        .order("order_no", { ascending: true })
        .limit(1);
      if (!isActive) return;
      setResolvedLessonId(data?.[0]?.id ?? null);
    };

    void resolveLessonId();

    return () => {
      isActive = false;
    };
  }, [lessonId, chapterId]);

  const loadFallbackMessage = async () => {
    if (!user || !chapterId) return null;
    const { data } = await supabase
      .from("student_activity_log")
      .select("meta,created_at")
      .eq("user_id", user.id)
      .eq("type", "lesson_ai")
      .filter("meta->>chapter_id", "eq", chapterId)
      .order("created_at", { ascending: false })
      .limit(1);
    const meta = (data?.[0]?.meta ?? {}) as Record<string, unknown>;
    const content = typeof meta.content === "string" ? meta.content : null;
    return content;
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading || disabled) return;
    setLoading(true);
    setError(null);
    const nextHistory = [...messages, { role: "user", content: trimmed }];
    setMessages(nextHistory);
    setInput("");

    const isEnglishSubject = subject.toLowerCase().includes("english");
    const aiLang = isEnglishSubject ? "en" : language;

    const prompt = [
      `Class: ${classLevel}.`,
      `Subject: ${subject}.`,
      `Chapter: ${chapter}.`,
      `Question: ${trimmed}`,
      aiLang === "bn" ? "RESPOND STRICTLY IN BENGALI (বাংলা) ONLY." : "RESPOND IN ENGLISH ONLY."
    ].join(" ");

    const { data, error: fnError } = await invokeEdgeFunction<{ reply?: string }>("site-chat", {
      message: prompt,
      history: nextHistory,
      mode: "lesson",
      subject,
      chapter,
      classLevel,
      language: aiLang,
      chapterId,
      subjectId,
      courseId,
    });

    if (fnError || !data?.reply) {
      const fallback = await loadFallbackMessage();
      if (fallback) {
        setMessages((prev) => [...prev, { role: "assistant", content: fallback }]);
        setError(t({ en: "Showing your last saved answer.", bn: "আপনার আগের সেভ করা উত্তর দেখানো হচ্ছে।" }));
      } else {
        setError(t({ en: "AI reply failed. Please try again.", bn: "এআই এর উত্তর ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।" }));
      }
      setLoading(false);
      return;
    }

    setMessages((prev) => [...prev, { role: "assistant", content: data.reply as string }]);
    if (resolvedLessonId) {
      void markLessonComplete(courseId, resolvedLessonId, data.reply as string, {
        chapterId,
      });
    }
    void logActivity("lesson_ai", {
      courseId,
      refId: chapterId ?? null,
      meta: {
        class_level: classLevel,
        subject,
        chapter,
        subject_id: subjectId ?? null,
        chapter_id: chapterId ?? null,
        content: data.reply as string,
      },
    });
    setLoading(false);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="rounded-xl bg-gradient-to-r from-blue-600 to-sky-400 px-4 py-3 text-white">
        <div className="text-sm font-semibold">{t({ en: "AI Tutor", bn: "এআই টিউটর" })}</div>
        <div className="text-xs text-white/80">
          {t({ en: `Ask about ${chapter}`, bn: `${chapter} সম্পর্কে জিজ্ঞাসা করুন` })}
        </div>
      </div>

      <div className="mt-6 min-h-[400px] max-h-[600px] space-y-6 overflow-y-auto pr-2">
        {messages.map((item, index) => (
          <div
            key={`${item.role}-${index}`}
            className={cn("flex w-full gap-3 sm:gap-4", item.role === "user" ? "justify-end" : "justify-start")}
          >
            {item.role === "assistant" && (
              <div className="shrink-0 pt-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
                  <Brain className="h-6 w-6 text-white" />
                </div>
              </div>
            )}
            <div
              className={cn(
                "rounded-[24px] px-6 py-5 w-fit max-w-[85%] shadow-sm",
                item.role === "assistant" 
                  ? "bg-slate-50 border-2 border-slate-100 text-slate-800" 
                  : "bg-[#F2A430] text-white"
              )}
            >
              {item.role === "assistant" ? (
                <div className="prose prose-base sm:prose-lg prose-slate max-w-none [&>p]:mb-4 [&>p:last-child]:mb-0 [&>p]:leading-relaxed [&>ul]:mb-4 [&>ul]:list-none [&>ul>li]:relative [&>ul>li]:pl-6 [&>ul>li]:mb-2 [&>ul>li::before]:content-['⭐'] [&>ul>li::before]:absolute [&>ul>li::before]:left-0 [&>ul>li::before]:top-0.5 [&>ul>li::before]:text-[14px] [&>ol]:mb-4 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol>li]:mb-2 [&>ol>li::marker]:font-bold [&>ol>li::marker]:text-[#F2A430] [&>h1]:text-[24px] [&>h1]:font-bold [&>h1]:mb-4 [&>h1]:text-blue-700 [&>h2]:text-[22px] [&>h2]:font-bold [&>h2]:mb-3 [&>h2]:text-indigo-600 [&>h3]:text-[20px] [&>h3]:font-bold [&>h3]:mb-2 [&>h3]:text-purple-600 [&>strong]:font-bold [&>strong]:text-slate-900">
                  <ReactMarkdown>{item.content}</ReactMarkdown>
                </div>
              ) : (
                <div className="whitespace-pre-wrap text-[16px] font-medium leading-relaxed">{item.content}</div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex w-full gap-3 sm:gap-4 justify-start">
            <div className="shrink-0 pt-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm opacity-70 animate-pulse">
                <Brain className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="rounded-[24px] px-6 py-4 w-fit max-w-[85%] bg-slate-50 border-2 border-slate-100 text-slate-700 flex items-center gap-3 shadow-sm">
              <Loader2 className="h-5 w-5 animate-spin text-[#F2A430]" />
              <span className="text-[15px] font-medium text-slate-500">{t({ en: "Thinking...", bn: "ভাবছে..." })}</span>
            </div>
          </div>
        )}
      </div>

      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}

      <div className="mt-4 flex items-center gap-3">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              void handleSend();
            }
          }}
          disabled={loading || disabled}
          placeholder={t({ en: "Ask your question...", bn: "আপনার প্রশ্ন জিজ্ঞাসা করুন..." })}
          className="h-11 flex-1 rounded-xl border border-slate-200 px-3 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={loading || disabled}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-60"
          aria-label={t({ en: "Send", bn: "পাঠান" })}
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
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
  chapters: CourseChapter[];
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
  const quizLessonId =
    selectedChapter?.lessons.find((lesson) => lesson.type === "quiz")?.id ??
    selectedChapter?.lessons[0]?.id;

  useEffect(() => {
    setChapterId(activeChapterId);
    setQuestions(null);
    setError(null);
  }, [activeChapterId]);

  const handleGenerate = async () => {
    if (!selectedChapter || disabled) return;
    setLoading(true);
    setError(null);
    
    const isEnglishSubject = subject.toLowerCase().includes("english");
    const aiLang = isEnglishSubject ? "en" : language;

    const chapterTitle = aiLang === "bn" 
      ? `${selectedChapter.title} (CRITICAL INSTRUCTION: YOU MUST WRITE ALL QUESTIONS, OPTIONS, AND EXPLANATIONS STRICTLY IN BENGALI / BANGLA SCRIPT)`
      : selectedChapter.title;

    const { data, error: fnError } = await invokeEdgeFunction<{ questions?: QuizQuestion[] }>("generate-quiz", {
      subject,
      chapter: chapterTitle,
      classLevel,
      language: aiLang,
      count: 10,
      difficulty: "medium",
      chapterId: selectedChapter.id,
      courseId,
    });

    if (fnError) {
      const payload = await parseFunctionError(fnError);
      const message =
        payload?.error ||
        fnError.message ||
        t({ en: "Quiz generation failed. Please try again.", bn: "কুইজ তৈরি ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।" });
      setError(message);
      setLoading(false);
      return;
    }

    if (!data?.questions?.length) {
      setError(t({ en: "No questions returned. Try again.", bn: "কোনো প্রশ্ন পাওয়া যায়নি। আবার চেষ্টা করুন।" }));
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
        <h3 className="text-lg font-semibold">{t({ en: "AI Quiz Generator", bn: "এআই কুইজ জেনারেটর" })}</h3>
        <p className="mt-1 text-xs text-slate-500">
          {t({ en: "Generate chapter-specific MCQs aligned with NCTB.", bn: "এনসিটিবি (NCTB) সিলেবাস অনুযায়ী অধ্যায়-ভিত্তিক বহুনির্বাচনী প্রশ্ন তৈরি করুন।" })}
        </p>

        <div className="mt-5 space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">{t({ en: "Course", bn: "কোর্স" })}</label>
            <div className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm leading-10 text-slate-700">
              {subject}
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">{t({ en: "Chapter", bn: "অধ্যায়" })}</label>
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
            {loading ? t({ en: "Generating...", bn: "তৈরি হচ্ছে..." }) : t({ en: "Generate Quiz", bn: "কুইজ তৈরি করুন" })}
          </Button>
          <Button variant="outline" onClick={handleReset} disabled={!questions}>
            {t({ en: "Reset", bn: "রিসেট করুন" })}
          </Button>
        </div>
        {error?.toLowerCase().includes("limit") && (
          <button
            type="button"
            onClick={() => navigate("/pricing")}
            className="mt-3 text-xs font-semibold text-blue-600 hover:underline"
          >
            {t({ en: "Upgrade plan to continue", bn: "চালিয়ে যেতে প্ল্যান আপগ্রেড করুন" })}
          </button>
        )}
        <div className="mt-3 text-[11px] text-slate-400">
          {t({ en: "10 questions - Medium difficulty - MCQ", bn: "১০টি প্রশ্ন - মাঝারি কাঠিন্য - বহুনির্বাচনী" })}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        {questions ? (
          <QuizComponent
            courseId={courseId}
            quizId={quizLessonId}
            questions={questions ?? undefined}
            onComplete={handleReset}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-sm text-slate-400">
            {t({ en: "Generate a quiz to see it here.", bn: "এখানে দেখতে একটি কুইজ তৈরি করুন।" })}
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
  const [isChapterPaying, setIsChapterPaying] = useState(false);
  const [chapterPaymentError, setChapterPaymentError] = useState<string | null>(null);

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
  const hasCourseAccess = course.isPurchased === true || course.isFree === true;
  const hasLockedChapters = chapters.some((chapter) => !chapter.isFree && !chapter.isPurchased);
  const isChapterLocked =
    !hasCourseAccess && !(selectedChapter?.isFree || selectedChapter?.isPurchased);
  const chapterLabel = selectedChapter?.order ? `Chapter ${selectedChapter.order}` : "Chapter";
  const chapterTitle = selectedChapter ? `${chapterLabel}: ${selectedChapter.title}` : "Chapter";
  const chapterDuration = selectedChapter
    ? getChapterDurationMinutes(selectedChapter.lessons, selectedChapter.durationMinutes ?? 40)
    : 40;
  const subjectPriceLabel = course.priceFull ? `BDT ${course.priceFull}` : "BDT 0";
  const chapterPriceLabel =
    selectedChapter?.isFree ? t({ en: "FREE", bn: "FREE" }) : `BDT ${selectedChapter?.price ?? 0}`;
  const userProgress = progress[course.id as keyof typeof progress] || { completedLessons: [] };
  const defaultLessonId = selectedChapter?.lessons[0]?.id;

  const handleBuyCourse = async () => {
    setPaymentError(null);
    if (course.priceFull === null || course.priceFull === undefined) {
      setPaymentError(t({ en: "Subject price is missing.", bn: "Subject price is missing." }));
      return;
    }
    setIsPaying(true);
    try {
      await startCourseCheckout(course.id, {
        planId: "premium",
        amount: course.priceFull,
      });
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : "Payment failed. Please try again.");
      setIsPaying(false);
    }
  };

  const handleBuyChapter = async () => {
    if (!selectedChapter || selectedChapter.isFree) return;
    setChapterPaymentError(null);
    setIsChapterPaying(true);
    try {
      await startChapterCheckout(selectedChapter.id, {
        amount: selectedChapter.price ?? undefined,
      });
    } catch (error) {
      setChapterPaymentError(error instanceof Error ? error.message : "Payment failed. Please try again.");
      setIsChapterPaying(false);
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
              const isLocked = !hasCourseAccess && !chapter.isFree && !chapter.isPurchased;
              const completedCount = chapter.lessons.filter((lesson) =>
                userProgress.completedLessons.includes(lesson.id)
              ).length;
              const isCompleted = completedCount === chapter.lessons.length && chapter.lessons.length > 0;
              const duration = getChapterDurationMinutes(chapter.lessons, chapter.durationMinutes ?? 40);
              const priceLabel = chapter.isFree
                ? t({ en: "FREE", bn: "FREE" })
                : `BDT ${chapter.price ?? 0}`;
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
                  <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                    <span>{duration} min</span>
                    <span className={chapter.isFree ? "font-semibold text-emerald-600" : ""}>
                      {priceLabel}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      <div className="flex-1 space-y-6">
        <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-sky-300 px-6 py-6 text-white shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-white/70">
            {t({ en: "Class", bn: "Class" })}: {course.class} &nbsp; &gt; &nbsp;
            {t({ en: "Subject", bn: "Subject" })}: {course.title} &nbsp; &gt; &nbsp;
            {t({ en: "Chapter", bn: "Chapter" })}: {selectedChapter?.order ?? 1}
          </div>
          <div className="mt-3 text-2xl font-semibold sm:text-3xl">{chapterTitle}</div>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-white/80">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" /> {chapterDuration} min
            </span>
            <span className="inline-flex items-center gap-1">
              <BookOpen className="h-4 w-4" /> {course.title}
            </span>
            <span className="inline-flex items-center gap-1">
              {t({ en: "Subject", bn: "Subject" })} {t({ en: "price", bn: "price" })}: {subjectPriceLabel}
            </span>
            <span className="inline-flex items-center gap-1">
              {t({ en: "Chapter", bn: "Chapter" })} {t({ en: "price", bn: "price" })}: {chapterPriceLabel}
            </span>
          </div>
          {!hasCourseAccess && hasLockedChapters && (
            <div className="mt-4">
              <Button onClick={handleBuyCourse} disabled={isPaying} variant="secondary">
                {isPaying ? "Redirecting..." : t({ en: "Buy Subject", bn: "Buy Subject" })}
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
              <LockedChapterNotice
                onUpgrade={handleBuyChapter}
                isPaying={isChapterPaying}
                errorMessage={chapterPaymentError}
                ctaLabel={t({ en: "Buy Chapter", bn: "Buy Chapter" })}
              />
            ) : (
              <>
                {activeTab === "brainbite" && selectedChapter && (
                  <BrainBitePanel
                    courseId={course.id}
                    lessonId={defaultLessonId}
                    classLevel={course.class}
                    subject={course.title}
                    chapter={selectedChapter.title}
                    subjectId={course.subjectId}
                    chapterId={selectedChapter.id}
                    disabled={false}
                  />
                )}
                {activeTab === "lesson" && selectedChapter && (
                  <LessonGeneratorPanel
                    courseId={course.id}
                    lessonId={defaultLessonId}
                    classLevel={course.class}
                    subject={course.title}
                    chapter={selectedChapter.title}
                    subjectId={course.subjectId}
                    chapterId={selectedChapter.id}
                    disabled={false}
                  />
                )}
                {activeTab === "quiz" && selectedChapter && (
                  <QuizGeneratorPanel
                    courseId={course.id}
                    classLevel={course.class}
                    subject={course.title}
                    chapters={chapters}
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
