create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text not null,
  school text,
  class_name text,
  section text,
  student_id text,
  guardian_name text,
  phone text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Profiles are insertable by owner"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Profiles are updatable by owner"
  on public.profiles for update
  using (auth.uid() = id);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  role text,
  message text not null,
  user_agent text,
  created_at timestamp with time zone default now()
);

alter table public.contact_messages enable row level security;

create extension if not exists vector;

create table if not exists public.nctb_chunks (
  id uuid primary key default gen_random_uuid(),
  class_level text not null,
  subject text,
  book_name text,
  page integer,
  content text not null,
  embedding vector(1536),
  created_at timestamp with time zone default now()
);

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
