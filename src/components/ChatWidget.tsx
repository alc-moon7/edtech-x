import { useState, useMemo, useEffect, useCallback } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const QUICK_QUESTIONS = [
  "How do I sign up?",
  "What subjects are covered?",
  "How do I reset my password?",
  "How does the AI tutor work?",
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hi! I’m Homeschool AI. Ask me anything about this site." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = useCallback(
    async (question?: string) => {
      const text = (question ?? input).trim();
      if (!text) return;
      setInput("");
      setMessages((prev) => [...prev, { role: "user", content: text }]);
      setLoading(true);

      try {
        const { data, error } = await supabase.functions.invoke("site-chat", {
          body: {
            message: text,
            history: messages.slice(-6), // recent history
          },
        });

        if (error || !data?.reply) {
          setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I couldn’t reply right now. Please try again." }]);
        } else {
          setMessages((prev) => [...prev, { role: "assistant", content: data.reply as string }]);
        }
      } catch {
        setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I couldn’t reply right now. Please try again." }]);
      } finally {
        setLoading(false);
      }
    },
    [input, messages]
  );

  const shortMessages = useMemo(() => messages.slice(-12), [messages]);

  useEffect(() => {
    if (!open) return;
    const container = document.getElementById("chat-widget-body");
    if (container) container.scrollTop = container.scrollHeight;
  }, [open, shortMessages, loading]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open AI chat"
        className="fixed bottom-4 right-4 z-[60] flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-slate-100 transition hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B94DE] sm:bottom-6 sm:right-6 sm:h-16 sm:w-16"
      >
        <img src="/figma/hero-chat.png" alt="" className="h-9 w-10 sm:h-10 sm:w-12" aria-hidden="true" />
        <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-[#66FF00]" />
      </button>

      {open && (
        <div className="fixed bottom-24 right-4 z-[70] w-[320px] max-w-[90vw] sm:bottom-28 sm:right-6 sm:w-[360px]">
          <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <div>
                <div className="text-sm font-semibold text-slate-900">Homeschool AI</div>
                <div className="text-xs text-slate-500">Ask about this site</div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-1.5 text-slate-500 transition hover:bg-slate-100"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div id="chat-widget-body" className="max-h-[70vh] space-y-3 overflow-y-auto px-4 py-4">
              {shortMessages.map((msg, idx) => (
                <div
                  key={`${msg.role}-${idx}-${msg.content.slice(0, 8)}`}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#060BF7] text-white"
                        : "bg-slate-100 text-slate-900 ring-1 ring-slate-200"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-600 ring-1 ring-slate-200">
                    <MessageCircle className="h-4 w-4 animate-pulse" />
                    <span>Thinking…</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2 border-t border-slate-100 px-4 py-3">
              <div className="flex flex-wrap gap-2">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleAsk(q)}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about HomeSchool…"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAsk();
                    }
                  }}
                />
                <Button type="button" className="h-10 px-3" onClick={() => handleAsk()} disabled={loading}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
