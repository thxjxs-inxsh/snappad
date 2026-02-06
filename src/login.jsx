import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import logo from "./assets/SnapPad.png";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://172.16.61.79:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      // ✅ BACKEND RETURNS TOKEN HERE
      const data = await res.json();

      // 🔐 STORE TOKEN
      localStorage.setItem("token", data.token);

      // ✅ REDIRECT AFTER LOGIN
      navigate("/dashboard");

    } catch (err) {
      alert("Login failed");
      console.error(err);
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
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />

          <input
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
