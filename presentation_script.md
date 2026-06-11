# Vibe to Production in 180 Seconds: Presentation Script

*Instructions: Read this at a steady, confident pace. Practice it a few times with a stopwatch to ensure you hit the time markers perfectly. Bracketed text `[like this]` are visual cues for what to show on screen.*

---

### [0:00 - 0:30] Problem (The Vibe)
**[Visual: Title slide or a striking image of a crowded classroom]**

"Hello everyone. In Bangladesh, millions of students rely on the national NCTB curriculum to shape their futures. However, our education system—and the global system at large—faces a massive, urgent problem: a complete lack of personalization. Every student learns at a different pace, yet they are forced into a rigid, one-size-fits-all model. Because 1-on-1 tutoring is expensive and inaccessible, countless bright students fall behind simply because the material didn't adapt to them. This problem matters, and it demands a modern solution."

### [0:30 - 1:00] Solution
**[Visual: High-level architectural diagram or the sleek Home School logo]**

"That is why we built 'Home School'. It is an AI-driven, hyper-personalized learning platform that dynamically adapts to the individual student. Unlike standard e-learning apps that just host static videos, our platform actively analyzes a student's progress and uses Agentic AI to generate custom quizzes and answer questions strictly based on the official curriculum. We differentiate ourselves by turning passive reading into an interactive, visual journey through knowledge."

### [1:00 - 2:00] Demo / Concept Flow
**[Visual: Screen recording or live demo of the app]**

"Let me show you how it works. When a student logs in, they are greeted by their responsive dashboard showing real-time progress synced directly from our database. **[Show Knowledge Graph]** But here is where it gets exciting: our physics-based 2D Knowledge Graph. Students can visually drag and explore how different textbook topics interconnect in real-time. **[Show Chat or Email]** If a student is struggling, our AI tutor acts as a safety net. And behind the scenes, we have completely automated the administrative flow—using n8n workflows, the exact second a student registers, they are automatically dispatched a personalized onboarding email to kickstart their learning."

### [2:00 - 2:30] AI Approach
**[Visual: Slide highlighting pgvector, Neo4j, LangChain, and Zod logos]**

"This is powered by true, enterprise-grade AI architecture. We don't just use a simple database; we use a 'Tri-Storage' system: PostgreSQL for user telemetry, `pgvector` for semantic search, and Neo4j for GraphRAG. We ingest raw educational PDFs using intelligent semantic chunking and cryptographic deduplication. When a student asks a question, our LangChain Agents dynamically route the query to models like GPT-4o-mini or local Llama 3, while strictly enforcing output validation via `zod` to completely eliminate AI hallucinations."

### [2:30 - 3:00] Impact & Next Step
**[Visual: Final slide with "What's Next" and a strong call to action]**

"The impact of this architecture is profound: we are providing democratized, enterprise-grade, 1-on-1 tutoring for any student, entirely at scale. By exposing our schema via a custom Model Context Protocol (MCP) server and utilizing an Apache Iceberg Lakehouse for analytics, our infrastructure is infinitely scalable. Our next step is to use this telemetry lake to fine-tune our own localized educational models. We aren't just building an app; we have built the infrastructure to modernize education. Thank you."
