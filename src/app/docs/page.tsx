import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Brain, Code, Cpu, Database, Globe2, Layout, ShieldCheck, Users, Zap } from "lucide-react";
import ReactMarkdown from "react-markdown";

const teamMembers = [
  {
    name: "Md. Mehedi Hasan Chowdhury",
    role: "Team Leader / AI & Analytics Lead",
    email: "mehedimahi07@gmail.com",
    image: "/assets/mehedi_hasan.png"
  },
  {
    name: "Mahfuz Ahmad",
    role: "Full Stack Developer / AI Engineer",
    email: "mahfuz.raj.bd@gmail.com",
    image: "/assets/mahfuz_ahmad.jpeg",
    position: "object-top"
  },
  {
    name: "Mst. Soniya Akter",
    role: "Product Design Lead / UI/UX Designer",
    email: "contact@homeschool.com",
    image: "/assets/soniya.png"
  },
  {
    name: "Oishi Farzana",
    role: "Curriculum Lead / Content Strategist",
    email: "oishifarzana83@gmail.com",
    image: "/assets/oishi_farzana.png"
  },
  {
    name: "Ehtisum Fariad",
    role: "Business Strategy / International Growth Lead",
    email: "contact@homeschool.com",
    image: "/assets/ehtisum.png"
  }
];

const pitchDeckContent = [
  {
    id: "problem",
    title: "The Problem",
    icon: Layout,
    content: `Students in the NCTB curriculum face a severe lack of structured, personalized learning. Passive video consumption leads to low retention, while generic tutoring fails to address individual knowledge gaps. Parents lack visibility into real progress.`
  },
  {
    id: "solution",
    title: "The Solution",
    icon: Brain,
    content: `HomeSchool transforms passive learning into active mastery. We provide a structured, interactive platform where every lesson includes instant AI-driven feedback, continuous micro-quizzes, and personalized learning paths—giving students exactly what they need, when they need it.`
  },
  {
    id: "market",
    title: "Market Opportunity",
    icon: Globe2,
    content: `With over **15 million** secondary students in Bangladesh alone, the EdTech market is ripe for disruption. Parents spend significantly on private tutors, seeking better outcomes. Our platform offers a scalable, high-quality alternative.`
  },
  {
    id: "business-model",
    title: "Business Model",
    icon: Zap,
    content: `Freemium SaaS model:\n- **Free Tier**: Basic access to introductory chapters and core AI features.\n- **Premium Subscription**: Full syllabus access, advanced analytics, unlimited AI tutoring, and detailed parent reports for a low monthly fee.`
  },
  {
    id: "team",
    title: "Our Team",
    icon: Users,
    content: `We are a team of passionate educators, AI engineers, and designers dedicated to revolutionizing education in Bangladesh.` // Rendered separately via component
  }
];

const technicalDocs = [
  {
    id: "architecture",
    title: "Architecture & Stack",
    icon: Cpu,
    content: `
### 🛠️ Technology Stack
- **Frontend Framework**: React 19 + Vite (Fast rendering & compilation)
- **Styling & Layout**: Tailwind CSS 4 + Framer Motion (Responsive & interactive UI)
- **Backend & Database**: Supabase (PostgreSQL, Real-time APIs, Auth)
- **Serverless Compute**: Supabase Edge Functions (Secure server-side logic)
- **AI Integration**: OpenRouter API (gpt-4o-mini model)

### 🏗️ High-Level Architecture
Our system utilizes a heavily decoupled, serverless architecture:
- **Client-Side Rendering**: React handles all routing and state management dynamically.
- **Secure AI Proxies**: All AI requests are routed through Edge Functions, ensuring API keys are never exposed to the client.
- **Real-Time Data**: Supabase streams live data updates (like quiz progress) directly to the UI.
    `
  },
  {
    id: "data-flow",
    title: "Data Flow & AI Layer",
    icon: Database,
    content: `
### 💾 Data Layer Strategy
- **Core Storage**: Supabase Postgres handles all relational data (users, courses, enrollments, progress).
- **Vector Embeddings**: \`pgvector\` is utilized for storing NCTB textbook chunks, enabling advanced RAG (Retrieval-Augmented Generation) capabilities.
- **Data Privacy**: Strict Row Level Security (RLS) policies guarantee that students can only access their own profiles and progress data.

### 🧠 AI Integration Flow
The AI ecosystem follows a precise, 5-step data flow:
1. **Trigger**: User requests a BrainBite, Lesson, or dynamic Quiz.
2. **Context Assembly**: The Edge Function compiles relevant context (Subject, Chapter, Class Level, User Language Mode).
3. **Prompt Injection**: System instructions enforce strict guidelines (e.g., forcing Bengali responses or overriding for the English subject).
4. **Execution**: Payload is securely sent to the OpenRouter API.
5. **Streaming**: The AI response is parsed and streamed back to the frontend UI in real-time.
    `
  },
  {
    id: "security",
    title: "Security & Performance",
    icon: ShieldCheck,
    content: `
### 🔒 Security Implementations
- **Authentication**: Robust JWT-based auth via Supabase Auth.
- **Access Control**: Dynamic Role-Based Access Control distinguishing between Students, Parents, and Admins.
- **Data Protection**: All sensitive backend queries and API calls are isolated in server-side Edge Functions.

### 🚀 Scalability & Performance
- **Edge Computing**: AI endpoints and contact forms run on global Edge infrastructure, guaranteeing ultra-low latency.
- **Database Scaling**: Postgres backend handles complex joins and can scale with read-replicas for heavy analytic loads.
- **Asset Delivery**: Static assets and compiled JS bundles are cached at the CDN level.
    `
  }
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("problem");

  // Basic scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const sections = [...pitchDeckContent, ...technicalDocs].map(s => s.id);
      let current = sections[0];
      
      for (const id of sections) {
        const element = document.getElementById(id);
        if (element && window.scrollY >= element.offsetTop - 150) {
          current = id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 100, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="HomeSchool" className="h-8 w-auto" />
              <span className="text-xl font-bold font-heading text-slate-900 ml-2">/docs</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              Live System View
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col md:flex-row px-4 sm:px-6 py-8 gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-28 space-y-8">
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Pitch Deck</h3>
              <nav className="flex flex-col space-y-1">
                {pitchDeckContent.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollTo(section.id)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      activeSection === section.id
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <section.icon className="h-4 w-4" />
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
            
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Technical Specs</h3>
              <nav className="flex flex-col space-y-1">
                {technicalDocs.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollTo(section.id)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      activeSection === section.id
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <section.icon className="h-4 w-4" />
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 space-y-16 pb-20">
          
          {/* Pitch Deck Sections */}
          <div className="space-y-16">
            <div className="border-b border-slate-200 pb-4">
              <h1 className="text-3xl font-bold text-slate-900">HomeSchool Pitch Deck</h1>
              <p className="text-slate-500 mt-2">Executive Summary & Business Model</p>
            </div>

            {pitchDeckContent.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
                    <section.icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
                </div>
                
                {section.id === "team" ? (
                  <div className="space-y-6">
                    <p className="text-lg text-slate-600 leading-relaxed">{section.content}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                      {teamMembers.map((member, idx) => (
                        <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col items-center text-center">
                          <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-slate-50 mb-4 shadow-sm">
                            <img src={member.image} alt={member.name} className={`h-full w-full object-cover ${member.position || ""}`} />
                          </div>
                          <h4 className="font-bold text-slate-900">{member.name}</h4>
                          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mt-1">{member.role}</p>
                          <a href={`mailto:${member.email}`} className="text-sm text-slate-500 mt-3 hover:text-blue-600">{member.email}</a>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-lg prose-slate max-w-none">
                    <ReactMarkdown>{section.content}</ReactMarkdown>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Technical Docs Sections */}
          <div className="space-y-16 pt-10 border-t border-slate-200">
            <div className="pb-4">
              <h1 className="text-3xl font-bold text-slate-900">Technical Documentation</h1>
              <p className="text-slate-500 mt-2">Architecture, Data Flow, and Scalability Details</p>
            </div>

            {technicalDocs.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-slate-800 rounded-lg text-white">
                    <section.icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
                </div>
                <div className="prose prose-slate prose-lg max-w-none bg-white border border-slate-200 rounded-2xl p-8 shadow-sm [&>h3]:mt-8 [&>h3:first-child]:mt-0 [&>h3]:text-[22px] [&>h3]:font-bold [&>h3]:text-slate-800 [&>p]:text-slate-600 [&>p]:leading-relaxed [&>ul]:mt-4 [&>ul]:space-y-3 [&>ul>li]:text-slate-600 [&>ol]:mt-4 [&>ol]:space-y-3 [&>ol>li]:text-slate-600 [&>ul>li>strong]:text-slate-800 [&>ol>li>strong]:text-slate-800">
                  <ReactMarkdown>{section.content}</ReactMarkdown>
                </div>
              </section>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}
