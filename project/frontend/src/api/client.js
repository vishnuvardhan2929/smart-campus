// Dynamic API client with URL normalization and client-side override support

export function getApiBase() {
  try {
    const saved = localStorage.getItem("campus_api_url");
    if (saved && saved.trim()) {
      const clean = saved.trim().replace(/\/+$/, "");
      return clean.endsWith("/api") ? clean : `${clean}/api`;
    }
  } catch (e) {}

  const rawApi = (import.meta.env.VITE_API_URL || "https://smart-campus-production-10bf.up.railway.app/api").trim().replace(/\/+$/, "");
  return rawApi.endsWith("/api") ? rawApi : `${rawApi}/api`;
}

export function setApiBase(url) {
  try {
    if (url && url.trim()) {
      localStorage.setItem("campus_api_url", url.trim());
    } else {
      localStorage.removeItem("campus_api_url");
    }
  } catch (e) {}
}

export async function testApiConnection(customUrl = null) {
  const base = customUrl ? (customUrl.trim().replace(/\/+$/, "").endsWith("/api") ? customUrl.trim().replace(/\/+$/, "") : `${customUrl.trim().replace(/\/+$/, "")}/api`) : getApiBase();
  const root = base.replace(/\/api$/, "");
  
  // Try /api/health or root /
  try {
    const res = await fetch(`${root}/`, { method: "GET" });
    if (res.ok) return { success: true, base };
  } catch (e) {}

  try {
    const res = await fetch(`${base}/health`, { method: "GET" });
    if (res.ok) return { success: true, base };
  } catch (e) {}

  try {
    const res = await fetch(`${base}/buses`, { method: "GET" });
    if (res.ok) return { success: true, base };
  } catch (e) {}

  return { success: false, base };
}

export async function fetchFromApi(endpoint, options = {}) {
  const base = getApiBase();
  const response = await fetch(`${base}/${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `API error (${response.status})`);
  }
  return await response.json();
}
