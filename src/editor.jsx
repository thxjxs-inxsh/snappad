import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./editor.css";
import logo from "./assets/SnapPad.png";
import settings from "./assets/settings.png";

function Editor({ darkMode, toggleMode }) {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("Untitled");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [status, setStatus] = useState("Saved");

  let saveTimeout = null;

  const authFetch = (url, options = {}) => {
    const token = localStorage.getItem("token");
    return fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });
  };

  // Load notebook
  useEffect(() => {
    authFetch(`${API_BASE}/api/notebooks/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title);
        setContent(data.content || "");
      })
      .catch(() => alert("Failed to load notebook"));
  }, [id]);

  // Auto-save (debounced)
  const triggerAutosave = () => {
    setStatus("Saving...");
    if (saveTimeout) clearTimeout(saveTimeout);

    saveTimeout = setTimeout(async () => {
      try {
        await authFetch(`${API_BASE}/api/notebooks/${id}`, {
          method: "PUT",
          body: JSON.stringify({ title, content }),
        });
        setStatus("Auto Saved");
      } catch {
        setStatus("Save failed");
      }
    }, 800);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    triggerAutosave();
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    triggerAutosave();
  };

  const logout = async () => {
    localStorage.clear();
    navigate("/login", { replace: true });
    alert("Logged out successfully!");
  };

  return (
    <>
      <img
        src={logo}
        id="logo"
        alt="SnapPad Logo"
        onClick={() => navigate("/dashboard")}
      />

      <input
        id="title"
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="Untitled"
      />

      <p id="name">SNAPPAD</p>
      <p id="auto">{status}</p>

      <img
        src={settings}
        id="settings"
        alt="settings"
        onClick={() => setSettingsOpen(true)}
      />

      {settingsOpen && (
        <div className="settings-overlay">
          <div className="settings-panel">
            <button id="close" onClick={() => setSettingsOpen(false)}>
              X
            </button>
            <button id="mode" onClick={toggleMode}>
              {darkMode ? "Dark Mode" : "Light Mode"}
            </button>
            <button id="logout" onClick={logout}>
              Log Out
            </button>
          </div>
        </div>
      )}

      <textarea
  id="editor"
  value={content}
  onChange={handleContentChange}
  placeholder="Start writing..."
/>

    </>
  );
}

export default Editor;
