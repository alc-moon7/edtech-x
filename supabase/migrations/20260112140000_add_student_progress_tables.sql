create table if not exists public.student_courses (
  user_id uuid not null references auth.users (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  started_at timestamp with time zone default now(),
  primary key (user_id, course_id)
);

create index if not exists student_courses_course_idx on public.student_courses (course_id);

create table if not exists public.student_lessons (
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  status text not null check (status in ('started', 'completed')),
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  updated_at timestamp with time zone default now(),
  primary key (user_id, lesson_id)
);

drop trigger if exists set_student_lessons_updated_at on public.student_lessons;
create trigger set_student_lessons_updated_at
before update on public.student_lessons
for each row execute function public.set_updated_at();

create index if not exists student_lessons_user_idx on public.student_lessons (user_id, updated_at);

create table if not exists public.student_quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  quiz_id uuid not null references public.lessons (id) on delete cascade,
  score integer not null,
  total integer not null,
  created_at timestamp with time zone default now()
);

create index if not exists student_quiz_attempts_user_idx on public.student_quiz_attempts (user_id, created_at);

create table if not exists public.student_activity_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null,
  ref_id uuid,
  meta jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now()
);

create index if not exists student_activity_log_user_idx on public.student_activity_log (user_id, created_at);

alter table public.student_courses enable row level security;
alter table public.student_lessons enable row level security;
alter table public.student_quiz_attempts enable row level security;
alter table public.student_activity_log enable row level security;

create policy "Student courses are viewable by owner"
  on public.student_courses for select
  using (auth.uid() = user_id);

create policy "Student courses are insertable by owner"
  on public.student_courses for insert
  with check (auth.uid() = user_id);

create policy "Student courses are updatable by owner"
  on public.student_courses for update
  using (auth.uid() = user_id);

create policy "Student courses are deletable by owner"
  on public.student_courses for delete
  using (auth.uid() = user_id);

create policy "Student lessons are viewable by owner"
  on public.student_lessons for select
  using (auth.uid() = user_id);

create policy "Student lessons are insertable by owner"
  on public.student_lessons for insert
  with check (auth.uid() = user_id);

create policy "Student lessons are updatable by owner"
  on public.student_lessons for update
  using (auth.uid() = user_id);

create policy "Student lessons are deletable by owner"
  on public.student_lessons for delete
  using (auth.uid() = user_id);

create policy "Student quiz attempts are viewable by owner"
  on public.student_quiz_attempts for select
  using (auth.uid() = user_id);

create policy "Student quiz attempts are insertable by owner"
  on public.student_quiz_attempts for insert
  with check (auth.uid() = user_id);

create policy "Student quiz attempts are updatable by owner"
  on public.student_quiz_attempts for update
  using (auth.uid() = user_id);

create policy "Student quiz attempts are deletable by owner"
  on public.student_quiz_attempts for delete
  using (auth.uid() = user_id);

create policy "Student activity log is viewable by owner"
  on public.student_activity_log for select
  using (auth.uid() = user_id);

create policy "Student activity log is insertable by owner"
  on public.student_activity_log for insert
  with check (auth.uid() = user_id);

create policy "Student activity log is updatable by owner"
  on public.student_activity_log for update
  using (auth.uid() = user_id);

create policy "Student activity log is deletable by owner"
  on public.student_activity_log for delete
  using (auth.uid() = user_id);
