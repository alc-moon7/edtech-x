"use client";

import { supabase } from "@/lib/supabaseClient";

type CheckoutOptions = {
  planId?: "standard" | "premium";
  amount?: number;
};

export async function startCourseCheckout(courseId: string, options?: CheckoutOptions) {
  if (!courseId) {
    throw new Error("Invalid course payment request.");
  }

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  const accessToken = sessionData?.session?.access_token;
  if (sessionError || !accessToken) {
    throw new Error("Please sign in to continue.");
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "http://127.0.0.1:54321";
  const response = await fetch(`${supabaseUrl}/functions/v1/create-payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      courseId,
      planId: options?.planId ?? "premium",
      amount: options?.amount,
      currency: "BDT",
    }),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = payload?.error || payload?.details || "Payment failed. Please try again.";
    throw new Error(message);
  }

  const url = payload?.url;
  if (!url) {
    throw new Error("Payment gateway URL missing.");
  }

  window.location.href = url;
}
