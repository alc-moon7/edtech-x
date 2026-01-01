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

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildSearchQuery(payload: GenerateQuizPayload, language: "en" | "bn", difficulty: string) {
  const parts = [payload.classLevel, payload.subject, payload.chapter, difficulty];
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

function buildQuestions(items: SearchItem[], language: "en" | "bn", count: number) {
  const titles = uniqueStrings(items.map((item) => item.title));
  const results: QuizQuestion[] = [];

  for (let i = 0; i < items.length && results.length < count; i += 1) {
    const item = items[i];
    if (!item.title || !item.snippet) continue;

    const questionPrefix =
      language === "bn"
        ? "নিচের বর্ণনার সাথে কোন শিরোনামটি সবচেয়ে বেশি মেলে?"
        : "Which title best matches the description below?";
    const question = `${questionPrefix}\n${normalizeText(item.snippet)}`;

    const wrongOptions = shuffle(
      titles.filter((title) => title !== item.title)
    ).slice(0, 3);
    const options = shuffle(uniqueStrings([item.title, ...wrongOptions]));

    if (options.length < 4) continue;

    results.push({
      id: crypto.randomUUID(),
      question,
      options: options.slice(0, 4),
      correctAnswer: options.indexOf(item.title),
    });
  }

  return results.slice(0, count);
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
    const apiKey = Deno.env.get("SERPER_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing SERPER_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const query = buildSearchQuery(payload, language, difficulty);
    const keywords = buildKeywords(payload, language);
    const searchPayload = {
      q: query,
      num: Math.max(count * 2, 10),
      gl: "bd",
      hl: language,
    };

    const response = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(searchPayload),
    });

    if (!response.ok) {
      const details = await response.text();
      return new Response(
        JSON.stringify({ error: "Serper request failed.", details }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    const organic = Array.isArray(data?.organic) ? data.organic : [];
    const rawItems = organic
      .filter((item: { title?: string; snippet?: string }) => item.title && item.snippet)
      .map((item: { title: string; snippet: string; link?: string; url?: string }) => ({
        title: normalizeText(item.title),
        snippet: normalizeText(item.snippet),
        link: item.link ?? item.url ?? "",
      }));

    const items = filterRelevantItems(rawItems, keywords, count);
    const questions = buildQuestions(items, language, count);

    if (!questions.length) {
      return new Response(
        JSON.stringify({ error: "No questions could be generated from Serper." }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const warning =
      questions.length < count
        ? "Serper returned fewer questions than requested."
        : undefined;

    return new Response(JSON.stringify({ questions, source: "serper", warning }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
