import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

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
  const languageLabel = language === "bn" ? "Bangla (bn)" : "English (en)";
  const classLevel = payload.classLevel ?? "Unknown class level";
  const subject = payload.subject ?? "General subject";
  const chapter = payload.chapter ?? "General chapter";

  const system = [
    "You are an expert NCTB curriculum quiz writer.",
    "Return only valid JSON with no extra text.",
    "Use the schema: {\"questions\":[{\"question\":\"...\",\"options\":[\"...\"],\"correctAnswer\":0,\"explanation\":\"...\"}]}",
    "correctAnswer must be a 0-based index into options.",
    "Each question must have exactly 4 options and exactly one correct answer.",
    "Avoid meta-questions like matching titles; create real MCQs.",
    "Keep content strictly within the given class, subject, and chapter.",
  ].join(" ");

  const user = [
    `Language: ${languageLabel}.`,
    `Class level: ${classLevel}.`,
    `Subject: ${subject}.`,
    `Chapter: ${chapter}.`,
    `Difficulty: ${difficulty}.`,
    `Count: ${count}.`,
    "Do not include numbering or markdown.",
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
    const payload = (await req.json()) as GenerateQuizPayload;
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
