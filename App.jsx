import { useState, useEffect } from "react";
import { googleLogout } from "@react-oauth/google";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useHash, go } from "./hooks/useHash";
import * as api from "./api/auth";

export default function App() {
  const route = useHash();
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [joinedIds, setJoined] = useState([]);
  const [notice, setNotice] = useState("");

  // Restore the session (cookie) when the page loads or refreshes.
  useEffect(() => {
    api.me().then(setUser).catch(() => setUser(null)).finally(() => setReady(true));
  }, []);

  const finish = async () => { setUser(await api.me()); setNotice(""); go("home"); };
  const login = async (email, password) => { await api.login(email, password); await finish(); };
  const register = async ({ name, email, password }) => {
    await api.register(name, email, password);
    await api.login(email, password);
    await finish();
  };
  const googleSignIn = async (credential) => { await api.googleLogin(credential); await finish(); };
  const logout = async () => {
    try { await api.logout(); } catch { /* clear the screen even if the server is unreachable */ }
    googleLogout();
    setUser(null); setJoined([]); go("home");
  };
  const join = (id) => {
    if (!user) { setNotice("Please log in or sign up to join a campaign."); return go("login"); }
    setJoined((j) => j.includes(id) ? j.filter((x) => x !== id) : [...j, id]);
  };

  useEffect(() => { if (user && (route === "login" || route === "register")) go("home"); }, [route, user]);

  let page;
  if (!ready) page = <p className="wrap" style={{ padding: "40px 16px" }}>Loading…</p>;
  else if (route === "login") page = <Login onLogin={login} onGoogle={googleSignIn} notice={notice} />;
  else if (route === "register") page = <Register onRegister={register} onGoogle={googleSignIn} />;
  else page = <Home user={user} joinedIds={joinedIds} onJoin={join} />;

  return (<>
    <Header user={user} onLogout={logout} />
    {page}
    <footer><div className="wrap">PeopleforPeople prototype</div></footer>
  </>);
}
