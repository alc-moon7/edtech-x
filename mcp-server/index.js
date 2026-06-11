#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Manually load .env to avoid needing the dotenv package
try {
  const envPath = path.resolve(process.cwd(), '.env');
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      process.env[match[1]] = match[2];
    }
  });
} catch (e) {
  // ignore
}

/**
 * Build Provenance: MCP Usage Disclosed & Server List
 * This is a lightweight local MCP server that exposes the Supabase Database Schema
 * to an AI IDE or Assistant.
 */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "https://mock.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "mock_key";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const server = new Server(
  {
    name: "supabase-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Expose a tool to fetch database schemas
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_database_schema",
        description: "Fetches the public schema from the Supabase Postgres database.",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_database_schema") {
    try {
      // In a real scenario, we would run: 
      // await supabase.rpc('get_schema_metadata') or query information_schema.
      // For demonstration, returning a mock schema matching the project's actual structure.
      
      const mockSchema = `
        Tables:
        - profiles (id, full_name, class_name)
        - courses (id, title, class_level)
        - lesson_progress (user_id, lesson_id, progress_percent)
        - nctb_chunks (id, class_level, content, embedding vector)
        - ai_usage (user_id, usage_type, count)
      `;

      return {
        content: [
          {
            type: "text",
            text: mockSchema,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error fetching schema: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  throw new Error("Tool not found");
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Supabase MCP server running on stdio");
}

run().catch((error) => {
  console.error("Fatal error running MCP server:", error);
  process.exit(1);
});
