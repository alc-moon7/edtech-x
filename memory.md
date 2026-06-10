# HomeSchool Application Memory

## Overview
HomeSchool is an interactive, bilingual (English & Bangla) learning platform targeted at students in classes 6-12, aligned with the NCTB (National Curriculum and Textbook Board) syllabus. It provides structured learning modules, quizzes, progress tracking analytics, AI-assisted learning tools, and parental monitoring.

## Tech Stack
- **Frontend Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Routing**: React Router (v6)
- **Backend/BaaS**: Supabase (Authentication, PostgreSQL Database, Edge Functions)
- **AI Integration**: OpenRouter API (gpt-4o-mini) for BrainBite, Lesson Generator, and Quiz Generator
- **UI/UX Tools**: Framer Motion (animations), Recharts (data visualization), Lucide React (icons)
- **Other**: React Markdown, Date-fns

## Architecture & Directory Structure
The application employs a standard modern React application structure grouped generally by feature/route and reusable libraries.

```
home-school/
├── .env                    # Environment variables (Supabase keys)
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
├── src/
│   ├── app/                # Route definitions grouped logically
│   │   ├── (dashboard)/    # Protected dashboard routes (Dashboard, Courses, AI, Settings, etc.)
│   │   ├── about/          # Marketing: About page
│   │   ├── contact/        # Marketing: Contact page
│   │   ├── login/          # Auth: Login page
│   │   ├── signup/         # Auth: Signup page
│   │   └── ...             # Other public/marketing routes
│   ├── components/         # Reusable UI components
│   │   ├── dashboard/      # Dashboard-specific components
│   │   ├── learning/       # Lesson/Course specific components
│   │   ├── ui/             # Generic UI components
│   │   ├── Navbar.tsx      # Main navigation
│   │   ├── Sidebar.tsx     # Dashboard sidebar
│   │   └── NctbAsk.tsx     # AI Query interface for NCTB
│   ├── lib/                # Utilities, services, and state
│   │   ├── auth.tsx        # Authentication handling/logic
│   │   ├── store.tsx       # Global state management
│   │   ├── supabaseClient.ts # Supabase initialization
│   │   ├── i18n.tsx        # Internationalization configuration
│   │   └── mockData.ts     # Mock data for courses and progress
│   ├── locales/            # Translation files (en, bn)
│   ├── pages/              # Static pages (e.g., NotFound)
│   └── App.tsx             # Main React Router configuration
└── supabase/
    ├── functions/          # Edge Functions (e.g., generate-quiz, contact-message)
    ├── schema.sql          # Database schema (profiles, contact_messages, etc.)
    └── seed.sql            # Database seed data
```

## Routing Setup
The application's routing (`src/App.tsx`) is split into two primary segments:

1. **Public/Marketing Routes (`RootLayout`)**
   - Home (`/`), About (`/about`), Pricing (`/pricing`), Contact (`/contact`)
   - Legal/Help: Privacy (`/privacy`), Terms (`/terms`), Help Center (`/help`)
   - Auth: Login (`/login`), Signup (`/signup`), Forgot Password (`/forgot-password`), Reset Password (`/reset_pass`)
   - Payment Flows: Success (`/payment/success`), Fail (`/payment/fail`), Cancel (`/payment/cancel`)

2. **Protected Routes (`DashboardLayout`)** - Wrapped in `<ProtectedRoute />`
   - Main Dashboard (`/dashboard`)
   - Courses & Lessons (`/courses`, `/courses/:courseId`, `/learn/:courseId/:chapterId/:lessonId`)
   - AI Study Tools: BrainBite, AI Lesson Generator, AI Quiz Generator integrated into course views.
   - Student Tools: Progress (`/progress`), Live Classes (`/live-classes`), Homeschool AI (`/homeschool-ai`)
   - Account: Settings (`/settings`), Parent Dashboard (`/parent`)

## Data & State Management
- **State Store**: Handled in `src/lib/store.tsx` & `src/lib/auth.tsx`. Context API is likely heavily used.
- **Data Fetching**: Primarily interacts with Supabase, supplemented with mock data (`src/lib/mockData.ts` and `src/lib/dashboardData.ts`) for content not yet API-backed.
- **i18n**: Configured in `src/lib/i18n.tsx` offering real-time English and Bangla switching.

## Supabase Integrations
- **Database**: Schemas located in `supabase/schema.sql` outlining tables and RLS policies.
- **Edge Functions**:
  - `generate-quiz`: Utilizes OpenRouter API to generate dynamic MCQs in English or Bengali.
  - `site-chat`: Core AI handler for BrainBite and AI Lesson Generator, integrated with OpenRouter (gpt-4o-mini). Supports strict Bengali localization based on user language mode.
  - `contact-message`: Handles contact form submissions and triggers emails via Resend.
- **Auth**: Email/Password and likely OAuth flows configured through Supabase Auth, deeply integrated with the `profiles` table.

## Notes & Future Scope
- **Mocked Data**: Current course content, progress charts, and leaderboards use mock data. The next major integration phase will involve replacing these with active Supabase calls.
- **AI Integration**: Features like BrainBite, AI Lesson Generator, and Quiz generation rely heavily on external LLM services (OpenRouter). The system dynamically forces strict Bengali responses when `language === "bn"`, with special handling for the English subject. Ensure `OPENROUTER_API_KEY` is present in the deployed Edge Functions.
