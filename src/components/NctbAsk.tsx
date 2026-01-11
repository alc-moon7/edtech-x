import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage, useTranslate } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { invokeEdgeFunction } from "@/lib/supabaseClient";

export function NctbAsk() {
  const { language } = useLanguage();
  const t = useTranslate();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Array<{ id: string; role: "user" | "assistant"; content: string }>>([]);
  const [thinking, setThinking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const [classLevel, setClassLevel] = useState("");
  const [subject, setSubject] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scrollEl = chatScrollRef.current;
    if (!scrollEl) return;
    const maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;
    if (maxScroll <= 0) return;
    scrollEl.scrollTo({ top: scrollEl.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const classOptions = [
    { value: "Class 6", label: t({ en: "Class 6", bn: "Class 6" }) },
    { value: "Class 7", label: t({ en: "Class 7", bn: "Class 7" }) },
    { value: "Class 8", label: t({ en: "Class 8", bn: "Class 8" }) },
    { value: "Class 9", label: t({ en: "Class 9", bn: "Class 9" }) },
    { value: "Class 10", label: t({ en: "Class 10", bn: "Class 10" }) },
    { value: "Class 11", label: t({ en: "Class 11", bn: "Class 11" }) },
    { value: "Class 12", label: t({ en: "Class 12", bn: "Class 12" }) },
  ];

  const subjectOptions = [
    { value: "Bangla", label: t({ en: "Bangla", bn: "Bangla" }) },
    { value: "English", label: t({ en: "English", bn: "English" }) },
    { value: "Mathematics", label: t({ en: "Mathematics", bn: "Mathematics" }) },
    { value: "Science", label: t({ en: "Science", bn: "Science" }) },
    { value: "ICT", label: t({ en: "ICT", bn: "ICT" }) },
    { value: "Agriculture Studies", label: t({ en: "Agriculture Studies", bn: "Agriculture Studies" }) },
  ];

  const parseFunctionError = async (fnError: unknown) => {
    if (fnError && typeof fnError === "object" && "error" in fnError) {
      return fnError as Record<string, unknown>;
    }
    const context = (fnError as { context?: { response?: Response } }).context;
    if (!context?.response) return null;
    const response = context.response.clone();
    return response.json().catch(() => null);
  };

  const handleAsk = async () => {
    const trimmed = question.trim();
    if (!trimmed) return;
    if (!classLevel || !subject) {
      setError(t({ en: "Select class and subject first.", bn: "Select class and subject first." }));
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
      question: trimmed,
      classLevel,
      subject,
      language,
    });

    if (fnError || !data?.reply) {
      const payload = await parseFunctionError(fnError);
      if (payload?.code === "DAILY_LIMIT") {
        setLimitReached(true);
        setError(t({ en: "Daily limit reached. Upgrade your plan to continue.", bn: "Daily limit reached. Upgrade your plan to continue." }));
      } else if (payload?.error === "Unauthorized") {
        setError(t({ en: "Please sign in to use AI.", bn: "Please sign in to use AI." }));
      } else {
        setError(
          payload?.error ||
            fnError?.message ||
            t({ en: "AI reply failed. Please try again.", bn: "AI reply failed. Please try again." })
        );
      }
    } else {
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-assistant`, role: "assistant", content: data.reply as string },
      ]);
    }

    setLoading(false);
    setThinking(false);
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
            <div className="grid flex-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <select
                  value={classLevel}
                  onChange={(event) => {
                    setClassLevel(event.target.value);
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
                  value={subject}
                  onChange={(event) => {
                    setSubject(event.target.value);
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
            </div>
            <button
              type="button"
              disabled={loading}
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
