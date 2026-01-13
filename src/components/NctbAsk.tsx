import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage, useTranslate } from "@/lib/i18n";
import { useStudent } from "@/lib/store";
import { cn } from "@/lib/utils";
import { invokeEdgeFunction, supabase } from "@/lib/supabaseClient";
import { startChapterCheckout, startCourseCheckout } from "@/lib/payments";
import { useAuth } from "@/lib/auth";

export function NctbAsk() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const t = useTranslate();
  const { purchasedCourses, purchasedChapters, markLessonComplete, logActivity } = useStudent();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Array<{ id: string; role: "user" | "assistant"; content: string }>>([]);
  const [thinking, setThinking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [classId, setClassId] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [availableClasses, setAvailableClasses] = useState<Array<{ id: string; name: string; level: string }>>([]);
  const [availableSubjects, setAvailableSubjects] = useState<
    Array<{
      id: string;
      name: string;
      class_id: string | null;
      class_level: string | null;
      price_full?: number | null;
      first_chapter_free: boolean | null;
      free_first_chapter?: boolean | null;
    }>
  >([]);
  const [availableChapters, setAvailableChapters] = useState<
    Array<{ id: string; title: string; order_no: number; is_free: boolean; price: number | null }>
  >([]);
  const [hasInteracted, setHasInteracted] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scrollEl = chatScrollRef.current;
    if (!scrollEl) return;
    const maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;
    if (maxScroll <= 0) return;
    scrollEl.scrollTo({ top: scrollEl.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  useEffect(() => {
    let isActive = true;

    const loadAcademicData = async () => {
      const classOrder = ["Class 6", "Class 7", "Class 8", "Class 9-10", "Class 11-12"];
      const { data: classesData } = await supabase
        .from("classes")
        .select("id,name,level")
        .in("level", ["school", "ssc", "hsc"])
        .order("name", { ascending: true });

      const { data: subjectsData } = await supabase
        .from("subjects")
        .select("id,name,class_id,class_level,price_full,first_chapter_free,free_first_chapter")
        .order("name", { ascending: true });

      if (!isActive) return;
      const sortedClasses = (classesData ?? []).sort((a, b) => {
        const aIndex = classOrder.indexOf(a.name);
        const bIndex = classOrder.indexOf(b.name);
        if (aIndex === -1 && bIndex === -1) {
          return a.name.localeCompare(b.name);
        }
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      });
      setAvailableClasses(sortedClasses);
      setAvailableSubjects(subjectsData ?? []);
    };

    void loadAcademicData();

    return () => {
      isActive = false;
    };
  }, []);

  const classOptions = availableClasses.map((item) => ({
    value: item.id,
    label: t({ en: item.name, bn: item.name }),
    name: item.name,
  }));

  const selectedClass = availableClasses.find((item) => item.id === classId) ?? null;
  const resolvedClassLevel = selectedClass?.name ?? classLevel;
  const subjectOptions = availableSubjects
    .filter((item) =>
      classId ? item.class_id === classId || item.class_level === resolvedClassLevel : true
    )
    .map((item) => ({
      value: item.id,
      label: t({ en: item.name, bn: item.name }),
    }));
  const selectedSubject = availableSubjects.find((item) => item.id === subjectId) ?? null;
  const resolvedSubjectName = selectedSubject?.name ?? "";
  const firstChapterFree =
    selectedSubject?.first_chapter_free ?? selectedSubject?.free_first_chapter ?? false;
  const selectedChapter = availableChapters.find((chapter) => chapter.id === chapterId) ?? availableChapters[0] ?? null;
  const resolvedChapterName = selectedChapter?.title ?? "";
  const isChapterFree =
    Boolean(selectedChapter?.is_free) || (Boolean(firstChapterFree) && selectedChapter?.order_no === 1);
  const hasActiveCoursePurchase = purchasedCourses.some((purchase) => {
    if (!selectedCourseId || purchase.course_id !== selectedCourseId) return false;
    if (!purchase.expires_at) return true;
    const expiry = new Date(purchase.expires_at).getTime();
    return Number.isFinite(expiry) && expiry > Date.now();
  });
  const hasChapterPurchase = purchasedChapters.some(
    (purchase) => Boolean(chapterId) && purchase.chapter_id === chapterId
  );
  const isUnlocked = isChapterFree || hasActiveCoursePurchase || hasChapterPurchase;

  const parseFunctionError = async (fnError: unknown) => {
    if (fnError && typeof fnError === "object" && "error" in fnError) {
      return fnError as Record<string, unknown>;
    }
    const context = (fnError as { context?: { response?: Response } }).context;
    if (!context?.response) return null;
    const response = context.response.clone();
    return response.json().catch(() => null);
  };

  useEffect(() => {
    let isActive = true;

    const loadSubjectDetails = async () => {
      if (!subjectId || !resolvedClassLevel) {
        setAvailableChapters([]);
        setChapterId("");
        setSelectedCourseId(null);
        return;
      }

      const { data: courseData } = await supabase
        .from("courses")
        .select("id,title,class_level,subject_id")
        .eq("subject_id", subjectId)
        .eq("class_level", resolvedClassLevel)
        .maybeSingle();

      const { data: chaptersData } = await supabase
        .from("chapters")
        .select("id,subject_id,name,title,order_no,is_free,price")
        .eq("subject_id", subjectId)
        .order("order_no", { ascending: true });

      if (!isActive) return;
      const formattedChapters = (chaptersData ?? []).map((chapter) => ({
        id: chapter.id,
        title: chapter.name ?? chapter.title ?? "Chapter",
        order_no: chapter.order_no,
        is_free: chapter.is_free ?? false,
        price: chapter.price ?? null,
      }));
      setSelectedCourseId(courseData?.id ?? null);
      setAvailableChapters(formattedChapters);
      if (!chapterId || !formattedChapters.some((chapter) => chapter.id === chapterId)) {
        setChapterId(formattedChapters[0]?.id ?? "");
      }
    };

    void loadSubjectDetails();

    return () => {
      isActive = false;
    };
  }, [subjectId, resolvedClassLevel]);

  useEffect(() => {
    setMessages([]);
    setQuestion("");
    setError(null);
    setLimitReached(false);
    setThinking(false);
    setHasInteracted(false);
  }, [classId, subjectId, chapterId]);

  const handleAsk = async () => {
    const trimmed = question.trim();
    if (!trimmed) return;
    if (!resolvedClassLevel || !subjectId || !chapterId) {
      setError(t({ en: "Select class, subject, and chapter first.", bn: "প্রথমে ক্লাস, বিষয় ও অধ্যায় নির্বাচন করুন।" }));
      return;
    }
    if (!selectedCourseId || !resolvedSubjectName || !resolvedChapterName) {
      setError(t({ en: "Missing course details. Please reselect.", bn: "কোর্স তথ্য পাওয়া যায়নি। আবার নির্বাচন করুন।" }));
      return;
    }
    if (!isUnlocked) {
      setError(t({ en: "Chapter locked. Buy to continue.", bn: "চ্যাপ্টার লক করা আছে। কিনে চালু করুন।" }));
      return;
    }
    const userMessage = { id: `${Date.now()}-user`, role: "user" as const, content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);
    setThinking(true);
    setError(null);
    setLimitReached(false);

    const { data, error: fnError } = await invokeEdgeFunction<{ reply?: string }>("nctb-qa", {
      question: `Class: ${resolvedClassLevel}\nSubject: ${resolvedSubjectName}\nChapter: ${resolvedChapterName}\nQuestion: ${trimmed}`,
      classLevel: resolvedClassLevel,
      subject: resolvedSubjectName,
      language,
      chapter: resolvedChapterName,
    });

    if (fnError || !data?.reply) {
      const payload = await parseFunctionError(fnError);
      if (payload?.code === "DAILY_LIMIT") {
        setLimitReached(true);
        setError(t({ en: "Daily limit reached. Upgrade your plan to continue.", bn: "Daily limit reached. Upgrade your plan to continue." }));
      } else if (payload?.error === "Unauthorized") {
        setError(t({ en: "Please sign in to use AI.", bn: "Please sign in to use AI." }));
      } else {
        const { data: fallbackData } = user && chapterId
          ? await supabase
              .from("student_activity_log")
              .select("meta,created_at")
              .eq("user_id", user.id)
              .eq("type", "homeschool_ai")
              .filter("meta->>chapter_id", "eq", chapterId)
              .order("created_at", { ascending: false })
              .limit(1)
          : { data: null };
        const meta = (fallbackData?.[0]?.meta ?? {}) as Record<string, unknown>;
        const fallbackContent =
          typeof meta.content === "string"
            ? meta.content
            : `Answer: ${resolvedChapterName}.\nNotes:\n• Review the key ideas of ${resolvedChapterName}.\n• Focus on definitions and important terms.\n• Practice short questions to reinforce learning.`;
        setMessages((prev) => [
          ...prev,
          { id: `${Date.now()}-assistant`, role: "assistant", content: fallbackContent },
        ]);
        setError(
          payload?.error ||
            fnError?.message ||
            t({ en: "AI reply failed. Showing saved notes instead.", bn: "AI reply failed. Showing saved notes instead." })
        );
      }
    } else {
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-assistant`, role: "assistant", content: data.reply as string },
      ]);
      const { data: lessonRows } = await supabase
        .from("lessons")
        .select("id")
        .eq("chapter_id", chapterId)
        .order("order_no", { ascending: true })
        .limit(1);
      const lessonId = lessonRows?.[0]?.id ?? null;
      if (lessonId) {
        void markLessonComplete(selectedCourseId, lessonId, data.reply as string);
      }
      void logActivity("homeschool_ai", {
        courseId: selectedCourseId,
        refId: chapterId,
        meta: {
          class_level: resolvedClassLevel,
          subject: resolvedSubjectName,
          chapter: resolvedChapterName,
          class_id: classId || null,
          subject_id: subjectId || null,
          chapter_id: chapterId,
          content: data.reply as string,
        },
      });
    }

    setLoading(false);
    setThinking(false);
  };

  const handleBuyChapter = async () => {
    if (!chapterId || isChapterFree) return;
    setIsPaying(true);
    setPaymentError(null);
    try {
      await startChapterCheckout(chapterId, {
        amount: selectedChapter?.price ?? undefined,
      });
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : "Payment failed. Please try again.");
      setIsPaying(false);
    }
  };

  const handleBuySubject = async () => {
    if (!selectedCourseId) return;
    setIsPaying(true);
    setPaymentError(null);
    try {
      await startCourseCheckout(selectedCourseId, {
        planId: "premium",
        amount: selectedSubject?.price_full ?? undefined,
      });
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : "Payment failed. Please try again.");
      setIsPaying(false);
    }
  };

  const guidanceCards = [
    {
      title: { en: "Solve Math Problem", bn: "গণিত সমস্যার সমাধান" },
      subtitle: { en: "Help me understand algebraic equations", bn: "বীজগণিতের সমীকরণ বুঝতে সাহায্য কর" },
    },
    {
      title: { en: "Science Concept", bn: "বিজ্ঞান ধারণা" },
      subtitle: { en: "Explain photosynthesis step by step", bn: "ফটোসিন্থেসিস ধাপে ধাপে বুঝিয়ে দাও" },
    },
    {
      title: { en: "Grammar Help", bn: "ব্যাকরণ সহায়তা" },
      subtitle: { en: "Teach me about verb tenses", bn: "ক্রিয়ার কাল সম্পর্কে শেখাও" },
    },
    {
      title: { en: "Study Tips", bn: "পড়াশোনার টিপস" },
      subtitle: { en: "How to prepare for exams effectively", bn: "কার্যকরভাবে পরীক্ষার প্রস্তুতি নেওয়ার উপায়" },
    },
  ];

  return (
    <div>
      <div className="rounded-[18px] bg-white p-3.5 shadow-sm ring-1 ring-slate-100 sm:p-4">
        {!hasInteracted && (
          <div className="mb-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Homeschool AI</p>
            <h2 className="text-2xl font-bold text-slate-900">How can I help you today?</h2>
            <p className="text-xs text-slate-500">Class & subject based answers with notes</p>
          </div>
        )}
        <div ref={chatScrollRef} className="relative max-h-72 min-h-[180px] space-y-3 overflow-y-auto pr-1 sm:max-h-80">
          {!hasInteracted && messages.length === 0 && !thinking && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/70 px-2 pb-2 backdrop-blur-sm transition-opacity">
              <div className="grid w-full gap-2 sm:grid-cols-2">
                {guidanceCards.map((card) => (
                  <div key={card.title.en} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs shadow-sm">
                    <div className="text-sm font-semibold text-slate-900">{t(card.title)}</div>
                    <p className="text-[11px] text-slate-500">{t(card.subtitle)}</p>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-slate-400">Start typing to chat. Refresh to show tips again.</p>
            </div>
          )}
          {messages.length === 0 && !thinking && (
            <p className="text-xs text-slate-400">Ask a question and get notes in bullet points.</p>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-6 shadow-sm",
                  message.role === "user"
                    ? "bg-[#060BF7] text-white"
                    : "bg-slate-50 text-slate-700 ring-1 ring-slate-100"
                )}
              >
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
              </div>
            </div>
          ))}
          {thinking && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-slate-50 px-4 py-2 text-sm text-slate-500 ring-1 ring-slate-100">
                <span className="animate-pulse">Thinking...</span>
              </div>
            </div>
          )}
        </div>
        <div className="mt-3 border-t border-slate-100 pt-3">
          <textarea
            value={question}
            onChange={(event) => {
              setQuestion(event.target.value);
              if (event.target.value.trim().length > 0) {
                setHasInteracted(true);
              }
            }}
            placeholder={t({ en: "Ask a question about the NCTB syllabus...", bn: "Ask a question about the NCTB syllabus..." })}
            rows={3}
            className="min-h-24 max-h-40 w-full resize-none overflow-y-auto overflow-x-hidden rounded-xl border border-slate-200 px-3 py-2 text-sm leading-6 text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 sm:max-h-48 sm:text-base"
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                if (!loading) handleAsk();
              }
            }}
          />
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="grid flex-1 gap-3 sm:grid-cols-3">
              <div className="space-y-1">
                <select
                  value={classId}
                  onChange={(event) => {
                    const nextId = event.target.value;
                    const nextClass = availableClasses.find((item) => item.id === nextId);
                    setClassId(nextId);
                    setClassLevel(nextClass?.name ?? "");
                    setSubjectId("");
                    setChapterId("");
                    setSelectedCourseId(null);
                    setError(null);
                  }}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm text-black shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">{t({ en: "Select class", bn: "Select class" })}</option>
                  {classOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <select
                  value={subjectId}
                  onChange={(event) => {
                    setSubjectId(event.target.value);
                    setChapterId("");
                    setError(null);
                  }}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm text-black shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">{t({ en: "Select subject", bn: "Select subject" })}</option>
                  {subjectOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <select
                  value={chapterId}
                  onChange={(event) => {
                    setChapterId(event.target.value);
                    setError(null);
                  }}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm text-black shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">{t({ en: "Select chapter", bn: "Select chapter" })}</option>
                  {availableChapters.map((chapter) => (
                    <option key={chapter.id} value={chapter.id}>
                      {chapter.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="button"
              disabled={loading || !isUnlocked || !chapterId || !subjectId || !resolvedClassLevel}
              onClick={() => {
                setHasInteracted(true);
                handleAsk();
              }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[linear-gradient(180deg,_#060BF7_0%,_#3B94DE_70%)] text-white shadow-sm transition hover:brightness-110 disabled:opacity-60 sm:h-11 sm:w-11"
              aria-label={t({ en: "Send message", bn: "Send message" })}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4l16 8-16 8 4-8-4-8z" />
              </svg>
            </button>
          </div>
          {!isUnlocked && chapterId && (
            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
              <div className="font-semibold">{t({ en: "Chapter locked", bn: "চ্যাপ্টার লক করা" })}</div>
              <p className="mt-1 text-amber-700">
                {t({ en: "Buy this chapter or the full subject to unlock Homeschool AI.", bn: "Homeschool AI আনলক করতে চ্যাপ্টার বা পুরো বিষয় কিনুন।" })}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleBuyChapter}
                  disabled={isPaying}
                  className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {isPaying ? t({ en: "Redirecting...", bn: "রিডাইরেক্ট হচ্ছে..." }) : t({ en: "Buy Chapter", bn: "চ্যাপ্টার কিনুন" })}
                </button>
                <button
                  type="button"
                  onClick={handleBuySubject}
                  disabled={isPaying}
                  className="rounded-lg border border-amber-300 px-3 py-2 text-xs font-semibold text-amber-800 transition hover:bg-amber-100 disabled:opacity-60"
                >
                  {t({ en: "Buy Subject", bn: "বিষয় কিনুন" })}
                </button>
                {paymentError && <span className="text-xs text-red-600">{paymentError}</span>}
              </div>
            </div>
          )}
        </div>
      </div>
      {error && (
        <div className="mt-2 space-y-1">
          <p className="text-xs text-red-600">{error}</p>
          {limitReached && (
            <Link to="/pricing" className="text-xs font-semibold text-blue-600 hover:underline">
              {t({ en: "Upgrade plan", bn: "Upgrade plan" })}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
