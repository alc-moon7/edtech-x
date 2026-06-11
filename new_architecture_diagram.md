# Modern Home School Architecture

Here is the updated architectural diagram that reflects the massive upgrades we built today. 

*Note: This is written in **Mermaid**, a modern diagramming language. You can copy the code block below and paste it directly into [mermaid.live](https://mermaid.live/) to instantly generate a beautiful, downloadable PNG/SVG image for your presentation. It also renders automatically if you upload this file to GitHub!*

```mermaid
graph TD
    %% Styling Colors
    classDef client fill:#2d3748,stroke:#4a5568,color:#fff,stroke-width:2px;
    classDef orchestrator fill:#3182ce,stroke:#2b6cb0,color:#fff,stroke-width:2px;
    classDef storage fill:#38a169,stroke:#2f855a,color:#fff,stroke-width:2px;
    classDef automation fill:#d69e2e,stroke:#b7791f,color:#fff,stroke-width:2px;
    classDef data fill:#805ad5,stroke:#6b46c1,color:#fff,stroke-width:2px;
    classDef dev fill:#e53e3e,stroke:#c53030,color:#fff,stroke-width:2px;

    %% 1. Client Layer
    subgraph Client ["🖥️ Client Layer (Vite + React)"]
        UI[Student/Parent Dashboard]
        GraphUI[Knowledge Graph UI<br/>react-force-graph]
    end
    class UI,GraphUI client;

    %% 2. Orchestration Layer
    subgraph Orchestration ["🧠 Agentic Edge Layer"]
        LangChain[LangChain Orchestrator<br/>GPT-4o-mini / Llama 3]
        Zod[Zod Schema Validator<br/>Hallucination Guard]
    end
    class LangChain,Zod orchestrator;

    %% 3. Tri-Storage Database Layer
    subgraph Storage ["💾 Tri-Storage Architecture"]
        PG[(PostgreSQL<br/>Telemetry & RLS)]
        Vec[(pgvector<br/>Semantic Embeddings)]
        Neo[(Neo4j GraphDB<br/>Curriculum Nodes)]
    end
    class PG,Vec,Neo storage;

    %% 4. Data Acquisition
    subgraph Pipeline ["📥 Data Ingestion Pipeline (GitHub CRON)"]
        Cheerio[Cheerio Web Scraper<br/>Live NCTB Web]
        PDF[PDF Parsing &<br/>Semantic Chunking]
        Hash[SHA-256 Crypto<br/>Deduplication]
    end
    class Cheerio,PDF,Hash data;

    %% 5. Automation & Lakehouse
    subgraph Automation ["⚙️ Automation & Analytics"]
        n8n[n8n Workflow<br/>Welcome Emails]
        Iceberg[Apache Iceberg<br/>Data Lakehouse Export]
    end
    class n8n,Iceberg automation;

    %% 6. Dev Tools
    subgraph DevTools ["🛠️ Build Provenance"]
        MCP[MCP Server<br/>stdio]
        IDE[AI IDE / Cursor<br/>Agent]
    end
    class MCP,IDE dev;

    %% --- Connections ---
    
    %% User to Edge
    UI <-->|Student Queries| LangChain
    GraphUI <-->|Visualize Nodes| Neo
    
    %% Edge to Storage
    LangChain -->|Validates Output| Zod
    LangChain <-->|Reads/Writes Progress| PG
    LangChain <-->|Semantic Search| Vec
    LangChain <-->|GraphRAG Reasoning| Neo
    
    %% Ingestion Flow
    Cheerio --> PDF
    PDF --> Hash
    Hash -->|Inserts Chunks| Vec
    Hash -->|Creates Nodes/Edges| Neo
    
    %% Webhook Flow
    PG -.->|Database Webhook<br/>Triggered on Insert| n8n
    
    %% Analytics Flow
    PG -.->|CRON Export Script| Iceberg
    
    %% Developer Flow
    PG -.->|Reads Schema| MCP
    MCP <-->|get_database_schema| IDE
```
