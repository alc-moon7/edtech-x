const MODE = (Deno.env.get("SSLCOMMERZ_MODE") ?? "sandbox").toLowerCase();

export const SSL_BASE_URL =
  MODE === "live" || MODE === "production"
    ? "https://securepay.sslcommerz.com"
    : "https://sandbox.sslcommerz.com";

export function getSslcommerzInitUrl() {
  return `${SSL_BASE_URL}/gwprocess/v4/api.php`;
}

export function getSslcommerzValidationUrl(valId: string, storeId: string, storePass: string) {
  const params = new URLSearchParams({
    val_id: valId,
    store_id: storeId,
    store_passwd: storePass,
    format: "json",
  });
  return `${SSL_BASE_URL}/validator/api/validationserverAPI.php?${params.toString()}`;
}
