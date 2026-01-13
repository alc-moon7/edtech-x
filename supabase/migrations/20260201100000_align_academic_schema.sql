alter table public.classes
  drop constraint if exists classes_level_check;

alter table public.classes
  add constraint classes_level_check check (level in ('school', 'ssc', 'hsc', 'admission'));

update public.classes
set level = case
  when name in ('Class 6', 'Class 7', 'Class 8') then 'school'
  when name = 'Class 9-10' then 'ssc'
  when name = 'Class 11-12' then 'hsc'
  when name = 'Admission' then 'admission'
  else level
end
where level in ('college', 'school', 'ssc', 'hsc', 'admission');

alter table public.subjects
  add column if not exists first_chapter_free boolean not null default false;

update public.subjects
set first_chapter_free = coalesce(first_chapter_free, free_first_chapter);

update public.subjects s
set class_id = c.id
from public.classes c
where s.class_id is null
  and s.class_level = c.name;

alter table public.chapters
  add column if not exists subject_id uuid references public.subjects (id) on delete cascade,
  add column if not exists name text;

create index if not exists chapters_subject_id_idx on public.chapters (subject_id);

update public.chapters ch
set subject_id = s.id,
    name = coalesce(ch.name, ch.title)
from public.courses c
join public.subjects s on s.id = c.subject_id
where ch.course_id = c.id
  and (ch.subject_id is null or ch.name is null);

create table if not exists public.purchased_chapters (
  user_id uuid not null references auth.users (id) on delete cascade,
  chapter_id uuid not null references public.chapters (id) on delete cascade,
  purchased_at timestamp with time zone default now(),
  primary key (user_id, chapter_id)
);

create index if not exists purchased_chapters_chapter_idx on public.purchased_chapters (chapter_id);

alter table public.purchased_chapters enable row level security;

drop policy if exists "Purchased chapters are viewable by owner" on public.purchased_chapters;
create policy "Purchased chapters are viewable by owner"
  on public.purchased_chapters for select
  using (auth.uid() = user_id);

drop policy if exists "Purchased chapters are insertable by owner" on public.purchased_chapters;
create policy "Purchased chapters are insertable by owner"
  on public.purchased_chapters for insert
  with check (auth.uid() = user_id);

drop policy if exists "Purchased chapters are updatable by owner" on public.purchased_chapters;
create policy "Purchased chapters are updatable by owner"
  on public.purchased_chapters for update
  using (auth.uid() = user_id);

drop policy if exists "Purchased chapters are deletable by owner" on public.purchased_chapters;
create policy "Purchased chapters are deletable by owner"
  on public.purchased_chapters for delete
  using (auth.uid() = user_id);

alter table public.student_lessons
  add column if not exists chapter_id uuid references public.chapters (id) on delete set null,
  add column if not exists completed boolean not null default false;

create index if not exists student_lessons_chapter_idx on public.student_lessons (user_id, chapter_id);

update public.student_lessons sl
set chapter_id = l.chapter_id,
    completed = (sl.status = 'completed')
from public.lessons l
where sl.lesson_id = l.id
  and (sl.chapter_id is null or sl.completed is null);

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
      or exists (
        select 1
        from public.purchased_chapters pch
        where pch.user_id = auth.uid()
          and pch.chapter_id = lessons.chapter_id
      )
    )
  );
