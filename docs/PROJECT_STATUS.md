# Project Status: HomeSchool (edtech-x)

## 1. Project Overview
**HomeSchool** is an interactive educational technology platform designed for students in classes 6-12, following the NCTB (National Curriculum and Textbook Board) syllabus. It provides structured learning modules, interactive quizzes, progress analytics, and dedicated views for both students and parents.

## 2. Tech Stack Architecture
- **Frontend Framework**: React 19 with Vite & TypeScript
- **Styling & UI**: Tailwind CSS v4, Framer Motion (animations), Recharts (data visualization), Lucide React (icons)
- **Routing**: React Router DOM v6 (organized mimicking a modern file-based routing structure in `src/app/`)
- **Backend/Database**: Supabase (PostgreSQL, Row Level Security, Auth)
- **Serverless/API**: Supabase Edge Functions (Deno)
- **Integrations**:
  - **OpenAI**: Powers the AI quiz generator
  - **SSLCommerz**: Payment gateway integration
  - **Resend**: Email delivery for contact messages

## 3. Implemented Features
- **Student Dashboard**: Tracks learning progress, daily streaks, leaderboards, and progress insights.
- **Course Infrastructure**: Support for chapters, lessons, and interactive quizzes aligned with the NCTB curriculum.
- **Parent Dashboard**: Allows parents to monitor student study time and performance metrics.
- **AI Quiz Generator**: Generates MCQs dynamically utilizing an OpenAI-powered Supabase Edge Function.
- **Authentication Workflows**: Registration, login, password reset powered by Supabase Auth.
- **Internationalization (i18n)**: Fully bilingual UI supporting English and Bangla (`src/locales/`).
- **Payment & Checkout**: Integration with SSLCommerz handling success, failure, and cancellation callbacks via Edge Functions.
- **Marketing & Support**: Dedicated static pages for About, Pricing, Privacy, Terms, Contact, and a Help Center.

## 4. Codebase Structure
- **`/src/app/`**: Contains the page routes categorized logically:
  - `(dashboard)/`: Authenticated views (dashboard, courses, progress, settings, live-classes, parent view).
  - Marketing & Info pages (`/about`, `/contact`, `/pricing`, etc.).
  - Auth pages (`/login`, `/signup`, `/forgot-password`, `/reset_pass`).
  - Payment callback pages.
- **`/src/components/`**: Modular, reusable UI components (Navbars, Modals, Language Switchers, Chat Widgets, etc.).
- **`/src/lib/`**: Centralized application logic, Supabase client initialization, stores, utility functions, and mock data.
- **`/supabase/`**: 
  - `schema.sql` and `seed.sql`: Database schema definition and seed data.
  - `functions/`: Serverless edge functions handling complex operations (e.g., `generate-quiz`, `contact-message`, `create-payment`, `site-chat`).

## 5. Database Architecture
Based on the `current_database.md` (and underlying `schema.sql`), the Supabase PostgreSQL database is structured into several core domains:
- **Users & Profiles**: `profiles`, `user_profiles` track student/parent details, class levels, schools, etc.
- **Curriculum & Content**: A deeply nested structure to support NCTB requirements: `classes` -> `subjects` -> `courses` -> `chapters` -> `lessons`. Also includes `nctb_chunks` (with pgvector embeddings) for AI processing.
- **Progress & Tracking**: `student_courses`, `student_lessons`, `lesson_progress`, `quiz_attempts`, `student_quiz_attempts`, and `study_sessions` strictly monitor what the user has watched, read, or scored.
- **Commerce & Access**: `orders`, `payments`, `purchased_courses`, and `purchased_chapters` manage the SSLCommerz payment flow and user content entitlements.
- **AI Integration**: `ai_usage` tracks limits and usage across 'home_qa', 'quiz', 'brainbite', 'lesson', and 'chat'.
- **Admissions Prep**: Specialized tables (`admission_packages`, `admission_attempts`) for university/medical/engineering admission testing workflows.
- **Activity Logging**: `student_activity_log` for comprehensive user event tracking.

## 6. Current Development State
- **Mock Data Reliance**: As noted in the project documentation, certain course content, progress tracking, and leaderboard features are currently relying on mocked data (`src/lib/mockData.ts`). These need to be transitioned to fetch data directly from the Supabase database.
- **Edge Functions**: The backend logic is modularized effectively into Edge Functions, requiring proper environment variables (`OPENAI_API_KEY`, `RESEND_API_KEY`, etc.) for full functionality in deployment.
- **Readiness**: The application foundation is solid with React 19 and Tailwind 4. Most of the core architecture is well-defined, bridging a robust React frontend with Supabase's BaaS capabilities.
