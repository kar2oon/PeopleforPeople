// Talks to Suraj's Campaign API (all routes start with /api). Same-origin, so the login cookie is sent automatically.
const TYPE = { social_cause: "cause", business_promotion: "business" };
const titleCase = (s) => (s || "").replace(/\b\w/g, (m) => m.toUpperCase());

async function request(path, options = {}) {
  const res = await fetch(path, {
    credentials: "include",
    headers: options.body ? { "Content-Type": "application/json" } : {},
    ...options,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const e = new Error(data?.error?.message || "Something went wrong. Please try again.");
    e.code = data?.error?.code;
    e.status = res.status;
    e.details = data?.error?.details || [];
    throw e;
  }
  return data;
}
const send = (method, body) => ({ method, body: body ? JSON.stringify(body) : undefined });

// API campaign -> the shape the cards use.
export function fromApi(c) {
  return {
    id: c.id,
    type: TYPE[c.type] || "cause",
    cat: c.type === "business_promotion" ? "Small Business" : titleCase(c.category),
    title: c.title,
    by: c.business_name || c.location || "Community campaign",
    desc: c.summary,
    count: c.participants ?? 0,
    isJoined: !!c.joined,
  };
}

// Public
export const listCampaigns = async () => (await request("/api/campaigns?page_size=50")).items.map(fromApi);
// Joining
export const joinCampaign = (id) => request(`/api/campaigns/${id}/join`, send("POST"));
export const leaveCampaign = (id) => request(`/api/campaigns/${id}/join`, send("DELETE"));
// Owner
export const getCampaign = (id) => request(`/api/campaigns/${id}`);
export const createCampaign = (body) => request("/api/campaigns", send("POST", body));
export const updateCampaign = (id, body) => request(`/api/campaigns/${id}`, send("PUT", body));
export const submitCampaign = (id) => request(`/api/campaigns/${id}/submit`, send("POST"));
export const archiveCampaign = (id) => request(`/api/campaigns/${id}/archive`, send("POST"));
export const myCampaigns = async () => (await request("/api/me/campaigns?page_size=50")).items;
// Admin
export const adminQueue = async (status = "PENDING") => (await request(`/api/admin/campaigns?status=${status}&page_size=50`)).items;
export const approveCampaign = (id) => request(`/api/admin/campaigns/${id}/approve`, send("POST"));
export const rejectCampaign = (id, reason) => request(`/api/admin/campaigns/${id}/reject`, send("POST", { reason }));
