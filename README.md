This is a React + Vite project configured as a single-page app for Netlify.

## Getting Started

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Netlify

- Build command: `npm run build`
- Publish directory: `dist`
- SPA routing is handled via `public/_redirects`.

## Supabase Auth

1. Create a `.env` file (see `.env.example`) with:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
2. In Supabase SQL editor, run `supabase/schema.sql` to create the `profiles` table and RLS policies.
3. In Supabase Auth settings:
   - Enable email/password.
   - Require email confirmations.
   - Add redirect URLs:
     - `http://localhost:5173/login`
   - `http://localhost:5173/reset_pass`
   - `https://homeschool.moonx.dev/login`
   - `https://homeschool.moonx.dev/reset_pass`

## AI Quiz (Serper)

This project includes a Supabase Edge Function that uses Serper.dev search data to generate MCQ-style questions.

1. Set the Serper API key as a Supabase secret:

```bash
supabase secrets set SERPER_API_KEY=your-serper-key
```

2. Deploy the Edge Function:

```bash
supabase functions deploy generate-quiz
```

3. For local dev, run:

```bash
supabase functions serve
```

## Contact Form (Email + DB)

The contact page uses a public Edge Function to store messages and email the support inbox.

1. Run `supabase/schema.sql` to create the `contact_messages` table (included in the schema).
2. Set the required secrets:

```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key RESEND_API_KEY=your-resend-key RESEND_FROM="HomeSchool <onboarding@resend.dev>" CONTACT_RECEIVER_EMAIL="alc.moon@hotmail.com"
```

3. Deploy the Edge Function:

```bash
supabase functions deploy contact-message
```

Note: For production email delivery, set `RESEND_FROM` to a verified domain in Resend.
