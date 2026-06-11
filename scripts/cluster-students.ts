import { createClient } from "@supabase/supabase-js";

/**
 * ML / Analytics Methods: K-Means Clustering Simulation
 * Groups students into performance clusters (e.g., 'At Risk', 'On Track', 'Excelling')
 * based on their lesson progress and quiz scores.
 */

const SUPABASE_URL = process.env.SUPABASE_URL || "mock_url";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "mock_key";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// Simple Euclidean distance function
function distance(p1: number[], p2: number[]) {
  return Math.sqrt(p1.reduce((sum, val, i) => sum + Math.pow(val - p2[i], 2), 0));
}

async function clusterStudents() {
  console.log("Running K-Means Student Clustering...");

  // Mock data representing [progress_percent, average_quiz_score]
  const students = [
    { id: 'u1', features: [10, 45] }, // Low progress, low score
    { id: 'u2', features: [20, 50] }, // Low progress, low score
    { id: 'u3', features: [80, 95] }, // High progress, high score
    { id: 'u4', features: [90, 88] }, // High progress, high score
    { id: 'u5', features: [50, 70] }, // Medium progress, medium score
  ];

  // K-means (K=3)
  const k = 3;
  let centroids = [
    [15, 45], // Cluster 0: At Risk
    [50, 70], // Cluster 1: On Track
    [85, 90]  // Cluster 2: Excelling
  ];

  const assignments: number[] = new Array(students.length).fill(0);

  // 1 iteration for demo purposes
  for (let s = 0; s < students.length; s++) {
    let min_dist = Infinity;
    let best_cluster = 0;
    
    for (let c = 0; c < k; c++) {
      const dist = distance(students[s].features, centroids[c]);
      if (dist < min_dist) {
        min_dist = dist;
        best_cluster = c;
      }
    }
    assignments[s] = best_cluster;
  }

  const clusterNames = ['At Risk', 'On Track', 'Excelling'];
  
  console.log("Clustering Results:");
  students.forEach((student, idx) => {
    console.log(`Student ${student.id} assigned to ${clusterNames[assignments[idx]]}`);
  });
}

clusterStudents();
