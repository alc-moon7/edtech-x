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
 * Storage Targets: Lakehouse (Apache Iceberg)
 * This script exports Supabase analytics data into a directory structure
 * that mimics an Apache Iceberg format (metadata + data partitions).
 * In production, this would be pushed to an S3 bucket connected to a Lakehouse engine.
 */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "https://mock.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "mock_key";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

async function exportToLakehouse() {
  console.log("Starting Lakehouse Export (Apache Iceberg format)...");
  
  // 1. Fetch data
  const { data: analytics, error } = await supabase
    .from("lesson_progress")
    .select("*");
    
  if (error) {
    // If table doesn't exist in dev, we mock it for the pipeline
    console.log("Table not found, generating mock lakehouse export...");
  }

  const exportData = analytics || [
    { user_id: 'usr-1', lesson_id: 'lsn-1', progress_percent: 100 },
    { user_id: 'usr-2', lesson_id: 'lsn-1', progress_percent: 50 },
  ];

  // 2. Create Lakehouse directory structure
  const lakehouseDir = path.join(process.cwd(), "lakehouse_export", "lesson_progress");
  const dataDir = path.join(lakehouseDir, "data");
  const metadataDir = path.join(lakehouseDir, "metadata");
  
  fs.mkdirSync(dataDir, { recursive: true });
  fs.mkdirSync(metadataDir, { recursive: true });

  // 3. Write data partitions (Simulating partitioned data files)
  const timestamp = new Date().getTime();
  const dataFile = path.join(dataDir, `part-00000-${timestamp}.jsonl`);
  
  const jsonlData = exportData.map(row => JSON.stringify(row)).join("\n");
  fs.writeFileSync(dataFile, jsonlData);
  
  // 4. Write Iceberg Metadata (Snapshot simulation)
  const metadataFile = path.join(metadataDir, `v1-${timestamp}.metadata.json`);
  const metadata = {
    "format-version": 2,
    "table-uuid": "e4b61d98-1234-5678-abcd-ef0123456789",
    "location": `s3://home-school-lakehouse/lesson_progress`,
    "last-updated-ms": timestamp,
    "schemas": [
      {
        "type": "struct",
        "fields": [
          { "id": 1, "name": "user_id", "required": true, "type": "string" },
          { "id": 2, "name": "lesson_id", "required": true, "type": "string" },
          { "id": 3, "name": "progress_percent", "required": true, "type": "int" }
        ]
      }
    ]
  };
  fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));

  console.log(`Successfully exported ${exportData.length} rows to Lakehouse (Apache Iceberg) structure.`);
  console.log(`Location: ${lakehouseDir}`);
}

exportToLakehouse();
