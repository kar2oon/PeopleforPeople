import { useState, useEffect } from "react";
import * as api from "../api/campaigns";
import { go } from "../hooks/useHash";

// Start of today in UTC: the server decides "is it active yet" using UTC dates.
const today = () => new Date().toISOString().slice(0, 10);
const EMPTY = { type: "social_cause", title: "", summary: "", description: "", category: "", image_url: "", location: "", business_name: "", offer_text: "", start_date: today(), end_date: "" };

export default function NewCampaign({ editId }) {
  const [f, setF] = useState(EMPTY);
  const [errs, setErrs] = useState({});
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  useEffect(() => {
    if (!editId) return;
    api.getCampaign(editId).then((c) => setF({
      type: c.type, title: c.title, summary: c.summary, description: c.description, category: c.category,
      image_url: c.image_url || "", location: c.location || "", business_name: c.business_name || "",
      offer_text: c.offer_text || "", start_date: c.start_date, end_date: c.end_date || "",
    })).catch((e) => setErr(e.message));
  }, [editId]);

  const save = async (andSubmit) => {
    setErr(""); setErrs({}); setBusy(true);
    // The API rejects empty strings for optional fields, so send null instead.
    const body = { ...f };
    for (const k of ["image_url", "location", "business_name", "offer_text", "end_date"]) body[k] = body[k].trim() || null;
    try {
      const c = editId ? await api.updateCampaign(editId, body) : await api.createCampaign(body);
      if (andSubmit) await api.submitCampaign(c.id);
      go("mine");
    } catch (e) {
      if (e.status === 401) setErr("Please log in again, then retry.");
      else { setErr(e.message); setErrs(Object.fromEntries((e.details || []).map((d) => [d.field, d.message === "Input should be a valid string" || d.message === "Field required" ? "This field is required." : d.message]))); }
    } finally { setBusy(false); }
  };

  const field = (k, label, props = {}) => (<>
    <label htmlFor={k}>{label}</label>
    <input id={k} value={f[k]} onChange={set(k)} {...props} />
    {errs[k] && <div className="err">{errs[k]}</div>}
  </>);

  return (
    <form className="form wide" onSubmit={(e) => { e.preventDefault(); save(true); }} noValidate>
      <h2>{editId ? "Edit campaign" : "Start a campaign"}</h2>
      <p className="muted">Your campaign is reviewed by an administrator before it appears on the homepage.</p>
      <label htmlFor="type">Type</label>
      <select id="type" value={f.type} onChange={set("type")}>
        <option value="social_cause">Social cause</option>
        <option value="business_promotion">Small business promotion</option>
      </select>
      {field("title", "Title (3–120 characters)", { maxLength: 120 })}
      {field("summary", "Short summary (10–280 characters)", { maxLength: 280 })}
      <label htmlFor="description">Full description (at least 20 characters)</label>
      <textarea id="description" rows="5" value={f.description} onChange={set("description")} />
      {errs.description && <div className="err">{errs.description}</div>}
      {field("category", "Category (e.g. environment, community)", { maxLength: 50 })}
      {field("location", "Location (optional)")}
      {f.type === "business_promotion" && <>
        {field("business_name", "Business name")}
        {field("offer_text", "Offer (optional, e.g. 20% off with a reusable cup)")}
      </>}
      {field("image_url", "Image link (optional, https://…)", { type: "url" })}
      {field("start_date", "Start date", { type: "date" })}
      {field("end_date", "End date (optional)", { type: "date" })}
      {errs.null && <div className="err">{errs.null}</div>}
      {err && <div className="err" role="alert">{err}</div>}
      <p className="actions">
        <button className="btn" type="submit" disabled={busy}>{busy ? "Saving…" : "Submit for review"}</button>
        <button className="btn ghost" type="button" disabled={busy} onClick={() => save(false)}>Save as draft</button>
      </p>
    </form>
  );
}
