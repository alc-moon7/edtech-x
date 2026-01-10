import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { getSupabaseAdmin, getUserFromRequest } from "../_shared/supabase.ts";

type QaPayload = {
  question?: string;
  classLevel?: string;
  subject?: string;
  language?: "en" | "bn";
};

type ChunkRow = {
  content: string;
  subject: string | null;
  book_name: string | null;
  page: number | null;
  similarity: number;
};

const EMBEDDING_MODEL = "text-embedding-3-large";
const CHAT_MODEL = Deno.env.get("OPENAI_MODEL") ?? "gpt-4o-mini";
const DAILY_LIMIT = 3;
const USAGE_TYPE = "home_qa";

function getBangladeshDateKey() {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const bd = new Date(utcMs + 6 * 60 * 60 * 1000);
  return bd.toISOString().slice(0, 10);
}

async function isPremiumUser(supabaseAdmin: ReturnType<typeof getSupabaseAdmin>, userId: string) {
  const { count, error } = await supabaseAdmin
    .from("purchased_courses")
    .select("course_id", { count: "exact", head: true })
    .eq("user_id", userId);

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

function buildSystemPrompt(language: "en" | "bn", classLevel: string, subject: string) {
  if (language === "bn") {
    return [
      `???? Homeschool AI, ${classLevel} ?? ${subject} ?????? ????? ??????`,
      "??????? ??????? ???????? ????? ???? ??????? ????",
      "???????? ?? ????? ?? ?????? ?? ??? ??????????? ?????? ???????? ????",
      "??? ?????? ???????? ???, ??? ??? ????? ????? ????? ?????? ?????????",
      "????? ?????????, ???????? ? ??????????? ?????",
    ].join(" ");
  }

  return [
    `You are Homeschool AI, a helpful tutor for ${classLevel} ${subject}.`,
    "Use the provided textbook context when it is relevant and sufficient.",
    "If context is missing or not enough, answer with a concise subject-based explanation.",
    "When you go beyond the context, mention it is a general explanation (not from the book).",
    "Keep answers short, clear, and student-friendly.",
  ].join(" ");
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

    const payload = (await req.json()) as QaPayload;
    const question = (payload.question ?? "").trim();
    const classLevel = (payload.classLevel ?? "Class 6").trim();
    const subject = (payload.subject ?? "General subject").trim() || "General subject";
    const language = payload.language === "bn" ? "bn" : "en";

    if (!question) {
      return new Response(JSON.stringify({ error: "Question is required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const openAiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAiKey) {
      return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = getSupabaseAdmin();
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

    const embeddingRes = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: EMBEDDING_MODEL,
        input: question,
      }),
    });

    if (!embeddingRes.ok) {
      const errorText = await embeddingRes.text();
      return new Response(JSON.stringify({ error: "Embedding failed.", details: errorText }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const embeddingData = await embeddingRes.json();
    const embedding = embeddingData?.data?.[0]?.embedding;
    if (!embedding) {
      return new Response(JSON.stringify({ error: "Embedding missing." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(JSON.stringify({ error: "Missing server configuration." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const matchRes = await fetch(`${supabaseUrl}/rest/v1/rpc/match_nctb_chunks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceRoleKey}`,
        apikey: serviceRoleKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query_embedding: embedding,
        match_count: 6,
        class_level: classLevel,
        min_similarity: 0.7,
      }),
    });

    if (!matchRes.ok) {
      const errorText = await matchRes.text();
      return new Response(JSON.stringify({ error: "Chunk search failed.", details: errorText }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const chunks = (await matchRes.json()) as ChunkRow[];
    const normalizedSubject = subject.toLowerCase();
    const subjectChunks = normalizedSubject
      ? chunks.filter((chunk) => chunk.subject?.toLowerCase().includes(normalizedSubject))
      : [];
    const selectedChunks = subjectChunks.length ? subjectChunks : chunks;

    const context = selectedChunks
      .filter((chunk) => chunk?.content)
      .map((chunk, index) => {
        const book = chunk.book_name ?? "NCTB";
        const page = chunk.page ?? "-";
        return `Source ${index + 1} (${book}, p.${page}): ${chunk.content}`;
      })
      .join("\n\n")
      .slice(0, 6000);

    const system = buildSystemPrompt(language, classLevel, subject);
    const userPrompt = [
      `Question: ${question}`,
      `Class level: ${classLevel}`,
      `Subject: ${subject}`,
      `Context:\n${context || "(none)"}`,
      "Answer:",
    ].join("\n\n");

    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: CHAT_MODEL,
        messages: [
          { role: "system", content: system },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 350,
        temperature: 0.3,
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
    const reply = data?.choices?.[0]?.message?.content ?? "";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("NCTB QA error", error);
    return new Response(JSON.stringify({ error: "Unexpected error." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
