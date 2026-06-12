# HomeSchool App - Complete Context Reference

This document serves as the absolute master context for the "HomeSchool" application. It is designed to be fed to an AI to give it comprehensive knowledge about the platform's vision, architecture, technology stack, logic, and future roadmap, enabling it to generate precise speeches, pitches, or documentation.

---

## 1. Vision & Core Problem
**The Problem:** In Bangladesh, millions of students rely on the national NCTB curriculum. However, standard learning environments lack personalization. One-on-one tutoring is inaccessible for most, and generic e-learning simply hosts static videos without adapting to the student's pace. This rigid, one-size-fits-all model leaves many bright students behind.
**The Solution:** HomeSchool is an AI-driven, hyper-personalized learning platform for classes 6-12 (aligned with the NCTB syllabus). It acts as an interactive, digital 1-on-1 tutor. It actively tracks student progress and uses Agentic AI to dynamically generate quizzes, explain complex topics, and route the user through an interconnected curriculum.

---

## 2. Key Features
*   **NCTB Aligned Curriculum:** Courses are strictly structured around chapters, lessons, and quizzes sourced directly from official NCTB material.
*   **Bilingual Interface:** Real-time toggling between English and Bangla (using `i18n`). The AI also seamlessly shifts languages.
*   **Student Dashboard:** Tracks streaks, provides a leaderboard, and visualizes progress insights using Recharts.
*   **Interactive Knowledge Graph:** A physics-based 2D visualization (using `react-force-graph-2d`) that allows students to see how different textbook topics interconnect in real-time.
*   **AI Study Tools:**
    *   **BrainBite:** Micro-learning insights powered by AI.
    *   **AI Lesson Generator:** Dynamically creates targeted learning material.
    *   **AI Quiz Generator:** Edge Function powered by OpenRouter (gpt-4o-mini) to generate customized MCQs.
*   **Parent Dashboard:** Allows parents to monitor study time, progress, and performance.
*   **Automated Onboarding:** Supabase webhooks trigger `n8n` workflows the moment a student registers to instantly dispatch a personalized welcome email.

---

## 3. Technology Stack
*   **Frontend UI:** React 19 + Vite + TypeScript
*   **Styling & Components:** Tailwind CSS 4, Framer Motion (animations), Lucide React (icons)
*   **Routing:** React Router v6
*   **Backend & BaaS:** Supabase (Auth, PostgreSQL, Edge Functions, Storage)
*   **AI Orchestration:** LangChain.js
*   **AI Models:** OpenRouter API (gpt-4o-mini) for production inference; `text-embedding-3-large` (OpenAI) for embeddings. Local models (Llama 3, Mistral via Ollama/LM Studio) used during dev for cost optimization.
*   **Workflow Automation:** n8n (self-hosted) for webhooks and email logic (via Resend).
*   **Data Ingestion & Extraction:** Cheerio (web scraping NCTB site), `pdf-parse` for textbook reading.
*   **Visualization:** `react-force-graph-2d` for Knowledge Graph, `recharts` / `chart.js` for analytics.

---

## 4. Advanced Architecture: "Tri-Storage" System
The application abandons a standard monolithic database for specialized engines:
1.  **Relational Data (PostgreSQL / Supabase):** The core backend. Handles user authentication, strict Row Level Security (RLS) for tenant isolation, and stores granular learning telemetry.
2.  **Semantic Vector Storage (`pgvector`):** Educational PDFs are read, semantically chunked by paragraph, cryptographically deduplicated using SHA-256 hashes, and embedded using `text-embedding-3-large`. This supports rapid mathematical similarity searches (Vector RAG).
3.  **Knowledge Graph (Neo4j):** Models interconnected curriculum topics as graph nodes and edges. Enables complex multi-hop reasoning (GraphRAG).

**Agentic Workflow:** When a student queries the system, LangChain.js agents dynamically route the question between the vector database and the knowledge graph to synthesize the most accurate answer.

---

## 5. Data Pipeline & Lakehouse Scalability
*   **Data Acquisition:** A custom script uses `Cheerio` to dynamically scrape the official NCTB website to build syllabus hierarchies. Official NCTB PDFs are hosted on Supabase Storage.
*   **Lakehouse Export:** To prepare for massive scale, an automated GitHub Actions CRON script periodically dumps raw PostgreSQL telemetry into an **Apache Iceberg** format. This separates structured metadata snapshots from data partitions, allowing infinite horizontal scaling via S3 Data Lakes.
*   **Token Optimization:** Uses `TikToken` for pre-flight token estimation, sliding-window trimming, and prompt caching to aggressively reduce LLM inference costs.

---

## 6. Security, Validation & Trust (Responsible AI)
*   **No Hallucinations:** Outputs from the LLM are passed through strict runtime **Zod Schema Validation**. If the AI tries to output unstable formatting or non-educational responses, the system rejects it, ensuring frontend UI stability.
*   **Tenant Security:** Handled natively by Supabase PostgreSQL Row Level Security (RLS) policies.
*   **Build Provenance (MCP):** The development phase utilized a custom Node.js Model Context Protocol (MCP) server. Running over `stdio`, it exposed the live Supabase schema directly to the AI IDE (Cursor/DeepMind Agent). This gave the AI "build provenance" – the ability to inspect exact table structures without hallucinating DB logic.

---

## 7. Future Roadmap
1.  **Local Model Fine-Tuning:** Use the Apache Iceberg data lake exports to fine-tune open-weight models (Llama 3/Mistral) specifically on the syntax of the NCTB curriculum to drop cloud API costs.
2.  **Dynamic GraphRAG Evolution:** LangChain orchestration agent will automatically forge *new* semantic relationships (edges) in the Neo4j graph as students ask novel, cross-disciplinary questions. The system learns from the students.
3.  **Real-Time Peer Learning (Gamification):** Multiplayer challenges using Supabase Realtime WebSockets, allowing students to challenge peers to "conquer" specific nodes on the Knowledge Graph.
4.  **Edge-Deployed Offline Inference:** Compile quantized small language models (like Phi-3) into WebAssembly (Wasm) to allow offline inference directly inside the browser for rural students with poor internet connectivity.

---

## 8. Presentation "Vibe" / Pitch Angles
When speaking about HomeSchool, use these angles:
*   **The Mission:** We aren't just building an app; we are democratizing enterprise-grade, 1-on-1 tutoring for millions of students at scale.
*   **The Tech Edge:** Focus heavily on the "Tri-Storage" architecture (PostgreSQL + pgvector + Neo4j) and the "Lakehouse" telemetry export. It proves this is an enterprise-scale solution, not a toy app.
*   **The Speed:** Highlight that advanced Agentic IDEs (like Cursor / Antigravity) were used to build this highly resilient system rapidly, using spec-driven Agile loops (Plan -> Approve -> Execute -> Verify).
*   **The Safety:** Emphasize strict Zod validation and RLS. "We don't let AI guess; we mathematically validate its outputs before it ever touches the UI."
