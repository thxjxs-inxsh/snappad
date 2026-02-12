import { useEffect, useState } from "react";
import "./startup.css";
import logo from "./assets/SnapPad.png";

export default function StartupAnimation({ onFinish }) {
  const [phase, setPhase] = useState("enter"); 
  // enter → exit → done

  useEffect(() => {
    // Let full animation play
    const exitTimer = setTimeout(() => {
      setPhase("exit");
    }, 6200); // animation fully visible

    // Unmount AFTER fade-out
    const doneTimer = setTimeout(() => {
      onFinish();
    }, 7400); // exit animation complete
    console.log("splash mounted");
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
      console.log("splash unmounted");
    };
  }, [onFinish]);

  return (
    <div
      id="startup"
      className={phase === "exit" ? "hide" : ""}
    >
      <div className="startup-center">
        <img src={logo} alt="SnapPad" className="startup-logo" />

        <h1 className="startup-title">
          {"SNAPPAD".split("").map((c, i) => (
            <span key={i}>{c}</span>
          ))}
        </h1>

        <p className="startup-tagline">
          write. think. remember.
        </p>
      </div>
    </div>
  );
}
