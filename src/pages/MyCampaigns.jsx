import { useState, useEffect } from "react";
import * as api from "../api/campaigns";

const LABEL = { DRAFT: "Draft", PENDING: "Waiting for review", APPROVED: "Live", REJECTED: "Needs changes", ARCHIVED: "Archived" };

export default function MyCampaigns() {
  const [items, setItems] = useState(null);
  const [err, setErr] = useState("");
  const load = () => api.myCampaigns().then(setItems).catch((e) => { setErr(e.message); setItems([]); });
  useEffect(() => { load(); }, []);

  const act = (fn) => async () => { setErr(""); try { await fn(); await load(); } catch (e) { setErr(e.message); } };

  return (
    <main className="wrap">
      <h2>My campaigns</h2>
      <p><a className="btn sm" href="#new">+ Start a campaign</a></p>
      {err && <div className="err" role="alert">{err}</div>}
      {items === null && <p>Loading…</p>}
      {items?.length === 0 && !err && <p>You have not started any campaigns yet.</p>}
      <div className="grid">
        {items?.map((c) => (
          <article className="card" key={c.id}>
            <span className={"status s-" + c.status}>{LABEL[c.status]}</span>
            <h3>{c.title}</h3>
            <p>{c.summary}</p>
            {c.status === "REJECTED" && c.rejection_reason && <div className="err">Reviewer note: {c.rejection_reason}</div>}
            <div className="row"><span>{c.participants} supporters</span></div>
            <div className="actions">
              {(c.status === "DRAFT" || c.status === "REJECTED") && <>
                <a className="btn ghost sm" href={`#edit-${c.id}`}>Edit</a>
                <button className="btn sm" onClick={act(() => api.submitCampaign(c.id))}>Submit for review</button>
              </>}
              {c.status === "APPROVED" && <button className="btn ghost sm" onClick={act(() => api.archiveCampaign(c.id))}>Archive</button>}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
