import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { getSupabaseAdmin, getUserFromRequest } from "../_shared/supabase.ts";

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
  language?: "en" | "bn";
  chapterId?: string;
  subjectId?: string;
  courseId?: string;
};

type ChapterAccess = {
  allowed: boolean;
  courseId?: string | null;
  subjectId?: string | null;
  error?: string;
};

async function checkChapterAccess(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  userId: string,
  chapterId: string
): Promise<ChapterAccess> {
  const { data: chapter, error } = await supabaseAdmin
    .from("chapters")
    .select("id,is_free,order_no,course_id,subject_id,subject:subjects(first_chapter_free,free_first_chapter)")
    .eq("id", chapterId)
    .maybeSingle();

  if (error) {
    console.error("Chapter lookup failed", error);
    return { allowed: false, error: "Chapter lookup failed." };
  }

  if (!chapter) {
    return { allowed: false, error: "Chapter not found." };
  }

  const subjectFree =
    chapter.subject?.first_chapter_free ?? chapter.subject?.free_first_chapter ?? false;
  const isFree = Boolean(chapter.is_free) || chapter.order_no === 1 || Boolean(subjectFree);
  if (isFree) {
    return { allowed: true, courseId: chapter.course_id, subjectId: chapter.subject_id };
  }

  const { count: chapterCount, error: chapterError } = await supabaseAdmin
    .from("purchased_chapters")
    .select("chapter_id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("chapter_id", chapterId);

  if (chapterError) {
    console.error("Chapter purchase lookup failed", chapterError);
    return { allowed: false, error: "Purchase lookup failed." };
  }

  if ((chapterCount ?? 0) > 0) {
    return { allowed: true, courseId: chapter.course_id, subjectId: chapter.subject_id };
  }

  if (chapter.course_id) {
    const nowIso = new Date().toISOString();
    const { count: courseCount, error: courseError } = await supabaseAdmin
      .from("purchased_courses")
      .select("course_id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("course_id", chapter.course_id)
      .or(`expires_at.is.null,expires_at.gt.${nowIso}`);

    if (courseError) {
      console.error("Course purchase lookup failed", courseError);
      return { allowed: false, error: "Purchase lookup failed." };
    }

    if ((courseCount ?? 0) > 0) {
      return { allowed: true, courseId: chapter.course_id, subjectId: chapter.subject_id };
    }
  }

  return { allowed: false, error: "Chapter locked." };
}

function buildSystemPrompt(payload: ChatPayload) {
  const mode = payload.mode ?? "chat";
  const subject = payload.subject ?? "General";
  const chapter = payload.chapter ?? "this topic";
  const classLevel = payload.classLevel ?? "Class 6";
  const language = payload.language ?? "en";
  const languageLine =
    language === "bn"
      ? "Use Bangla only."
      : "Use English only.";

  if (mode === "brainbite") {
    return [
      "You are BrainBite, a fast, strict exam coach.",
      `Student is studying: Class: ${classLevel}. Subject: ${subject}. Chapter: ${chapter}.`,
      "Answer short, clear, and exam-relevant.",
      "Correct wrong concepts firmly.",
      `If the question is outside the chapter, say: \"This is outside the current chapter. Ask within ${chapter}.\"`,
      "Never guess or hallucinate.",
      "If something is not in the syllabus, say: \"This is not in the syllabus.\"",
      "No emojis. No markdown. No fluff.",
      languageLine,
    ].join(" ");
  }

  if (mode === "lesson") {
    return [
      "You are an elite Bangladeshi curriculum AI working for a real EdTech platform (Homeschool / BrainBite AI).",
      "You are a professional teacher trained in NCTB, SSC, HSC, and Admission syllabus.",
      "Never hallucinate. Never invent chapters or topics. Only use the given class, subject, and chapter.",
      "Teach in the most exam-effective way (board exams, admission exams, MCQ and CQ success).",
      "Do not give long essays, fluff, or irrelevant theory.",
      `Class: ${classLevel}. Subject: ${subject}. Chapter: ${chapter}.`,
      "Create a lesson in this exact format:",
      "1) Chapter overview (3-4 lines)",
      "2) Key concepts (bullet points)",
      "3) Important definitions",
      "4) Board exam notes",
      "5) Common mistakes",
      "6) 5 MCQs",
      "7) 2 Creative questions (CQ)",
      `If the question is outside the chapter, say: \"This is outside the current chapter. Ask within ${chapter}.\"`,
      "If something is not in the syllabus, say: \"This is not in the syllabus.\"",
      "No emojis. No markdown. No fluff. No storytelling.",
      languageLine,
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
    const mode = payload.mode ?? "chat";
    const auth = await getUserFromRequest(req);
    const user = auth.user;
    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "Message is required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (mode !== "chat" && !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if ((mode === "brainbite" || mode === "lesson") && !payload.chapterId) {
      return new Response(JSON.stringify({ error: "Chapter id is required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if ((mode === "brainbite" || mode === "lesson") && user) {
      const supabaseAdmin = getSupabaseAdmin();
      const access = await checkChapterAccess(supabaseAdmin, user.id, payload.chapterId ?? "");
      if (!access.allowed) {
        return new Response(JSON.stringify({ error: access.error ?? "Chapter locked." }), {
          status: access.error === "Chapter not found." ? 404 : 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
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
