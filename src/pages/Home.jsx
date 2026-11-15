import { useState, useEffect } from "react";
import CampaignCard from "../components/CampaignCard";
import { CAMPAIGNS as SAMPLE } from "../data/campaigns";
import * as api from "../api/campaigns";

// Sample data uses older field names; convert it to the same shape as live campaigns.
const sample = SAMPLE.map((c) => ({ id: c.id, type: c.type, cat: c.cat, title: c.title, by: c.by, desc: c.desc, count: c.joined, isJoined: false }));

export default function Home({ user, onNeedLogin }) {
  const [cat, setCat] = useState("All");
  const [campaigns, setCampaigns] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | live | sample
  const [busyId, setBusyId] = useState(null);
  const [msg, setMsg] = useState("");

  // Reload when the user logs in or out so each card's "joined" flag is correct.
  useEffect(() => {
    api.listCampaigns()
      .then((list) => { setCampaigns(list); setStatus("live"); })
      .catch(() => { setCampaigns(sample); setStatus("sample"); });
  }, [user?.id]);

  const toggle = async (c) => {
    if (!user) return onNeedLogin();
    setMsg("");
    const patch = (isJoined, count) => setCampaigns((l) => l.map((x) => (x.id === c.id ? { ...x, isJoined, count } : x)));
    if (status === "sample") return patch(!c.isJoined, c.count + (c.isJoined ? -1 : 1)); // no server: local only
    setBusyId(c.id);
    try {
      const r = c.isJoined ? await api.leaveCampaign(c.id) : await api.joinCampaign(c.id);
      patch(r.joined, r.participants);
    } catch (e) {
      setMsg(e.status === 401
        ? "The campaign service did not receive your login. Check that /api and /auth both go through the proxy."
        : e.message);
    } finally { setBusyId(null); }
  };

  const cats = ["All", ...new Set(campaigns.map((c) => c.cat))];
  const list = campaigns.filter((c) => cat === "All" || c.cat === cat);

  return (<>
    <section className="wrap hero">
      <h1>Causes close to your heart. Businesses worth backing.</h1>
      <p>PeopleforPeople is a place to start or join social awareness campaigns, and for small business owners to promote what they do and find new customers.</p>
      {!user && <a className="btn" href="#register">Create a free account</a>}
      <div className="stats">
        <div><b>{campaigns.length}</b><small>active campaigns</small></div>
        <div><b>{campaigns.reduce((a, c) => a + c.count, 0).toLocaleString()}</b><small>people taking part</small></div>
        <div><b>{campaigns.filter((c) => c.type === "business").length}</b><small>local businesses</small></div>
      </div>
    </section>
    <main className="wrap">
      <h2>Campaigns</h2>
      {status === "loading" && <p>Loading campaigns…</p>}
      {status === "sample" && <div className="msg" role="status">Showing sample campaigns because the campaign service could not be reached.</div>}
      {status === "live" && campaigns.length === 0 && <p>No approved campaigns yet. <a href="#new">Start the first one.</a></p>}
      {msg && <div className="err" role="alert">{msg}</div>}
      <div className="chips">
        {cats.map((x) => <button key={x} className={"chip" + (cat === x ? " on" : "")} onClick={() => setCat(x)}>{x}</button>)}
      </div>
      <div className="grid">
        {list.map((c) => <CampaignCard key={c.id} c={c} onToggle={toggle} busy={busyId === c.id} />)}
      </div>
    </main>
  </>);
}
