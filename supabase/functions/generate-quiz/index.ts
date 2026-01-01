import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
};

type GenerateQuizPayload = {
  subject?: string;
  chapter?: string;
  classLevel?: string;
  language?: "en" | "bn";
  count?: number;
};

type SearchItem = {
  title: string;
  snippet: string;
  link?: string;
};

function normalizeText(v: string) {
  return v.replace(/\s+/g, " ").trim();
}

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function uniqueStrings(arr: string[]) {
  const s = new Set<string>();
  return arr.filter((x) => {
    const v = normalizeText(x).toLowerCase();
    if (!v || s.has(v)) return false;
    s.add(v);
    return true;
  });
}

function buildSearchQuery(
  payload: GenerateQuizPayload,
  language: "en" | "bn"
) {
  const parts = [payload.classLevel, payload.subject, payload.chapter];
  if (language === "bn") {
    parts.push("বাংলাদেশ", "এনসিটিবি", "পাঠ্যবই");
  } else {
    parts.push("Bangladesh", "NCTB", "textbook");
  }
  return parts.filter(Boolean).join(" ");
}

async function fetchSerperResults(
  query: string,
  language: "en" | "bn",
  count: number
): Promise<SearchItem[]> {
  const apiKey = Deno.env.get("SERPER_API_KEY");
  if (!apiKey) throw new Error("Missing SERPER_API_KEY");

  const res = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: {
      "X-API-KEY": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: query,
      gl: "bd",
      hl: language === "bn" ? "bn" : "en",
      num: Math.min(10, count * 2),
    }),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(t);
  }

  const data = await res.json();
  const organic = Array.isArray(data?.organic) ? data.organic : [];

  return organic.map((i: any) => ({
    title: normalizeText(i.title ?? ""),
    snippet: normalizeText(i.snippet ?? ""),
    link: i.link,
  }));
}

function buildQuestions(
  items: SearchItem[],
  payload: GenerateQuizPayload,
  language: "en" | "bn",
  count: number
): QuizQuestion[] {
  const results: QuizQuestion[] = [];
  const titles = uniqueStrings(items.map((i) => i.title));

  for (let i = 0; i < items.length && results.length < count; i++) {
    const item = items[i];

    if (!item.title || !item.snippet) continue;

    const q =
      language === "bn"
        ? `নিচের কোন শিরোনামটি বর্ণনার সাথে সবচেয়ে বেশি মেলে?\n${item.snippet}`
        : `Which title best matches the description below?\n${item.snippet}`;

    const wrong = shuffle(titles.filter((t) => t !== item.title)).slice(0, 3);
    const options = shuffle(uniqueStrings([item.title, ...wrong]));

    if (options.length < 4) continue;

    results.push({
      id: crypto.randomUUID(),
      question: q,
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
    const count = payload.count ?? 10;

    const query = buildSearchQuery(payload, language);

    let items: SearchItem[] = [];
    let warning: string | undefined;

    try {
      items = await fetchSerperResults(query, language, count);
    } catch (e) {
      warning = String(e);
    }

    const questions = items.length
      ? buildQuestions(items, payload, language, count)
      : [];

    return new Response(
      JSON.stringify({
        questions,
        source: "serper",
        warning,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
