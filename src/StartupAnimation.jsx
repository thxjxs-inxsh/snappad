import { useEffect, useState } from "react";
import "./startup.css";
import logo from "./assets/SnapPad.png";

export default function StartupAnimation({ onFinish }) {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setHide(true), 1200);
    const doneTimer = setTimeout(onFinish, 1500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onFinish]);

  return (
    <div id="startup" className={hide ? "hide" : ""}>
      <div className="startup-center">
        <img src={logo} alt="SnapPad" className="startup-logo" />

        <h1 className="startup-title">
          {"SNAPPAD".split("").map((c, i) => (
            <span key={i}>{c}</span>
          ))}
        </h1>

        <p className="startup-tagline">write. think. remember.</p>
      </div>
    </div>
  );
}
