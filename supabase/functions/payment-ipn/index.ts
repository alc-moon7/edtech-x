import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { getSupabaseAdmin } from "../_shared/supabase.ts";
import { getSslcommerzValidationUrl } from "../_shared/sslcommerz.ts";

function jsonResponse(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  try {
    const body = await req.text();
    const params = new URLSearchParams(body);
    const tranId = params.get("tran_id") ?? "";
    const valId = params.get("val_id") ?? "";
    const amount = params.get("amount") ?? "";
    const statusParam = params.get("status") ?? "";
    const orderId = params.get("value_a") ?? "";

    if (!valId) {
      return jsonResponse(400, { error: "Missing val_id." });
    }

    const storeId = Deno.env.get("SSLCOMMERZ_STORE_ID");
    const storePassword = Deno.env.get("SSLCOMMERZ_STORE_PASSWORD");
    if (!storeId || !storePassword) {
      return jsonResponse(500, { error: "Missing SSLCommerz credentials." });
    }

    const validationResponse = await fetch(getSslcommerzValidationUrl(valId, storeId, storePassword));
    const validation = await validationResponse.json();
    const status = `${validation?.status ?? ""}`.toUpperCase();

    const supabase = getSupabaseAdmin();
    const resolvedOrderId = validation?.value_a ?? orderId;

    if (!resolvedOrderId) {
      return jsonResponse(400, { error: "Missing order id." });
    }

    const { data: order } = await supabase
      .from("orders")
      .select("id,user_id,course_id,amount,currency,status")
      .eq("id", resolvedOrderId)
      .maybeSingle();

    if (!order) {
      return jsonResponse(404, { error: "Order not found." });
    }

    if (order.status === "paid") {
      return jsonResponse(200, { status: "already_paid" });
    }

    const amountMatches =
      Number(validation?.amount ?? 0) === Number(order.amount) &&
      String(validation?.currency ?? order.currency).toUpperCase() === order.currency.toUpperCase();

    if (!validationResponse.ok || !(status === "VALID" || status === "VALIDATED") || !amountMatches) {
      await supabase.from("orders").update({ status: "failed" }).eq("id", order.id);
      return jsonResponse(400, { status: "invalid" });
    }

    await supabase.from("orders").update({ status: "paid" }).eq("id", order.id);

    await supabase.from("payments").upsert(
      {
        order_id: order.id,
        tran_id: validation.tran_id ?? tranId,
        amount: Number(validation.amount ?? amount ?? order.amount),
        card_type: validation.card_type ?? null,
        validation_id: validation.val_id ?? valId,
        status: validation.status ?? statusParam ?? null,
        raw_response: validation ?? {},
      },
      { onConflict: "tran_id" }
    );

    await supabase.from("purchased_courses").upsert(
      {
        user_id: order.user_id,
        course_id: order.course_id,
      },
      { onConflict: "user_id,course_id" }
    );

    return jsonResponse(200, { status: "ok" });
  } catch (error) {
    console.error("payment-ipn error", error);
    return jsonResponse(500, { error: "Unexpected error." });
  }
});
