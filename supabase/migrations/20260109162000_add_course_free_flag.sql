alter table public.courses
  add column if not exists is_free boolean not null default false;

drop policy if exists "Lessons are readable for purchased courses" on public.lessons;
drop policy if exists "Lessons are readable for purchased or free courses" on public.lessons;

create policy "Lessons are readable for purchased or free courses"
  on public.lessons for select
  using (
    auth.role() = 'authenticated'
    and (
      exists (
        select 1 from public.courses c
        where c.id = lessons.course_id
          and c.is_free = true
      )
      or exists (
        select 1 from public.purchased_courses pc
        where pc.user_id = auth.uid()
          and pc.course_id = lessons.course_id
      )
    )
  );
