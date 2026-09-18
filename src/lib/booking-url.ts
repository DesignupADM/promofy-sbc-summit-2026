export function bookingUrl(href: string, placement: string, search = "") {
  const url = new URL(href);
  const incoming = new URLSearchParams(search);
  const defaults: Record<string, string> = {
    utm_source: process.env.NEXT_PUBLIC_BOOKING_UTM_SOURCE || "promofy_website",
    utm_medium: process.env.NEXT_PUBLIC_BOOKING_UTM_MEDIUM || "website",
    utm_campaign: process.env.NEXT_PUBLIC_BOOKING_UTM_CAMPAIGN || "sbc_lisbon_2026",
  };
  for (const [key, fallback] of Object.entries(defaults)) url.searchParams.set(key, incoming.get(key) || url.searchParams.get(key) || fallback);
  url.searchParams.set("utm_content", placement);
  if (incoming.get("utm_term")) url.searchParams.set("utm_term", incoming.get("utm_term")!);
  return url.toString();
}
