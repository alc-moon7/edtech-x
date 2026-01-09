-- Seed data: Class 6 (Agriculture Studies) demo course + lessons

with subject_seed as (
  select id from public.subjects where name = 'Agriculture Studies' and class_level = 'Class 6'
  union all
  select gen_random_uuid()
  where not exists (
    select 1 from public.subjects where name = 'Agriculture Studies' and class_level = 'Class 6'
  )
),
subject_insert as (
  insert into public.subjects (id, name, class_level)
  select id, 'Agriculture Studies', 'Class 6' from subject_seed
  on conflict (id) do nothing
  returning id
),
resolved_subject as (
  select id from subject_insert
  union all
  select id from public.subjects where name = 'Agriculture Studies' and class_level = 'Class 6'
  limit 1
),
course_seed as (
  select id from public.courses where title = 'Agriculture Studies' and class_level = 'Class 6'
  union all
  select gen_random_uuid()
  where not exists (
    select 1 from public.courses where title = 'Agriculture Studies' and class_level = 'Class 6'
  )
),
course_insert as (
  insert into public.courses (id, subject_id, title, class_level, description)
  select course_seed.id,
         resolved_subject.id,
         'Agriculture Studies',
         'Class 6',
         'Introductory lessons on crops, soil, and farming practices.'
  from course_seed, resolved_subject
  on conflict (id) do nothing
  returning id
),
resolved_course as (
  select id from course_insert
  union all
  select id from public.courses where title = 'Agriculture Studies' and class_level = 'Class 6'
  limit 1
)
insert into public.lessons (course_id, title, order_no, type, duration_minutes, quiz_question_count)
select
  resolved_course.id,
  lesson.title,
  lesson.order_no,
  lesson.type,
  lesson.duration_minutes,
  lesson.quiz_question_count
from resolved_course
cross join (
  values
    ('Introduction to Agriculture', 1, 'video', 12, null),
    ('Soil and Water Basics', 2, 'article', 15, null),
    ('Seeds and Germination', 3, 'video', 10, null),
    ('Crop Care & Nutrition', 4, 'article', 14, null),
    ('Farming Tools Overview', 5, 'video', 11, null),
    ('Chapter Quiz 1', 6, 'quiz', null, 8),
    ('Pest Management Basics', 7, 'article', 12, null),
    ('Chapter Quiz 2', 8, 'quiz', null, 8)
) as lesson(title, order_no, type, duration_minutes, quiz_question_count)
where not exists (
  select 1
  from public.lessons
  where lessons.course_id = resolved_course.id
    and lessons.order_no = lesson.order_no
);
