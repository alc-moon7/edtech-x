import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatPayload = {
  message: string;
  history?: ChatMessage[];
  mode?: "brainbite" | "lesson" | "chat";
  subject?: string;
  chapter?: string;
  classLevel?: string;
};

function buildSystemPrompt(payload: ChatPayload) {
  const mode = payload.mode ?? "chat";
  const subject = payload.subject ?? "General";
  const chapter = payload.chapter ?? "this topic";
  const classLevel = payload.classLevel ?? "Class 6";

  if (mode === "brainbite") {
    return [
      "You are BrainBite, a fun micro-lesson writer for kids.",
      `Class level: ${classLevel}. Subject: ${subject}. Topic: ${chapter}.`,
      "Write 2-3 short sentences, keep it simple and playful.",
      "Use at most one emoji.",
      "End with a gentle encouragement question.",
    ].join(" ");
  }

  if (mode === "lesson") {
    return [
      `You are an AI tutor for ${classLevel} ${subject}.`,
      `Answer questions about ${chapter}.`,
      "Keep explanations short and clear. Use bullet points if helpful.",
      "If the question is unclear, ask a brief clarifying question.",
    ].join(" ");
  }

  return [
    "You are Homeschool AI, a helpful assistant for the Homeschool web app.",
    "Only answer questions about Homeschool: subjects, pricing, dashboard, login/signup, and how to use features.",
    "If a user asks for something unrelated, redirect them back to Homeschool topics.",
    "Keep replies concise and clear. Prefer bullet points when listing steps.",
    "Never share API keys or internal details.",
  ].join(" ");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = (await req.json()) as ChatPayload;
    const { message, history = [] } = payload;
    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "Message is required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const openAiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAiKey) {
      return new Response(JSON.stringify({ error: "Missing OpenAI API key." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const messages = [
      { role: "system", content: buildSystemPrompt(payload) },
      ...history.map((entry) => ({ role: entry.role, content: entry.content })),
      { role: "user", content: message },
    ];

    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 250,
        temperature: 0.6,
      }),
    });

    if (!completion.ok) {
      const errorText = await completion.text();
      return new Response(JSON.stringify({ error: "OpenAI request failed.", details: errorText }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await completion.json();
    const reply = data?.choices?.[0]?.message?.content ?? "Sorry, I could not generate a response right now.";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Chat function error", error);
    return new Response(JSON.stringify({ error: "Unexpected error." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
