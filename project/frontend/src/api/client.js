// API client with automatic URL normalization and cloud-safe fallbacks

const rawApi = (import.meta.env.VITE_API_URL || "http://localhost:8080/api").trim().replace(/\/+$/, "");
export const API_BASE = rawApi.endsWith("/api") ? rawApi : `${rawApi}/api`;

export async function fetchFromApi(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}/${endpoint}`, {
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
  } catch (err) {
    throw err;
  }
}
