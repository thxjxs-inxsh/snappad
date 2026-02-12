import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./login.jsx";
import Signup from "./signup.jsx";
import Dashboard from "./dashboard.jsx";
import Editor from "./editor.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import StartupAnimation from "./StartupAnimation.jsx";

import "./App.css";
import About from "./about.jsx";
import Support from "./support.jsx";
import Contact from "./contact.jsx";




function App() {
  const location = useLocation();

  /* ---------------- STARTUP ANIMATION ---------------- */
  const [showSplash, setShowSplash] = useState(true);

  /* ---------------- BUFFER (LOGIN / TRANSITIONS) ---------------- */
  const [buffering, setBuffering] = useState(false);

  /* ---------------- DARK MODE ---------------- */
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const toggleMode = () => setDarkMode(prev => !prev);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  /* ---------------- SPLASH GATE (ONLY /login) ---------------- */
  if (showSplash && location.pathname === "/login") {
    return (
      <StartupAnimation
        onFinish={() => setShowSplash(false)}
      />
    );
  }

  /* ---------------- ROUTES ---------------- */
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route
        path="/login"
        element={<Login setBuffering={setBuffering} />}
      />

      <Route
        path="/signup"
        element={<Signup setBuffering={setBuffering} />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard
              darkMode={darkMode}
              toggleMode={toggleMode}
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/editor/:id"
        element={
          <ProtectedRoute>
            <Editor
              darkMode={darkMode}
              toggleMode={toggleMode}
            />
          </ProtectedRoute>
        }
      />
      <Route path="/about" element={<About />} />
      <Route path="/support" element={<Support />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}

export default App;
