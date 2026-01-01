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

type GeminiQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
};

type GeminiParsed = {
  questions?: GeminiQuestion[];
};

type SearchItem = {
  title: string;
  snippet: string;
  link?: string;
};

function buildSearchQuery(payload: GenerateQuizPayload, language: "en" | "bn") {
  const parts = [payload.classLevel, payload.subject, payload.chapter];
  if (language === "bn") {
    parts.push("বাংলাদেশ", "এনসিটিবি", "পাঠ্যবই", "বহুনির্বাচনী");
  } else {
    parts.push("Bangladesh", "NCTB", "textbook", "MCQ");
  }
  return parts.filter(Boolean).join(" ");
}

function buildKeywords(payload: GenerateQuizPayload, language: "en" | "bn") {
  const keywords = [payload.subject, payload.chapter, payload.classLevel];
  if (language === "bn") {
    keywords.push("এনসিটিবি", "পাঠ্যবই", "বহুনির্বাচনী");
  } else {
    keywords.push("NCTB", "textbook", "syllabus");
  }
  return keywords
    .filter(Boolean)
    .map((value) => value.trim())
    .filter(Boolean);
}

function scoreItem(item: SearchItem, keywords: string[]) {
  const text = `${item.title} ${item.snippet}`.toLowerCase();
  let score = 0;
  for (const keyword of keywords) {
    const needle = keyword.toLowerCase();
    if (!needle) continue;
    if (text.includes(needle)) {
      score += 2;
    }
  }

  if (item.link) {
    try {
      const hostname = new URL(item.link).hostname;
      if (hostname.includes("nctb")) score += 5;
      if (hostname.endsWith(".gov.bd") || hostname.endsWith(".edu.bd")) score += 2;
      if (hostname.endsWith(".bd")) score += 1;
    } catch {
      // ignore bad URLs
    }
  }

  return score;
}

function filterRelevantItems(items: SearchItem[], keywords: string[], count: number) {
  const scored = items.map((item) => ({ item, score: scoreItem(item, keywords) }));
  const sorted = scored.sort((a, b) => b.score - a.score);
  const filtered = sorted.filter((entry) => entry.score > 0).map((entry) => entry.item);
  const minRelevant = Math.min(count, 6);
  return filtered.length >= minRelevant ? filtered : sorted.map((entry) => entry.item);
}

const fallbackOptions = {
  en: [
    "Definition and overview",
    "Key formula or rule",
    "Worked example summary",
    "Common misconception",
  ],
  bn: [
    "সংজ্ঞা ও সারসংক্ষেপ",
    "মূল সূত্র বা নিয়ম",
    "সমাধান করা উদাহরণের সারাংশ",
    "সাধারণ ভুল ধারণা",
  ],
};

const fallbackSnippets = {
  en: [
    "A summary of the main concept covered in this chapter.",
    "An explanation of a key rule or formula from the syllabus.",
    "A short description of how to solve a typical problem.",
    "A common mistake learners make and how to avoid it.",
  ],
  bn: [
    "এই অধ্যায়ের মূল ধারণার সংক্ষিপ্ত সারাংশ।",
    "সিলেবাসের একটি গুরুত্বপূর্ণ নিয়ম বা সূত্রের ব্যাখ্যা।",
    "সাধারণ সমস্যা সমাধানের সংক্ষিপ্ত বর্ণনা।",
    "শিক্ষার্থীরা যে ভুলটি করে এবং কীভাবে এড়ানো যায়।",
  ],
};

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function uniqueStrings(items: string[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const normalized = normalizeText(item);
    if (!normalized || seen.has(normalized.toLowerCase())) return false;
    seen.add(normalized.toLowerCase());
    return true;
  });
}

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildQuestions(
  items: { title: string; snippet: string }[],
  language: "en" | "bn",
  count: number
): QuizQuestion[] {
  const titles = uniqueStrings(items.map((item) => item.title));
  const targetCount = Math.max(1, count);
  const results: QuizQuestion[] = [];

  for (let i = 0; i < items.length && results.length < targetCount; i += 1) {
    const item = items[i];
    const questionPrefix =
      language === "bn"
        ? "নিচের বর্ণনার সাথে কোন শিরোনামটি সবচেয়ে বেশি মেলে?"
        : "Which title best matches the description below?";
    const question = `${questionPrefix}\n${normalizeText(item.snippet)}`;

    const wrongOptions = shuffle(
      titles.filter((title) => title !== item.title)
    ).slice(0, 3);
    const optionPool = uniqueStrings([
      ...wrongOptions,
      ...fallbackOptions[language],
    ]).filter((option) => option !== item.title);
    const distractors = shuffle(optionPool).slice(0, 3);
    const options = shuffle([item.title, ...distractors]);
    const correctAnswer = options.findIndex((option) => option === item.title);

    results.push({
      id: crypto.randomUUID(),
      question,
      options,
      correctAnswer: correctAnswer === -1 ? 0 : correctAnswer,
    });
  }

  while (results.length < targetCount) {
    const fallbackIndex = results.length % fallbackSnippets[language].length;
    const questionPrefix =
      language === "bn"
        ? "নিচের বর্ণনার সাথে কোন শিরোনামটি সবচেয়ে বেশি মেলে?"
        : "Which title best matches the description below?";
    const question = `${questionPrefix}\n${fallbackSnippets[language][fallbackIndex]}`;
    const options = shuffle(fallbackOptions[language]).slice(0, 4);

    results.push({
      id: crypto.randomUUID(),
      question,
      options,
      correctAnswer: 0,
    });
  }

  return results.slice(0, targetCount);
}

function buildGeminiPrompt(
  payload: GenerateQuizPayload,
  language: "en" | "bn",
  count: number,
  difficulty: string
) {
  const languageLabel = language === "bn" ? "Bangla (bn)" : "English (en)";
  const classLevel = payload.classLevel ?? "Unknown class level";
  const subject = payload.subject ?? "General subject";
  const chapter = payload.chapter ?? "General chapter";

  return [
    "You generate multiple-choice questions for NCTB-aligned study.",
    "Return only valid JSON with no extra text.",
    "Use the schema: {\"questions\":[{\"question\":\"...\",\"options\":[\"...\"],\"correctAnswer\":0,\"explanation\":\"...\"}]}",
    "correctAnswer must be a 0-based index into options.",
    "Each question must have exactly 4 options and exactly one correct answer.",
    "Keep questions concise and avoid ambiguous wording.",
    `Language: ${languageLabel}.`,
    `Class level: ${classLevel}.`,
    `Subject: ${subject}.`,
    `Chapter: ${chapter}.`,
    `Difficulty: ${difficulty}.`,
    `Count: ${count}.`,
    "Do not include numbering or markdown.",
  ].join(" ");
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

function normalizeOptions(
  rawOptions: unknown,
  rawCorrectAnswer: unknown,
  language: "en" | "bn"
) {
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

  let correctIndex =
    typeof rawCorrectAnswer === "number" && Number.isFinite(rawCorrectAnswer)
      ? Math.trunc(rawCorrectAnswer)
      : 0;
  if (correctIndex === 4 && cleaned.length >= 4) {
    correctIndex = 3;
  }

  let correctOption = cleaned[correctIndex];
  if (!correctOption && unique.length) {
    correctOption = unique[0];
  }

  let finalOptions = unique;
  if (correctOption && !finalOptions.includes(correctOption)) {
    finalOptions = [correctOption, ...finalOptions];
  }

  for (const fallback of fallbackOptions[language]) {
    if (finalOptions.length >= 4) break;
    if (!finalOptions.includes(fallback)) {
      finalOptions.push(fallback);
    }
  }

  finalOptions = finalOptions.slice(0, 4);
  let correctAnswer = correctOption ? finalOptions.indexOf(correctOption) : 0;
  if (!Number.isFinite(correctAnswer) || correctAnswer < 0) {
    correctAnswer = 0;
  }

  return { options: finalOptions, correctAnswer };
}

function normalizeQuestion(raw: unknown, language: "en" | "bn"): QuizQuestion | null {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as Record<string, unknown>;
  const question =
    typeof record.question === "string" ? normalizeText(record.question) : "";
  if (!question) return null;

  const { options, correctAnswer } = normalizeOptions(
    record.options,
    record.correctAnswer,
    language
  );
  if (!options.length) return null;

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
  const questions = (parsed as GeminiParsed).questions;
  return Array.isArray(questions) ? questions : [];
}

function normalizeGeminiQuestions(
  parsed: unknown,
  language: "en" | "bn"
): QuizQuestion[] {
  const rawQuestions = extractQuestions(parsed);
  const normalized = rawQuestions
    .map((entry) => normalizeQuestion(entry, language))
    .filter((entry): entry is QuizQuestion => Boolean(entry));
  return normalized;
}

function ensureQuestionCount(
  questions: QuizQuestion[],
  language: "en" | "bn",
  count: number
) {
  if (questions.length >= count) return questions.slice(0, count);
  const needed = count - questions.length;
  if (needed <= 0) return questions.slice(0, count);
  const fallbackQuestions = buildQuestions([], language, needed);
  return [...questions, ...fallbackQuestions].slice(0, count);
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
    const count = payload.count ?? 10;
    const difficulty = payload.difficulty ?? "medium";
    const apiKey = Deno.env.get("AIzaSyDO3pb_VeKw12hwirsTw7PQQBKlYlsqFTg");
    const model = Deno.env.get("GEMINI_MODEL") ?? "gemini-1.5-flash";
    if (!apiKey) {
      const fallbackQuestions = buildQuestions([], language, count);
      return new Response(
        JSON.stringify({
          questions: fallbackQuestions,
          source: "fallback",
          warning: "Missing GEMINI_API_KEY",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const prompt = buildGeminiPrompt(payload, language, count, difficulty);
    let source: "gemini" | "fallback" = "gemini";
    let warning: string | undefined;
    let geminiQuestions: QuizQuestion[] = [];

    try {
      const modelPath = model.startsWith("models/") ? model : `models/${model}`;
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/${modelPath}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.6,
            },
          }),
        }
      );

      if (!response.ok) {
        warning = await response.text();
        source = "fallback";
      } else {
        const data = await response.json();
        const parts = Array.isArray(data?.candidates?.[0]?.content?.parts)
          ? data.candidates[0].content.parts
          : [];
        const content = parts
          .map((part: { text?: string }) =>
            typeof part?.text === "string" ? part.text : ""
          )
          .join("");
        const parsed = parseJsonFromText(content);
        geminiQuestions = normalizeGeminiQuestions(parsed, language);
        if (!geminiQuestions.length) {
          source = "fallback";
          warning = warning ?? "Gemini returned no valid questions.";
        }
      }
    } catch (error) {
      warning = String(error);
      source = "fallback";
    }

    let questions: QuizQuestion[] = [];
    if (source === "gemini") {
      const finalQuestions = ensureQuestionCount(geminiQuestions, language, count);
      if (finalQuestions.length > geminiQuestions.length) {
        const fillWarning = "Filled missing questions with fallback prompts.";
        warning = warning ? `${warning} ${fillWarning}` : fillWarning;
      }
      questions = finalQuestions;
    } else {
      questions = buildQuestions([], language, count);
    }

    return new Response(JSON.stringify({ questions, source, warning }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
