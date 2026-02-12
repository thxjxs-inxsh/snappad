import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./login.jsx";
import Signup from "./signup.jsx";
import Dashboard from "./dashboard.jsx";
import Editor from "./editor.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import StartupAnimation from "./StartupAnimation.jsx";

import "./App.css";

function App() {
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

  /* ---------------- STARTUP GATE ---------------- */
  // 🚫 NOTHING ELSE is allowed to render before splash finishes
  if (showSplash) {
    return (
      <StartupAnimation
        onFinish={() => setShowSplash(false)}
      />
    );
  }

  /* ---------------- ROUTES ---------------- */
  return (
    <Routes>
      {/* 🌐 DEFAULT */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 🌐 PUBLIC ROUTES */}
      <Route
        path="/login"
        element={
          <Login
            setBuffering={setBuffering}
          />
        }
      />

      <Route
        path="/signup"
        element={
          <Signup
            setBuffering={setBuffering}
          />
        }
      />

      {/* 🔒 PROTECTED ROUTES */}
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
    </Routes>
  );
}

export default App;
