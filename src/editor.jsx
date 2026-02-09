import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./editor.css";
import logo from "./assets/SnapPad.png";
import settings from "./assets/settings.png";

function Editor({ darkMode, toggleMode }) {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const { id } = useParams(); // notebookId from URL
  const navigate = useNavigate();
  const [pages, setPages] = useState([""]);
  const [title, setTitle] = useState("Untitled");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [status, setStatus] = useState("Saved");

  const pageRefs = useRef([]);
  const saveTimeout = useRef(null);

  // 🔐 JWT fetch helper
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

  // 📥 Load notebook
  useEffect(() => {
    authFetch(`${API_BASE}/api/notebooks/${id}`)
      .then(res => res.json())
      .then(data => {
        setTitle(data.title);
        setPages(data.content ? data.content.split("\n\n") : [""]);
      })
      .catch(() => alert("Failed to load notebook"));
  }, [id]);

  // 💾 AUTOSAVE (debounced)
  const triggerAutosave = () => {
    setStatus("Saving...");

    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(async () => {
      try {
        await authFetch(
          `${API_BASE}/api/notebooks/${id}`,
          {
            method: "PUT",
            body: JSON.stringify({
              title,
              content: pages.join("\n\n")
            })
          }
        );
        setStatus("Auto Saved");
      } catch {
        setStatus("Save failed");
      }
    }, 800); // ⏱ debounce delay
  };

  // ✏️ Page change handler
  const handleChange = (index, value) => {
    const textarea = pageRefs.current[index];

    if (textarea.scrollHeight > textarea.clientHeight) {
      const lastChar = value.slice(-1);

      setPages(prev => {
        const updated = [...prev];
        updated[index] = value.slice(0, -1);
        updated[index + 1] = lastChar + (updated[index + 1] || "");
        return updated;
      });

      setTimeout(() => {
        pageRefs.current[index + 1]?.focus();
      }, 0);
    } else {
      setPages(prev => {
        const updated = [...prev];
        updated[index] = value;
        return updated;
      });
    }

    triggerAutosave();
  };

  // ⌫ Backspace merge pages
const TAB_SIZE = 4;

const handleKeyDown = (e, index) => {
  const textarea = pageRefs.current[index];

  /* ---------- TAB INDENT ---------- */
  if (e.key === "Tab") {
    e.preventDefault();

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const indent = " ".repeat(TAB_SIZE);

    setPages(prev => {
      const updated = [...prev];
      const value = updated[index];

      updated[index] =
        value.slice(0, start) +
        indent +
        value.slice(end);

      return updated;
    });

    requestAnimationFrame(() => {
      textarea.selectionStart =
        textarea.selectionEnd =
        start + TAB_SIZE;
    });

    triggerAutosave();
    return;
  }

  /* ---------- BACKSPACE MERGE ---------- */
  if (
    e.key === "Backspace" &&
    index > 0 &&
    textarea.selectionStart === 0 &&
    textarea.selectionEnd === 0
  ) {
    e.preventDefault();

    setPages(prev => {
      const updated = [...prev];
      updated[index - 1] += updated[index];
      updated.splice(index, 1);
      return updated;
    });

    requestAnimationFrame(() => {
      const prev = pageRefs.current[index - 1];
      prev.focus();
      prev.selectionStart =
        prev.selectionEnd =
        prev.value.length;
    });

    triggerAutosave();
  }
};


  // ✏️ Title change
  const handleTitleChange = e => {
    setTitle(e.target.value);
    triggerAutosave();
  };

  const logout = async () => {
    localStorage.clear();
    navigate('/login', { replace: true });
    alert("Logged out successfully!");
  }

  return (
    <>
      <img src={logo} id="logo" alt="SnapPad Logo" />

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
            <button id="close" onClick={() => setSettingsOpen(false)}>X</button>
            <button id="mode" onClick={toggleMode}>
              {darkMode ? "Dark Mode" : "Light Mode"}
            </button>
            <button id="logout" onClick={logout}>Log Out</button>
          </div>
        </div>
      )}

      <div className="pages">
        {pages.map((text, i) => (
          <textarea
            key={i}
            className="page"
            ref={el => (pageRefs.current[i] = el)}
            value={text}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(e, i)}
          />
        ))}
      </div>
    </>
  );
}

export default Editor;
