import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";
import logo from "./assets/SnapPad.png";

function Signup({ setBuffering }) {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== rePassword) {
      alert("Passwords do not match");
      return;
    }

    setBuffering(true); // 🔄 START BUFFER

    try {
      const res = await fetch(`${API_BASE}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }

      alert("User registered successfully!");

      // ✅ redirect to login
      navigate("/login");

    } catch (err) {
      alert("Signup failed");
      console.error(err);
    } finally {
      setBuffering(false); // 🔄 STOP BUFFER
    }
  };

  return (
    <div id="signup-page">
      <img src={logo} id="logo" alt="SnapPad Logo" onClick={() => navigate("/dashboard")}/>
      <p id="name">SNAPPAD</p>

      <div id="signup">
        <p id="message">Welcome to SnapPad, create your account</p>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Username"
            className="button_signup"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="button_signup"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Re-enter Password"
            className="button_signup"
            value={rePassword}
            onChange={e => setRePassword(e.target.value)}
            required
          />

          <button type="submit">Sign Up</button>
        </form>

        <p id="signin_message">
          Already Signed Up? <a href="/login">Sign in</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
