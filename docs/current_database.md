-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.admission_attempts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  package_id uuid NOT NULL,
  score integer NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT admission_attempts_pkey PRIMARY KEY (id),
  CONSTRAINT admission_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT admission_attempts_package_id_fkey FOREIGN KEY (package_id) REFERENCES public.admission_packages(id)
);
CREATE TABLE public.admission_packages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type = ANY (ARRAY['medical'::text, 'engineering'::text, 'varsity'::text])),
  name text NOT NULL,
  number_of_sets integer NOT NULL,
  price numeric NOT NULL,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT admission_packages_pkey PRIMARY KEY (id)
);
CREATE TABLE public.ai_usage (
  user_id uuid NOT NULL,
  usage_date date NOT NULL,
  usage_type text NOT NULL CHECK (usage_type = ANY (ARRAY['home_qa'::text, 'quiz'::text, 'brainbite'::text, 'lesson'::text, 'chat'::text])),
  count integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ai_usage_pkey PRIMARY KEY (user_id, usage_date, usage_type),
  CONSTRAINT ai_usage_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.calendar_events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  date date NOT NULL,
  type text NOT NULL CHECK (type = ANY (ARRAY['holiday'::text, 'exam'::text, 'study'::text])),
  class_level text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT calendar_events_pkey PRIMARY KEY (id)
);
CREATE TABLE public.chapters (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL,
  title text NOT NULL,
  order_no integer NOT NULL DEFAULT 1,
  is_free boolean NOT NULL DEFAULT false,
  duration_minutes integer,
  created_at timestamp with time zone DEFAULT now(),
  price numeric,
  title_bn text,
  subject_id uuid,
  name text,
  CONSTRAINT chapters_pkey PRIMARY KEY (id),
  CONSTRAINT chapters_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id),
  CONSTRAINT chapters_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id)
);
CREATE TABLE public.classes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  name_bn text,
  level text NOT NULL CHECK (level = ANY (ARRAY['school'::text, 'ssc'::text, 'hsc'::text, 'admission'::text])),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT classes_pkey PRIMARY KEY (id)
);
CREATE TABLE public.courses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  subject_id uuid NOT NULL,
  title text NOT NULL,
  class_level text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  is_free boolean NOT NULL DEFAULT false,
  CONSTRAINT courses_pkey PRIMARY KEY (id),
  CONSTRAINT courses_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id)
);
CREATE TABLE public.enrollments (
  user_id uuid NOT NULL,
  course_id uuid NOT NULL,
  status text NOT NULL CHECK (status = ANY (ARRAY['ongoing'::text, 'completed'::text])),
  enrolled_at timestamp with time zone DEFAULT now(),
  CONSTRAINT enrollments_pkey PRIMARY KEY (user_id, course_id),
  CONSTRAINT enrollments_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id)
);
CREATE TABLE public.lesson_progress (
  user_id uuid NOT NULL,
  lesson_id uuid NOT NULL,
  course_id uuid NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  progress_percent integer NOT NULL DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  last_position integer,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT lesson_progress_pkey PRIMARY KEY (user_id, lesson_id),
  CONSTRAINT lesson_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT lesson_progress_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id),
  CONSTRAINT lesson_progress_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id)
);
CREATE TABLE public.lessons (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL,
  title text NOT NULL,
  order_no integer NOT NULL DEFAULT 0,
  type text NOT NULL CHECK (type = ANY (ARRAY['video'::text, 'article'::text, 'quiz'::text])),
  duration_minutes integer,
  quiz_question_count integer,
  created_at timestamp with time zone DEFAULT now(),
  chapter_id uuid NOT NULL,
  CONSTRAINT lessons_pkey PRIMARY KEY (id),
  CONSTRAINT lessons_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id),
  CONSTRAINT lessons_chapter_id_fkey FOREIGN KEY (chapter_id) REFERENCES public.chapters(id)
);
CREATE TABLE public.nctb_chunks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  content text NOT NULL,
  class text,
  subject text,
  chapter text,
  source_pdf text,
  created_at timestamp without time zone DEFAULT now(),
  class_level text,
  book_name text,
  page integer,
  content_hash text NOT NULL,
  embedding USER-DEFINED,
  CONSTRAINT nctb_chunks_pkey PRIMARY KEY (id)
);
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  course_id uuid NOT NULL,
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'BDT'::text,
  status text NOT NULL CHECK (status = ANY (ARRAY['pending'::text, 'paid'::text, 'failed'::text, 'cancelled'::text])),
  ssl_session_id text,
  created_at timestamp with time zone DEFAULT now(),
  plan_id text,
  chapter_id uuid,
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT orders_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id),
  CONSTRAINT orders_chapter_id_fkey FOREIGN KEY (chapter_id) REFERENCES public.chapters(id)
);
CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  tran_id text NOT NULL,
  amount numeric NOT NULL,
  card_type text,
  validation_id text,
  status text,
  raw_response jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT payments_pkey PRIMARY KEY (id),
  CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now(),
  class_name text,
  section text,
  role text,
  guardian_name text,
  phone text,
  school text,
  student_id text,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.purchased_chapters (
  user_id uuid NOT NULL,
  chapter_id uuid NOT NULL,
  purchased_at timestamp with time zone DEFAULT now(),
  CONSTRAINT purchased_chapters_pkey PRIMARY KEY (user_id, chapter_id),
  CONSTRAINT purchased_chapters_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT purchased_chapters_chapter_id_fkey FOREIGN KEY (chapter_id) REFERENCES public.chapters(id)
);
CREATE TABLE public.purchased_courses (
  user_id uuid NOT NULL,
  course_id uuid NOT NULL,
  purchased_at timestamp with time zone DEFAULT now(),
  plan_id text,
  expires_at timestamp with time zone,
  CONSTRAINT purchased_courses_pkey PRIMARY KEY (user_id, course_id),
  CONSTRAINT purchased_courses_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT purchased_courses_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id)
);
CREATE TABLE public.quiz_attempts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  subject_id uuid,
  lesson_id uuid,
  score integer NOT NULL CHECK (score >= 0 AND score <= 100),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT quiz_attempts_pkey PRIMARY KEY (id),
  CONSTRAINT quiz_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT quiz_attempts_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id),
  CONSTRAINT quiz_attempts_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id)
);
CREATE TABLE public.student_activity_log (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL,
  ref_id uuid,
  meta jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT student_activity_log_pkey PRIMARY KEY (id),
  CONSTRAINT student_activity_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.student_courses (
  user_id uuid NOT NULL,
  course_id uuid NOT NULL,
  started_at timestamp with time zone DEFAULT now(),
  CONSTRAINT student_courses_pkey PRIMARY KEY (user_id, course_id),
  CONSTRAINT student_courses_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT student_courses_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id)
);
CREATE TABLE public.student_lessons (
  user_id uuid NOT NULL,
  lesson_id uuid NOT NULL,
  status text NOT NULL CHECK (status = ANY (ARRAY['started'::text, 'completed'::text])),
  progress integer NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  updated_at timestamp with time zone DEFAULT now(),
  chapter_id uuid,
  completed boolean NOT NULL DEFAULT false,
  content text,
  CONSTRAINT student_lessons_pkey PRIMARY KEY (user_id, lesson_id),
  CONSTRAINT student_lessons_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT student_lessons_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id),
  CONSTRAINT student_lessons_chapter_id_fkey FOREIGN KEY (chapter_id) REFERENCES public.chapters(id)
);
CREATE TABLE public.student_quiz_attempts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  quiz_id uuid NOT NULL,
  score integer NOT NULL,
  total integer NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT student_quiz_attempts_pkey PRIMARY KEY (id),
  CONSTRAINT student_quiz_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT student_quiz_attempts_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.lessons(id)
);
CREATE TABLE public.study_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  subject_id uuid,
  duration_minutes integer NOT NULL,
  session_date date NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT study_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT study_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT study_sessions_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id)
);
CREATE TABLE public.subjects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  class_level text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  class_id uuid,
  name_bn text,
  price_full numeric,
  free_first_chapter boolean NOT NULL DEFAULT false,
  first_chapter_free boolean NOT NULL DEFAULT false,
  CONSTRAINT subjects_pkey PRIMARY KEY (id),
  CONSTRAINT subjects_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id)
);
CREATE TABLE public.user_profiles (
  user_id uuid NOT NULL,
  full_name text,
  class_level text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_profiles_pkey PRIMARY KEY (user_id),
  CONSTRAINT user_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);