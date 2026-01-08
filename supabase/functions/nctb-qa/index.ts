import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type QaPayload = {
  question?: string;
  classLevel?: string;
  language?: "en" | "bn";
};

type ChunkRow = {
  content: string;
  subject: string | null;
  book_name: string | null;
  page: number | null;
  similarity: number;
};

const EMBEDDING_MODEL = "text-embedding-3-small";
const CHAT_MODEL = Deno.env.get("OPENAI_MODEL") ?? "gpt-4o-mini";

function buildSystemPrompt(language: "en" | "bn") {
  if (language === "bn") {
    return [
      "তুমি NCTB Class 6 বইয়ের সহায়ক।",
      "শুধু দেওয়া context থেকে উত্তর দেবে।",
      "context এ উত্তর না থাকলে বলবে: “এই প্রশ্নের উত্তর বইয়ে পাইনি।”",
      "উত্তর সংক্ষিপ্ত ও পরিষ্কার হবে।",
    ].join(" ");
  }

  return [
    "You are a helpful assistant for NCTB Class 6 textbooks.",
    "Answer strictly from the provided context.",
    "If the answer is not in the context, say: “I couldn’t find this in the Class 6 books.”",
    "Keep the reply concise and clear.",
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
    const payload = (await req.json()) as QaPayload;
    const question = (payload.question ?? "").trim();
    const classLevel = (payload.classLevel ?? "Class 6").trim();
    const language = payload.language === "bn" ? "bn" : "en";

    if (!question) {
      return new Response(JSON.stringify({ error: "Question is required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const openAiKey = Deno.env.get("OPENAI_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!openAiKey || !supabaseUrl || !serviceRoleKey) {
      return new Response(JSON.stringify({ error: "Missing server configuration." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
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
    const context = chunks
      .filter((chunk) => chunk?.content)
      .map((chunk, index) => {
        const book = chunk.book_name ?? "NCTB";
        const page = chunk.page ?? "-";
        return `Source ${index + 1} (${book}, p.${page}): ${chunk.content}`;
      })
      .join("\n\n")
      .slice(0, 6000);

    if (!context.trim()) {
      const fallback =
        language === "bn"
          ? "এই প্রশ্নের উত্তর বইয়ে পাইনি।"
          : "I couldn’t find this in the Class 6 books.";
      return new Response(JSON.stringify({ reply: fallback }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const system = buildSystemPrompt(language);
    const user = `Question: ${question}\n\nContext:\n${context}\n\nAnswer:`;

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
          { role: "user", content: user },
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
