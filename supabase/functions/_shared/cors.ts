const allowedOrigin = Deno.env.get("CORS_ORIGIN") ?? "https://homeschool.moonx.dev";

export const corsHeaders = {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};
