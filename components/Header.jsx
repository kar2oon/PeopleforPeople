export default function Header({ user, onLogout }) {
  return (
    <header><div className="wrap nav">
      <a className="logo" href="#home">People<span>for</span>People</a>
      <div className="nav-r">
        {user ? (<>
          {user.picture && <img className="avatar" src={user.picture} alt="" referrerPolicy="no-referrer" />}
          <span className="hi">Hi, {(user.name || user.email).split(/[ @]/)[0]}</span>
          <button className="btn ghost sm" onClick={onLogout}>Log out</button>
        </>) : (<>
          <a className="btn ghost sm" href="#login">Log in</a>
          <a className="btn sm" href="#register">Sign up</a>
        </>)}
      </div>
    </div></header>
  );
}
