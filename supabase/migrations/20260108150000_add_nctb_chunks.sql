create extension if not exists vector;

create table if not exists public.nctb_chunks (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  created_at timestamp with time zone default now()
);

alter table public.nctb_chunks
  add column if not exists class_level text,
  add column if not exists subject text,
  add column if not exists book_name text,
  add column if not exists page integer,
  add column if not exists embedding vector(1536);

update public.nctb_chunks
  set class_level = 'Class 6'
  where class_level is null;

create index if not exists nctb_chunks_class_idx on public.nctb_chunks (class_level);
-- Optional: add a vector index later when embedding dimension is confirmed.

alter table public.nctb_chunks enable row level security;

create or replace function public.match_nctb_chunks(
  query_embedding vector(1536),
  match_count int,
  class_level text,
  min_similarity float default 0.75
)
returns table (
  id uuid,
  content text,
  subject text,
  book_name text,
  page integer,
  similarity float
)
language sql stable as $$
  select
    id,
    content,
    subject,
    book_name,
    page,
    1 - (embedding <=> query_embedding) as similarity
  from public.nctb_chunks
  where embedding is not null
    and class_level = match_nctb_chunks.class_level
    and 1 - (embedding <=> query_embedding) > min_similarity
  order by embedding <=> query_embedding
  limit match_count;
$$;
