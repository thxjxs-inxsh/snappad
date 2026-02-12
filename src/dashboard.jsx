import { useState, useEffect } from "react";
import "./dashboard.css";
import logo from "./assets/SnapPad.png";
import settings from "./assets/settings.png";
import del from "./assets/delete.png";
import { useNavigate } from "react-router-dom";

function Dashboard({ darkMode, toggleMode }) {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteNoteId, setDeleteNoteId] = useState(null);
  const [title, setTitle] = useState("");

  // 🔐 JWT helper
  const authFetch = (url, options = {}) => {
    const token = localStorage.getItem("token");

    return fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {})
      }
    });
  };

  // 📥 Load notebooks
  useEffect(() => {
    authFetch(`${API_BASE}/api/notebooks`)
      .then(res => res.json())
      .then(data => setNotes(data))
      .catch(() => {
        navigate("/login");
        alert("Failed to load notebooks");
  });
  }, []);

  // ➕ Create notebook
  const handleCreateNotebook = async () => {
    if (!title.trim()) return alert("Title cannot be empty");

    try {
      const res = await authFetch(
        `${API_BASE}/api/notebooks`,
        {
          method: "POST",
          body: JSON.stringify({ title })
        }
      );

      if (!res.ok) throw new Error();

      const newNotebook = await res.json();

      setNotes(prev => [newNotebook, ...prev]);
      setTitle("");
      setAddOpen(false);

      navigate(`/editor/${newNotebook.notebookId}`);
    } catch {
      alert("Failed to create notebook");
    }
  };

  // 🗑️ Delete notebook
  const handleDeleteNotebook = async () => {
    try {
      const res = await authFetch(
        `${API_BASE}/api/notebooks/${deleteNoteId}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error();

      setNotes(prev =>
        prev.filter(note => note.notebookId !== deleteNoteId)
      );

      setDeleteNoteId(null);
    } catch {
      alert("Failed to delete notebook");
    }
  };

  const logout = async () => {
    localStorage.clear();
    navigate('/login', { replace: true });
    alert("Logged out successfully!");
  }
  const formatLastEdited = (timestamp) => {
  if (!timestamp) return "";

  const utcDate = new Date(timestamp + "Z"); // 👈 FORCE UTC

  return utcDate.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
};



  return (
    <div id="dashboard-page">
      <img src={logo} id="logo" alt="SnapPad Logo" onClick={() => navigate("/dashboard")}/>

      <img
        src={settings}
        id="settings"
        alt="settings"
        onClick={() => setSettingsOpen(true)}
      />

      {settingsOpen && (
        <div className="settings-overlay">
          <div className="settings-panel">
            <button id="close" onClick={() => setSettingsOpen(false)}>X</button>
            <button id="mode" onClick={toggleMode}>
              {darkMode ? "Dark Mode" : "Light Mode"}
            </button>
            <button id="logout" onClick={logout}>Log Out</button>
          </div>
        </div>
      )}

      <p id="name">SNAPPAD </p>

      <div className="dashboard-head">
        <p id="welcome">Welcome!</p>
        <button id="add" onClick={() => setAddOpen(true)}>+</button>
      </div>

      {/* ➕ CREATE PANEL */}
      {addOpen && (
        <div className="add-overlay">
          <div className="add-panel">
            <button id="close" onClick={() => setAddOpen(false)}>X</button>
            <p>Name your notebook</p>
            <input
              id="new-title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Untitled"
            />
            <button id="create" onClick={handleCreateNotebook}>
              Create Notebook
            </button>
          </div>
        </div>
      )}

      {/* 🗑️ DELETE CONFIRM PANEL */}
      {deleteNoteId !== null && (
        <div className="del-overlay">
          <div className="del-panel">
            <button id="close" onClick={() => setDeleteNoteId(null)}>X</button>
            <p>Are you sure?</p>
            <p>This action cannot be undone</p>
            <button id="del" onClick={handleDeleteNotebook}>
              Delete
            </button>
          </div>
        </div>
      )}

      <div id="dashboard">
        <div className="notes-container">
          {notes.map(note => (
            <div
              key={note.notebookId}
              className="note-card"
              onClick={() => navigate(`/editor/${note.notebookId}`)}
            >
              <img
                src={del}
                className="delete-btn"
                alt="delete"
                onClick={e => {
                  e.stopPropagation();
                  setDeleteNoteId(note.notebookId);
                }}
              />
              <h3>{note.title}</h3>
              <p className="last-edited">
  Last edited · {formatLastEdited(note.updatedAt)}
</p>


            </div>
          ))}
        </div>
      </div>


<footer id="footer">
  <div class="footer-links">
     <a onClick={() => navigate("/about")}>About Us</a>
  <a onClick={() => navigate("/support")}>Support Us</a>
  <a onClick={() => navigate("/contact")}>Contact Us</a>
  </div>
  <p id="footer-version">SnapPad v1.0.0 • 2026</p>
</footer>

    </div>
  );
}

export default Dashboard;
