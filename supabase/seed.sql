-- Seed data: Class 6 courses with chapter-level free access

-- Course: Agriculture Studies (Class 6)
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
),
chapter_one as (
  insert into public.chapters (course_id, title, order_no, is_free, duration_minutes)
  select resolved_course.id, 'Chapter 1: Soil & Crops', 1, true, 40
  from resolved_course
  on conflict (course_id, order_no) do nothing
  returning id
),
resolved_chapter_one as (
  select id from chapter_one
  union all
  select id from public.chapters where course_id = (select id from resolved_course) and order_no = 1
  limit 1
),
chapter_two as (
  insert into public.chapters (course_id, title, order_no, is_free, duration_minutes)
  select resolved_course.id, 'Chapter 2: Crop Care & Tools', 2, false, 40
  from resolved_course
  on conflict (course_id, order_no) do nothing
  returning id
),
resolved_chapter_two as (
  select id from chapter_two
  union all
  select id from public.chapters where course_id = (select id from resolved_course) and order_no = 2
  limit 1
)
insert into public.lessons (course_id, chapter_id, title, order_no, type, duration_minutes, quiz_question_count)
select
  resolved_course.id,
  resolved_chapter_one.id,
  lesson.title,
  lesson.order_no,
  lesson.type,
  lesson.duration_minutes,
  lesson.quiz_question_count
from resolved_course, resolved_chapter_one
cross join (
  values
    ('Soil and Water Basics', 1, 'article', 15, null),
    ('Seeds and Germination', 2, 'video', 12, null),
    ('Chapter 1 Quiz', 3, 'quiz', null, 8)
) as lesson(title, order_no, type, duration_minutes, quiz_question_count)
where not exists (
  select 1
  from public.lessons
  where lessons.course_id = resolved_course.id
    and lessons.chapter_id = resolved_chapter_one.id
    and lessons.order_no = lesson.order_no
);

insert into public.lessons (course_id, chapter_id, title, order_no, type, duration_minutes, quiz_question_count)
select
  resolved_course.id,
  resolved_chapter_two.id,
  lesson.title,
  lesson.order_no,
  lesson.type,
  lesson.duration_minutes,
  lesson.quiz_question_count
from resolved_course, resolved_chapter_two
cross join (
  values
    ('Crop Care & Nutrition', 1, 'article', 14, null),
    ('Farming Tools Overview', 2, 'video', 11, null),
    ('Chapter 2 Quiz', 3, 'quiz', null, 8)
) as lesson(title, order_no, type, duration_minutes, quiz_question_count)
where not exists (
  select 1
  from public.lessons
  where lessons.course_id = resolved_course.id
    and lessons.chapter_id = resolved_chapter_two.id
    and lessons.order_no = lesson.order_no
);

-- Course: Mathematics (Class 6)
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
         false,
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
),
chapter_one as (
  insert into public.chapters (course_id, title, order_no, is_free, duration_minutes)
  select resolved_course.id, 'Chapter 1: Number Systems', 1, true, 40
  from resolved_course
  on conflict (course_id, order_no) do nothing
  returning id
),
resolved_chapter_one as (
  select id from chapter_one
  union all
  select id from public.chapters where course_id = (select id from resolved_course) and order_no = 1
  limit 1
),
chapter_two as (
  insert into public.chapters (course_id, title, order_no, is_free, duration_minutes)
  select resolved_course.id, 'Chapter 2: Fractions & Decimals', 2, false, 40
  from resolved_course
  on conflict (course_id, order_no) do nothing
  returning id
),
resolved_chapter_two as (
  select id from chapter_two
  union all
  select id from public.chapters where course_id = (select id from resolved_course) and order_no = 2
  limit 1
)
insert into public.lessons (course_id, chapter_id, title, order_no, type, duration_minutes, quiz_question_count)
select
  resolved_course.id,
  resolved_chapter_one.id,
  lesson.title,
  lesson.order_no,
  lesson.type,
  lesson.duration_minutes,
  lesson.quiz_question_count
from resolved_course, resolved_chapter_one
cross join (
  values
    ('Whole Numbers Review', 1, 'video', 12, null),
    ('Factors and Multiples', 2, 'article', 14, null),
    ('Chapter 1 Quiz', 3, 'quiz', null, 10)
) as lesson(title, order_no, type, duration_minutes, quiz_question_count)
where not exists (
  select 1
  from public.lessons
  where lessons.course_id = resolved_course.id
    and lessons.chapter_id = resolved_chapter_one.id
    and lessons.order_no = lesson.order_no
);

insert into public.lessons (course_id, chapter_id, title, order_no, type, duration_minutes, quiz_question_count)
select
  resolved_course.id,
  resolved_chapter_two.id,
  lesson.title,
  lesson.order_no,
  lesson.type,
  lesson.duration_minutes,
  lesson.quiz_question_count
from resolved_course, resolved_chapter_two
cross join (
  values
    ('Fractions and Decimals', 1, 'article', 15, null),
    ('Ratio & Proportion', 2, 'video', 12, null),
    ('Chapter 2 Quiz', 3, 'quiz', null, 10)
) as lesson(title, order_no, type, duration_minutes, quiz_question_count)
where not exists (
  select 1
  from public.lessons
  where lessons.course_id = resolved_course.id
    and lessons.chapter_id = resolved_chapter_two.id
    and lessons.order_no = lesson.order_no
);

-- Course: English (Class 6)
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
         false,
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
),
chapter_one as (
  insert into public.chapters (course_id, title, order_no, is_free, duration_minutes)
  select resolved_course.id, 'Chapter 1: Reading Skills', 1, true, 40
  from resolved_course
  on conflict (course_id, order_no) do nothing
  returning id
),
resolved_chapter_one as (
  select id from chapter_one
  union all
  select id from public.chapters where course_id = (select id from resolved_course) and order_no = 1
  limit 1
),
chapter_two as (
  insert into public.chapters (course_id, title, order_no, is_free, duration_minutes)
  select resolved_course.id, 'Chapter 2: Writing & Grammar', 2, false, 40
  from resolved_course
  on conflict (course_id, order_no) do nothing
  returning id
),
resolved_chapter_two as (
  select id from chapter_two
  union all
  select id from public.chapters where course_id = (select id from resolved_course) and order_no = 2
  limit 1
)
insert into public.lessons (course_id, chapter_id, title, order_no, type, duration_minutes, quiz_question_count)
select
  resolved_course.id,
  resolved_chapter_one.id,
  lesson.title,
  lesson.order_no,
  lesson.type,
  lesson.duration_minutes,
  lesson.quiz_question_count
from resolved_course, resolved_chapter_one
cross join (
  values
    ('Reading Comprehension', 1, 'article', 14, null),
    ('Vocabulary Builder', 2, 'video', 10, null),
    ('Chapter 1 Quiz', 3, 'quiz', null, 10)
) as lesson(title, order_no, type, duration_minutes, quiz_question_count)
where not exists (
  select 1
  from public.lessons
  where lessons.course_id = resolved_course.id
    and lessons.chapter_id = resolved_chapter_one.id
    and lessons.order_no = lesson.order_no
);

insert into public.lessons (course_id, chapter_id, title, order_no, type, duration_minutes, quiz_question_count)
select
  resolved_course.id,
  resolved_chapter_two.id,
  lesson.title,
  lesson.order_no,
  lesson.type,
  lesson.duration_minutes,
  lesson.quiz_question_count
from resolved_course, resolved_chapter_two
cross join (
  values
    ('Sentence Structure', 1, 'video', 12, null),
    ('Writing Practice', 2, 'article', 14, null),
    ('Chapter 2 Quiz', 3, 'quiz', null, 10)
) as lesson(title, order_no, type, duration_minutes, quiz_question_count)
where not exists (
  select 1
  from public.lessons
  where lessons.course_id = resolved_course.id
    and lessons.chapter_id = resolved_chapter_two.id
    and lessons.order_no = lesson.order_no
);

-- Course: Science (Class 6)
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
         false,
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
),
chapter_one as (
  insert into public.chapters (course_id, title, order_no, is_free, duration_minutes)
  select resolved_course.id, 'Chapter 1: Living World', 1, true, 40
  from resolved_course
  on conflict (course_id, order_no) do nothing
  returning id
),
resolved_chapter_one as (
  select id from chapter_one
  union all
  select id from public.chapters where course_id = (select id from resolved_course) and order_no = 1
  limit 1
),
chapter_two as (
  insert into public.chapters (course_id, title, order_no, is_free, duration_minutes)
  select resolved_course.id, 'Chapter 2: Matter & Energy', 2, false, 40
  from resolved_course
  on conflict (course_id, order_no) do nothing
  returning id
),
resolved_chapter_two as (
  select id from chapter_two
  union all
  select id from public.chapters where course_id = (select id from resolved_course) and order_no = 2
  limit 1
)
insert into public.lessons (course_id, chapter_id, title, order_no, type, duration_minutes, quiz_question_count)
select
  resolved_course.id,
  resolved_chapter_one.id,
  lesson.title,
  lesson.order_no,
  lesson.type,
  lesson.duration_minutes,
  lesson.quiz_question_count
from resolved_course, resolved_chapter_one
cross join (
  values
    ('Living and Non-living', 1, 'video', 12, null),
    ('Plants and Growth', 2, 'article', 14, null),
    ('Chapter 1 Quiz', 3, 'quiz', null, 10)
) as lesson(title, order_no, type, duration_minutes, quiz_question_count)
where not exists (
  select 1
  from public.lessons
  where lessons.course_id = resolved_course.id
    and lessons.chapter_id = resolved_chapter_one.id
    and lessons.order_no = lesson.order_no
);

insert into public.lessons (course_id, chapter_id, title, order_no, type, duration_minutes, quiz_question_count)
select
  resolved_course.id,
  resolved_chapter_two.id,
  lesson.title,
  lesson.order_no,
  lesson.type,
  lesson.duration_minutes,
  lesson.quiz_question_count
from resolved_course, resolved_chapter_two
cross join (
  values
    ('Matter and States', 1, 'video', 11, null),
    ('Heat and Temperature', 2, 'article', 13, null),
    ('Chapter 2 Quiz', 3, 'quiz', null, 10)
) as lesson(title, order_no, type, duration_minutes, quiz_question_count)
where not exists (
  select 1
  from public.lessons
  where lessons.course_id = resolved_course.id
    and lessons.chapter_id = resolved_chapter_two.id
    and lessons.order_no = lesson.order_no
);

-- Course: Bangla (Class 6)
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
         false,
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
),
chapter_one as (
  insert into public.chapters (course_id, title, order_no, is_free, duration_minutes)
  select resolved_course.id, 'Chapter 1: Reading & Pronunciation', 1, true, 40
  from resolved_course
  on conflict (course_id, order_no) do nothing
  returning id
),
resolved_chapter_one as (
  select id from chapter_one
  union all
  select id from public.chapters where course_id = (select id from resolved_course) and order_no = 1
  limit 1
),
chapter_two as (
  insert into public.chapters (course_id, title, order_no, is_free, duration_minutes)
  select resolved_course.id, 'Chapter 2: Writing Skills', 2, false, 40
  from resolved_course
  on conflict (course_id, order_no) do nothing
  returning id
),
resolved_chapter_two as (
  select id from chapter_two
  union all
  select id from public.chapters where course_id = (select id from resolved_course) and order_no = 2
  limit 1
)
insert into public.lessons (course_id, chapter_id, title, order_no, type, duration_minutes, quiz_question_count)
select
  resolved_course.id,
  resolved_chapter_one.id,
  lesson.title,
  lesson.order_no,
  lesson.type,
  lesson.duration_minutes,
  lesson.quiz_question_count
from resolved_course, resolved_chapter_one
cross join (
  values
    ('Reading & Pronunciation', 1, 'article', 12, null),
    ('Grammar Basics', 2, 'video', 13, null),
    ('Chapter 1 Quiz', 3, 'quiz', null, 10)
) as lesson(title, order_no, type, duration_minutes, quiz_question_count)
where not exists (
  select 1
  from public.lessons
  where lessons.course_id = resolved_course.id
    and lessons.chapter_id = resolved_chapter_one.id
    and lessons.order_no = lesson.order_no
);

insert into public.lessons (course_id, chapter_id, title, order_no, type, duration_minutes, quiz_question_count)
select
  resolved_course.id,
  resolved_chapter_two.id,
  lesson.title,
  lesson.order_no,
  lesson.type,
  lesson.duration_minutes,
  lesson.quiz_question_count
from resolved_course, resolved_chapter_two
cross join (
  values
    ('Creative Writing', 1, 'article', 14, null),
    ('Essay Practice', 2, 'video', 12, null),
    ('Chapter 2 Quiz', 3, 'quiz', null, 10)
) as lesson(title, order_no, type, duration_minutes, quiz_question_count)
where not exists (
  select 1
  from public.lessons
  where lessons.course_id = resolved_course.id
    and lessons.chapter_id = resolved_chapter_two.id
    and lessons.order_no = lesson.order_no
);

-- Course: Social Studies (Class 6)
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
         false,
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
),
chapter_one as (
  insert into public.chapters (course_id, title, order_no, is_free, duration_minutes)
  select resolved_course.id, 'Chapter 1: Society & Community', 1, true, 40
  from resolved_course
  on conflict (course_id, order_no) do nothing
  returning id
),
resolved_chapter_one as (
  select id from chapter_one
  union all
  select id from public.chapters where course_id = (select id from resolved_course) and order_no = 1
  limit 1
),
chapter_two as (
  insert into public.chapters (course_id, title, order_no, is_free, duration_minutes)
  select resolved_course.id, 'Chapter 2: Geography', 2, false, 40
  from resolved_course
  on conflict (course_id, order_no) do nothing
  returning id
),
resolved_chapter_two as (
  select id from chapter_two
  union all
  select id from public.chapters where course_id = (select id from resolved_course) and order_no = 2
  limit 1
)
insert into public.lessons (course_id, chapter_id, title, order_no, type, duration_minutes, quiz_question_count)
select
  resolved_course.id,
  resolved_chapter_one.id,
  lesson.title,
  lesson.order_no,
  lesson.type,
  lesson.duration_minutes,
  lesson.quiz_question_count
from resolved_course, resolved_chapter_one
cross join (
  values
    ('Society & Community', 1, 'article', 12, null),
    ('Civic Duties', 2, 'article', 14, null),
    ('Chapter 1 Quiz', 3, 'quiz', null, 10)
) as lesson(title, order_no, type, duration_minutes, quiz_question_count)
where not exists (
  select 1
  from public.lessons
  where lessons.course_id = resolved_course.id
    and lessons.chapter_id = resolved_chapter_one.id
    and lessons.order_no = lesson.order_no
);

insert into public.lessons (course_id, chapter_id, title, order_no, type, duration_minutes, quiz_question_count)
select
  resolved_course.id,
  resolved_chapter_two.id,
  lesson.title,
  lesson.order_no,
  lesson.type,
  lesson.duration_minutes,
  lesson.quiz_question_count
from resolved_course, resolved_chapter_two
cross join (
  values
    ('Bangladesh Geography', 1, 'video', 13, null),
    ('Map Skills', 2, 'article', 12, null),
    ('Chapter 2 Quiz', 3, 'quiz', null, 10)
) as lesson(title, order_no, type, duration_minutes, quiz_question_count)
where not exists (
  select 1
  from public.lessons
  where lessons.course_id = resolved_course.id
    and lessons.chapter_id = resolved_chapter_two.id
    and lessons.order_no = lesson.order_no
);

-- Course: ICT (Class 6)
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
         false,
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
),
chapter_one as (
  insert into public.chapters (course_id, title, order_no, is_free, duration_minutes)
  select resolved_course.id, 'Chapter 1: Computer Basics', 1, true, 40
  from resolved_course
  on conflict (course_id, order_no) do nothing
  returning id
),
resolved_chapter_one as (
  select id from chapter_one
  union all
  select id from public.chapters where course_id = (select id from resolved_course) and order_no = 1
  limit 1
),
chapter_two as (
  insert into public.chapters (course_id, title, order_no, is_free, duration_minutes)
  select resolved_course.id, 'Chapter 2: Digital Tools', 2, false, 40
  from resolved_course
  on conflict (course_id, order_no) do nothing
  returning id
),
resolved_chapter_two as (
  select id from chapter_two
  union all
  select id from public.chapters where course_id = (select id from resolved_course) and order_no = 2
  limit 1
)
insert into public.lessons (course_id, chapter_id, title, order_no, type, duration_minutes, quiz_question_count)
select
  resolved_course.id,
  resolved_chapter_one.id,
  lesson.title,
  lesson.order_no,
  lesson.type,
  lesson.duration_minutes,
  lesson.quiz_question_count
from resolved_course, resolved_chapter_one
cross join (
  values
    ('Computer Basics', 1, 'video', 12, null),
    ('Internet Safety', 2, 'article', 12, null),
    ('Chapter 1 Quiz', 3, 'quiz', null, 10)
) as lesson(title, order_no, type, duration_minutes, quiz_question_count)
where not exists (
  select 1
  from public.lessons
  where lessons.course_id = resolved_course.id
    and lessons.chapter_id = resolved_chapter_one.id
    and lessons.order_no = lesson.order_no
);

insert into public.lessons (course_id, chapter_id, title, order_no, type, duration_minutes, quiz_question_count)
select
  resolved_course.id,
  resolved_chapter_two.id,
  lesson.title,
  lesson.order_no,
  lesson.type,
  lesson.duration_minutes,
  lesson.quiz_question_count
from resolved_course, resolved_chapter_two
cross join (
  values
    ('Digital Documents', 1, 'video', 11, null),
    ('Email Basics', 2, 'article', 12, null),
    ('Chapter 2 Quiz', 3, 'quiz', null, 10)
) as lesson(title, order_no, type, duration_minutes, quiz_question_count)
where not exists (
  select 1
  from public.lessons
  where lessons.course_id = resolved_course.id
    and lessons.chapter_id = resolved_chapter_two.id
    and lessons.order_no = lesson.order_no
);
