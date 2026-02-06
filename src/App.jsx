import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./login.jsx";
import Signup from "./signup.jsx";
import Dashboard from "./dashboard.jsx";
import Editor from "./editor.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const toggleMode = () => setDarkMode(prev => !prev);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <Routes>
      {/* 🌐 DEFAULT */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 🌐 PUBLIC ROUTES */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* 🔒 PROTECTED ROUTES */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard darkMode={darkMode} toggleMode={toggleMode} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/editor/:id"
        element={
          <ProtectedRoute>
            <Editor darkMode={darkMode} toggleMode={toggleMode} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
