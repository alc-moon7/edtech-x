alter table public.orders
  add column if not exists plan_id text;

alter table public.purchased_courses
  add column if not exists plan_id text;

alter table public.purchased_courses
  add column if not exists expires_at timestamp with time zone;

update public.purchased_courses
set expires_at = purchased_at + interval '3 days'
where expires_at is null;

create index if not exists purchased_courses_expires_idx on public.purchased_courses (expires_at);

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
          and (pc.expires_at is null or pc.expires_at > now())
      )
    )
  );
