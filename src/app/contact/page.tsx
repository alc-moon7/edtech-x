import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { MarketingShell } from "@/components/MarketingShell";
import { usePageMeta } from "@/lib/usePageMeta";
import { useTranslate } from "@/lib/i18n";

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
  const t = useTranslate();

  usePageMeta({
    title: t({ en: "Contact", bn: "যোগাযোগ" }),
    description: t({ en: "Contact HomeSchool for product questions, demos, or support.", bn: "পণ্য প্রশ্ন, ডেমো বা সাপোর্টের জন্য HomeSchool এর সাথে যোগাযোগ করুন।" }),
  });

  const [formData, setFormData] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (field: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.name.trim()) nextErrors.name = t({ en: "Please enter your name.", bn: "অনুগ্রহ করে আপনার নাম লিখুন।" });
    if (!formData.email.trim()) {
      nextErrors.email = t({ en: "Please enter your email.", bn: "অনুগ্রহ করে আপনার ইমেইল লিখুন।" });
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      nextErrors.email = t({ en: "Please enter a valid email address.", bn: "অনুগ্রহ করে সঠিক ইমেইল ঠিকানা লিখুন।" });
    }
    if (formData.message.trim().length < 20) {
      nextErrors.message = t({ en: "Please add at least 20 characters.", bn: "কমপক্ষে ২০ অক্ষর লিখুন।" });
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
          <div className="text-sm font-semibold uppercase tracking-wider text-primary">{t({ en: "Contact", bn: "যোগাযোগ" })}</div>
          <h1 className="mt-4 text-4xl font-bold font-heading sm:text-5xl">{t({ en: "We are here to help", bn: "আমরা সাহায্যের জন্য আছি" })}</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t({ en: "Reach out for demos, support, or partnership inquiries. We respond within 1 business day.", bn: "ডেমো, সাপোর্ট বা পার্টনারশিপের জন্য যোগাযোগ করুন। আমরা ১ কার্যদিবসের মধ্যে সাড়া দিই।" })}
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold">{t({ en: "Contact details", bn: "যোগাযোগের তথ্য" })}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {t({ en: "Use the form or contact us directly using the details below.", bn: "ফর্ম ব্যবহার করুন বা নিচের তথ্য দিয়ে সরাসরি যোগাযোগ করুন।" })}
              </p>
              <div className="mt-6 space-y-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-primary" />
                  <a href="mailto:alc.moon@hotmail.com" className="hover:text-primary">
                    alc.moon@hotmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>{t({ en: "Support hours: 24/7", bn: "সাপোর্ট সময়: ২৪/৭" })}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{t({ en: "Rajshahi, Bangladesh", bn: "রাজশাহী, বাংলাদেশ" })}</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-muted/40 p-6">
              <h3 className="text-lg font-semibold">{t({ en: "Need quick help?", bn: "দ্রুত সাহায্য দরকার?" })}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {t({ en: "Visit the help center for guides, account support, and FAQs.", bn: "গাইড, অ্যাকাউন্ট সাপোর্ট ও FAQ এর জন্য হেল্প সেন্টারে যান।" })}
              </p>
              <Link to="/help">
                <Button className="mt-4" variant="outline">
                  {t({ en: "Go to help center", bn: "হেল্প সেন্টারে যান" })}
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold">{t({ en: "Send a message", bn: "বার্তা পাঠান" })}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t({ en: "Tell us who you are and what you need. We will get back soon.", bn: "আপনি কে এবং কী দরকার জানান। আমরা দ্রুত জানাব।" })}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {status === "success" && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700" role="status">
                  {t({ en: "Thanks for reaching out. We will reply within 1 business day.", bn: "যোগাযোগের জন্য ধন্যবাদ। আমরা ১ কার্যদিবসের মধ্যে উত্তর দেব।" })}
                </div>
              )}
              {status === "error" && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                  {t({ en: "Please fix the highlighted fields.", bn: "হাইলাইট করা ঘরগুলো ঠিক করুন।" })}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    {t({ en: "Full name", bn: "পূর্ণ নাম" })}
                  </label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(event) => handleChange("name", event.target.value)}
                    placeholder={t({ en: "Your name", bn: "আপনার নাম" })}
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
                    {t({ en: "Email", bn: "ইমেইল" })}
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
                    {t({ en: "Phone (optional)", bn: "ফোন (ঐচ্ছিক)" })}
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
                    {t({ en: "I am a", bn: "আমি একজন" })}
                  </label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(event) => handleChange("role", event.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="student">{t({ en: "Student", bn: "শিক্ষার্থী" })}</option>
                    <option value="parent">{t({ en: "Parent", bn: "অভিভাবক" })}</option>
                    <option value="teacher">{t({ en: "Teacher", bn: "শিক্ষক" })}</option>
                    <option value="school">{t({ en: "School", bn: "স্কুল" })}</option>
                    <option value="other">{t({ en: "Other", bn: "অন্যান্য" })}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  {t({ en: "Message", bn: "বার্তা" })}
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(event) => handleChange("message", event.target.value)}
                  placeholder={t({ en: "Tell us how we can help.", bn: "কীভাবে সাহায্য করতে পারি জানান।" })}
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
                {t({ en: "Send message", bn: "বার্তা পাঠান" })}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
