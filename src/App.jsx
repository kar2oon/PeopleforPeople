import { useState, useEffect } from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useHash, go } from "./hooks/useHash";

export default function App() {
  const route = useHash();
  const [users, setUsers] = useState([{ name: "Demo User", email: "demo@peopleforpeople.org", password: "demo1234", role: "supporter" }]);
  const [user, setUser] = useState(null);
  const [joinedIds, setJoined] = useState([]);
  const [notice, setNotice] = useState("");

  const login = (u) => { setUser(u); setNotice(""); go("home"); };
  const logout = () => { setUser(null); setJoined([]); go("home"); };
  const register = (u) => { setUsers([...users, u]); setUser(u); go("home"); };
  const join = (id) => {
    if (!user) { setNotice("Please log in or sign up to join a campaign."); return go("login"); }
    setJoined((j) => j.includes(id) ? j.filter((x) => x !== id) : [...j, id]);
  };

  useEffect(() => { if (user && (route === "login" || route === "register")) go("home"); }, [route, user]);

  let page;
  if (route === "login") page = <Login users={users} onLogin={login} notice={notice} />;
  else if (route === "register") page = <Register users={users} onRegister={register} />;
  else page = <Home user={user} joinedIds={joinedIds} onJoin={join} />;

  return (<>
    <Header user={user} onLogout={logout} />
    {page}
    <footer><div className="wrap">PeopleforPeople prototype · front end only, no real data is stored</div></footer>
  </>);
}
