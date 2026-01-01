# HomeSchool

HomeSchool is an interactive learning platform for classes 6-12 aligned with the NCTB syllabus. It offers structured lessons, quizzes, progress analytics, and a parent view.

## Features
- NCTB aligned courses with chapters, lessons, and quizzes
- Student dashboard with streaks, leaderboard, and progress insights
- AI quiz generator powered by a Supabase Edge Function
- Parent dashboard to monitor study time and performance
- Auth flows (signup, login, password reset) with Supabase
- Bilingual UI (English and Bangla)
- Marketing pages: about, pricing, help center, contact

## Tech Stack
- React 19 + Vite + TypeScript
- Tailwind CSS 4
- React Router
- Supabase (auth, database, edge functions)
- Framer Motion, Recharts, Lucide icons

## Getting Started

### Prerequisites
- Node.js 18+ (or 20+)
- npm (or pnpm/yarn)

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` in the project root:
   ```bash
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```

### Scripts
- `npm run dev` - start Vite dev server
- `npm run build` - build for production
- `npm run preview` - preview the production build
- `npm run lint` - run ESLint

## Supabase

### Schema
Database tables and policies live in `supabase/schema.sql` (profiles and contact_messages).

### Edge Functions
- `supabase/functions/generate-quiz` - builds MCQ quizzes from search data (fallback when `SERPER_API_KEY` is missing).
- `supabase/functions/contact-message` - saves contact messages and sends email via Resend.

### Function Environment Variables
```bash
SERPER_API_KEY=...
RESEND_API_KEY=...
RESEND_FROM=...
CONTACT_RECEIVER_EMAIL=...
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## Project Structure
```text
src/
  app/            route pages
  components/     UI and feature components
  lib/            auth, data, store, Supabase client
  locales/        translations (en, bn)
  pages/          static fallbacks (e.g., 404)
supabase/
  functions/      edge functions
  schema.sql      database schema
```

## Notes
- Course content, progress, and leaderboard data are mocked in `src/lib/mockData.ts`. Replace with API-backed data when ready.

## Deployment
Run `npm run build` and serve the `dist/` directory with your hosting provider.
