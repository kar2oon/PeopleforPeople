export default function CampaignCard({ c, onToggle, busy }) {
  const label = c.type === "business" ? "interested" : "supporters";
  return (
    <article className="card">
      <span className={"tag" + (c.type === "business" ? " biz" : "")}>{c.type === "business" ? "Business spotlight" : c.cat}</span>
      <h3>{c.title}</h3>
      <div className="by">by {c.by}</div>
      <p>{c.desc}</p>
      <div className="row"><span>{c.count} {label}</span></div>
      <button className={"btn" + (c.isJoined ? " ghost" : "")} onClick={() => onToggle(c)} disabled={busy}>
        {c.isJoined ? "✓ Joined (tap to leave)" : c.type === "business" ? "Get in touch" : "Join this cause"}
      </button>
    </article>
  );
}
