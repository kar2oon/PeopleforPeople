// Talks to Aftab's auth-backend. Cookies carry the login session, so every call uses credentials: "include".
// Relative URLs ("/auth/...") go through the Vite proxy locally and a Vercel rewrite when deployed,
// so the login cookie belongs to our own site and is also sent to the campaign API.
const API = import.meta.env.VITE_API_URL ?? "";

async function request(path, options = {}) {
  const res = await fetch(API + path, { credentials: "include", headers: { "Content-Type": "application/json" }, ...options });
  if (res.status === 429) throw new Error("Too many attempts. Please wait a few minutes and try again.");
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
}

export const register = (name, email, password) => request("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) });
export const login = (email, password) => request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
export const googleLogin = (credential) => request("/auth/google", { method: "POST", body: JSON.stringify({ credential }) });
export const me = () => request("/auth/me");
export const logout = () => request("/auth/logout", { method: "POST" });
