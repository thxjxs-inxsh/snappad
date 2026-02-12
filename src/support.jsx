import "./support.css";
import logo from "./assets/SnapPad.png";
import { useNavigate } from "react-router-dom";

function Support() {
  const navigate = useNavigate();

  return (
    <div id="support-page">
      <img
        src={logo}
        id="logo"
        alt="SnapPad Logo"
        onClick={() => navigate("/dashboard")}
      />
      <p id="name">SNAPPAD</p>
      <h1 className="support-title">Support Us</h1>

      <p className="support-line">
        We thought of getting paid,
        <br />
        but today’s your lucky day.
      </p>

      <p className="support-sub">
        SnapPad is completely free.
        No subscriptions. No ads. No guilt-tripping.
      </p>

      <p className="support-sub">
        If you like using it, that’s already more than enough support for us :)
      </p>

      <p className="support-footer">
        Built by bored students, powered by curiosity.
      </p>
    </div>
  );
}

export default Support;
