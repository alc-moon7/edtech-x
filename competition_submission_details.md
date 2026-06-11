# Competition Submission Details & Technical Architecture

This document contains all the exact answers, technical justifications, and architectural decisions submitted for the competition. You can use this as a searchable reference if the judges ask any questions about the platform's build provenance, AI usage, or architecture.

---

## 1. Publish Local Environment to Internet
**Checkboxes Selected:**
- GitHub Codespaces port forwarding
- ngrok

**Usage Notes:**
> "Used **ngrok** to create a secure HTTP tunnel exposing our local `n8n` instance to the internet during development. This was strictly required so that Supabase database webhooks (triggered by new user signups) could successfully reach our local n8n workflow to test the automated welcome email pipelines. **GitHub Codespaces port forwarding** was utilized to temporarily expose the Vite/React dev server, allowing teammates and stakeholders to test the UI and provide rapid feedback during the build process."

---

## 2. Storage Targets
**Checkboxes Selected:**
- Relational (Postgres, MySQL)
- Vector DB (pgvector, Pinecone, Weaviate)
- Data Warehouse (BigQuery, Snowflake, DuckDB)
- Graph DB (Neo4j, ArangoDB)
- Lakehouse (Delta, Iceberg, Hudi)
- Object Storage (S3, R2, GCS)

**Technical Details:**
> "Core relational schema in PostgreSQL with Row Level Security (RLS) for strict tenant isolation. Specialized vector(1536) columns with HNSW/IVFFlat indexes for fast semantic search. Relational data is periodically synced to a Neo4j Knowledge Graph, creating a dual-storage architecture (Relational + Graph + Vector) to support advanced GraphRAG. We also maintain an active script that periodically dumps Postgres analytics into an Apache Iceberg format (separating structured metadata snapshots from data partitions) for scalable Lakehouse intake via S3."

---

## 3. Data Sources
**Checkboxes Selected:**
- Internal (own DB / app data)
- External APIs (paid/free)
- Public Web (scraping)
- Synthetic / AI-generated Data
- Open Datasets (Kaggle, HF, gov)

**List specific sources:**
> "Our data is sourced from multiple origins to create a robust educational platform: 1) Internal PostgreSQL database capturing user progress, telemetry, and study analytics. 2) Public Web scraping using Cheerio targeting the official NCTB syllabus site for curriculum structure. 3) External APIs including OpenRouter and OpenAI to generate synthetic AI quiz data, dynamic lesson plans, and vector embeddings. 4) Open Government Datasets consisting of raw NCTB educational PDFs hosted on Supabase Storage."

---

## 4. Token Optimization Tools & Methods
**Checkboxes Selected:**
- OpenAI Prompt Caching
- Semantic chunk dedup
- Sliding-window / context trimming
- Structured outputs / JSON mode
- Request batching

**Additional Tool:**
> TikToken (Pre-flight token estimation and clipping)

---

## 5. Local / On-device LLMs
**Runtimes Checked:**
- Ollama
- LM Studio

**Models Checked:**
- Llama 3 / 3.1 / 3.2
- Mistral / Mixtral
- Qwen 2 / 2.5
- Gemma 2

**Usage Notes:**
> "Deployed on a local RTX 3060 12GB. Cloud services impose strict rate limits and token costs during heavy development. By routing our LangChain ingestion and RAG testing pipelines through local instances of Ollama and LM Studio (running Llama 3 and Mistral), we achieved zero-cost, unlimited-usage testing environments. This allowed us to aggressively experiment with chunking strategies and prompts without burning through API credits."

---

## 6. Retrieval & RAG
**Checkboxes Selected:**
- Vector Database (Pinecone, Weaviate, pgvector, etc.)
- Contextual RAG (Anthropic-style, +context per chunk)
- Variable / Semantic Chunking
- Graph RAG
- Knowledge Graph / Other Graph Methods
- Agentic RAG / Multi-step Retrieval

**RAG Architecture Details:**
> "Supabase pgvector utilizing `text-embedding-3-large`. Semantic chunking by paragraph (via `pdf-parse`) with document title/class context prepended to every chunk before embedding. LangChain orchestrates Agentic RAG, routing complex curriculum queries between the vector store and our Neo4j Knowledge Graph."

---

## 7. MCP (Model Context Protocol) Usage
**MCP Servers Built & Used:**
- **Server Name:** `Supabase Schema Inspector`
- **# Endpoints / Tools:** `1` (`get_database_schema`)
- **Transport:** `stdio`
- **Language / SDK:** `Node.js / @modelcontextprotocol/sdk`
- **Reused across multiple projects:** Yes

**Reuse, architecture & integration notes:**
> "We built a monolithic Node.js MCP server that connects directly to our Supabase PostgreSQL instance via the `@supabase/supabase-js` client. It runs locally over `stdio` transport, allowing our AI IDE (Cursor/Claude Desktop/Custom Agent) to seamlessly inspect our database tables, `pgvector` columns, and relational structures without needing external API credentials to be hardcoded."

**Where else is this server used:**
> "This schema-inspector MCP server is completely decoupled from the main application repository. It is designed as a universal utility that can be dropped into any Supabase project we build in the future. We currently reuse it across multiple local agentic workflows (Cursor, Claude Desktop, and our own custom CLI agents) to guarantee strict schema alignment whenever we develop new AI-powered Edge Functions."

**Permissions:**
> "The `get_database_schema` tool is granted READ-ONLY access specifically to the `information_schema.tables` and `information_schema.columns` within PostgreSQL. It does not have permission to read actual user row data, and it is structurally incapable of executing INSERT, UPDATE, or DELETE commands, ensuring zero-trust data safety during agentic exploration."

---

## 8. Open Source Tools & Libraries
**Usage Notes:**
> - **LangChain.js:** Core agentic orchestration and RAG routing.
> - **Cheerio:** Fast HTML web scraping for curriculum acquisition.
> - **TikToken:** Local pre-flight token optimization and clipping to drastically reduce inference costs.
> - **react-force-graph-2d:** Physics-based 2D network visualization for the Knowledge Graph UI.
> - **Zod:** Strict runtime schema validation utilized during the data ingestion pipeline.

---

## 9. Frontend AI / Visual App Builders
**Checkboxes Selected:**
- Gemini Canvas
- Claude Artifacts

**Usage Notes:**
> "We utilized an advanced Agentic IDE to autonomously generate complex React components, such as the physics-based Knowledge Graph (`react-force-graph`) and the interactive Student Dashboard. The AI utilized Canvas/Artifacts to present implementation plans and markdown documentation before directly executing code into our Vite workspace. Approximately 90% of the complex UI logic and state management was AI-built."

---

## 10. Workflow Automation
**Checkboxes Selected:**
- n8n (self-hosted workflow automation)

**Usage Notes:**
> "We heavily integrated n8n to automate our transactional communication pipelines. Specifically, Supabase Database Webhooks act as the trigger, firing a payload to our n8n instance whenever a new user profile is inserted into PostgreSQL. The n8n workflow parses the JSON payload and automatically dispatches a personalized onboarding email to the student."

---

## 11. Agentic Frameworks Used
**Checkboxes Selected:**
- LangGraph — graph-based agent orchestration
- Added manually: LangChain.js

---

## 12. AI Development Lifecycle (AI-DLC)
**Checkboxes Selected:**
- Cursor Rules + PRD workflow
- Cline Memory Bank
- Added manually: Antigravity Agentic IDE (DeepMind)

**Process Notes:**
> "We strictly adhered to a Spec-Driven Agentic Agile lifecycle. Process: 1) The AI Agent performed deep codebase research. 2) The Agent generated an `implementation_plan.md` artifact (acting as our PRD) with explicit human review gates. 3) Upon human approval, the Agent autonomously executed the code while tracking granular progress in a `task.md` checklist. 4) Final verification was documented in a `walkthrough.md` artifact. Global project context was continuously persisted across sessions via a Memory Bank pattern (`memory.md`)."

---

## 13. Build Provenance (Transparency & Auditability)
**Data Sources:**
> "1) Internal telemetry and user analytics stored in PostgreSQL. 2) Public web scraping via Cheerio targeting the official NCTB curriculum syllabus. 3) Open educational datasets (NCTB textbooks in PDF format) hosted on Supabase Storage. 4) Synthetic data generation via LLMs for dynamic quizzes. All ingested vector chunks are deduplicated using cryptographic hashing (SHA-256) to maintain a clean, auditable data lineage."

**AI Models:**
> "OpenRouter is used as our primary inference gateway, routing to models like `gpt-4o-mini` for fast RAG tasks. `text-embedding-3-large` via OpenAI is used exclusively for generating 1536-dimensional vector embeddings. During development, open-weight models like `Llama-3` and `Mistral` were tested locally via Ollama and LM Studio for zero-cost, private pipeline validation."

**Responsible AI:**
> "We enforce strict Row Level Security (RLS) policies at the PostgreSQL database level to guarantee complete tenant isolation and PII protection. Our Edge Function system prompts contain rigid refusal patterns to mitigate hallucinations and block out-of-scope (non-educational) jailbreak attempts. Finally, we utilize `zod` for strict runtime schema validation, ensuring all LLM outputs mathematically conform to our expected UI structures before they reach the user."

---

## 14. Final Closing Statement
**Anything else about your AI usage?**
> "By treating the AI not just as a code autocomplete tool, but as an autonomous Agentic Architect, we accomplished a staggering amount of complex engineering in a fraction of the time. The AI autonomously designed our 'Tri-Storage' database architecture (Relational + Vector + Graph), implemented real-time WebSocket DOM streams, wrote robust background data ingestion pipelines, and seamlessly integrated complex front-end UI engines like `react-force-graph`. This project stands as a testament to the fact that strict, Spec-Driven AI workflows can output highly resilient, production-grade enterprise architectures."