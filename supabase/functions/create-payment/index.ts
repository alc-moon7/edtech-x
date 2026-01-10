import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { getSupabaseAdmin, getUserFromRequest } from "../_shared/supabase.ts";
import { getSslcommerzInitUrl } from "../_shared/sslcommerz.ts";

type CreatePaymentPayload = {
  courseId?: string;
  planId?: string;
  amount?: number;
  currency?: string;
};

const SITE_URL = Deno.env.get("SITE_URL") ?? "https://homeschoo.moonx.dev";
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
    const planId = typeof payload.planId === "string" ? payload.planId.toLowerCase() : "premium";
    const planAmount = PLAN_PRICES[planId];
    const amount = planAmount ?? Number(payload.amount);
    const currency = (payload.currency ?? "BDT").toUpperCase();

    if (!courseId || Number.isNaN(amount) || amount <= 0) {
      return jsonResponse(400, { error: "courseId and plan are required." });
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
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("id,title")
      .eq("id", courseId)
      .maybeSingle();

    if (courseError || !course) {
      return jsonResponse(404, { error: "Course not found." });
    }

    const orderId = crypto.randomUUID();
    const tranId = `HS-${orderId.replace(/-/g, "").slice(0, 20)}`;

    const { error: orderError } = await supabase.from("orders").insert({
      id: orderId,
      user_id: user.id,
      course_id: courseId,
      amount,
      currency,
      status: "pending",
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
      product_name: course.title ?? "Course",
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
      value_c: courseId,
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
