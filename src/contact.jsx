import "./contact.css";
import logo from "./assets/SnapPad.png";
import { useNavigate } from "react-router-dom";

function Contact() {
  const navigate = useNavigate();

  return (
    <div id="contact-page">
      <img
        src={logo}
        id="logo"
        alt="SnapPad Logo"
        onClick={() => navigate("/dashboard")}
      />

      <h1 className="contact-title">Contact Us</h1>

      <p className="contact-line">
        Something broke?  
        Something confused you?  
        Or you just want to say hi?
      </p>

      <p className="contact-sub">
        We’re just two students building this — but we do read our emails.
      </p>

      <div className="contact-cards">
        <div className="contact-card">
          <h3>Thejas Inesh M</h3>
          <p className="role">Frontend</p>
          <p className="email">thejasinesh678@gmail.com</p>
        </div>

        <div className="contact-card">
          <h3>Hari Hara Sudhan</h3>
          <p className="role">Backend</p>
          <p className="email">hari.shenbagan@gmail.com</p>
        </div>
      </div>

      <p className="contact-footer">
        We might be slow sometimes (We are on the same boat as you, hope you understand).
      </p>
    </div>
  );
}

export default Contact;
