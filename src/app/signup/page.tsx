"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { usePageMeta } from "@/lib/usePageMeta";
import { supabase } from "@/lib/supabaseClient";

type SignupForm = {
  full_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  school: string;
  class_name: string;
  section: string;
  student_id: string;
  guardian_name: string;
  phone: string;
};

const initialForm: SignupForm = {
  full_name: "",
  email: "",
  password: "",
  confirmPassword: "",
  school: "",
  class_name: "",
  section: "",
  student_id: "",
  guardian_name: "",
  phone: "",
};

export default function SignupPage() {
  usePageMeta({
    title: "Create account",
    description: "Create a HomeSchool student account and profile.",
  });

  const [formData, setFormData] = useState<SignupForm>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: keyof SignupForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.full_name.trim()) nextErrors.full_name = "Full name is required.";
    if (!formData.email.trim()) nextErrors.email = "Email is required.";
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) nextErrors.email = "Enter a valid email.";
    if (!formData.password) nextErrors.password = "Password is required.";
    if (formData.password.length < 6) nextErrors.password = "Password must be at least 6 characters.";
    if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }
    if (!formData.school.trim()) nextErrors.school = "School name is required.";
    if (!formData.class_name.trim()) nextErrors.class_name = "Class is required.";
    if (!formData.student_id.trim()) nextErrors.student_id = "Student ID or roll is required.";
    if (!formData.guardian_name.trim()) nextErrors.guardian_name = "Guardian name is required.";
    if (!formData.phone.trim()) nextErrors.phone = "Phone number is required.";
    return nextErrors;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});

    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {
          full_name: formData.full_name,
          school: formData.school,
          class: formData.class_name,
          section: formData.section,
          student_id: formData.student_id,
          guardian_name: formData.guardian_name,
          phone: formData.phone,
        },
      },
    });

    if (error) {
      setErrors({ form: error.message });
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    setFormData(initialForm);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-2xl space-y-4">
        <div className="text-center space-y-3 mb-8">
          <img src="/logo.png" alt="HomeSchool" className="mx-auto h-12 w-auto" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Create your account</h1>
          <p className="text-muted-foreground">
            Join HomeSchool and access the full Class 6-12 learning system.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Student profile</CardTitle>
            <CardDescription>All fields marked * are required.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {errors.form && (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                  {errors.form}
                </div>
              )}
              {success && (
                <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700" role="status">
                  Account created. Please check your email to confirm and then sign in.
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="full_name" className="text-sm font-medium">
                    Full name *
                  </label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(event) => handleChange("full_name", event.target.value)}
                    aria-invalid={!!errors.full_name}
                  />
                  {errors.full_name && <p className="text-xs text-red-600">{errors.full_name}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(event) => handleChange("email", event.target.value)}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password *
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(event) => handleChange("password", event.target.value)}
                    aria-invalid={!!errors.password}
                  />
                  {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm password *
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(event) => handleChange("confirmPassword", event.target.value)}
                    aria-invalid={!!errors.confirmPassword}
                  />
                  {errors.confirmPassword && <p className="text-xs text-red-600">{errors.confirmPassword}</p>}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="school" className="text-sm font-medium">
                    School *
                  </label>
                  <Input
                    id="school"
                    value={formData.school}
                    onChange={(event) => handleChange("school", event.target.value)}
                    aria-invalid={!!errors.school}
                  />
                  {errors.school && <p className="text-xs text-red-600">{errors.school}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="class_name" className="text-sm font-medium">
                    Class *
                  </label>
                  <select
                    id="class_name"
                    value={formData.class_name}
                    onChange={(event) => handleChange("class_name", event.target.value)}
                    aria-invalid={!!errors.class_name}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">Select class</option>
                    <option>Class 6</option>
                    <option>Class 7</option>
                    <option>Class 8</option>
                    <option>Class 9</option>
                    <option>Class 10</option>
                    <option>Class 11</option>
                    <option>Class 12</option>
                  </select>
                  {errors.class_name && <p className="text-xs text-red-600">{errors.class_name}</p>}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="section" className="text-sm font-medium">
                    Section (optional)
                  </label>
                  <Input
                    id="section"
                    value={formData.section}
                    onChange={(event) => handleChange("section", event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="student_id" className="text-sm font-medium">
                    Student ID / Roll *
                  </label>
                  <Input
                    id="student_id"
                    value={formData.student_id}
                    onChange={(event) => handleChange("student_id", event.target.value)}
                    aria-invalid={!!errors.student_id}
                  />
                  {errors.student_id && <p className="text-xs text-red-600">{errors.student_id}</p>}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="guardian_name" className="text-sm font-medium">
                    Guardian name *
                  </label>
                  <Input
                    id="guardian_name"
                    value={formData.guardian_name}
                    onChange={(event) => handleChange("guardian_name", event.target.value)}
                    aria-invalid={!!errors.guardian_name}
                  />
                  {errors.guardian_name && <p className="text-xs text-red-600">{errors.guardian_name}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Phone *
                  </label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(event) => handleChange("phone", event.target.value)}
                    aria-invalid={!!errors.phone}
                  />
                  {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center text-xs text-muted-foreground">
            Already have an account? <Link to="/login" className="ml-1 text-primary hover:underline">Sign in</Link>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
