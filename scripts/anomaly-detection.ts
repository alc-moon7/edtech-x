import { createClient } from "@supabase/supabase-js";

/**
 * Insights: Anomaly Detection
 * This script analyzes student study sessions to detect anomalous behavior,
 * such as a sudden drop in engagement or impossibly fast lesson completions.
 */

const SUPABASE_URL = process.env.SUPABASE_URL || "mock_url";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "mock_key";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// Helper function to calculate Z-Score for anomaly detection
function calculateZScore(value: number, mean: number, stdDev: number) {
  if (stdDev === 0) return 0;
  return (value - mean) / stdDev;
}

async function detectAnomalies() {
  console.log("Running Anomaly Detection on Student Engagement...");

  // Mock data representing a student's weekly study hours over a 6-week period
  const studentData = [
    { studentId: 'stu-1', history: [12, 11, 13, 12, 10, 0] },  // Anomaly: Sudden drop to 0
    { studentId: 'stu-2', history: [5, 6, 5, 4, 6, 5] },       // Normal behavior
    { studentId: 'stu-3', history: [2, 3, 2, 3, 2, 45] },      // Anomaly: Sudden spike
  ];

  studentData.forEach((student) => {
    // We analyze the first 5 weeks to build our baseline, then check the 6th week (current)
    const baseline = student.history.slice(0, 5);
    const currentWeek = student.history[5];

    // Calculate Mean
    const mean = baseline.reduce((sum, val) => sum + val, 0) / baseline.length;

    // Calculate Standard Deviation
    const variance = baseline.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / baseline.length;
    const stdDev = Math.sqrt(variance);

    // Calculate Z-Score for the current week
    // A Z-Score > 2.5 or < -2.5 is typically considered an anomaly
    const zScore = calculateZScore(currentWeek, mean, stdDev);

    if (zScore > 2.5) {
      console.warn(`[ANOMALY DETECTED] Student ${student.studentId}: Unusually high engagement spike (Z-Score: ${zScore.toFixed(2)}). Potential bot or shared account.`);
    } else if (zScore < -2.5) {
      console.warn(`[ANOMALY DETECTED] Student ${student.studentId}: Severe engagement drop-off (Z-Score: ${zScore.toFixed(2)}). At risk of churning.`);
    } else {
      console.log(`[NORMAL] Student ${student.studentId}: Engagement is stable.`);
    }
  });
}

detectAnomalies();
