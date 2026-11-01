export default function CampaignCard({ c, joined, onJoin }) {
  const count = c.joined + (joined ? 1 : 0);
  const pct = Math.min(100, Math.round((count / c.goal) * 100));
  return (
    <article className="card">
      <span className={"tag" + (c.type === "business" ? " biz" : "")}>{c.type === "business" ? "Business spotlight" : c.cat}</span>
      <h3>{c.title}</h3>
      <div className="by">by {c.by}</div>
      <p>{c.desc}</p>
      <div className="bar" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100"><i style={{ width: pct + "%" }} /></div>
      <div className="row"><span>{count} of {c.goal} {c.type === "business" ? "interested" : "supporters"}</span><span>{pct}%</span></div>
      <button className={"btn" + (joined ? " ghost" : "")} onClick={() => onJoin(c.id)}>
        {joined ? "✓ Joined (tap to leave)" : c.type === "business" ? "Get in touch" : "Join this cause"}
      </button>
    </article>
  );
}
