"use strict";

import { createClient } from "@supabase/supabase-js";
import { createRequire } from "module";
import { createHash } from "crypto";

const require = createRequire(import.meta.url);
const PDFJS = require("pdf-parse/lib/pdf.js/v1.10.100/build/pdf.js");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const BUCKET = "nctb-pdfs";
const PREFIX = "Class 6";
const CLASS_LEVEL = "Class 6";
const EMBEDDING_MODEL = "text-embedding-3-large";
const CHUNK_WORDS = 400;
const BATCH_SIZE = 5;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !OPENAI_API_KEY) {
  console.error("Missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or OPENAI_API_KEY.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

PDFJS.disableWorker = true;

function hashContent(content) {
  return createHash("sha256").update(content).digest("hex");
}

async function extractPageText(pageData) {
  const renderOptions = {
    normalizeWhitespace: false,
    disableCombineTextItems: false,
  };
  const textContent = await pageData.getTextContent(renderOptions);
  let lastY;
  let text = "";
  for (const item of textContent.items) {
    if (lastY === item.transform[5] || !lastY) {
      text += item.str;
    } else {
      text += `\n${item.str}`;
    }
    lastY = item.transform[5];
  }
  return text;
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

async function fetchExistingHashes(hashes) {
  if (!hashes.length) return new Set();
  const unique = Array.from(new Set(hashes));
  const { data, error } = await supabase
    .from("nctb_chunks")
    .select("content_hash")
    .in("content_hash", unique);

  if (error) {
    throw new Error(`Hash lookup failed: ${error.message}`);
  }

  return new Set((data || []).map((row) => row.content_hash));
}

async function flushBatch(state, subject) {
  if (state.batch.length === 0) return;

  const pending = state.batch;
  state.batch = [];

  const deduped = [];
  const seen = new Set();
  for (const item of pending) {
    if (seen.has(item.hash)) {
      state.skippedCount += 1;
      state.processedCount += 1;
      console.log(`Skipping existing chunk (duplicate in batch): ${item.hash}`);
      continue;
    }
    seen.add(item.hash);
    deduped.push(item);
  }

  if (!deduped.length) return;

  const existing = await fetchExistingHashes(deduped.map((item) => item.hash));
  const fresh = [];

  for (const item of deduped) {
    if (existing.has(item.hash)) {
      state.skippedCount += 1;
      state.processedCount += 1;
      console.log(`Skipping existing chunk: ${item.hash}`);
      continue;
    }
    fresh.push(item);
  }

  if (!fresh.length) return;

  const embeddings = await embedBatch(fresh.map((item) => item.content));
  const rows = fresh.map((item, idx) => ({
    class_level: CLASS_LEVEL,
    subject,
    book_name: subject,
    page: item.page,
    content: item.content,
    content_hash: item.hash,
    embedding: embeddings[idx],
  }));

  const { error } = await supabase
    .from("nctb_chunks")
    .upsert(rows, { onConflict: "content_hash", ignoreDuplicates: true });
  if (error) {
    throw new Error(`Insert failed: ${error.message}`);
  }

  state.insertedCount += rows.length;
  state.processedCount += rows.length;
  console.log(
    `Inserted ${state.insertedCount} chunks (processed ${state.processedCount}, skipped ${state.skippedCount})`
  );
}

async function enqueueChunk(content, page, state, subject) {
  const trimmed = content.trim();
  if (!trimmed) return;
  const hash = hashContent(trimmed);
  state.batch.push({ content: trimmed, page, hash });
  if (state.batch.length >= BATCH_SIZE) {
    await flushBatch(state, subject);
  }
}

async function ingestFile(path) {
  console.log(`Downloading: ${path}`);
  const { data, error } = await supabase.storage.from(BUCKET).download(path);
  if (error || !data) throw new Error(`Download failed: ${error?.message ?? "unknown"}`);

  let arrayBuffer = await data.arrayBuffer();
  const pdfData = new Uint8Array(arrayBuffer);
  arrayBuffer = null;

  const doc = await PDFJS.getDocument(pdfData);
  const totalPages = doc.numPages;
  const subject = path.split("/").pop()?.replace(/\.pdf$/i, "") ?? "NCTB";

  const state = {
    batch: [],
    insertedCount: 0,
    processedCount: 0,
    skippedCount: 0,
    carry: [],
  };

  for (let pageNum = 1; pageNum <= totalPages; pageNum += 1) {
    const page = await doc.getPage(pageNum);
    const pageText = await extractPageText(page);
    if (page.cleanup) page.cleanup();

    const words = pageText.split(/\s+/).filter(Boolean);
    if (words.length) {
      state.carry.push(...words);
      while (state.carry.length >= CHUNK_WORDS) {
        const chunkWords = state.carry.slice(0, CHUNK_WORDS);
        state.carry = state.carry.slice(CHUNK_WORDS);
        await enqueueChunk(chunkWords.join(" "), pageNum, state, subject);
      }
    }

    if (pageNum % 5 === 0 || pageNum === totalPages) {
      console.log(`Processed page ${pageNum}/${totalPages}`);
    }
  }

  if (state.carry.length) {
    await enqueueChunk(state.carry.join(" "), totalPages, state, subject);
    state.carry.length = 0;
  }

  await flushBatch(state, subject);
  doc.destroy();
  console.log(
    `Finished ${subject}. Inserted ${state.insertedCount}, skipped ${state.skippedCount}.`
  );
}

async function main() {
  const { data: files, error } = await supabase.storage.from(BUCKET).list(PREFIX, { limit: 1000 });
  if (error) throw new Error(`List failed: ${error.message}`);

  const pdfs = (files || []).filter((file) => file.name.toLowerCase().endsWith(".pdf"));
  if (pdfs.length === 0) {
    console.log("No PDFs found.");
    return;
  }

  for (const file of pdfs) {
    await ingestFile(`${PREFIX}/${file.name}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
