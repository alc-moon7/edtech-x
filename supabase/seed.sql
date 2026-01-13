-- Seed academic catalog (classes, subjects, chapters, admission packages)

insert into public.classes (name, level)
values
  ('Class 6', 'school'),
  ('Class 7', 'school'),
  ('Class 8', 'school'),
  ('Class 9-10', 'ssc'),
  ('Class 11-12', 'hsc'),
  ('Admission', 'admission')

on conflict (name) do update set level = excluded.level;

-- Subject: Science (Class 6)
insert into public.subjects (name, class_level, class_id, price_full, free_first_chapter)
select 'Science', 'Class 6', c.id, 599.00, false
from public.classes c
where c.name = 'Class 6'
on conflict (class_level, name) do update set class_id = excluded.class_id, price_full = excluded.price_full, free_first_chapter = excluded.free_first_chapter;

insert into public.courses (subject_id, title, class_level, is_free, description)
select s.id, 'Science', 'Class 6', false, 'Science curriculum for Class 6.'
from public.subjects s
where s.name = 'Science' and s.class_level = 'Class 6'
on conflict (class_level, title) do update set subject_id = excluded.subject_id, description = excluded.description, is_free = excluded.is_free;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Science & Scientific Method', 1, false, 40, 100.00
from public.courses c
where c.title = 'Science' and c.class_level = 'Class 6'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Living World & Environment', 2, false, 40, 100.00
from public.courses c
where c.title = 'Science' and c.class_level = 'Class 6'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Stimulus & Response', 3, false, 40, 100.00
from public.courses c
where c.title = 'Science' and c.class_level = 'Class 6'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Food and Nutrition', 4, false, 40, 100.00
from public.courses c
where c.title = 'Science' and c.class_level = 'Class 6'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Matter and Its Properties', 5, false, 40, 100.00
from public.courses c
where c.title = 'Science' and c.class_level = 'Class 6'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Work, Power & Force', 6, false, 40, 100.00
from public.courses c
where c.title = 'Science' and c.class_level = 'Class 6'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Earth and Space', 7, false, 40, 100.00
from public.courses c
where c.title = 'Science' and c.class_level = 'Class 6'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

-- Subject: Mathematics (Class 6)
insert into public.subjects (name, class_level, class_id, price_full, free_first_chapter)
select 'Mathematics', 'Class 6', c.id, 699.00, false
from public.classes c
where c.name = 'Class 6'
on conflict (class_level, name) do update set class_id = excluded.class_id, price_full = excluded.price_full, free_first_chapter = excluded.free_first_chapter;

insert into public.courses (subject_id, title, class_level, is_free, description)
select s.id, 'Mathematics', 'Class 6', false, 'Mathematics curriculum for Class 6.'
from public.subjects s
where s.name = 'Mathematics' and s.class_level = 'Class 6'
on conflict (class_level, title) do update set subject_id = excluded.subject_id, description = excluded.description, is_free = excluded.is_free;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Numbers', 1, false, 40, 100.00
from public.courses c
where c.title = 'Mathematics' and c.class_level = 'Class 6'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Integers', 2, false, 40, 100.00
from public.courses c
where c.title = 'Mathematics' and c.class_level = 'Class 6'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Fractions', 3, false, 40, 100.00
from public.courses c
where c.title = 'Mathematics' and c.class_level = 'Class 6'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Decimals', 4, false, 40, 100.00
from public.courses c
where c.title = 'Mathematics' and c.class_level = 'Class 6'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Algebra', 5, false, 40, 100.00
from public.courses c
where c.title = 'Mathematics' and c.class_level = 'Class 6'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Geometry', 6, false, 40, 100.00
from public.courses c
where c.title = 'Mathematics' and c.class_level = 'Class 6'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Measurement', 7, false, 40, 100.00
from public.courses c
where c.title = 'Mathematics' and c.class_level = 'Class 6'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Data Handling', 8, false, 40, 100.00
from public.courses c
where c.title = 'Mathematics' and c.class_level = 'Class 6'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

-- Subject: ICT (Class 6)
insert into public.subjects (name, class_level, class_id, price_full, free_first_chapter)
select 'ICT', 'Class 6', c.id, 349.00, false
from public.classes c
where c.name = 'Class 6'
on conflict (class_level, name) do update set class_id = excluded.class_id, price_full = excluded.price_full, free_first_chapter = excluded.free_first_chapter;

insert into public.courses (subject_id, title, class_level, is_free, description)
select s.id, 'ICT', 'Class 6', false, 'ICT curriculum for Class 6.'
from public.subjects s
where s.name = 'ICT' and s.class_level = 'Class 6'
on conflict (class_level, title) do update set subject_id = excluded.subject_id, description = excluded.description, is_free = excluded.is_free;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Information & Communication', 1, false, 40, 100.00
from public.courses c
where c.title = 'ICT' and c.class_level = 'Class 6'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Introduction to Computers', 2, false, 40, 100.00
from public.courses c
where c.title = 'ICT' and c.class_level = 'Class 6'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Internet & Online Safety', 3, false, 40, 100.00
from public.courses c
where c.title = 'ICT' and c.class_level = 'Class 6'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Using Digital Devices', 4, false, 40, 100.00
from public.courses c
where c.title = 'ICT' and c.class_level = 'Class 6'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

-- Subject: Bangladesh & Global Studies (Class 6)
insert into public.subjects (name, class_level, class_id, price_full, free_first_chapter)
select 'Bangladesh & Global Studies', 'Class 6', c.id, 299.00, true
from public.classes c
where c.name = 'Class 6'
on conflict (class_level, name) do update set class_id = excluded.class_id, price_full = excluded.price_full, free_first_chapter = excluded.free_first_chapter;

insert into public.courses (subject_id, title, class_level, is_free, description)
select s.id, 'Bangladesh & Global Studies', 'Class 6', false, 'Bangladesh & Global Studies curriculum for Class 6.'
from public.subjects s
where s.name = 'Bangladesh & Global Studies' and s.class_level = 'Class 6'
on conflict (class_level, title) do update set subject_id = excluded.subject_id, description = excluded.description, is_free = excluded.is_free;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Bangladesh', 1, true, 40, 100.00
from public.courses c
where c.title = 'Bangladesh & Global Studies' and c.class_level = 'Class 6'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Environment', 2, false, 40, 100.00
from public.courses c
where c.title = 'Bangladesh & Global Studies' and c.class_level = 'Class 6'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Society', 3, false, 40, 100.00
from public.courses c
where c.title = 'Bangladesh & Global Studies' and c.class_level = 'Class 6'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Economy', 4, false, 40, 100.00
from public.courses c
where c.title = 'Bangladesh & Global Studies' and c.class_level = 'Class 6'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'World Studies', 5, false, 40, 100.00
from public.courses c
where c.title = 'Bangladesh & Global Studies' and c.class_level = 'Class 6'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

-- Subject: English (Class 6)
insert into public.subjects (name, class_level, class_id, price_full, free_first_chapter)
select 'English', 'Class 6', c.id, 499.00, false
from public.classes c
where c.name = 'Class 6'
on conflict (class_level, name) do update set class_id = excluded.class_id, price_full = excluded.price_full, free_first_chapter = excluded.free_first_chapter;

insert into public.courses (subject_id, title, class_level, is_free, description)
select s.id, 'English', 'Class 6', false, 'English curriculum for Class 6.'
from public.subjects s
where s.name = 'English' and s.class_level = 'Class 6'
on conflict (class_level, title) do update set subject_id = excluded.subject_id, description = excluded.description, is_free = excluded.is_free;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'People and Their Habits', 1, false, 40, 100.00
from public.courses c
where c.title = 'English' and c.class_level = 'Class 6'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Pastimes', 2, false, 40, 100.00
from public.courses c
where c.title = 'English' and c.class_level = 'Class 6'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Health & Hygiene', 3, false, 40, 100.00
from public.courses c
where c.title = 'English' and c.class_level = 'Class 6'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Our Heritage', 4, false, 40, 100.00
from public.courses c
where c.title = 'English' and c.class_level = 'Class 6'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Environment', 5, false, 40, 100.00
from public.courses c
where c.title = 'English' and c.class_level = 'Class 6'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Technology', 6, false, 40, 100.00
from public.courses c
where c.title = 'English' and c.class_level = 'Class 6'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

-- Subject: Bangla (Class 6)
insert into public.subjects (name, class_level, class_id, price_full, free_first_chapter)
select 'Bangla', 'Class 6', c.id, 299.00, true
from public.classes c
where c.name = 'Class 6'
on conflict (class_level, name) do update set class_id = excluded.class_id, price_full = excluded.price_full, free_first_chapter = excluded.free_first_chapter;

insert into public.courses (subject_id, title, class_level, is_free, description)
select s.id, 'Bangla', 'Class 6', false, 'Bangla curriculum for Class 6.'
from public.subjects s
where s.name = 'Bangla' and s.class_level = 'Class 6'
on conflict (class_level, title) do update set subject_id = excluded.subject_id, description = excluded.description, is_free = excluded.is_free;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Poetry', 1, true, 40, 100.00
from public.courses c
where c.title = 'Bangla' and c.class_level = 'Class 6'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Short Stories', 2, false, 40, 100.00
from public.courses c
where c.title = 'Bangla' and c.class_level = 'Class 6'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Essays', 3, false, 40, 100.00
from public.courses c
where c.title = 'Bangla' and c.class_level = 'Class 6'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Grammar', 4, false, 40, 100.00
from public.courses c
where c.title = 'Bangla' and c.class_level = 'Class 6'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Composition', 5, false, 40, 100.00
from public.courses c
where c.title = 'Bangla' and c.class_level = 'Class 6'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

-- Subject: Science (Class 7)
insert into public.subjects (name, class_level, class_id, price_full, free_first_chapter)
select 'Science', 'Class 7', c.id, 499.00, false
from public.classes c
where c.name = 'Class 7'
on conflict (class_level, name) do update set class_id = excluded.class_id, price_full = excluded.price_full, free_first_chapter = excluded.free_first_chapter;

insert into public.courses (subject_id, title, class_level, is_free, description)
select s.id, 'Science', 'Class 7', false, 'Science curriculum for Class 7.'
from public.subjects s
where s.name = 'Science' and s.class_level = 'Class 7'
on conflict (class_level, title) do update set subject_id = excluded.subject_id, description = excluded.description, is_free = excluded.is_free;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Intro to Biology', 1, false, 40, 100.00
from public.courses c
where c.title = 'Science' and c.class_level = 'Class 7'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Human Body', 2, false, 40, 100.00
from public.courses c
where c.title = 'Science' and c.class_level = 'Class 7'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Structure of Matter', 3, false, 40, 100.00
from public.courses c
where c.title = 'Science' and c.class_level = 'Class 7'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Force & Motion', 4, false, 40, 100.00
from public.courses c
where c.title = 'Science' and c.class_level = 'Class 7'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Electricity', 5, false, 40, 100.00
from public.courses c
where c.title = 'Science' and c.class_level = 'Class 7'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Earth Science', 6, false, 40, 100.00
from public.courses c
where c.title = 'Science' and c.class_level = 'Class 7'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

-- Subject: Mathematics (Class 7)
insert into public.subjects (name, class_level, class_id, price_full, free_first_chapter)
select 'Mathematics', 'Class 7', c.id, 499.00, false
from public.classes c
where c.name = 'Class 7'
on conflict (class_level, name) do update set class_id = excluded.class_id, price_full = excluded.price_full, free_first_chapter = excluded.free_first_chapter;

insert into public.courses (subject_id, title, class_level, is_free, description)
select s.id, 'Mathematics', 'Class 7', false, 'Mathematics curriculum for Class 7.'
from public.subjects s
where s.name = 'Mathematics' and s.class_level = 'Class 7'
on conflict (class_level, title) do update set subject_id = excluded.subject_id, description = excluded.description, is_free = excluded.is_free;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Ratio & Proportion', 1, false, 40, 100.00
from public.courses c
where c.title = 'Mathematics' and c.class_level = 'Class 7'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Algebraic Expressions', 2, false, 40, 100.00
from public.courses c
where c.title = 'Mathematics' and c.class_level = 'Class 7'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Linear Equations', 3, false, 40, 100.00
from public.courses c
where c.title = 'Mathematics' and c.class_level = 'Class 7'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Geometry', 4, false, 40, 100.00
from public.courses c
where c.title = 'Mathematics' and c.class_level = 'Class 7'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Statistics', 5, false, 40, 100.00
from public.courses c
where c.title = 'Mathematics' and c.class_level = 'Class 7'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Mensuration', 6, false, 40, 100.00
from public.courses c
where c.title = 'Mathematics' and c.class_level = 'Class 7'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

-- Subject: ICT (Class 7)
insert into public.subjects (name, class_level, class_id, price_full, free_first_chapter)
select 'ICT', 'Class 7', c.id, 299.00, false
from public.classes c
where c.name = 'Class 7'
on conflict (class_level, name) do update set class_id = excluded.class_id, price_full = excluded.price_full, free_first_chapter = excluded.free_first_chapter;

insert into public.courses (subject_id, title, class_level, is_free, description)
select s.id, 'ICT', 'Class 7', false, 'ICT curriculum for Class 7.'
from public.subjects s
where s.name = 'ICT' and s.class_level = 'Class 7'
on conflict (class_level, title) do update set subject_id = excluded.subject_id, description = excluded.description, is_free = excluded.is_free;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Digital Citizenship', 1, false, 40, 100.00
from public.courses c
where c.title = 'ICT' and c.class_level = 'Class 7'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Intro to Software', 2, false, 40, 100.00
from public.courses c
where c.title = 'ICT' and c.class_level = 'Class 7'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Multimedia', 3, false, 40, 100.00
from public.courses c
where c.title = 'ICT' and c.class_level = 'Class 7'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Internet Uses', 4, false, 40, 100.00
from public.courses c
where c.title = 'ICT' and c.class_level = 'Class 7'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

-- Subject: Bangladesh & Global Studies (Class 7)
insert into public.subjects (name, class_level, class_id, price_full, free_first_chapter)
select 'Bangladesh & Global Studies', 'Class 7', c.id, 399.00, true
from public.classes c
where c.name = 'Class 7'
on conflict (class_level, name) do update set class_id = excluded.class_id, price_full = excluded.price_full, free_first_chapter = excluded.free_first_chapter;

insert into public.courses (subject_id, title, class_level, is_free, description)
select s.id, 'Bangladesh & Global Studies', 'Class 7', false, 'Bangladesh & Global Studies curriculum for Class 7.'
from public.subjects s
where s.name = 'Bangladesh & Global Studies' and s.class_level = 'Class 7'
on conflict (class_level, title) do update set subject_id = excluded.subject_id, description = excluded.description, is_free = excluded.is_free;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'History', 1, true, 40, 100.00
from public.courses c
where c.title = 'Bangladesh & Global Studies' and c.class_level = 'Class 7'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Civics', 2, false, 40, 100.00
from public.courses c
where c.title = 'Bangladesh & Global Studies' and c.class_level = 'Class 7'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Economy', 3, false, 40, 100.00
from public.courses c
where c.title = 'Bangladesh & Global Studies' and c.class_level = 'Class 7'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Geography', 4, false, 40, 100.00
from public.courses c
where c.title = 'Bangladesh & Global Studies' and c.class_level = 'Class 7'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Global Studies', 5, false, 40, 100.00
from public.courses c
where c.title = 'Bangladesh & Global Studies' and c.class_level = 'Class 7'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

-- Subject: Science (Class 8)
insert into public.subjects (name, class_level, class_id, price_full, free_first_chapter)
select 'Science', 'Class 8', c.id, 599.00, false
from public.classes c
where c.name = 'Class 8'
on conflict (class_level, name) do update set class_id = excluded.class_id, price_full = excluded.price_full, free_first_chapter = excluded.free_first_chapter;

insert into public.courses (subject_id, title, class_level, is_free, description)
select s.id, 'Science', 'Class 8', false, 'Science curriculum for Class 8.'
from public.subjects s
where s.name = 'Science' and s.class_level = 'Class 8'
on conflict (class_level, title) do update set subject_id = excluded.subject_id, description = excluded.description, is_free = excluded.is_free;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Cell & Tissue', 1, false, 40, 100.00
from public.courses c
where c.title = 'Science' and c.class_level = 'Class 8'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Reproduction', 2, false, 40, 100.00
from public.courses c
where c.title = 'Science' and c.class_level = 'Class 8'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Kinetic Theory', 3, false, 40, 100.00
from public.courses c
where c.title = 'Science' and c.class_level = 'Class 8'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Simple Machines', 4, false, 40, 100.00
from public.courses c
where c.title = 'Science' and c.class_level = 'Class 8'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Heat & Temperature', 5, false, 40, 100.00
from public.courses c
where c.title = 'Science' and c.class_level = 'Class 8'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Chemical Reaction', 6, false, 40, 100.00
from public.courses c
where c.title = 'Science' and c.class_level = 'Class 8'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Environment & Climate', 7, false, 40, 100.00
from public.courses c
where c.title = 'Science' and c.class_level = 'Class 8'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

-- Subject: Mathematics (Class 8)
insert into public.subjects (name, class_level, class_id, price_full, free_first_chapter)
select 'Mathematics', 'Class 8', c.id, 499.00, false
from public.classes c
where c.name = 'Class 8'
on conflict (class_level, name) do update set class_id = excluded.class_id, price_full = excluded.price_full, free_first_chapter = excluded.free_first_chapter;

insert into public.courses (subject_id, title, class_level, is_free, description)
select s.id, 'Mathematics', 'Class 8', false, 'Mathematics curriculum for Class 8.'
from public.subjects s
where s.name = 'Mathematics' and s.class_level = 'Class 8'
on conflict (class_level, title) do update set subject_id = excluded.subject_id, description = excluded.description, is_free = excluded.is_free;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Algebra', 1, false, 40, 100.00
from public.courses c
where c.title = 'Mathematics' and c.class_level = 'Class 8'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Simultaneous Equations', 2, false, 40, 100.00
from public.courses c
where c.title = 'Mathematics' and c.class_level = 'Class 8'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Geometry', 3, false, 40, 100.00
from public.courses c
where c.title = 'Mathematics' and c.class_level = 'Class 8'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Trigonometry Basics', 4, false, 40, 100.00
from public.courses c
where c.title = 'Mathematics' and c.class_level = 'Class 8'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Statistics', 5, false, 40, 100.00
from public.courses c
where c.title = 'Mathematics' and c.class_level = 'Class 8'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Mensuration', 6, false, 40, 100.00
from public.courses c
where c.title = 'Mathematics' and c.class_level = 'Class 8'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

-- Subject: ICT (Class 8)
insert into public.subjects (name, class_level, class_id, price_full, free_first_chapter)
select 'ICT', 'Class 8', c.id, 299.00, false
from public.classes c
where c.name = 'Class 8'
on conflict (class_level, name) do update set class_id = excluded.class_id, price_full = excluded.price_full, free_first_chapter = excluded.free_first_chapter;

insert into public.courses (subject_id, title, class_level, is_free, description)
select s.id, 'ICT', 'Class 8', false, 'ICT curriculum for Class 8.'
from public.subjects s
where s.name = 'ICT' and s.class_level = 'Class 8'
on conflict (class_level, title) do update set subject_id = excluded.subject_id, description = excluded.description, is_free = excluded.is_free;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Spreadsheet', 1, false, 40, 100.00
from public.courses c
where c.title = 'ICT' and c.class_level = 'Class 8'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Presentation', 2, false, 40, 100.00
from public.courses c
where c.title = 'ICT' and c.class_level = 'Class 8'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Programming Basics', 3, false, 40, 100.00
from public.courses c
where c.title = 'ICT' and c.class_level = 'Class 8'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Online Security', 4, false, 40, 100.00
from public.courses c
where c.title = 'ICT' and c.class_level = 'Class 8'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

-- Subject: Bangladesh & Global Studies (Class 8)
insert into public.subjects (name, class_level, class_id, price_full, free_first_chapter)
select 'Bangladesh & Global Studies', 'Class 8', c.id, 249.00, true
from public.classes c
where c.name = 'Class 8'
on conflict (class_level, name) do update set class_id = excluded.class_id, price_full = excluded.price_full, free_first_chapter = excluded.free_first_chapter;

insert into public.courses (subject_id, title, class_level, is_free, description)
select s.id, 'Bangladesh & Global Studies', 'Class 8', false, 'Bangladesh & Global Studies curriculum for Class 8.'
from public.subjects s
where s.name = 'Bangladesh & Global Studies' and s.class_level = 'Class 8'
on conflict (class_level, title) do update set subject_id = excluded.subject_id, description = excluded.description, is_free = excluded.is_free;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'State & Government', 1, true, 40, 100.00
from public.courses c
where c.title = 'Bangladesh & Global Studies' and c.class_level = 'Class 8'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Economic Activities', 2, false, 40, 100.00
from public.courses c
where c.title = 'Bangladesh & Global Studies' and c.class_level = 'Class 8'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Maps & Globe', 3, false, 40, 100.00
from public.courses c
where c.title = 'Bangladesh & Global Studies' and c.class_level = 'Class 8'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'World Affairs', 4, false, 40, 100.00
from public.courses c
where c.title = 'Bangladesh & Global Studies' and c.class_level = 'Class 8'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

-- Subject: Science (Class 9-10)
insert into public.subjects (name, class_level, class_id, price_full, free_first_chapter)
select 'Science', 'Class 9-10', c.id, 899.00, false
from public.classes c
where c.name = 'Class 9-10'
on conflict (class_level, name) do update set class_id = excluded.class_id, price_full = excluded.price_full, free_first_chapter = excluded.free_first_chapter;

insert into public.courses (subject_id, title, class_level, is_free, description)
select s.id, 'Science', 'Class 9-10', false, 'Science curriculum for Class 9-10.'
from public.subjects s
where s.name = 'Science' and s.class_level = 'Class 9-10'
on conflict (class_level, title) do update set subject_id = excluded.subject_id, description = excluded.description, is_free = excluded.is_free;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Cell Biology', 1, false, 40, 99.00
from public.courses c
where c.title = 'Science' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Chemical Reaction & Equation', 2, false, 40, 100.00
from public.courses c
where c.title = 'Science' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Acid-Base-Salt', 3, false, 40, 100.00
from public.courses c
where c.title = 'Science' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Motion', 4, false, 40, 100.00
from public.courses c
where c.title = 'Science' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Force & Work', 5, false, 40, 100.00
from public.courses c
where c.title = 'Science' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Electricity', 6, false, 40, 100.00
from public.courses c
where c.title = 'Science' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Magnetism', 7, false, 40, 100.00
from public.courses c
where c.title = 'Science' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Environment', 8, false, 40, 100.00
from public.courses c
where c.title = 'Science' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Astronomy', 9, false, 40, 100.00
from public.courses c
where c.title = 'Science' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

-- Subject: Physics (Class 9-10)
insert into public.subjects (name, class_level, class_id, price_full, free_first_chapter)
select 'Physics', 'Class 9-10', c.id, 899.00, false
from public.classes c
where c.name = 'Class 9-10'
on conflict (class_level, name) do update set class_id = excluded.class_id, price_full = excluded.price_full, free_first_chapter = excluded.free_first_chapter;

insert into public.courses (subject_id, title, class_level, is_free, description)
select s.id, 'Physics', 'Class 9-10', false, 'Physics curriculum for Class 9-10.'
from public.subjects s
where s.name = 'Physics' and s.class_level = 'Class 9-10'
on conflict (class_level, title) do update set subject_id = excluded.subject_id, description = excluded.description, is_free = excluded.is_free;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Physical Quantities', 1, false, 40, 120.00
from public.courses c
where c.title = 'Physics' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Motion', 2, false, 40, 120.00
from public.courses c
where c.title = 'Physics' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Newton''s Laws', 3, false, 40, 120.00
from public.courses c
where c.title = 'Physics' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Work, Power, Energy', 4, false, 40, 120.00
from public.courses c
where c.title = 'Physics' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Pressure', 5, false, 40, 120.00
from public.courses c
where c.title = 'Physics' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Heat', 6, false, 40, 120.00
from public.courses c
where c.title = 'Physics' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Light', 7, false, 40, 120.00
from public.courses c
where c.title = 'Physics' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Electricity', 8, false, 40, 120.00
from public.courses c
where c.title = 'Physics' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Magnetism', 9, false, 40, 120.00
from public.courses c
where c.title = 'Physics' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

-- Subject: Chemistry (Class 9-10)
insert into public.subjects (name, class_level, class_id, price_full, free_first_chapter)
select 'Chemistry', 'Class 9-10', c.id, 699.00, false
from public.classes c
where c.name = 'Class 9-10'
on conflict (class_level, name) do update set class_id = excluded.class_id, price_full = excluded.price_full, free_first_chapter = excluded.free_first_chapter;

insert into public.courses (subject_id, title, class_level, is_free, description)
select s.id, 'Chemistry', 'Class 9-10', false, 'Chemistry curriculum for Class 9-10.'
from public.subjects s
where s.name = 'Chemistry' and s.class_level = 'Class 9-10'
on conflict (class_level, title) do update set subject_id = excluded.subject_id, description = excluded.description, is_free = excluded.is_free;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Structure of Matter', 1, false, 40, 120.00
from public.courses c
where c.title = 'Chemistry' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Chemical Bonding', 2, false, 40, 120.00
from public.courses c
where c.title = 'Chemistry' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Chemical Reactions', 3, false, 40, 120.00
from public.courses c
where c.title = 'Chemistry' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Periodic Table', 4, false, 40, 120.00
from public.courses c
where c.title = 'Chemistry' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Acid, Base, Salt', 5, false, 40, 120.00
from public.courses c
where c.title = 'Chemistry' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Organic Chemistry Basics', 6, false, 40, 120.00
from public.courses c
where c.title = 'Chemistry' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Environment & Pollution', 7, false, 40, 120.00
from public.courses c
where c.title = 'Chemistry' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

-- Subject: Biology (Class 9-10)
insert into public.subjects (name, class_level, class_id, price_full, free_first_chapter)
select 'Biology', 'Class 9-10', c.id, 599.00, false
from public.classes c
where c.name = 'Class 9-10'
on conflict (class_level, name) do update set class_id = excluded.class_id, price_full = excluded.price_full, free_first_chapter = excluded.free_first_chapter;

insert into public.courses (subject_id, title, class_level, is_free, description)
select s.id, 'Biology', 'Class 9-10', false, 'Biology curriculum for Class 9-10.'
from public.subjects s
where s.name = 'Biology' and s.class_level = 'Class 9-10'
on conflict (class_level, title) do update set subject_id = excluded.subject_id, description = excluded.description, is_free = excluded.is_free;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Cell Biology', 1, false, 40, 120.00
from public.courses c
where c.title = 'Biology' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Genetics', 2, false, 40, 120.00
from public.courses c
where c.title = 'Biology' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Evolution', 3, false, 40, 120.00
from public.courses c
where c.title = 'Biology' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Human Physiology', 4, false, 40, 120.00
from public.courses c
where c.title = 'Biology' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Plant Physiology', 5, false, 40, 120.00
from public.courses c
where c.title = 'Biology' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Ecology', 6, false, 40, 120.00
from public.courses c
where c.title = 'Biology' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Biotechnology', 7, false, 40, 120.00
from public.courses c
where c.title = 'Biology' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

-- Subject: Mathematics (Class 9-10)
insert into public.subjects (name, class_level, class_id, price_full, free_first_chapter)
select 'Mathematics', 'Class 9-10', c.id, 699.00, false
from public.classes c
where c.name = 'Class 9-10'
on conflict (class_level, name) do update set class_id = excluded.class_id, price_full = excluded.price_full, free_first_chapter = excluded.free_first_chapter;

insert into public.courses (subject_id, title, class_level, is_free, description)
select s.id, 'Mathematics', 'Class 9-10', false, 'Mathematics curriculum for Class 9-10.'
from public.subjects s
where s.name = 'Mathematics' and s.class_level = 'Class 9-10'
on conflict (class_level, title) do update set subject_id = excluded.subject_id, description = excluded.description, is_free = excluded.is_free;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Algebra', 1, false, 40, 120.00
from public.courses c
where c.title = 'Mathematics' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Geometry', 2, false, 40, 120.00
from public.courses c
where c.title = 'Mathematics' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Trigonometry', 3, false, 40, 120.00
from public.courses c
where c.title = 'Mathematics' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Coordinate Geometry', 4, false, 40, 120.00
from public.courses c
where c.title = 'Mathematics' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Statistics', 5, false, 40, 120.00
from public.courses c
where c.title = 'Mathematics' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Mensuration', 6, false, 40, 120.00
from public.courses c
where c.title = 'Mathematics' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Probability', 7, false, 40, 120.00
from public.courses c
where c.title = 'Mathematics' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

-- Subject: ICT (Class 9-10)
insert into public.subjects (name, class_level, class_id, price_full, free_first_chapter)
select 'ICT', 'Class 9-10', c.id, 599.00, false
from public.classes c
where c.name = 'Class 9-10'
on conflict (class_level, name) do update set class_id = excluded.class_id, price_full = excluded.price_full, free_first_chapter = excluded.free_first_chapter;

insert into public.courses (subject_id, title, class_level, is_free, description)
select s.id, 'ICT', 'Class 9-10', false, 'ICT curriculum for Class 9-10.'
from public.subjects s
where s.name = 'ICT' and s.class_level = 'Class 9-10'
on conflict (class_level, title) do update set subject_id = excluded.subject_id, description = excluded.description, is_free = excluded.is_free;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Number Systems', 1, false, 40, 120.00
from public.courses c
where c.title = 'ICT' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Digital Devices', 2, false, 40, 120.00
from public.courses c
where c.title = 'ICT' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'ICT in Daily Life', 3, false, 40, 120.00
from public.courses c
where c.title = 'ICT' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Programming - C/Python basics', 4, false, 40, 120.00
from public.courses c
where c.title = 'ICT' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Database', 5, false, 40, 120.00
from public.courses c
where c.title = 'ICT' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Multimedia', 6, false, 40, 120.00
from public.courses c
where c.title = 'ICT' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

-- Subject: Bangladesh & Global Studies (Class 9-10)
insert into public.subjects (name, class_level, class_id, price_full, free_first_chapter)
select 'Bangladesh & Global Studies', 'Class 9-10', c.id, 399.00, true
from public.classes c
where c.name = 'Class 9-10'
on conflict (class_level, name) do update set class_id = excluded.class_id, price_full = excluded.price_full, free_first_chapter = excluded.free_first_chapter;

insert into public.courses (subject_id, title, class_level, is_free, description)
select s.id, 'Bangladesh & Global Studies', 'Class 9-10', false, 'Bangladesh & Global Studies curriculum for Class 9-10.'
from public.subjects s
where s.name = 'Bangladesh & Global Studies' and s.class_level = 'Class 9-10'
on conflict (class_level, title) do update set subject_id = excluded.subject_id, description = excluded.description, is_free = excluded.is_free;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Bangladesh History', 1, true, 40, 120.00
from public.courses c
where c.title = 'Bangladesh & Global Studies' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Geography', 2, false, 40, 120.00
from public.courses c
where c.title = 'Bangladesh & Global Studies' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Civics', 3, false, 40, 120.00
from public.courses c
where c.title = 'Bangladesh & Global Studies' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Economics', 4, false, 40, 120.00
from public.courses c
where c.title = 'Bangladesh & Global Studies' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Global Studies', 5, false, 40, 120.00
from public.courses c
where c.title = 'Bangladesh & Global Studies' and c.class_level = 'Class 9-10'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

-- Subject: Physics (Class 11-12)
insert into public.subjects (name, class_level, class_id, price_full, free_first_chapter)
select 'Physics', 'Class 11-12', c.id, 1299.00, false
from public.classes c
where c.name = 'Class 11-12'
on conflict (class_level, name) do update set class_id = excluded.class_id, price_full = excluded.price_full, free_first_chapter = excluded.free_first_chapter;

insert into public.courses (subject_id, title, class_level, is_free, description)
select s.id, 'Physics', 'Class 11-12', false, 'Physics curriculum for Class 11-12.'
from public.subjects s
where s.name = 'Physics' and s.class_level = 'Class 11-12'
on conflict (class_level, title) do update set subject_id = excluded.subject_id, description = excluded.description, is_free = excluded.is_free;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Vector', 1, false, 40, 149.00
from public.courses c
where c.title = 'Physics' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Motion', 2, false, 40, 120.00
from public.courses c
where c.title = 'Physics' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Dynamics', 3, false, 40, 120.00
from public.courses c
where c.title = 'Physics' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Work, Energy, Power', 4, false, 40, 120.00
from public.courses c
where c.title = 'Physics' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Gravitation', 5, false, 40, 120.00
from public.courses c
where c.title = 'Physics' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Properties of Matter', 6, false, 40, 120.00
from public.courses c
where c.title = 'Physics' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Thermodynamics', 7, false, 40, 120.00
from public.courses c
where c.title = 'Physics' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Waves', 8, false, 40, 120.00
from public.courses c
where c.title = 'Physics' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Optics', 9, false, 40, 120.00
from public.courses c
where c.title = 'Physics' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Electricity', 10, false, 40, 120.00
from public.courses c
where c.title = 'Physics' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Magnetism', 11, false, 40, 120.00
from public.courses c
where c.title = 'Physics' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Modern Physics', 12, false, 40, 120.00
from public.courses c
where c.title = 'Physics' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Electronics', 13, false, 40, 120.00
from public.courses c
where c.title = 'Physics' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

-- Subject: Chemistry (Class 11-12)
insert into public.subjects (name, class_level, class_id, price_full, free_first_chapter)
select 'Chemistry', 'Class 11-12', c.id, 899.00, false
from public.classes c
where c.name = 'Class 11-12'
on conflict (class_level, name) do update set class_id = excluded.class_id, price_full = excluded.price_full, free_first_chapter = excluded.free_first_chapter;

insert into public.courses (subject_id, title, class_level, is_free, description)
select s.id, 'Chemistry', 'Class 11-12', false, 'Chemistry curriculum for Class 11-12.'
from public.subjects s
where s.name = 'Chemistry' and s.class_level = 'Class 11-12'
on conflict (class_level, title) do update set subject_id = excluded.subject_id, description = excluded.description, is_free = excluded.is_free;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Atomic Structure', 1, false, 40, 120.00
from public.courses c
where c.title = 'Chemistry' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Periodicity', 2, false, 40, 120.00
from public.courses c
where c.title = 'Chemistry' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Chemical Bond', 3, false, 40, 120.00
from public.courses c
where c.title = 'Chemistry' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Thermochemistry', 4, false, 40, 120.00
from public.courses c
where c.title = 'Chemistry' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Reaction Rate', 5, false, 40, 120.00
from public.courses c
where c.title = 'Chemistry' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Electrochemistry', 6, false, 40, 120.00
from public.courses c
where c.title = 'Chemistry' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Organic Chemistry', 7, false, 40, 120.00
from public.courses c
where c.title = 'Chemistry' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Polymer', 8, false, 40, 120.00
from public.courses c
where c.title = 'Chemistry' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Environmental Chemistry', 9, false, 40, 120.00
from public.courses c
where c.title = 'Chemistry' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

-- Subject: Biology (Class 11-12)
insert into public.subjects (name, class_level, class_id, price_full, free_first_chapter)
select 'Biology', 'Class 11-12', c.id, 799.00, false
from public.classes c
where c.name = 'Class 11-12'
on conflict (class_level, name) do update set class_id = excluded.class_id, price_full = excluded.price_full, free_first_chapter = excluded.free_first_chapter;

insert into public.courses (subject_id, title, class_level, is_free, description)
select s.id, 'Biology', 'Class 11-12', false, 'Biology curriculum for Class 11-12.'
from public.subjects s
where s.name = 'Biology' and s.class_level = 'Class 11-12'
on conflict (class_level, title) do update set subject_id = excluded.subject_id, description = excluded.description, is_free = excluded.is_free;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Cell Biology', 1, false, 40, 120.00
from public.courses c
where c.title = 'Biology' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Genetics', 2, false, 40, 120.00
from public.courses c
where c.title = 'Biology' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Biotechnology', 3, false, 40, 120.00
from public.courses c
where c.title = 'Biology' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Evolution', 4, false, 40, 120.00
from public.courses c
where c.title = 'Biology' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Plant Physiology', 5, false, 40, 120.00
from public.courses c
where c.title = 'Biology' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Human Physiology', 6, false, 40, 120.00
from public.courses c
where c.title = 'Biology' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Reproduction', 7, false, 40, 120.00
from public.courses c
where c.title = 'Biology' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Ecology', 8, false, 40, 120.00
from public.courses c
where c.title = 'Biology' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

-- Subject: Higher Math (Class 11-12)
insert into public.subjects (name, class_level, class_id, price_full, free_first_chapter)
select 'Higher Math', 'Class 11-12', c.id, 899.00, false
from public.classes c
where c.name = 'Class 11-12'
on conflict (class_level, name) do update set class_id = excluded.class_id, price_full = excluded.price_full, free_first_chapter = excluded.free_first_chapter;

insert into public.courses (subject_id, title, class_level, is_free, description)
select s.id, 'Higher Math', 'Class 11-12', false, 'Higher Math curriculum for Class 11-12.'
from public.subjects s
where s.name = 'Higher Math' and s.class_level = 'Class 11-12'
on conflict (class_level, title) do update set subject_id = excluded.subject_id, description = excluded.description, is_free = excluded.is_free;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Set Theory', 1, false, 40, 120.00
from public.courses c
where c.title = 'Higher Math' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Complex Numbers', 2, false, 40, 120.00
from public.courses c
where c.title = 'Higher Math' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Polynomial', 3, false, 40, 120.00
from public.courses c
where c.title = 'Higher Math' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Calculus - Limits', 4, false, 40, 120.00
from public.courses c
where c.title = 'Higher Math' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Differentiation', 5, false, 40, 120.00
from public.courses c
where c.title = 'Higher Math' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Integration', 6, false, 40, 120.00
from public.courses c
where c.title = 'Higher Math' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Matrix & Determinant', 7, false, 40, 120.00
from public.courses c
where c.title = 'Higher Math' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Coordinate Geometry', 8, false, 40, 120.00
from public.courses c
where c.title = 'Higher Math' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Trigonometry (Advanced)', 9, false, 40, 120.00
from public.courses c
where c.title = 'Higher Math' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

-- Subject: ICT (Class 11-12)
insert into public.subjects (name, class_level, class_id, price_full, free_first_chapter)
select 'ICT', 'Class 11-12', c.id, 699.00, false
from public.classes c
where c.name = 'Class 11-12'
on conflict (class_level, name) do update set class_id = excluded.class_id, price_full = excluded.price_full, free_first_chapter = excluded.free_first_chapter;

insert into public.courses (subject_id, title, class_level, is_free, description)
select s.id, 'ICT', 'Class 11-12', false, 'ICT curriculum for Class 11-12.'
from public.subjects s
where s.name = 'ICT' and s.class_level = 'Class 11-12'
on conflict (class_level, title) do update set subject_id = excluded.subject_id, description = excluded.description, is_free = excluded.is_free;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Number Systems', 1, false, 40, 120.00
from public.courses c
where c.title = 'ICT' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Logic Gates', 2, false, 40, 120.00
from public.courses c
where c.title = 'ICT' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Programming - C/Python', 3, false, 40, 120.00
from public.courses c
where c.title = 'ICT' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Algorithms', 4, false, 40, 120.00
from public.courses c
where c.title = 'ICT' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Database Management', 5, false, 40, 120.00
from public.courses c
where c.title = 'ICT' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'System Security', 6, false, 40, 120.00
from public.courses c
where c.title = 'ICT' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Networking', 7, false, 40, 120.00
from public.courses c
where c.title = 'ICT' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

-- Subject: Bangladesh & Global Studies (Class 11-12)
insert into public.subjects (name, class_level, class_id, price_full, free_first_chapter)
select 'Bangladesh & Global Studies', 'Class 11-12', c.id, 499.00, true
from public.classes c
where c.name = 'Class 11-12'
on conflict (class_level, name) do update set class_id = excluded.class_id, price_full = excluded.price_full, free_first_chapter = excluded.free_first_chapter;

insert into public.courses (subject_id, title, class_level, is_free, description)
select s.id, 'Bangladesh & Global Studies', 'Class 11-12', false, 'Bangladesh & Global Studies curriculum for Class 11-12.'
from public.subjects s
where s.name = 'Bangladesh & Global Studies' and s.class_level = 'Class 11-12'
on conflict (class_level, title) do update set subject_id = excluded.subject_id, description = excluded.description, is_free = excluded.is_free;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Bangladesh Government', 1, true, 40, 120.00
from public.courses c
where c.title = 'Bangladesh & Global Studies' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Economy', 2, false, 40, 120.00
from public.courses c
where c.title = 'Bangladesh & Global Studies' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Geography', 3, false, 40, 120.00
from public.courses c
where c.title = 'Bangladesh & Global Studies' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'World Politics', 4, false, 40, 120.00
from public.courses c
where c.title = 'Bangladesh & Global Studies' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Civic Duties', 5, false, 40, 120.00
from public.courses c
where c.title = 'Bangladesh & Global Studies' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

-- Subject: English (Class 11-12)
insert into public.subjects (name, class_level, class_id, price_full, free_first_chapter)
select 'English', 'Class 11-12', c.id, 720.00, false
from public.classes c
where c.name = 'Class 11-12'
on conflict (class_level, name) do update set class_id = excluded.class_id, price_full = excluded.price_full, free_first_chapter = excluded.free_first_chapter;

insert into public.courses (subject_id, title, class_level, is_free, description)
select s.id, 'English', 'Class 11-12', false, 'English curriculum for Class 11-12.'
from public.subjects s
where s.name = 'English' and s.class_level = 'Class 11-12'
on conflict (class_level, title) do update set subject_id = excluded.subject_id, description = excluded.description, is_free = excluded.is_free;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Prose', 1, false, 40, 120.00
from public.courses c
where c.title = 'English' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Poetry', 2, false, 40, 120.00
from public.courses c
where c.title = 'English' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Grammar', 3, false, 40, 120.00
from public.courses c
where c.title = 'English' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Writing', 4, false, 40, 120.00
from public.courses c
where c.title = 'English' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Vocabulary', 5, false, 40, 120.00
from public.courses c
where c.title = 'English' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Comprehension passages', 6, false, 40, 120.00
from public.courses c
where c.title = 'English' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

-- Subject: Bangla (Class 11-12)
insert into public.subjects (name, class_level, class_id, price_full, free_first_chapter)
select 'Bangla', 'Class 11-12', c.id, 240.00, false
from public.classes c
where c.name = 'Class 11-12'
on conflict (class_level, name) do update set class_id = excluded.class_id, price_full = excluded.price_full, free_first_chapter = excluded.free_first_chapter;

insert into public.courses (subject_id, title, class_level, is_free, description)
select s.id, 'Bangla', 'Class 11-12', false, 'Bangla curriculum for Class 11-12.'
from public.subjects s
where s.name = 'Bangla' and s.class_level = 'Class 11-12'
on conflict (class_level, title) do update set subject_id = excluded.subject_id, description = excluded.description, is_free = excluded.is_free;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Bangla 1st Paper', 1, false, 40, 120.00
from public.courses c
where c.title = 'Bangla' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

insert into public.chapters (course_id, title, order_no, is_free, duration_minutes, price)
select c.id, 'Bangla 2nd Paper', 2, false, 40, 120.00
from public.courses c
where c.title = 'Bangla' and c.class_level = 'Class 11-12'
on conflict (course_id, order_no) do update set title = excluded.title, is_free = excluded.is_free, duration_minutes = excluded.duration_minutes, price = excluded.price;

-- Auto-create base lessons for chapters without content
insert into public.lessons (course_id, chapter_id, title, order_no, type, duration_minutes, quiz_question_count)
select ch.course_id, ch.id, 'Lesson: ' || ch.title, 1, 'article', 20, null
from public.chapters ch
where not exists (
  select 1 from public.lessons l where l.chapter_id = ch.id and l.order_no = 1
);

insert into public.lessons (course_id, chapter_id, title, order_no, type, duration_minutes, quiz_question_count)
select ch.course_id, ch.id, 'Chapter Quiz', 2, 'quiz', null, 10
from public.chapters ch
where not exists (
  select 1 from public.lessons l where l.chapter_id = ch.id and l.order_no = 2
);

-- Admission packages
insert into public.admission_packages (type, name, number_of_sets, price, details)
values
  ('medical', 'Package 1', 3, 150.00, '{"total_marks": 100, "time": "1 Hour", "question_type": "MCQs", "negative_marking": "0.25", "distribution": {"Biology": 30, "Chemistry": 25, "Physics": 20, "English": 15, "General Knowledge": 10}}'::jsonb),
  ('medical', 'Package 2', 5, 250.00, '{"total_marks": 100, "time": "1 Hour", "question_type": "MCQs", "negative_marking": "0.25", "distribution": {"Biology": 30, "Chemistry": 25, "Physics": 20, "English": 15, "General Knowledge": 10}}'::jsonb),
  ('medical', 'Package 3', 10, 450.00, '{"total_marks": 100, "time": "1 Hour", "question_type": "MCQs", "negative_marking": "0.25", "distribution": {"Biology": 30, "Chemistry": 25, "Physics": 20, "English": 15, "General Knowledge": 10}}'::jsonb),
  ('engineering', 'Package 1', 3, 150.00, '{"total_marks": 200, "time": "2-3 Hours", "question_type": "MCQs", "negative_marking": "0.25", "distribution": {"Mathematics": 60, "Physics": 60, "Chemistry": 60, "English": 20}}'::jsonb),
  ('engineering', 'Package 2', 5, 250.00, '{"total_marks": 200, "time": "2-3 Hours", "question_type": "MCQs", "negative_marking": "0.25", "distribution": {"Mathematics": 60, "Physics": 60, "Chemistry": 60, "English": 20}}'::jsonb),
  ('engineering', 'Package 3', 10, 450.00, '{"total_marks": 200, "time": "2-3 Hours", "question_type": "MCQs", "negative_marking": "0.25", "distribution": {"Mathematics": 60, "Physics": 60, "Chemistry": 60, "English": 20}}'::jsonb),
  ('varsity', 'Package 1', 3, 150.00, '{"total_marks": 100, "time": "1 Hour", "question_type": "MCQs", "negative_marking": "0.25", "distribution": {"Bangla": 15, "English": 15, "Physics": 20, "Chemistry": 20, "Mathematics_or_Biology": 20, "General Knowledge": 10}}'::jsonb),
  ('varsity', 'Package 2', 5, 250.00, '{"total_marks": 100, "time": "1 Hour", "question_type": "MCQs", "negative_marking": "0.25", "distribution": {"Bangla": 15, "English": 15, "Physics": 20, "Chemistry": 20, "Mathematics_or_Biology": 20, "General Knowledge": 10}}'::jsonb),
  ('varsity', 'Package 3', 10, 450.00, '{"total_marks": 100, "time": "1 Hour", "question_type": "MCQs", "negative_marking": "0.25", "distribution": {"Bangla": 15, "English": 15, "Physics": 20, "Chemistry": 20, "Mathematics_or_Biology": 20, "General Knowledge": 10}}'::jsonb)
on conflict (type, name) do update set number_of_sets = excluded.number_of_sets, price = excluded.price, details = excluded.details;

update public.subjects
set first_chapter_free = free_first_chapter
where first_chapter_free is distinct from free_first_chapter;

update public.chapters
set name = coalesce(name, title)
where name is null;

update public.chapters ch
set subject_id = s.id
from public.courses c
join public.subjects s on s.id = c.subject_id
where ch.course_id = c.id
  and ch.subject_id is null;

update public.subjects
set free_first_chapter = true,
    first_chapter_free = true;

update public.chapters
set is_free = true,
    price = 0
where order_no = 1;

