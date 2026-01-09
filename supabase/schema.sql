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
create extension if not exists pgcrypto;

create table if not exists public.nctb_chunks (
  id uuid primary key default gen_random_uuid(),
  class_level text not null,
  subject text,
  book_name text,
  page integer,
  content text not null,
  content_hash text not null,
  embedding vector(1536),
  created_at timestamp with time zone default now()
);

create index if not exists nctb_chunks_class_idx on public.nctb_chunks (class_level);
create unique index if not exists nctb_chunks_content_hash_key on public.nctb_chunks (content_hash);
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

create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  class_level text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

drop trigger if exists set_user_profiles_updated_at on public.user_profiles;
create trigger set_user_profiles_updated_at
before update on public.user_profiles
for each row execute function public.set_updated_at();

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  class_level text not null,
  created_at timestamp with time zone default now()
);

create index if not exists subjects_class_idx on public.subjects (class_level);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects (id) on delete cascade,
  title text not null,
  class_level text not null,
  description text,
  created_at timestamp with time zone default now()
);

create index if not exists courses_class_idx on public.courses (class_level);
create index if not exists courses_subject_idx on public.courses (subject_id);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null,
  order_no integer not null default 0,
  type text not null check (type in ('video', 'article', 'quiz')),
  duration_minutes integer,
  quiz_question_count integer,
  created_at timestamp with time zone default now()
);

create index if not exists lessons_course_idx on public.lessons (course_id);
create index if not exists lessons_order_idx on public.lessons (course_id, order_no);

create table if not exists public.enrollments (
  user_id uuid not null references auth.users (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  status text not null check (status in ('ongoing', 'completed')),
  enrolled_at timestamp with time zone default now(),
  primary key (user_id, course_id)
);

create index if not exists enrollments_status_idx on public.enrollments (status);
create index if not exists enrollments_course_idx on public.enrollments (course_id);

create table if not exists public.lesson_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  completed boolean not null default false,
  progress_percent integer not null default 0 check (progress_percent >= 0 and progress_percent <= 100),
  last_position integer,
  updated_at timestamp with time zone default now(),
  primary key (user_id, lesson_id)
);

drop trigger if exists set_lesson_progress_updated_at on public.lesson_progress;
create trigger set_lesson_progress_updated_at
before update on public.lesson_progress
for each row execute function public.set_updated_at();

create index if not exists lesson_progress_course_idx on public.lesson_progress (course_id);

create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  subject_id uuid references public.subjects (id) on delete set null,
  duration_minutes integer not null,
  session_date date not null,
  created_at timestamp with time zone default now()
);

create index if not exists study_sessions_user_idx on public.study_sessions (user_id, session_date);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  subject_id uuid references public.subjects (id) on delete set null,
  lesson_id uuid references public.lessons (id) on delete set null,
  score integer not null check (score >= 0 and score <= 100),
  created_at timestamp with time zone default now()
);

create index if not exists quiz_attempts_user_idx on public.quiz_attempts (user_id, created_at);

create table if not exists public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null,
  type text not null check (type in ('holiday', 'exam', 'study')),
  class_level text,
  created_at timestamp with time zone default now()
);

create index if not exists calendar_events_class_idx on public.calendar_events (class_level, date);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  amount numeric(10, 2) not null,
  currency text not null default 'BDT',
  status text not null check (status in ('pending', 'paid', 'failed', 'cancelled')),
  ssl_session_id text,
  created_at timestamp with time zone default now()
);

create index if not exists orders_user_idx on public.orders (user_id);
create index if not exists orders_course_idx on public.orders (course_id);
create index if not exists orders_status_idx on public.orders (status);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  tran_id text not null,
  amount numeric(10, 2) not null,
  card_type text,
  validation_id text,
  status text,
  raw_response jsonb,
  created_at timestamp with time zone default now()
);

create unique index if not exists payments_tran_id_key on public.payments (tran_id);
create index if not exists payments_order_idx on public.payments (order_id);

create table if not exists public.purchased_courses (
  user_id uuid not null references auth.users (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  purchased_at timestamp with time zone default now(),
  primary key (user_id, course_id)
);

create index if not exists purchased_courses_course_idx on public.purchased_courses (course_id);

alter table public.user_profiles enable row level security;
alter table public.subjects enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.study_sessions enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.calendar_events enable row level security;
alter table public.orders enable row level security;
alter table public.payments enable row level security;
alter table public.purchased_courses enable row level security;

create policy "User profiles are viewable by owner"
  on public.user_profiles for select
  using (auth.uid() = user_id);

create policy "User profiles are insertable by owner"
  on public.user_profiles for insert
  with check (auth.uid() = user_id);

create policy "User profiles are updatable by owner"
  on public.user_profiles for update
  using (auth.uid() = user_id);

create policy "Subjects are readable by class"
  on public.subjects for select
  using (
    exists (
      select 1 from public.user_profiles up
      where up.user_id = auth.uid()
        and up.class_level = subjects.class_level
    )
  );

create policy "Courses are readable by class"
  on public.courses for select
  using (
    exists (
      select 1 from public.user_profiles up
      where up.user_id = auth.uid()
        and up.class_level = courses.class_level
    )
  );

create policy "Lessons are readable for purchased courses"
  on public.lessons for select
  using (
    exists (
      select 1 from public.purchased_courses pc
      where pc.user_id = auth.uid()
        and pc.course_id = lessons.course_id
    )
  );

create policy "Enrollments are viewable by owner"
  on public.enrollments for select
  using (auth.uid() = user_id);

create policy "Enrollments are insertable by owner"
  on public.enrollments for insert
  with check (auth.uid() = user_id);

create policy "Enrollments are updatable by owner"
  on public.enrollments for update
  using (auth.uid() = user_id);

create policy "Enrollments are deletable by owner"
  on public.enrollments for delete
  using (auth.uid() = user_id);

create policy "Lesson progress is viewable by owner"
  on public.lesson_progress for select
  using (auth.uid() = user_id);

create policy "Lesson progress is insertable by owner"
  on public.lesson_progress for insert
  with check (auth.uid() = user_id);

create policy "Lesson progress is updatable by owner"
  on public.lesson_progress for update
  using (auth.uid() = user_id);

create policy "Lesson progress is deletable by owner"
  on public.lesson_progress for delete
  using (auth.uid() = user_id);

create policy "Study sessions are viewable by owner"
  on public.study_sessions for select
  using (auth.uid() = user_id);

create policy "Study sessions are insertable by owner"
  on public.study_sessions for insert
  with check (auth.uid() = user_id);

create policy "Study sessions are updatable by owner"
  on public.study_sessions for update
  using (auth.uid() = user_id);

create policy "Study sessions are deletable by owner"
  on public.study_sessions for delete
  using (auth.uid() = user_id);

create policy "Quiz attempts are viewable by owner"
  on public.quiz_attempts for select
  using (auth.uid() = user_id);

create policy "Quiz attempts are insertable by owner"
  on public.quiz_attempts for insert
  with check (auth.uid() = user_id);

create policy "Quiz attempts are updatable by owner"
  on public.quiz_attempts for update
  using (auth.uid() = user_id);

create policy "Quiz attempts are deletable by owner"
  on public.quiz_attempts for delete
  using (auth.uid() = user_id);

create policy "Calendar events are readable by class"
  on public.calendar_events for select
  using (
    exists (
      select 1 from public.user_profiles up
      where up.user_id = auth.uid()
        and (calendar_events.class_level is null or calendar_events.class_level = up.class_level)
    )
  );

create policy "Orders are viewable by owner"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Orders are insertable by owner"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "Orders are updatable by owner"
  on public.orders for update
  using (auth.uid() = user_id);

create policy "Payments are viewable by order owner"
  on public.payments for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = payments.order_id
        and o.user_id = auth.uid()
    )
  );

create policy "Purchased courses are viewable by owner"
  on public.purchased_courses for select
  using (auth.uid() = user_id);
