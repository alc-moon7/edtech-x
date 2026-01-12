create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  name_bn text,
  level text not null check (level in ('school', 'college', 'admission')),
  created_at timestamp with time zone default now()
);

alter table public.subjects
  add column if not exists class_id uuid references public.classes (id) on delete set null,
  add column if not exists name_bn text,
  add column if not exists price_full numeric(10, 2),
  add column if not exists free_first_chapter boolean not null default false;

create index if not exists subjects_class_id_idx on public.subjects (class_id);
create unique index if not exists subjects_class_level_name_key
  on public.subjects (class_level, name);

alter table public.chapters
  add column if not exists price numeric(10, 2);

alter table public.chapters
  add column if not exists title_bn text;

create unique index if not exists courses_class_level_title_key
  on public.courses (class_level, title);

create table if not exists public.admission_packages (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('medical', 'engineering', 'varsity')),
  name text not null,
  number_of_sets integer not null,
  price numeric(10, 2) not null,
  details jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now()
);

create index if not exists admission_packages_type_idx on public.admission_packages (type);
create unique index if not exists admission_packages_type_name_key
  on public.admission_packages (type, name);

create table if not exists public.admission_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  package_id uuid not null references public.admission_packages (id) on delete cascade,
  score integer not null,
  created_at timestamp with time zone default now()
);

create index if not exists admission_attempts_user_idx on public.admission_attempts (user_id, created_at);

alter table public.classes enable row level security;
alter table public.admission_packages enable row level security;
alter table public.admission_attempts enable row level security;

drop policy if exists "Classes are readable" on public.classes;
create policy "Classes are readable"
  on public.classes for select
  using (true);

drop policy if exists "Admission packages are readable" on public.admission_packages;
create policy "Admission packages are readable"
  on public.admission_packages for select
  using (true);

drop policy if exists "Admission attempts are viewable by owner" on public.admission_attempts;
create policy "Admission attempts are viewable by owner"
  on public.admission_attempts for select
  using (auth.uid() = user_id);

drop policy if exists "Admission attempts are insertable by owner" on public.admission_attempts;
create policy "Admission attempts are insertable by owner"
  on public.admission_attempts for insert
  with check (auth.uid() = user_id);

drop policy if exists "Admission attempts are updatable by owner" on public.admission_attempts;
create policy "Admission attempts are updatable by owner"
  on public.admission_attempts for update
  using (auth.uid() = user_id);

drop policy if exists "Admission attempts are deletable by owner" on public.admission_attempts;
create policy "Admission attempts are deletable by owner"
  on public.admission_attempts for delete
  using (auth.uid() = user_id);

drop policy if exists "Subjects are readable by class" on public.subjects;
create policy "Subjects are readable by all"
  on public.subjects for select
  using (true);

drop policy if exists "Courses are readable by class" on public.courses;
create policy "Courses are readable by all"
  on public.courses for select
  using (true);

drop policy if exists "Chapters are readable by class" on public.chapters;
create policy "Chapters are readable by all"
  on public.chapters for select
  using (true);

drop policy if exists "Lessons are readable for purchased or free courses" on public.lessons;
create policy "Lessons are readable for purchased or free courses"
  on public.lessons for select
  using (
    auth.role() = 'authenticated'
    and (
      exists (
        select 1
        from public.courses c
        where c.id = lessons.course_id
          and c.is_free = true
      )
      or exists (
        select 1
        from public.chapters ch
        where ch.id = lessons.chapter_id
          and ch.is_free = true
      )
      or exists (
        select 1
        from public.purchased_courses pc
        where pc.user_id = auth.uid()
          and pc.course_id = lessons.course_id
          and (pc.expires_at is null or pc.expires_at > now())
      )
    )
  );
