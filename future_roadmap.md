# Future Roadmap: Home School

The current architecture establishes a highly robust foundation. The following phases outline the strategic roadmap for scaling the platform's AI capabilities and user reach.

## Phase 1: Local Model Fine-Tuning
*   **Objective:** Eliminate cloud API dependencies for core RAG workloads to drastically reduce inference latency and operational costs.
*   **Action:** Utilize our automated `Apache Iceberg` Data Lakehouse exports to train and fine-tune open-weight models (like Llama 3 or Mistral). We will fine-tune these models specifically on the syntax of the NCTB curriculum and the historical telemetry of our student interactions.

## Phase 2: Dynamic GraphRAG Evolution
*   **Objective:** Transform the Neo4j Knowledge Graph from a static curriculum map into an evolving, living network.
*   **Action:** Implement dynamic node and edge creation. As students ask complex, cross-disciplinary questions, the LangChain orchestration agent will automatically forge new semantic relationships (edges) in the graph, allowing the system to "learn" and become smarter from student curiosity.

## Phase 3: Gamification & Real-Time Peer Learning
*   **Objective:** Increase student engagement and long-term retention.
*   **Action:** Introduce multiplayer, realtime curriculum challenges backed by Supabase Realtime WebSocket streams. Students will be able to challenge peers to "conquer" specific nodes on the Knowledge Graph, turning learning into a collaborative social experience.

## Phase 4: Edge-Deployed Offline Inference
*   **Objective:** Expand accessibility to rural areas in Bangladesh with poor or intermittent internet connectivity.
*   **Action:** Compile quantized small language models (like Phi-3 or Qwen-1.5B) into WebAssembly (Wasm). This will allow full offline inference directly inside the student's local browser, utilizing the browser's Cache API to store vector embeddings locally.
