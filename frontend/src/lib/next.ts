/* Read ?next= on the client without useSearchParams (avoids a Suspense boundary on auth pages). */
export function nextParam(fallback: string) {
  if (typeof window === "undefined") return fallback;
  const n = new URLSearchParams(window.location.search).get("next");
  return n && n.startsWith("/") ? n : fallback;
}
