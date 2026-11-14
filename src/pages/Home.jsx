import { useState } from "react";
import CampaignCard from "../components/CampaignCard";
import { CAMPAIGNS, CATS } from "../data/campaigns";

export default function Home({ user, joinedIds, onJoin }) {
  const [cat, setCat] = useState("All");
  const list = CAMPAIGNS.filter((c) => cat === "All" || c.cat === cat);
  return (<>
    <section className="wrap hero">
      <h1>Causes close to your heart. Businesses worth backing.</h1>
      <p>PeopleforPeople is a place to start or join social awareness campaigns, and for small business owners to promote what they do and find new customers.</p>
      {!user && <a className="btn" href="#register">Create a free account</a>}
      <div className="stats">
        <div><b>{CAMPAIGNS.length}</b><small>active campaigns</small></div>
        <div><b>{CAMPAIGNS.reduce((a, c) => a + c.joined, 0).toLocaleString()}</b><small>people taking part</small></div>
        <div><b>{CAMPAIGNS.filter((c) => c.type === "business").length}</b><small>local businesses</small></div>
      </div>
    </section>
    <main className="wrap">
      <h2>Campaigns</h2>
      <div className="chips">
        {CATS.map((x) => <button key={x} className={"chip" + (cat === x ? " on" : "")} onClick={() => setCat(x)}>{x}</button>)}
      </div>
      <div className="grid">
        {list.map((c) => <CampaignCard key={c.id} c={c} joined={joinedIds.includes(c.id)} onJoin={onJoin} />)}
      </div>
    </main>
  </>);
}
