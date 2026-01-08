import pdfParse from "pdf-parse";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const BUCKET = "nctb-pdfs";
const PREFIX = "Class 6";
const CLASS_LEVEL = "Class 6";
const EMBEDDING_MODEL = "text-embedding-3-small";
const CHUNK_WORDS = 350;
const CHUNK_OVERLAP = 60;
const CHUNK_CHARS = 2000;
const CHUNK_CHAR_OVERLAP = 200;
const BATCH_SIZE = 30;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !OPENAI_API_KEY) {
  console.error("Missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or OPENAI_API_KEY.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

function chunkByChars(text) {
  const chunks = [];
  for (let i = 0; i < text.length; i += CHUNK_CHARS - CHUNK_CHAR_OVERLAP) {
    const slice = text.slice(i, i + CHUNK_CHARS);
    if (slice.trim()) chunks.push(slice.trim());
  }
  return chunks;
}

function chunkText(text) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length > CHUNK_WORDS) {
    const chunks = [];
    for (let i = 0; i < words.length; i += CHUNK_WORDS - CHUNK_OVERLAP) {
      const slice = words.slice(i, i + CHUNK_WORDS);
      if (slice.length) chunks.push(slice.join(" "));
    }
    return chunks;
  }

  if (text.length > CHUNK_CHARS * 2) {
    return chunkByChars(text);
  }

  return words.length ? [words.join(" ")] : [];
}

async function embedBatch(inputs) {
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: inputs,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Embedding failed: ${err}`);
  }

  const data = await res.json();
  return data.data.map((item) => item.embedding);
}

async function ingestFile(path) {
  console.log(`Downloading: ${path}`);
  const { data, error } = await supabase.storage.from(BUCKET).download(path);
  if (error || !data) throw new Error(`Download failed: ${error?.message ?? "unknown"}`);

  const arrayBuffer = await data.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const parsed = await pdfParse(buffer);
  const text = parsed.text?.trim();
  if (!text) return;

  const chunks = chunkText(text);
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  console.log(`Extracted ${wordCount} words, ${text.length} chars, ${chunks.length} chunks`);
  const subject = path.split("/").pop()?.replace(/\.pdf$/i, "") ?? "NCTB";

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    const embeddings = await embedBatch(batch);
    const rows = batch.map((content, idx) => ({
      class_level: CLASS_LEVEL,
      subject,
      book_name: subject,
      page: null,
      content,
      embedding: embeddings[idx],
    }));

    const { error: insertError } = await supabase.from("nctb_chunks").insert(rows);
    if (insertError) {
      throw new Error(`Insert failed: ${insertError.message}`);
    }
    console.log(`Inserted ${rows.length} chunks`);
  }
}

async function main() {
  const { data: files, error } = await supabase.storage.from(BUCKET).list(PREFIX, { limit: 1000 });
  if (error) throw new Error(`List failed: ${error.message}`);

  const pdfs = (files || []).filter((file) => file.name.toLowerCase().endsWith(".pdf"));
  for (const file of pdfs) {
    await ingestFile(`${PREFIX}/${file.name}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
