import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  message?: string;
};

type EmailResult = {
  sent: boolean;
  warning?: string;
};

type SaveResult = {
  saved: boolean;
  warning?: string;
};

function isValidEmail(value: string) {
  return /^\S+@\S+\.\S+$/.test(value);
}

function buildEmailText(payload: Required<ContactPayload>) {
  return [
    `New contact message from ${payload.name}`,
    "",
    `Email: ${payload.email}`,
    `Phone: ${payload.phone || "-"}`,
    `Role: ${payload.role || "-"}`,
    "",
    "Message:",
    payload.message,
  ].join("\n");
}

async function sendEmail(payload: Required<ContactPayload>): Promise<EmailResult> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    return { sent: false, warning: "Email delivery not configured" };
  }

  const from = Deno.env.get("RESEND_FROM") ?? "onboarding@resend.dev";
  const to = Deno.env.get("CONTACT_RECEIVER_EMAIL") ?? "alc.moon@hotmail.com";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: `New contact message - ${payload.name}`,
      text: buildEmailText(payload),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Resend error:", errorText);
    return { sent: false, warning: "Email send failed" };
  }

  return { sent: true };
}

async function saveMessage(payload: Required<ContactPayload>, userAgent: string | null): Promise<SaveResult> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return { saved: false, warning: "Database save not configured" };
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/contact_messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      phone: payload.phone || null,
      role: payload.role || null,
      message: payload.message,
      user_agent: userAgent,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Contact message save error:", errorText);
    return { saved: false, warning: "Message save failed" };
  }

  return { saved: true };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const payload = (await req.json()) as ContactPayload;
    const name = (payload.name ?? "").trim();
    const email = (payload.email ?? "").trim();
    const message = (payload.message ?? "").trim();

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!isValidEmail(email)) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (message.length < 20) {
      return new Response(JSON.stringify({ error: "Message too short" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const fullPayload: Required<ContactPayload> = {
      name,
      email,
      phone: (payload.phone ?? "").trim(),
      role: (payload.role ?? "").trim(),
      message,
    };

    const [saveResult, emailResult] = await Promise.all([
      saveMessage(fullPayload, req.headers.get("user-agent")),
      sendEmail(fullPayload),
    ]);

    const warnings = [saveResult.warning, emailResult.warning].filter(Boolean);
    const warning = warnings.length ? warnings.join(" | ") : undefined;

    if (!saveResult.saved && !emailResult.sent) {
      return new Response(JSON.stringify({ ok: false, error: "Unable to process message", warning }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, emailSent: emailResult.sent, saved: saveResult.saved, warning }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
