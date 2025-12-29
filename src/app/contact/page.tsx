import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { MarketingShell } from "@/components/MarketingShell";
import { usePageMeta } from "@/lib/usePageMeta";

type FormState = {
  name: string;
  email: string;
  phone: string;
  role: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  role: "student",
  message: "",
};

export default function ContactPage() {
  usePageMeta({
    title: "Contact",
    description: "Contact HomeSchool for product questions, demos, or support.",
  });

  const [formData, setFormData] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (field: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.name.trim()) nextErrors.name = "Please enter your name.";
    if (!formData.email.trim()) {
      nextErrors.email = "Please enter your email.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }
    if (formData.message.trim().length < 20) {
      nextErrors.message = "Please add at least 20 characters.";
    }
    return nextErrors;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setStatus("error");
      return;
    }
    setErrors({});
    setStatus("success");
    setFormData(initialState);
  };

  return (
    <MarketingShell>
      <section className="bg-gradient-to-b from-background via-primary/5 to-background py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <div className="text-sm font-semibold uppercase tracking-wider text-primary">Contact</div>
          <h1 className="mt-4 text-4xl font-bold font-heading sm:text-5xl">We are here to help</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Reach out for demos, support, or partnership inquiries. We respond within 1 business day.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Contact details</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Use the form or contact us directly using the details below.
              </p>
              <div className="mt-6 space-y-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-primary" />
                  <a href="mailto:support@homeschool.bd" className="hover:text-primary">
                    support@homeschool.bd
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>Support hours: Sun-Thu, 9:00 AM to 6:00 PM</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Dhaka, Bangladesh</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-muted/40 p-6">
              <h3 className="text-lg font-semibold">Need quick help?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Visit the help center for guides, account support, and FAQs.
              </p>
              <Link to="/help">
                <Button className="mt-4" variant="outline">
                  Go to help center
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Send a message</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Tell us who you are and what you need. We will get back soon.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {status === "success" && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700" role="status">
                  Thanks for reaching out. We will reply within 1 business day.
                </div>
              )}
              {status === "error" && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                  Please fix the highlighted fields.
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Full name
                  </label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(event) => handleChange("name", event.target.value)}
                    placeholder="Your name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-xs text-red-600">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(event) => handleChange("email", event.target.value)}
                    placeholder="name@example.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-xs text-red-600">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Phone (optional)
                  </label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(event) => handleChange("phone", event.target.value)}
                    placeholder="+880"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium">
                    I am a
                  </label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(event) => handleChange("role", event.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="student">Student</option>
                    <option value="parent">Parent</option>
                    <option value="teacher">Teacher</option>
                    <option value="school">School</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(event) => handleChange("message", event.target.value)}
                  placeholder="Tell us how we can help."
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "message-error" : undefined}
                />
                {errors.message && (
                  <p id="message-error" className="text-xs text-red-600">
                    {errors.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full">
                Send message
              </Button>
            </form>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
