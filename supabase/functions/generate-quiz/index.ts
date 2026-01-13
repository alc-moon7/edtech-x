import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { getSupabaseAdmin, getUserFromRequest } from "../_shared/supabase.ts";

const DAILY_LIMIT = 3;
const USAGE_TYPE = "quiz";

function getBangladeshDateKey() {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const bd = new Date(utcMs + 6 * 60 * 60 * 1000);
  return bd.toISOString().slice(0, 10);
}

async function isPremiumUser(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  userId: string
) {
  const nowIso = new Date().toISOString();
  const { count, error } = await supabaseAdmin
    .from("purchased_courses")
    .select("course_id", { count: "exact", head: true })
    .eq("user_id", userId)
    .or(`expires_at.is.null,expires_at.gt.${nowIso}`);

  if (error) {
    console.error("Premium check failed", error);
    return false;
  }

  return (count ?? 0) > 0;
}

async function checkAndIncrementUsage(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  userId: string
) {
  const usageDate = getBangladeshDateKey();
  const { data, error } = await supabaseAdmin
    .from("ai_usage")
    .select("count")
    .eq("user_id", userId)
    .eq("usage_date", usageDate)
    .eq("usage_type", USAGE_TYPE)
    .maybeSingle();

  if (error) {
    console.error("Usage lookup failed", error);
    throw new Error("Usage lookup failed");
  }

  const current = data?.count ?? 0;
  if (current >= DAILY_LIMIT) {
    return { allowed: false, count: current };
  }

  const { error: upsertError } = await supabaseAdmin.from("ai_usage").upsert(
    {
      user_id: userId,
      usage_date: usageDate,
      usage_type: USAGE_TYPE,
      count: current + 1,
    },
    { onConflict: "user_id,usage_date,usage_type" }
  );

  if (upsertError) {
    console.error("Usage update failed", upsertError);
    throw new Error("Usage update failed");
  }

  return { allowed: true, count: current + 1 };
}

type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
};

type GenerateQuizPayload = {
  subject?: string;
  chapter?: string;
  classLevel?: string;
  language?: "en" | "bn";
  count?: number;
  difficulty?: "easy" | "medium" | "hard";
  chapterId?: string;
  courseId?: string;
  subjectId?: string;
};

type OpenAiQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
};

type OpenAiParsed = {
  questions?: OpenAiQuestion[];
};

type OpenAiMessages = {
  system: string;
  user: string;
};

type ChapterAccess = {
  allowed: boolean;
  error?: string;
};

async function checkChapterAccess(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  userId: string,
  chapterId: string
): Promise<ChapterAccess> {
  const { data: chapter, error } = await supabaseAdmin
    .from("chapters")
    .select("id,is_free,order_no,course_id,subject:subjects(first_chapter_free,free_first_chapter)")
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
  if (isFree) return { allowed: true };

  const { count: chapterCount, error: chapterError } = await supabaseAdmin
    .from("purchased_chapters")
    .select("chapter_id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("chapter_id", chapterId);

  if (chapterError) {
    console.error("Chapter purchase lookup failed", chapterError);
    return { allowed: false, error: "Purchase lookup failed." };
  }

  if ((chapterCount ?? 0) > 0) return { allowed: true };

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

    if ((courseCount ?? 0) > 0) return { allowed: true };
  }

  return { allowed: false, error: "Chapter locked." };
}

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function uniqueStrings(items: string[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const normalized = normalizeText(item);
    if (!normalized) return false;
    const lowered = normalized.toLowerCase();
    if (seen.has(lowered)) return false;
    seen.add(lowered);
    return true;
  });
}

function buildOpenAiMessages(
  payload: GenerateQuizPayload,
  language: "en" | "bn",
  count: number,
  difficulty: string
): OpenAiMessages {
  const languageLabel = language === "bn" ? "bn" : "en";
  const classLevel = payload.classLevel ?? "Unknown class level";
  const subject = payload.subject ?? "General subject";
  const chapter = payload.chapter ?? "General chapter";

  const system = [
    "You are creating SSC/HSC standard MCQs for Bangladesh board exams.",
    "Use only the given class, subject, and chapter. Do not add outside topics.",
    "Exactly 4 options, only one correct answer, no trick wording.",
    "Board-style questions only. No markdown. No extra text.",
    "Return ONLY valid JSON in this exact schema:",
    "{\"questions\":[{\"question\":\"\",\"options\":[\"\",\"\",\"\",\"\"],\"correctAnswer\":0,\"explanation\":\"\"}]}",
    "correctAnswer must be a 0-based index into options.",
    "Use Bangla if language=bn, English if language=en.",
  ].join(" ");

  const user = [
    `Class: ${classLevel}`,
    `Subject: ${subject}`,
    `Chapter: ${chapter}`,
    `Difficulty: ${difficulty}`,
    `Count: ${count}`,
    `Language: ${languageLabel}`,
  ].join(" ");

  return { system, user };
}

function stripCodeFences(value: string) {
  const trimmed = value.trim();
  if (!trimmed.startsWith("```")) return trimmed;
  const withoutStart = trimmed.replace(/^```[a-zA-Z]*\s*/i, "");
  const endFence = withoutStart.lastIndexOf("```");
  if (endFence === -1) return withoutStart.trim();
  return withoutStart.slice(0, endFence).trim();
}

function sliceBetween(value: string, startChar: string, endChar: string) {
  const startIndex = value.indexOf(startChar);
  const endIndex = value.lastIndexOf(endChar);
  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) return "";
  return value.slice(startIndex, endIndex + 1);
}

function parseJsonFromText(value: string): unknown | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    // fall through
  }

  const unfenced = stripCodeFences(trimmed);
  if (unfenced !== trimmed) {
    try {
      return JSON.parse(unfenced);
    } catch {
      // fall through
    }
  }

  const objectSlice = sliceBetween(trimmed, "{", "}");
  if (objectSlice) {
    try {
      return JSON.parse(objectSlice);
    } catch {
      // fall through
    }
  }

  const arraySlice = sliceBetween(trimmed, "[", "]");
  if (arraySlice) {
    try {
      return JSON.parse(arraySlice);
    } catch {
      // fall through
    }
  }

  return null;
}

function normalizeOptions(rawOptions: unknown, rawCorrectAnswer: unknown) {
  const optionsArray = Array.isArray(rawOptions) ? rawOptions : [];
  const cleaned = optionsArray
    .map((option) => {
      if (typeof option === "string") return option;
      if (option === null || option === undefined) return "";
      return String(option);
    })
    .map(normalizeText)
    .filter(Boolean);
  const unique = uniqueStrings(cleaned);
  if (unique.length < 4) return null;

  let correctIndex = 0;
  if (typeof rawCorrectAnswer === "number" && Number.isFinite(rawCorrectAnswer)) {
    correctIndex = Math.trunc(rawCorrectAnswer);
  } else if (typeof rawCorrectAnswer === "string") {
    const parsed = Number.parseInt(rawCorrectAnswer, 10);
    if (Number.isFinite(parsed)) {
      correctIndex = parsed;
    }
  }

  if (correctIndex < 0 || correctIndex >= cleaned.length) {
    correctIndex = 0;
  }
  if (correctIndex >= 4) {
    correctIndex = 3;
  }

  const correctOption = cleaned[correctIndex] ?? unique[0];
  const options = unique.slice(0, 4);
  if (correctOption && !options.includes(correctOption)) {
    options[options.length - 1] = correctOption;
  }

  let correctAnswer = options.indexOf(correctOption);
  if (!Number.isFinite(correctAnswer) || correctAnswer < 0) {
    correctAnswer = 0;
  }

  return { options, correctAnswer };
}

function normalizeQuestion(raw: unknown): QuizQuestion | null {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as Record<string, unknown>;
  const question =
    typeof record.question === "string" ? normalizeText(record.question) : "";
  if (!question) return null;

  const normalized = normalizeOptions(record.options, record.correctAnswer);
  if (!normalized) return null;
  const { options, correctAnswer } = normalized;

  const explanation =
    typeof record.explanation === "string"
      ? normalizeText(record.explanation)
      : undefined;

  return {
    id: crypto.randomUUID(),
    question,
    options,
    correctAnswer,
    ...(explanation ? { explanation } : {}),
  };
}

function extractQuestions(parsed: unknown) {
  if (Array.isArray(parsed)) return parsed;
  if (!parsed || typeof parsed !== "object") return [];
  const questions = (parsed as OpenAiParsed).questions;
  return Array.isArray(questions) ? questions : [];
}

function normalizeOpenAiQuestions(parsed: unknown): QuizQuestion[] {
  const rawQuestions = extractQuestions(parsed);
  return rawQuestions
    .map((entry) => normalizeQuestion(entry))
    .filter((entry): entry is QuizQuestion => Boolean(entry));
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { user, error: authError } = await getUserFromRequest(req);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = getSupabaseAdmin();
    const payload = (await req.json()) as GenerateQuizPayload;
    const chapterId = (payload.chapterId ?? "").trim();

    if (!chapterId) {
      return new Response(JSON.stringify({ error: "Chapter id is required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const access = await checkChapterAccess(supabaseAdmin, user.id, chapterId);
    if (!access.allowed) {
      return new Response(JSON.stringify({ error: access.error ?? "Chapter locked." }), {
        status: access.error === "Chapter not found." ? 404 : 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const isPremium = await isPremiumUser(supabaseAdmin, user.id);
    if (!isPremium) {
      const usage = await checkAndIncrementUsage(supabaseAdmin, user.id);
      if (!usage.allowed) {
        return new Response(
          JSON.stringify({
            error: "Daily limit reached. Upgrade your plan to continue.",
            code: "DAILY_LIMIT",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    const language = payload.language === "bn" ? "bn" : "en";
    const count = Math.max(1, payload.count ?? 10);
    const difficulty = payload.difficulty ?? "medium";
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    const model = Deno.env.get("OPENAI_MODEL");

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!model) {
      return new Response(JSON.stringify({ error: "Missing OPENAI_MODEL" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const messages = buildOpenAiMessages(payload, language, count, difficulty);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.6,
        max_tokens: 1200,
        messages: [
          { role: "system", content: messages.system },
          { role: "user", content: messages.user },
        ],
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      return new Response(
        JSON.stringify({ error: "OpenAI request failed.", details }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content ?? "";
    const parsed = parseJsonFromText(content);
    const questions = normalizeOpenAiQuestions(parsed).slice(0, count);

    if (!questions.length) {
      return new Response(
        JSON.stringify({ error: "OpenAI returned no valid questions." }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const warning =
      questions.length < count
        ? "OpenAI returned fewer questions than requested."
        : undefined;

    return new Response(
      JSON.stringify({ questions, source: "openai", warning }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
