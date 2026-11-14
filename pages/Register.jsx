import { useState } from "react";
import GoogleButton from "../components/GoogleButton";

export default function Register({ onRegister, onGoogle }) {
  const [f, setF] = useState({ name: "", email: "", password: "", confirm: "", terms: false });
  const [errs, setErrs] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    const v = {};
    if (f.name.trim().length < 2) v.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) v.email = "Enter a valid email address.";
    if (f.password.length < 10) v.password = "Use at least 10 characters.";
    if (f.confirm !== f.password) v.confirm = "Passwords do not match.";
    if (!f.terms) v.terms = "Please accept the terms to continue.";
    setErrs(v);
    if (Object.keys(v).length) return;
    setBusy(true);
    try { await onRegister({ name: f.name.trim(), email: f.email.trim(), password: f.password }); }
    catch (ex) { setErrs({ form: ex.message }); }
    finally { setBusy(false); }
  };
  const E = ({ k }) => errs[k] ? <div className="err" role="alert">{errs[k]}</div> : null;
  return (
    <form className="form" onSubmit={submit} noValidate>
      <h2>Create your account</h2>
      <GoogleButton onGoogle={onGoogle} mode="register" />
      <label htmlFor="n">Full name</label>
      <input id="n" value={f.name} onChange={set("name")} autoComplete="name" /><E k="name" />
      <label htmlFor="re">Email</label>
      <input id="re" type="email" value={f.email} onChange={set("email")} autoComplete="email" /><E k="email" />
      <label htmlFor="rp">Password</label>
      <input id="rp" type="password" value={f.password} onChange={set("password")} autoComplete="new-password" /><E k="password" />
      <label htmlFor="rc">Confirm password</label>
      <input id="rc" type="password" value={f.confirm} onChange={set("confirm")} autoComplete="new-password" /><E k="confirm" />
      <label style={{ fontWeight: 400 }}><input type="checkbox" checked={f.terms} onChange={set("terms")} />I agree to the terms and privacy policy</label>
      <E k="terms" />
      <E k="form" />
      <p><button className="btn" type="submit" style={{ width: "100%" }} disabled={busy}>{busy ? "Creating account…" : "Sign up"}</button></p>
      <div className="alt">Already registered? <a href="#login">Log in</a></div>
    </form>
  );
}
