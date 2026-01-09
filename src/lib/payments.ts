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

  const { data, error } = await supabase.functions.invoke("create-payment", {
    body: {
      courseId,
      planId: options?.planId ?? "premium",
      amount: options?.amount,
      currency: "BDT",
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  const url = (data as { url?: string })?.url;
  if (!url) {
    throw new Error("Payment gateway URL missing.");
  }

  window.location.href = url;
}
