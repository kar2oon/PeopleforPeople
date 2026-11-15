import { useState, useEffect } from "react";
import { googleLogout } from "@react-oauth/google";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NewCampaign from "./pages/NewCampaign";
import MyCampaigns from "./pages/MyCampaigns";
import Admin from "./pages/Admin";
import { useHash, go } from "./hooks/useHash";
import * as api from "./api/auth";

export default function App() {
  const route = useHash();
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
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
    setUser(null); go("home");
  };
  const needLogin = () => { setNotice("Please log in or sign up to continue."); go("login"); };

  useEffect(() => { if (user && (route === "login" || route === "register")) go("home"); }, [route, user]);

  let page;
  const protectedRoute = route === "new" || route === "mine" || route === "admin" || route.startsWith("edit-");
  if (!ready) page = <p className="wrap" style={{ padding: "40px 16px" }}>Loading…</p>;
  else if (route === "login") page = <Login onLogin={login} onGoogle={googleSignIn} notice={notice} />;
  else if (route === "register") page = <Register onRegister={register} onGoogle={googleSignIn} />;
  else if (protectedRoute && !user) page = <Login onLogin={login} onGoogle={googleSignIn} notice="Please log in to continue." />;
  else if (route === "new") page = <NewCampaign key="new" />;
  else if (route.startsWith("edit-")) page = <NewCampaign key={route} editId={route.slice(5)} />;
  else if (route === "mine") page = <MyCampaigns />;
  else if (route === "admin") page = user.role === "admin" ? <Admin /> : <p className="wrap" style={{ padding: "40px 16px" }}>Only administrators can see this page.</p>;
  else page = <Home user={user} onNeedLogin={needLogin} />;

  return (<>
    <Header user={user} onLogout={logout} />
    {page}
    <footer><div className="wrap">PeopleforPeople prototype</div></footer>
  </>);
}
