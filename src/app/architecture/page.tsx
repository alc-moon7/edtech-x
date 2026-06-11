import { MarketingShell } from "@/components/MarketingShell";
import { ArrowRight, ArrowDown, ArrowLeft, Users, Target, Search, BrainCircuit, LayoutDashboard, Settings2, CheckCircle, Database, Sparkles, Layers, Zap, ShieldAlert, Cpu, Share2, ArrowUpLeft } from "lucide-react";

export default function ArchitecturePage() {
  return (
    <MarketingShell>
      <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 font-sans overflow-x-auto flex justify-center items-start">
        
        {/* Landscape Canvas - Wide enough to prevent overlapping */}
        <div className="relative w-[1300px] bg-slate-50 border border-slate-700 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] shrink-0 overflow-hidden font-sans pb-12">
          
          {/* Header Banner */}
          <div className="w-full h-24 bg-gradient-to-r from-[#0f172a] via-[#1e3a8a] to-[#312e81] flex items-center px-10 justify-between shadow-lg relative z-20">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 p-3 rounded-xl border border-white/20 backdrop-blur-sm">
                <Cpu className="w-8 h-8 text-blue-300" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white tracking-widest uppercase">AI & System Architecture Workflow</h1>
                <p className="text-blue-200 text-sm font-medium tracking-wide mt-1">CURRICULUM-ALIGNED, PERSONALIZED LEARNING SYSTEM</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-black/30 px-5 py-2.5 rounded-full border border-white/10 shadow-inner">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white text-sm font-bold uppercase tracking-wider">Live System Mapping</span>
            </div>
          </div>

          {/* Main Diagram Area */}
          <div className="px-12 pt-12 flex flex-col gap-6 relative z-10">
            
            {/* ROW 1: The Core Flow */}
            <div className="flex items-center justify-between w-full">
              
              {/* Box 1: User Input */}
              <div className="w-[220px] bg-white border border-slate-300 rounded-2xl shadow-md overflow-hidden relative shrink-0">
                <div className="h-2 w-full bg-slate-600 absolute top-0 left-0" />
                <div className="p-4 text-center border-b border-slate-100 bg-slate-50">
                  <div className="w-12 h-12 bg-white rounded-full mx-auto flex items-center justify-center mb-2 text-slate-600 border border-slate-200 shadow-sm">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-slate-800 text-sm">User Input & Profile</h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-2">
                    <span className="text-lg">🧑‍🎓</span> Student / Parent
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-2">
                    <span className="text-blue-500"><Sparkles className="w-4 h-4"/></span> Text, Voice, Quiz
                  </div>
                  <div className="bg-slate-200 h-px w-full my-2" />
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1 text-center">Learner Profile</p>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-bold border border-slate-200">Class</span>
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-bold border border-slate-200">Metrics</span>
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-bold border border-slate-200">Preferences</span>
                  </div>
                </div>
              </div>

              {/* Arrow 1 */}
              <div className="flex items-center justify-center shrink-0">
                <ArrowRight className="text-slate-400 w-8 h-8" />
              </div>

              {/* Box 2: Intent Analysis */}
              <div className="w-[220px] bg-white border border-indigo-200 rounded-2xl shadow-md overflow-hidden relative shrink-0">
                <div className="h-2 w-full bg-indigo-500 absolute top-0 left-0" />
                <div className="p-4 text-center border-b border-indigo-50 bg-indigo-50/50">
                  <div className="w-12 h-12 bg-white rounded-full mx-auto flex items-center justify-center mb-2 text-indigo-600 border border-indigo-200 shadow-sm">
                    <Target className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-slate-800 text-sm">Intent Analysis</h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="bg-indigo-50 p-2.5 rounded-lg border border-indigo-100 text-xs font-bold text-indigo-900 flex items-center gap-2">
                    <span className="text-lg">🎯</span> Learning Goals
                  </div>
                  <div className="bg-indigo-50 p-2.5 rounded-lg border border-indigo-100 text-xs font-bold text-indigo-900 flex items-center gap-2">
                    <span className="text-lg">⚖️</span> Strengths Map
                  </div>
                </div>
              </div>

              {/* Arrow 2 */}
              <div className="flex items-center justify-center shrink-0">
                <ArrowRight className="text-indigo-400 w-8 h-8" />
              </div>

              {/* Box 3: Curriculum RAG */}
              <div className="w-[230px] bg-white border border-amber-300 rounded-2xl shadow-lg overflow-hidden relative shrink-0">
                <div className="h-2 w-full bg-amber-500 absolute top-0 left-0" />
                <div className="p-4 text-center border-b border-amber-100 bg-amber-50">
                  <div className="w-12 h-12 bg-white rounded-full mx-auto flex items-center justify-center mb-2 text-amber-600 border border-amber-300 shadow-sm">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-amber-900 text-sm tracking-tight">Curriculum Retrieval</h3>
                  <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mt-1">Tri-Storage RAG</p>
                </div>
                <div className="p-4 space-y-2.5">
                  <div className="bg-blue-50 p-2 rounded-lg border border-blue-200 text-xs font-bold text-blue-900 flex items-center gap-2">
                    <div className="bg-blue-600 text-white p-1.5 rounded-md"><Database className="w-4 h-4"/></div>
                    PostgreSQL
                  </div>
                  <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-2">
                    <div className="bg-emerald-600 text-white p-1.5 rounded-md"><Layers className="w-4 h-4"/></div>
                    pgvector
                  </div>
                  <div className="bg-purple-50 p-2 rounded-lg border border-purple-200 text-xs font-bold text-purple-900 flex items-center gap-2">
                    <div className="bg-purple-600 text-white p-1.5 rounded-md"><Share2 className="w-4 h-4"/></div>
                    Neo4j Graph
                  </div>
                </div>
              </div>

              {/* Arrow 3 */}
              <div className="flex items-center justify-center shrink-0">
                <ArrowRight className="text-amber-500 w-8 h-8 scale-110" />
              </div>

              {/* Box 4: Agent Layer */}
              <div className="w-[240px] bg-blue-50 border-2 border-blue-500 rounded-2xl shadow-xl overflow-hidden relative shrink-0">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-400 rounded-bl-full opacity-20 blur-xl pointer-events-none" />
                <div className="h-2 w-full bg-blue-600 absolute top-0 left-0" />
                <div className="p-4 text-center border-b border-blue-200 bg-gradient-to-b from-blue-100 to-blue-50">
                  <div className="w-14 h-14 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-2 text-white shadow-lg shadow-blue-500/40">
                    <BrainCircuit className="w-8 h-8" />
                  </div>
                  <h3 className="font-black text-blue-900 text-[15px]">AI Agent Layer</h3>
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">LangChain Core</p>
                </div>
                <div className="p-4 bg-white space-y-2.5 relative z-10">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 flex justify-between items-center">
                    <span>Retrieval Agent</span> <span className="bg-blue-100 text-blue-600 p-1.5 rounded-md"><Database className="w-4 h-4"/></span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 flex justify-between items-center">
                    <span>GPT-4o / Llama 3</span> <span className="bg-indigo-100 text-indigo-600 p-1.5 rounded-md"><Zap className="w-4 h-4"/></span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 flex justify-between items-center">
                    <span>Zod Guardrails</span> <span className="bg-rose-100 text-rose-600 p-1.5 rounded-md"><ShieldAlert className="w-4 h-4"/></span>
                  </div>
                </div>
              </div>

              {/* Arrow 4 */}
              <div className="flex items-center justify-center shrink-0">
                <ArrowRight className="text-blue-500 w-8 h-8 scale-110" />
              </div>

              {/* Box 5: Dashboard */}
              <div className="w-[220px] bg-white border border-orange-300 rounded-2xl shadow-lg overflow-hidden relative shrink-0">
                <div className="h-2 w-full bg-orange-500 absolute top-0 left-0" />
                <div className="p-4 text-center border-b border-orange-100 bg-orange-50">
                  <div className="w-12 h-12 bg-white rounded-full mx-auto flex items-center justify-center mb-2 text-orange-600 border border-orange-300 shadow-sm">
                    <LayoutDashboard className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-orange-900 text-sm">Progress & UI</h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="bg-orange-50 p-2.5 rounded-lg border border-orange-200 text-xs font-bold text-orange-900 flex items-center gap-2">
                    <span className="text-lg">📈</span> Dashboards
                  </div>
                  <div className="bg-orange-50 p-2.5 rounded-lg border border-orange-200 text-xs font-bold text-orange-900 flex items-center gap-2">
                    <span className="text-lg">🕸️</span> Force-Graph
                  </div>
                  <div className="bg-orange-50 p-2.5 rounded-lg border border-orange-200 text-xs font-bold text-orange-900 flex items-center gap-2">
                    <span className="text-lg">📊</span> Analytics
                  </div>
                </div>
              </div>

            </div>

            {/* ROW 2 Connections: Vertical Arrows connecting Top to Bottom */}
            <div className="relative h-12 w-full">
              {/* Arrow from Dashboard -> Assessment */}
              <div className="absolute right-[110px] top-0 flex flex-col items-center">
                <div className="h-8 w-1 border-l-4 border-dashed border-orange-400"></div>
                <ArrowDown className="text-orange-500 w-6 h-6 -mt-2" />
              </div>
              
              {/* Arrow from Agent -> Assessment */}
              <div className="absolute right-[370px] top-0 flex flex-col items-center">
                <div className="h-8 w-1 border-l-4 border-solid border-blue-500"></div>
                <ArrowDown className="text-blue-500 w-6 h-6 -mt-2" />
              </div>
            </div>

            {/* ROW 3: Bottom Logic & Data */}
            <div className="flex items-start justify-between w-full">
              
              {/* Left Side: Data & Learning Refinement */}
              <div className="w-[600px] bg-slate-800 border-4 border-slate-700 rounded-3xl shadow-2xl overflow-hidden relative shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-700 to-slate-900 opacity-80" />
                <div className="p-4 bg-slate-900 text-white flex items-center justify-center gap-3 relative z-10 border-b border-slate-700">
                  <Database className="w-6 h-6 text-slate-300" />
                  <h3 className="font-black tracking-widest uppercase text-sm">Data & Learning Refinement</h3>
                </div>
                <div className="p-6 relative z-10 flex flex-col gap-6">
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-300 rounded-2xl shadow-lg border border-slate-400 flex items-center justify-center text-3xl mb-2">💾</div>
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider text-center">Telemetry<br/>Storage</span>
                    </div>
                    <ArrowRight className="text-slate-500 w-6 h-6" />
                    
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-200 rounded-2xl shadow-lg border border-rose-300 flex items-center justify-center text-3xl mb-2">⚙️</div>
                      <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider text-center">n8n<br/>Automation</span>
                    </div>
                    <ArrowRight className="text-slate-500 w-6 h-6" />
                    
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-blue-200 rounded-2xl shadow-lg border border-cyan-300 flex items-center justify-center text-3xl mb-2">🧊</div>
                      <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider text-center">Iceberg<br/>Lakehouse</span>
                    </div>
                    <ArrowRight className="text-slate-500 w-6 h-6" />
                    
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-200 rounded-2xl shadow-lg border border-indigo-300 flex items-center justify-center text-3xl mb-2">🧠</div>
                      <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider text-center">Model<br/>Updates</span>
                    </div>
                  </div>

                  <div className="bg-slate-900 text-emerald-400 text-xs font-black py-2.5 px-4 rounded-full uppercase tracking-[0.2em] text-center w-full max-w-[400px] mx-auto border border-emerald-900/80 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    🔄 Continuous Optimization Loop
                  </div>

                </div>
              </div>

              {/* Middle Arrow connecting Assessment -> Data */}
              <div className="flex flex-col items-center justify-center px-4">
                 <ArrowLeft className="text-slate-400 w-8 h-8 mb-1" />
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Feedback<br/>Loop</span>
              </div>

              {/* Right Side: Assessment & Adaptive Logic */}
              <div className="flex gap-4 shrink-0">
                
                {/* Adaptive Logic */}
                <div className="w-[200px] bg-white border border-emerald-400 rounded-2xl shadow-lg overflow-hidden relative z-10 shrink-0">
                  <div className="h-2 w-full bg-emerald-600 absolute top-0 left-0" />
                  <div className="p-3 text-center border-b border-emerald-100 bg-emerald-50">
                    <div className="w-10 h-10 bg-white rounded-full mx-auto flex items-center justify-center mb-2 text-emerald-600 border border-emerald-200 shadow-sm">
                      <Settings2 className="w-5 h-5" />
                    </div>
                    <h3 className="font-black text-emerald-900 text-xs">Adaptive Logic</h3>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 text-xs font-bold text-emerald-800 text-center">Personalization</div>
                    <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 text-xs font-bold text-emerald-800 text-center">Difficulty Scaling</div>
                  </div>
                </div>

                {/* Arrow from Assessment -> Adaptive Logic */}
                <div className="flex items-center justify-center">
                  <ArrowLeft className="text-emerald-500 w-6 h-6" />
                </div>

                {/* Assessment Feedback */}
                <div className="w-[220px] bg-white border-2 border-green-500 rounded-2xl shadow-xl overflow-hidden relative z-10 shrink-0">
                  <div className="h-2 w-full bg-green-600 absolute top-0 left-0" />
                  <div className="p-3 text-center border-b border-green-100 bg-green-50">
                    <div className="w-10 h-10 bg-white rounded-full mx-auto flex items-center justify-center mb-2 text-green-600 border border-green-200 shadow-sm">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <h3 className="font-black text-green-900 text-sm">Assessment Feedback</h3>
                  </div>
                  <div className="p-4 space-y-2.5">
                    <div className="bg-green-50 p-2.5 rounded-lg border border-green-200 text-xs font-bold text-green-900 flex items-center justify-center gap-2">
                      <span className="text-green-600"><CheckCircle className="w-4 h-4"/></span> BrainBite Micro-quizzes
                    </div>
                    <div className="bg-green-50 p-2.5 rounded-lg border border-green-200 text-xs font-bold text-green-900 flex items-center justify-center gap-2">
                      <span className="text-green-600"><Sparkles className="w-4 h-4"/></span> Instant AI Evaluation
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
          
        </div>
      </div>
    </MarketingShell>
  );
}
