import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-foreground">Page not found</h1>
        <p className="text-muted-foreground">
          The page you are looking for does not exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-lg border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
