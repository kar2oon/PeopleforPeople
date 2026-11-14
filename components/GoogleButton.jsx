import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

// Reads the profile (name, email, picture) from Google's ID token.
// NOTE: in a real app the token must be verified on a backend, not just decoded here.
function decodeJwt(token) {
  const b64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
  const json = decodeURIComponent(
    atob(b64).split("").map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0")).join("")
  );
  return JSON.parse(json);
}

export default function GoogleButton({ onGoogle, mode = "login" }) {
  const [err, setErr] = useState("");

  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    return <div className="msg">Google sign-in is not set up yet. Add VITE_GOOGLE_CLIENT_ID to .env.local (see README).</div>;
  }

  return (
    <div className="g-wrap">
      <GoogleLogin
        text={mode === "register" ? "signup_with" : "signin_with"}
        shape="pill"
        onSuccess={async (res) => {
          try {
            const p = decodeJwt(res.credential);
            if (!p.email || p.email_verified === false) return setErr("Your Google email is not verified.");
            setErr("");
            // The backend verifies this token with Google and starts the session.
            await onGoogle(res.credential);
          } catch (ex) {
            setErr(ex.message || "Google sign-in failed. Please try again.");
          }
        }}
        onError={() => setErr("Google sign-in failed or was cancelled.")}
      />
      {err && <div className="err" role="alert">{err}</div>}
      <div className="divider"><span>or use email</span></div>
    </div>
  );
}
