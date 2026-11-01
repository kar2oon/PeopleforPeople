import { useState } from "react";

export default function Register({ users, onRegister }) {
  const [f, setF] = useState({ name: "", email: "", role: "supporter", password: "", confirm: "", terms: false });
  const [errs, setErrs] = useState({});
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  const submit = (e) => {
    e.preventDefault();
    const v = {};
    if (f.name.trim().length < 2) v.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) v.email = "Enter a valid email address.";
    else if (users.some((u) => u.email.toLowerCase() === f.email.trim().toLowerCase())) v.email = "An account with this email already exists.";
    if (f.password.length < 8) v.password = "Use at least 8 characters.";
    if (f.confirm !== f.password) v.confirm = "Passwords do not match.";
    if (!f.terms) v.terms = "Please accept the terms to continue.";
    setErrs(v);
    if (Object.keys(v).length === 0) onRegister({ name: f.name.trim(), email: f.email.trim(), role: f.role, password: f.password });
  };
  const E = ({ k }) => errs[k] ? <div className="err" role="alert">{errs[k]}</div> : null;
  return (
    <form className="form" onSubmit={submit} noValidate>
      <h2>Create your account</h2>
      <label htmlFor="n">Full name</label>
      <input id="n" value={f.name} onChange={set("name")} autoComplete="name" /><E k="name" />
      <label htmlFor="re">Email</label>
      <input id="re" type="email" value={f.email} onChange={set("email")} autoComplete="email" /><E k="email" />
      <label htmlFor="r">I'm joining as</label>
      <select id="r" value={f.role} onChange={set("role")}>
        <option value="supporter">A supporter (join and create causes)</option>
        <option value="business">A small business owner (promote my business)</option>
      </select>
      <label htmlFor="rp">Password</label>
      <input id="rp" type="password" value={f.password} onChange={set("password")} autoComplete="new-password" /><E k="password" />
      <label htmlFor="rc">Confirm password</label>
      <input id="rc" type="password" value={f.confirm} onChange={set("confirm")} autoComplete="new-password" /><E k="confirm" />
      <label style={{ fontWeight: 400 }}><input type="checkbox" checked={f.terms} onChange={set("terms")} />I agree to the terms and privacy policy</label>
      <E k="terms" />
      <p><button className="btn" type="submit" style={{ width: "100%" }}>Sign up</button></p>
      <div className="alt">Already registered? <a href="#login">Log in</a></div>
    </form>
  );
}
