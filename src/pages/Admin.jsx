import { useState, useEffect } from "react";
import * as api from "../api/campaigns";

export default function Admin() {
  const [items, setItems] = useState(null);
  const [err, setErr] = useState("");
  const [rejecting, setRejecting] = useState(null); // campaign id
  const [reason, setReason] = useState("");
  const load = () => api.adminQueue("PENDING").then(setItems).catch((e) => { setErr(e.message); setItems([]); });
  useEffect(() => { load(); }, []);

  const run = async (fn) => { setErr(""); try { await fn(); setRejecting(null); setReason(""); await load(); } catch (e) { setErr(e.message); } };

  return (
    <main className="wrap">
      <h2>Moderation queue</h2>
      <p className="muted">Campaigns waiting for review, oldest first.</p>
      {err && <div className="err" role="alert">{err}</div>}
      {items === null && <p>Loading…</p>}
      {items?.length === 0 && !err && <p>Nothing waiting for review.</p>}
      <div className="grid">
        {items?.map((c) => (
          <article className="card" key={c.id}>
            <span className={"tag" + (c.type === "business_promotion" ? " biz" : "")}>{c.type === "business_promotion" ? "Business" : "Social cause"} · {c.category}</span>
            <h3>{c.title}</h3>
            <p>{c.description}</p>
            <div className="by">Created by user #{c.created_by}</div>
            {rejecting === c.id ? (<>
              <label htmlFor={"r" + c.id}>Reason for rejection (10–500 characters)</label>
              <textarea id={"r" + c.id} rows="3" value={reason} onChange={(e) => setReason(e.target.value)} />
              <div className="actions">
                <button className="btn sm" onClick={() => run(() => api.rejectCampaign(c.id, reason))}>Confirm reject</button>
                <button className="btn ghost sm" onClick={() => setRejecting(null)}>Cancel</button>
              </div>
            </>) : (
              <div className="actions">
                <button className="btn sm" onClick={() => run(() => api.approveCampaign(c.id))}>Approve</button>
                <button className="btn ghost sm" onClick={() => { setRejecting(c.id); setReason(""); }}>Reject…</button>
              </div>
            )}
          </article>
        ))}
      </div>
    </main>
  );
}
