import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { getSupabaseAdmin } from "../_shared/supabase.ts";

const SITE_URL = Deno.env.get("SITE_URL") ?? "https://homeschoo.moonx.dev";

async function readPayload(req: Request) {
  const contentType = req.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return await req.json();
  }
  const formData = await req.formData();
  return Object.fromEntries(formData.entries());
}

function redirect(url: string) {
  return new Response(null, { status: 302, headers: { Location: url } });
}

serve(async (req) => {
  try {
    const payload = await readPayload(req);
    const orderId = typeof payload.value_a === "string" ? payload.value_a : "";

    if (orderId) {
      const supabase = getSupabaseAdmin();
      await supabase.from("orders").update({ status: "failed" }).eq("id", orderId);
    }

    return redirect(`${SITE_URL}/payment/fail${orderId ? `?order=${orderId}` : ""}`);
  } catch (error) {
    console.error("payment-fail error", error);
    return redirect(`${SITE_URL}/payment/fail?reason=server_error`);
  }
});
