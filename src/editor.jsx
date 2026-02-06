import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./editor.css";
import logo from "./assets/SnapPad.png";
import settings from "./assets/settings.png";

function Editor({ darkMode, toggleMode }) {
  const { id } = useParams(); // notebookId from URL

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
    authFetch(`http://172.16.61.79:8080/api/notebooks/${id}`)
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
          `http://172.16.61.79:8080/api/notebooks/${id}`,
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
  const handleKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      index > 0 &&
      e.target.selectionStart === 0
    ) {
      e.preventDefault();

      setPages(prev => {
        const updated = [...prev];
        updated[index - 1] += updated[index];
        updated.splice(index, 1);
        return updated;
      });

      setTimeout(() => {
        const prevPage = pageRefs.current[index - 1];
        prevPage.focus();
        prevPage.selectionStart = prevPage.selectionEnd = prevPage.value.length;
      }, 0);

      triggerAutosave();
    }
  };

  // ✏️ Title change
  const handleTitleChange = e => {
    setTitle(e.target.value);
    triggerAutosave();
  };

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
            <button id="logout">Log Out</button>
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
