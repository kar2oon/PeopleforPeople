import { useState } from "react";
import GoogleButton from "../components/GoogleButton";

export default function Login({ onLogin, onGoogle, notice }) {
  const [f, setF] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setBusy(true);
    try { await onLogin(f.email.trim(), f.password); }
    catch (ex) { setErr(ex.message); }
    finally { setBusy(false); }
  };
  return (
    <form className="form" onSubmit={submit} noValidate>
      <h2>Log in</h2>
      {notice && <div className="msg">{notice}</div>}
      <GoogleButton onGoogle={onGoogle} mode="login" />
      <label htmlFor="e">Email</label>
      <input id="e" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} autoComplete="email" />
      <label htmlFor="p">Password</label>
      <input id="p" type="password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} autoComplete="current-password" />
      {err && <div className="err" role="alert">{err}</div>}
      <p><button className="btn" type="submit" style={{ width: "100%" }} disabled={busy}>{busy ? "Logging in…" : "Log in"}</button></p>
      <div className="alt">New here? <a href="#register">Create an account</a></div>
    </form>
  );
}
