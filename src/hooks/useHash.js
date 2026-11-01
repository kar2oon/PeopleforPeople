import { useState, useEffect } from "react";

export function useHash() {
  const read = () => (location.hash.replace("#", "") || "home");
  const [h, setH] = useState(read);
  useEffect(() => { const f = () => setH(read()); window.addEventListener("hashchange", f); return () => window.removeEventListener("hashchange", f); }, []);
  return h;
}
export const go = (p) => { location.hash = p; window.scrollTo(0, 0); };
