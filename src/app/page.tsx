import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { BookOpen, LineChart, Users } from "lucide-react";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-4 py-32 text-center bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-50 z-0" />

        <div className="relative z-10 space-y-8 max-w-4xl">
          <div className="inline-block rounded-full bg-accent/20 px-4 py-1.5 text-sm font-medium text-accent-foreground backdrop-blur-sm border border-accent/20">
            Now available for Class 6-12
          </div>

          <h1 className="text-6xl font-extrabold tracking-tight text-foreground sm:text-7xl font-heading">
            Master Your Syllabus with <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Interactive Learning
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            HomeSchool replaces passive learning with a structured, interactive system tailored for the NCTB syllabus.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="rounded-full px-8 text-lg h-12 bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25">
                Get Started Free
              </Button>
            </Link>
            <Link to="/courses">
              <Button variant="outline" size="lg" className="rounded-full px-8 text-lg h-12 border-primary/20 hover:bg-primary/5">
                Explore Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-3">
          <FeatureCard
            icon={BookOpen}
            title="Syllabus Aligned"
            description="Complete coverage of the NCTB curriculum with chapter-wise video lessons and notes."
          />
          <FeatureCard
            icon={LineChart}
            title="Real-time Analytics"
            description="Track your progress with detailed performance reports and personalized insights."
          />
          <FeatureCard
            icon={Users}
            title="Expert Support"
            description="Get your doubts resolved instantly by our team of expert teachers."
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4 inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mb-3 text-xl font-bold text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
