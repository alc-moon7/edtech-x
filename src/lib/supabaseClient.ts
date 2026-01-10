import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const aiEndpoint = import.meta.env.VITE_AI_ENDPOINT ?? supabaseUrl;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const isAiConfigured = Boolean(aiEndpoint);

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.warn("Supabase env vars missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.");
}
if (!isAiConfigured && import.meta.env.DEV) {
  console.warn("AI endpoint missing. Add VITE_AI_ENDPOINT to .env.");
}

const fallbackUrl = "http://127.0.0.1:54321";
const fallbackAnonKey = "public-anon-key";
const fallbackAiEndpoint = fallbackUrl;

export const supabase = createClient(supabaseUrl ?? fallbackUrl, supabaseAnonKey ?? fallbackAnonKey);
export const resolvedAiEndpoint = aiEndpoint ?? fallbackAiEndpoint;

export async function invokeEdgeFunction<TResponse>(
  functionName: string,
  body: unknown
): Promise<{ data: TResponse | null; error: Record<string, unknown> | null; status: number }> {
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData?.session?.access_token;
  const url = `${resolvedAiEndpoint}/functions/v1/${functionName}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (supabaseAnonKey) {
    headers.apikey = supabaseAnonKey;
  }

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    return {
      data: null,
      error: (payload as Record<string, unknown>) ?? { error: "Request failed" },
      status: response.status,
    };
  }

  return {
    data: payload as TResponse,
    error: null,
    status: response.status,
  };
}
