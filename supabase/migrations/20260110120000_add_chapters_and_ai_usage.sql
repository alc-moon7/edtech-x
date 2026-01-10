create table if not exists public.chapters (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null,
  order_no integer not null default 1,
  is_free boolean not null default false,
  duration_minutes integer,
  created_at timestamp with time zone default now()
);

create unique index if not exists chapters_course_order_idx on public.chapters (course_id, order_no);
create index if not exists chapters_course_idx on public.chapters (course_id);

alter table public.chapters enable row level security;

alter table public.lessons
  add column if not exists chapter_id uuid references public.chapters (id) on delete cascade;

insert into public.chapters (course_id, title, order_no, is_free)
select c.id, 'Chapter 1', 1, true
from public.courses c
where not exists (
  select 1 from public.chapters ch where ch.course_id = c.id
);

update public.lessons l
set chapter_id = ch.id
from public.chapters ch
where l.course_id = ch.course_id
  and ch.order_no = 1
  and l.chapter_id is null;

alter table public.lessons
  alter column chapter_id set not null;

drop policy if exists "Lessons are readable for purchased or free courses" on public.lessons;

create policy "Lessons are readable for purchased or free courses"
  on public.lessons for select
  using (
    auth.role() = 'authenticated'
    and (
      exists (
        select 1
        from public.courses c
        join public.user_profiles up on up.class_level = c.class_level
        where c.id = lessons.course_id
          and up.user_id = auth.uid()
          and c.is_free = true
      )
      or exists (
        select 1
        from public.chapters ch
        join public.courses c on c.id = ch.course_id
        join public.user_profiles up on up.class_level = c.class_level
        where ch.id = lessons.chapter_id
          and up.user_id = auth.uid()
          and ch.is_free = true
      )
      or exists (
        select 1
        from public.purchased_courses pc
        where pc.user_id = auth.uid()
          and pc.course_id = lessons.course_id
      )
    )
  );

create policy "Chapters are readable by class"
  on public.chapters for select
  using (
    exists (
      select 1
      from public.courses c
      join public.user_profiles up on up.class_level = c.class_level
      where c.id = chapters.course_id
        and up.user_id = auth.uid()
    )
  );

create table if not exists public.ai_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  usage_date date not null,
  usage_type text not null check (usage_type in ('home_qa', 'quiz', 'brainbite', 'lesson', 'chat')),
  count integer not null default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  primary key (user_id, usage_date, usage_type)
);

alter table public.ai_usage enable row level security;

drop trigger if exists set_ai_usage_updated_at on public.ai_usage;
create trigger set_ai_usage_updated_at
before update on public.ai_usage
for each row execute function public.set_updated_at();

create policy "AI usage is viewable by owner"
  on public.ai_usage for select
  using (auth.uid() = user_id);

create policy "AI usage is insertable by owner"
  on public.ai_usage for insert
  with check (auth.uid() = user_id);

create policy "AI usage is updatable by owner"
  on public.ai_usage for update
  using (auth.uid() = user_id);
