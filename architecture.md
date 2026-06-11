# Architecture Overview: Home School

This document outlines the advanced, enterprise-grade architecture powering the personalized learning platform.

## 1. "Tri-Storage" Database Architecture
To support complex AI workflows, we abandoned the monolithic database approach in favor of specialized engines:
*   **Relational Data (PostgreSQL via Supabase):** Serves as the core backend, handling user authentication, strict Row Level Security (RLS), and granular learning telemetry.
*   **Semantic Vector Storage (`pgvector`):** Educational materials are semantically chunked by paragraph, cryptographically deduplicated using SHA-256 hashes, and embedded using `text-embedding-3-large` for rapid mathematical similarity searches.
*   **Knowledge Graph (Neo4j):** Interconnected curriculum topics are modeled as graph nodes and edges. This enables complex multi-hop reasoning (GraphRAG) and powers the interactive frontend `react-force-graph-2d` UI.

## 2. Agentic Workflow & Orchestration
*   **LangChain.js:** Orchestrates multi-step retrieval by dynamically routing user questions between the vector database and the knowledge graph using intelligent tool calling.
*   **Workflow Automation (n8n):** Decoupled transactional logic. Supabase database webhooks trigger local `n8n` workflows instantly upon user signup to parse payloads and dispatch personalized onboarding emails.
*   **GitHub Actions CRON:** A fully automated ingestion pipeline runs weekly to scrape fresh syllabus updates and sync vector data without human intervention.

## 3. Data Acquisition & Lakehouse Pipeline
*   **Public Web Scraping:** A highly optimized `Cheerio`-powered script scrapes the live NCTB curriculum website to dynamically generate syllabus hierarchies.
*   **Lakehouse Export (`Apache Iceberg`):** An automated pipeline dumps raw PostgreSQL telemetry into an Apache Iceberg format (separating data partitions from structured metadata snapshots) allowing for infinite horizontal scaling via S3 Data Lakes.

## 4. Build Provenance (Model Context Protocol)
*   **Custom MCP Server:** A custom-built Node.js server securely exposes the live Supabase PostgreSQL schema to AI IDEs (like Cursor or Claude Desktop) over `stdio`. This guarantees perfect "build provenance" by allowing the AI Agent to read exact table structures and vector dimensions, completely eliminating code hallucination during Edge Function development.

## 5. Security, Guardrails & Validation
*   **Zod Schema Validation:** Enforces strict runtime mathematical validation on all LLM outputs to ensure frontend UI stability.
*   **Row Level Security (RLS):** Enforced at the database level to guarantee complete tenant isolation and PII protection, even if the backend is compromised.
