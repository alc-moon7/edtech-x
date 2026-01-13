import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { getSupabaseAdmin, getUserFromRequest } from "../_shared/supabase.ts";
import { getSslcommerzInitUrl } from "../_shared/sslcommerz.ts";

type CreatePaymentPayload = {
  courseId?: string;
  chapterId?: string;
  planId?: string;
  amount?: number;
  currency?: string;
};

const SITE_URL = Deno.env.get("SITE_URL") ?? "https://homeschool.moonx.dev";
const PLAN_PRICES: Record<string, number> = {
  standard: 299,
  premium: 499,
};

function jsonResponse(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { user, error: authError } = await getUserFromRequest(req);
    if (authError || !user) {
      return jsonResponse(401, { error: "Unauthorized" });
    }

    const payload = (await req.json()) as CreatePaymentPayload;
    const courseId = payload.courseId?.trim();
    const chapterId = payload.chapterId?.trim();
    const planId = typeof payload.planId === "string" ? payload.planId.toLowerCase() : "premium";
    const planAmount = PLAN_PRICES[planId];
    let amount = planAmount ?? Number(payload.amount);
    const currency = (payload.currency ?? "BDT").toUpperCase();

    if (!courseId && !chapterId) {
      return jsonResponse(400, { error: "courseId or chapterId is required." });
    }

    const rawPhone =
      (user.user_metadata?.phone as string | undefined) ??
      (user.phone as string | undefined) ??
      "";
    const sanitizedPhone = rawPhone.replace(/[^\d]/g, "");
    const customerPhone = sanitizedPhone.length >= 10 ? sanitizedPhone : "01700000000";

    const storeId = Deno.env.get("SSLCOMMERZ_STORE_ID");
    const storePassword = Deno.env.get("SSLCOMMERZ_STORE_PASSWORD");
    if (!storeId || !storePassword) {
      return jsonResponse(500, { error: "Missing SSLCommerz credentials." });
    }

    const supabase = getSupabaseAdmin();
    let resolvedCourseId = courseId ?? "";
    let resolvedChapterId: string | null = null;
    let productName = "Course";

    if (chapterId) {
      const { data: chapter, error: chapterError } = await supabase
        .from("chapters")
        .select("id,title,price,is_free,course_id,course:courses(id,title)")
        .eq("id", chapterId)
        .maybeSingle();

      if (chapterError || !chapter) {
        return jsonResponse(404, { error: "Chapter not found." });
      }

      if (chapter.is_free) {
        return jsonResponse(409, { error: "Chapter is already free." });
      }

      const chapterPrice = Number(chapter.price ?? payload.amount);
      if (!Number.isFinite(chapterPrice) || chapterPrice <= 0) {
        return jsonResponse(400, { error: "Invalid chapter price." });
      }

      resolvedCourseId = chapter.course_id;
      resolvedChapterId = chapter.id;
      amount = chapterPrice;
      productName = `${chapter.course?.title ?? "Course"} - ${chapter.title}`;
    }

    if (!resolvedCourseId) {
      return jsonResponse(400, { error: "courseId is required." });
    }

    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("id,title")
      .eq("id", resolvedCourseId)
      .maybeSingle();

    if (courseError || !course) {
      return jsonResponse(404, { error: "Course not found." });
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return jsonResponse(400, { error: "Invalid payment amount." });
    }

    const { data: activePurchase, error: activeError } = await supabase
      .from("purchased_courses")
      .select("course_id,plan_id,expires_at")
      .eq("user_id", user.id)
      .eq("course_id", resolvedCourseId)
      .maybeSingle();

    if (activeError) {
      return jsonResponse(500, { error: activeError.message });
    }

    if (activePurchase) {
      const expiresAt = activePurchase.expires_at ? new Date(activePurchase.expires_at) : null;
      if (!expiresAt || expiresAt.getTime() > Date.now()) {
        return jsonResponse(409, {
          error: "Active subscription already exists.",
          planId: activePurchase.plan_id ?? planId,
          expiresAt: activePurchase.expires_at ?? null,
        });
      }
    }

    if (resolvedChapterId) {
      const { data: existingChapter, error: chapterPurchaseError } = await supabase
        .from("purchased_chapters")
        .select("chapter_id")
        .eq("user_id", user.id)
        .eq("chapter_id", resolvedChapterId)
        .maybeSingle();

      if (chapterPurchaseError) {
        return jsonResponse(500, { error: chapterPurchaseError.message });
      }

      if (existingChapter) {
        return jsonResponse(409, { error: "Chapter already unlocked." });
      }
    }

    const orderId = crypto.randomUUID();
    const tranId = `HS-${orderId.replace(/-/g, "").slice(0, 20)}`;

    const { error: orderError } = await supabase.from("orders").insert({
      id: orderId,
      user_id: user.id,
      course_id: resolvedCourseId,
      chapter_id: resolvedChapterId,
      amount,
      currency,
      status: "pending",
      plan_id: resolvedChapterId ? "chapter" : planId,
    });

    if (orderError) {
      return jsonResponse(500, { error: orderError.message });
    }

    const form = new URLSearchParams({
      store_id: storeId,
      store_passwd: storePassword,
      total_amount: amount.toFixed(2),
      currency,
      tran_id: tranId,
      success_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/payment-success`,
      fail_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/payment-fail`,
      cancel_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/payment-cancel`,
      ipn_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/payment-ipn`,
      product_name: productName || course.title || "Course",
      product_category: "Education",
      product_profile: "general",
      cus_name: user.user_metadata?.full_name ?? user.email ?? "Student",
      cus_email: user.email ?? "student@example.com",
      cus_phone: customerPhone,
      cus_add1: "N/A",
      cus_city: "N/A",
      cus_country: "Bangladesh",
      shipping_method: "NO",
      num_of_item: "1",
      value_a: orderId,
      value_b: user.id,
      value_c: resolvedChapterId ?? resolvedCourseId,
      value_d: SITE_URL,
    });

    const initResponse = await fetch(getSslcommerzInitUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });

    const initData = await initResponse.json();

    if (!initResponse.ok || initData?.status !== "SUCCESS") {
      await supabase.from("orders").update({ status: "failed" }).eq("id", orderId);
      return jsonResponse(502, { error: "SSLCommerz init failed.", details: initData });
    }

    if (initData?.sessionkey) {
      await supabase.from("orders").update({ ssl_session_id: initData.sessionkey }).eq("id", orderId);
    }

    return jsonResponse(200, { url: initData.GatewayPageURL, orderId });
  } catch (error) {
    console.error("create-payment error", error);
    return jsonResponse(500, {
      error: error instanceof Error ? error.message : "Unexpected error.",
    });
  }
});
