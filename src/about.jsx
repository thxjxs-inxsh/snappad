import "./about.css";
import logo from "./assets/SnapPad.png";
import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();

  return (
    <div id="about-page">
      <img
        src={logo}
        id="logo"
        alt="SnapPad Logo"
        onClick={() => navigate("/dashboard")}
      />
    <p id="name">SNAPPAD</p>
      <h1 className="about-title">About SnapPad</h1>

      <p className="about-intro">
        SnapPad is a quick note-saving app built to reduce the delay students
        often face when trying to jot something down instantly.
      </p>

      <p className="about-intro">
        Whether it’s a sudden idea, a lecture point, or a reminder — SnapPad is
        designed to stay out of your way and let you write first, think later.
      </p>

      <div className="about-section">
        <h2>Why we built this</h2>
        <p>
          We built SnapPad because we were bored — we wanted to build something genuinely useful (we think we did, atleast till now). 
        </p>
        <p>
          This project started as curiosity and slowly turned into a product we
          actually enjoy using ourselves.
        </p>
      </div>

      <div className="about-section">
        <h2>The people behind SnapPad</h2>

        <div className="team">
          <div className="member">
            <h3>Thejas Inesh M</h3>
            <p>Frontend Developer</p>
            <p className="muted">CSE (AI/ML), VIT Chennai</p>
            <p className="email">thejasinesh678@gmail.com</p>
          </div>

          <div className="member">
            <h3>Hari Hara Sudhan</h3>
            <p>Backend Developer</p>
            <p className="muted">CSE (AI/ML), VIT Chennai</p>
            <p className="email">hari.shenbagan@gmail.com</p>
          </div>
        </div>
      </div>

      <p className="about-footer">
        Built by students. Built for students.
      </p>
    </div>
  );
}

export default About;
