"use client";

import { supabase } from "@/lib/supabaseClient";

const DEFAULT_COURSE_PRICE = 1200;

export async function startCourseCheckout(courseId: string, amount?: number) {
  const price = Number(amount ?? DEFAULT_COURSE_PRICE);
  if (!courseId || Number.isNaN(price) || price <= 0) {
    throw new Error("Invalid course payment request.");
  }

  const { data, error } = await supabase.functions.invoke("create-payment", {
    body: {
      courseId,
      amount: price,
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
