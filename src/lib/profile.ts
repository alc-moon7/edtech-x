import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

export type ProfilePayload = {
  id: string;
  email: string | null;
  full_name: string;
  school: string;
  class_name: string;
  section: string | null;
  student_id: string;
  guardian_name: string;
  phone: string;
};

export async function syncProfile(user: User) {
  const metadata = user.user_metadata || {};

  const payload: ProfilePayload = {
    id: user.id,
    email: user.email ?? null,
    full_name: metadata.full_name ?? "",
    school: metadata.school ?? "",
    class_name: metadata.class ?? "",
    section: metadata.section || null,
    student_id: metadata.student_id ?? "",
    guardian_name: metadata.guardian_name ?? "",
    phone: metadata.phone ?? "",
  };

  const hasProfileData =
    payload.full_name ||
    payload.school ||
    payload.class_name ||
    payload.student_id ||
    payload.guardian_name ||
    payload.phone ||
    payload.section;

  if (!hasProfileData) return;

  const { error } = await supabase.from("profiles").upsert(payload, { onConflict: "id" });
  if (error) {
    console.warn("Profile sync failed:", error.message);
  }

  const { error: profileError } = await supabase
    .from("user_profiles")
    .upsert(
      {
        user_id: user.id,
        full_name: payload.full_name,
        class_level: payload.class_name,
      },
      { onConflict: "user_id" }
    );

  if (profileError) {
    console.warn("User profile sync failed:", profileError.message);
  }
}
