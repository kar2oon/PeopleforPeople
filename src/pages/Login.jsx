import { useState } from "react";

export default function Login({ users, onLogin, notice }) {
  const [f, setF] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const submit = (e) => {
    e.preventDefault();
    const u = users.find((x) => x.email.toLowerCase() === f.email.trim().toLowerCase() && x.password === f.password);
    if (!u) return setErr("Email or password is incorrect.");
    onLogin(u);
  };
  return (
    <form className="form" onSubmit={submit} noValidate>
      <h2>Log in</h2>
      {notice && <div className="msg">{notice}</div>}
      <div className="msg">Demo account: <b>demo@peopleforpeople.org</b> / <b>demo1234</b></div>
      <label htmlFor="e">Email</label>
      <input id="e" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} autoComplete="email" />
      <label htmlFor="p">Password</label>
      <input id="p" type="password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} autoComplete="current-password" />
      {err && <div className="err" role="alert">{err}</div>}
      <p><button className="btn" type="submit" style={{ width: "100%" }}>Log in</button></p>
      <div className="alt">New here? <a href="#register">Create an account</a></div>
    </form>
  );
}
