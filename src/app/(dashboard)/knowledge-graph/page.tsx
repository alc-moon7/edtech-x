import { useEffect, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { motion } from "framer-motion";

export default function KnowledgeGraphPage() {
  const [data, setData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    // Generate graph data representing Subject -> Course -> Chapter mapping
    // In production, this would fetch from Neo4j or Supabase
    const gData: any = {
      nodes: [
        { id: 'math', name: 'Mathematics', group: 1, val: 5 },
        { id: 'sci', name: 'Science', group: 1, val: 5 },
        { id: 'm_c1', name: 'Algebra', group: 2, val: 3 },
        { id: 'm_c2', name: 'Geometry', group: 2, val: 3 },
        { id: 's_c1', name: 'Physics', group: 2, val: 3 },
        { id: 's_c2', name: 'Biology', group: 2, val: 3 },
        { id: 'm_l1', name: 'Linear Equations', group: 3, val: 1 },
        { id: 'm_l2', name: 'Triangles', group: 3, val: 1 },
        { id: 's_l1', name: 'Motion', group: 3, val: 1 },
        { id: 's_l2', name: 'Cells', group: 3, val: 1 },
      ],
      links: [
        { source: 'math', target: 'm_c1' },
        { source: 'math', target: 'm_c2' },
        { source: 'sci', target: 's_c1' },
        { source: 'sci', target: 's_c2' },
        { source: 'm_c1', target: 'm_l1' },
        { source: 'm_c2', target: 'm_l2' },
        { source: 's_c1', target: 's_l1' },
        { source: 's_c2', target: 's_l2' },
      ]
    };
    setData(gData);
  }, []);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">NCTB Knowledge Graph</h2>
          <p className="text-muted-foreground mt-1">Explore relationships between subjects, chapters, and topics using our integrated Graph Database.</p>
        </div>
      </div>
      <motion.div 
        className="rounded-xl border bg-card text-card-foreground shadow h-[600px] overflow-hidden flex items-center justify-center bg-muted/10 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute top-4 left-4 z-10 bg-background/80 p-2 rounded-md border text-xs text-muted-foreground backdrop-blur-sm">
          Powered by Neo4j & GraphRAG
        </div>
        {typeof window !== 'undefined' && data.nodes.length > 0 ? (
           <ForceGraph2D
              graphData={data}
              nodeLabel="name"
              nodeAutoColorBy="group"
              linkDirectionalParticles={2}
              linkDirectionalParticleSpeed={d => Math.random() * 0.01 + 0.005}
              width={typeof window !== 'undefined' ? window.innerWidth - 300 : 800}
              height={600}
            />
        ) : (
          <p>Loading Knowledge Graph...</p>
        )}
      </motion.div>
    </div>
  );
}
