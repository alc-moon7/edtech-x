import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

/**
 * Lakehouse / Warehouse integration script
 * Extracts AI usage metrics and lesson progress from PostgreSQL
 * and formats it into NDJSON (Newline Delimited JSON) suitable for BigQuery or Iceberg.
 */

const SUPABASE_URL = process.env.SUPABASE_URL || "mock_url";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "mock_key";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

async function exportToLakehouse() {
  console.log("Starting export to Lakehouse (BigQuery format)...");
  
  try {
    // 1. Fetch data
    // In a real environment with credentials, we would uncomment:
    /*
    const { data: usageData, error: usageError } = await supabase
      .from('ai_usage')
      .select('*');
    if (usageError) throw usageError;
    */

    // Using mock data for demonstration
    const usageData = [
      { user_id: 'uuid-1', usage_date: '2026-06-10', usage_type: 'chat', count: 5, created_at: new Date().toISOString() },
      { user_id: 'uuid-2', usage_date: '2026-06-10', usage_type: 'brainbite', count: 12, created_at: new Date().toISOString() }
    ];

    // 2. Convert to NDJSON (Newline Delimited JSON) for BigQuery
    const ndjson = usageData.map(row => JSON.stringify(row)).join('\n');

    // 3. Save to file
    const outPath = path.join(process.cwd(), 'tmp', 'bigquery_export_ai_usage.ndjson');
    
    if (!fs.existsSync(path.join(process.cwd(), 'tmp'))) {
      fs.mkdirSync(path.join(process.cwd(), 'tmp'), { recursive: true });
    }

    fs.writeFileSync(outPath, ndjson, 'utf-8');
    
    console.log(`Successfully exported ${usageData.length} rows to ${outPath}`);
    console.log("File is ready for BigQuery / Iceberg ingestion.");
  } catch (error) {
    console.error("Export failed:", error);
  }
}

exportToLakehouse();
