alter table public.student_lessons
  add column if not exists content text;

create index if not exists student_lessons_content_idx
  on public.student_lessons (user_id, chapter_id);
