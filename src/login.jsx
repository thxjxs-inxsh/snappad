import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import logo from "./assets/SnapPad.png";

function Login({ setBuffering }) {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setBuffering(true); // 🔄 START BUFFER

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      // ✅ BACKEND RETURNS TOKEN
      const data = await res.json();

      // 🔐 STORE TOKEN
      localStorage.setItem("token", data.token);

      // ✅ REDIRECT AFTER LOGIN
      navigate("/dashboard");

    } catch (err) {
      alert("Login failed");
      console.error(err);
    } finally {
      setBuffering(false); // 🔄 STOP BUFFER
    }
  };

  return (
    <div id="login-page">
      <img src={logo} id="logo" alt="SnapPad Logo" />
      <p id="name">SNAPPAD</p>

      <div id="login">
        <p id="message">Welcome back</p>

        <form onSubmit={handleLogin}>
          <input
            id="user"
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />

          <input
            id="pass"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>

        <p>
          New user? <a href="/signup">Create account</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
