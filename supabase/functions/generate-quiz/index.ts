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

type SearchItem = {
  title: string;
  snippet: string;
  link?: string;
};

async function verifyUser(req: Request) {
  const authorization = req.headers.get("authorization") ?? req.headers.get("Authorization") ?? "";
  if (!authorization.startsWith("Bearer ")) {
    return false;
  }

  const token = authorization.replace("Bearer ", "").trim();
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

  if (!supabaseUrl || !anonKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: anonKey,
    },
  });

  return response.ok;
}

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
    const isAuthorized = await verifyUser(req);
    if (!isAuthorized) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = (await req.json()) as GenerateQuizPayload;
    const language = payload.language === "bn" ? "bn" : "en";
    const count = payload.count ?? 10;
    const difficulty = payload.difficulty ?? "medium";
    const apiKey = Deno.env.get("SERPER_API_KEY");
    if (!apiKey) {
      const fallbackQuestions = buildQuestions([], language, count);
      return new Response(
        JSON.stringify({
          questions: fallbackQuestions,
          source: "fallback",
          warning: "Missing SERPER_API_KEY",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const query = `${buildSearchQuery(payload, language)} ${difficulty}`.trim();
    const keywords = buildKeywords(payload, language);

    const searchPayload = {
      q: query,
      num: Math.max(count * 2, 10),
      gl: "bd",
      hl: language,
    };

    let items: SearchItem[] = [];
    let source: "serper" | "fallback" = "serper";
    let warning: string | undefined;

    try {
      const response = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchPayload),
      });

      if (!response.ok) {
        warning = await response.text();
        source = "fallback";
      } else {
        const data = await response.json();
        const organic = Array.isArray(data?.organic) ? data.organic : [];
        const rawItems = organic
          .filter((item: { title?: string; snippet?: string }) => item.title && item.snippet)
          .map((item: { title: string; snippet: string; link?: string; url?: string }) => ({
            title: normalizeText(item.title),
            snippet: normalizeText(item.snippet),
            link: item.link ?? item.url ?? "",
          }));
        items = filterRelevantItems(rawItems, keywords, count);
      }
    } catch (error) {
      warning = String(error);
      source = "fallback";
    }

    const questions = buildQuestions(items, language, count);

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
