import { Link } from "react-router-dom";
import { MarketingShell } from "@/components/MarketingShell";
import { Button } from "@/components/ui/Button";
import { usePageMeta } from "@/lib/usePageMeta";

export default function NotFoundPage() {
  usePageMeta({
    title: "Page not found",
    description: "The page you are looking for does not exist.",
  });

  return (
    <MarketingShell>
      <section className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="text-center space-y-4">
          <div className="text-sm font-semibold uppercase tracking-wider text-primary">404 error</div>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Page not found</h1>
          <p className="text-muted-foreground">
            The page you are looking for does not exist or has moved.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/">
              <Button>Back to Home</Button>
            </Link>
            <Link to="/help">
              <Button variant="outline">Visit Help Center</Button>
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
