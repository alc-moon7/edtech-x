-- Seed data: Class 6 demo courses + lessons (free + paid)

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
  insert into public.courses (id, subject_id, title, class_level, is_free, description)
  select course_seed.id,
         resolved_subject.id,
         'Agriculture Studies',
         'Class 6',
         false,
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

-- Free course: Mathematics (Class 6)
with subject_seed as (
  select id from public.subjects where name = 'Mathematics' and class_level = 'Class 6'
  union all
  select gen_random_uuid()
  where not exists (
    select 1 from public.subjects where name = 'Mathematics' and class_level = 'Class 6'
  )
),
subject_insert as (
  insert into public.subjects (id, name, class_level)
  select id, 'Mathematics', 'Class 6' from subject_seed
  on conflict (id) do nothing
  returning id
),
resolved_subject as (
  select id from subject_insert
  union all
  select id from public.subjects where name = 'Mathematics' and class_level = 'Class 6'
  limit 1
),
course_seed as (
  select id from public.courses where title = 'Mathematics' and class_level = 'Class 6'
  union all
  select gen_random_uuid()
  where not exists (
    select 1 from public.courses where title = 'Mathematics' and class_level = 'Class 6'
  )
),
course_insert as (
  insert into public.courses (id, subject_id, title, class_level, is_free, description)
  select course_seed.id,
         resolved_subject.id,
         'Mathematics',
         'Class 6',
         true,
         'Core math lessons covering numbers, fractions, and geometry.'
  from course_seed, resolved_subject
  on conflict (id) do nothing
  returning id
),
resolved_course as (
  select id from course_insert
  union all
  select id from public.courses where title = 'Mathematics' and class_level = 'Class 6'
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
    ('Whole Numbers Review', 1, 'video', 12, null),
    ('Fractions and Decimals', 2, 'article', 15, null),
    ('Basic Geometry', 3, 'video', 11, null),
    ('Practice Quiz', 4, 'quiz', null, 10)
) as lesson(title, order_no, type, duration_minutes, quiz_question_count)
where not exists (
  select 1
  from public.lessons
  where lessons.course_id = resolved_course.id
    and lessons.order_no = lesson.order_no
);

-- Free course: English (Class 6)
with subject_seed as (
  select id from public.subjects where name = 'English' and class_level = 'Class 6'
  union all
  select gen_random_uuid()
  where not exists (
    select 1 from public.subjects where name = 'English' and class_level = 'Class 6'
  )
),
subject_insert as (
  insert into public.subjects (id, name, class_level)
  select id, 'English', 'Class 6' from subject_seed
  on conflict (id) do nothing
  returning id
),
resolved_subject as (
  select id from subject_insert
  union all
  select id from public.subjects where name = 'English' and class_level = 'Class 6'
  limit 1
),
course_seed as (
  select id from public.courses where title = 'English' and class_level = 'Class 6'
  union all
  select gen_random_uuid()
  where not exists (
    select 1 from public.courses where title = 'English' and class_level = 'Class 6'
  )
),
course_insert as (
  insert into public.courses (id, subject_id, title, class_level, is_free, description)
  select course_seed.id,
         resolved_subject.id,
         'English',
         'Class 6',
         true,
         'Reading, writing, and grammar practice for Class 6.'
  from course_seed, resolved_subject
  on conflict (id) do nothing
  returning id
),
resolved_course as (
  select id from course_insert
  union all
  select id from public.courses where title = 'English' and class_level = 'Class 6'
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
    ('Reading Comprehension', 1, 'article', 14, null),
    ('Sentence Structure', 2, 'video', 12, null),
    ('Vocabulary Builder', 3, 'video', 10, null),
    ('Grammar Quiz', 4, 'quiz', null, 10)
) as lesson(title, order_no, type, duration_minutes, quiz_question_count)
where not exists (
  select 1
  from public.lessons
  where lessons.course_id = resolved_course.id
    and lessons.order_no = lesson.order_no
);

-- Free course: Science (Class 6)
with subject_seed as (
  select id from public.subjects where name = 'Science' and class_level = 'Class 6'
  union all
  select gen_random_uuid()
  where not exists (
    select 1 from public.subjects where name = 'Science' and class_level = 'Class 6'
  )
),
subject_insert as (
  insert into public.subjects (id, name, class_level)
  select id, 'Science', 'Class 6' from subject_seed
  on conflict (id) do nothing
  returning id
),
resolved_subject as (
  select id from subject_insert
  union all
  select id from public.subjects where name = 'Science' and class_level = 'Class 6'
  limit 1
),
course_seed as (
  select id from public.courses where title = 'Science' and class_level = 'Class 6'
  union all
  select gen_random_uuid()
  where not exists (
    select 1 from public.courses where title = 'Science' and class_level = 'Class 6'
  )
),
course_insert as (
  insert into public.courses (id, subject_id, title, class_level, is_free, description)
  select course_seed.id,
         resolved_subject.id,
         'Science',
         'Class 6',
         true,
         'Fundamental science concepts with quick checks.'
  from course_seed, resolved_subject
  on conflict (id) do nothing
  returning id
),
resolved_course as (
  select id from course_insert
  union all
  select id from public.courses where title = 'Science' and class_level = 'Class 6'
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
    ('Living and Non-living', 1, 'video', 12, null),
    ('Plants and Growth', 2, 'article', 14, null),
    ('Matter and States', 3, 'video', 11, null),
    ('Science Quiz', 4, 'quiz', null, 10)
) as lesson(title, order_no, type, duration_minutes, quiz_question_count)
where not exists (
  select 1
  from public.lessons
  where lessons.course_id = resolved_course.id
    and lessons.order_no = lesson.order_no
);

-- Free course: Bangla (Class 6)
with subject_seed as (
  select id from public.subjects where name = 'Bangla' and class_level = 'Class 6'
  union all
  select gen_random_uuid()
  where not exists (
    select 1 from public.subjects where name = 'Bangla' and class_level = 'Class 6'
  )
),
subject_insert as (
  insert into public.subjects (id, name, class_level)
  select id, 'Bangla', 'Class 6' from subject_seed
  on conflict (id) do nothing
  returning id
),
resolved_subject as (
  select id from subject_insert
  union all
  select id from public.subjects where name = 'Bangla' and class_level = 'Class 6'
  limit 1
),
course_seed as (
  select id from public.courses where title = 'Bangla' and class_level = 'Class 6'
  union all
  select gen_random_uuid()
  where not exists (
    select 1 from public.courses where title = 'Bangla' and class_level = 'Class 6'
  )
),
course_insert as (
  insert into public.courses (id, subject_id, title, class_level, is_free, description)
  select course_seed.id,
         resolved_subject.id,
         'Bangla',
         'Class 6',
         true,
         'Bangla reading and writing practice for Class 6.'
  from course_seed, resolved_subject
  on conflict (id) do nothing
  returning id
),
resolved_course as (
  select id from course_insert
  union all
  select id from public.courses where title = 'Bangla' and class_level = 'Class 6'
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
    ('Reading & Pronunciation', 1, 'article', 12, null),
    ('Grammar Basics', 2, 'video', 13, null),
    ('Creative Writing', 3, 'article', 14, null),
    ('Bangla Quiz', 4, 'quiz', null, 10)
) as lesson(title, order_no, type, duration_minutes, quiz_question_count)
where not exists (
  select 1
  from public.lessons
  where lessons.course_id = resolved_course.id
    and lessons.order_no = lesson.order_no
);

-- Free course: Social Studies (Class 6)
with subject_seed as (
  select id from public.subjects where name = 'Social Studies' and class_level = 'Class 6'
  union all
  select gen_random_uuid()
  where not exists (
    select 1 from public.subjects where name = 'Social Studies' and class_level = 'Class 6'
  )
),
subject_insert as (
  insert into public.subjects (id, name, class_level)
  select id, 'Social Studies', 'Class 6' from subject_seed
  on conflict (id) do nothing
  returning id
),
resolved_subject as (
  select id from subject_insert
  union all
  select id from public.subjects where name = 'Social Studies' and class_level = 'Class 6'
  limit 1
),
course_seed as (
  select id from public.courses where title = 'Social Studies' and class_level = 'Class 6'
  union all
  select gen_random_uuid()
  where not exists (
    select 1 from public.courses where title = 'Social Studies' and class_level = 'Class 6'
  )
),
course_insert as (
  insert into public.courses (id, subject_id, title, class_level, is_free, description)
  select course_seed.id,
         resolved_subject.id,
         'Social Studies',
         'Class 6',
         true,
         'Foundations of society, civics, and geography for Class 6.'
  from course_seed, resolved_subject
  on conflict (id) do nothing
  returning id
),
resolved_course as (
  select id from course_insert
  union all
  select id from public.courses where title = 'Social Studies' and class_level = 'Class 6'
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
    ('Society & Community', 1, 'article', 12, null),
    ('Bangladesh Geography', 2, 'video', 13, null),
    ('Civic Duties', 3, 'article', 14, null),
    ('Social Studies Quiz', 4, 'quiz', null, 10)
) as lesson(title, order_no, type, duration_minutes, quiz_question_count)
where not exists (
  select 1
  from public.lessons
  where lessons.course_id = resolved_course.id
    and lessons.order_no = lesson.order_no
);

-- Free course: ICT (Class 6)
with subject_seed as (
  select id from public.subjects where name = 'ICT' and class_level = 'Class 6'
  union all
  select gen_random_uuid()
  where not exists (
    select 1 from public.subjects where name = 'ICT' and class_level = 'Class 6'
  )
),
subject_insert as (
  insert into public.subjects (id, name, class_level)
  select id, 'ICT', 'Class 6' from subject_seed
  on conflict (id) do nothing
  returning id
),
resolved_subject as (
  select id from subject_insert
  union all
  select id from public.subjects where name = 'ICT' and class_level = 'Class 6'
  limit 1
),
course_seed as (
  select id from public.courses where title = 'ICT' and class_level = 'Class 6'
  union all
  select gen_random_uuid()
  where not exists (
    select 1 from public.courses where title = 'ICT' and class_level = 'Class 6'
  )
),
course_insert as (
  insert into public.courses (id, subject_id, title, class_level, is_free, description)
  select course_seed.id,
         resolved_subject.id,
         'ICT',
         'Class 6',
         true,
         'Digital basics, internet safety, and simple tools.'
  from course_seed, resolved_subject
  on conflict (id) do nothing
  returning id
),
resolved_course as (
  select id from course_insert
  union all
  select id from public.courses where title = 'ICT' and class_level = 'Class 6'
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
    ('Computer Basics', 1, 'video', 12, null),
    ('Internet Safety', 2, 'article', 12, null),
    ('Digital Documents', 3, 'video', 11, null),
    ('ICT Quiz', 4, 'quiz', null, 10)
) as lesson(title, order_no, type, duration_minutes, quiz_question_count)
where not exists (
  select 1
  from public.lessons
  where lessons.course_id = resolved_course.id
    and lessons.order_no = lesson.order_no
);
