import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./editor.css";
import logo from "./assets/SnapPad.png";
import settings from "./assets/settings.png";

// ReactQuill imports
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";

Quill.register("modules/imageResize", ImageResize);

function Editor({ darkMode, toggleMode }) {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const { id } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [title, setTitle] = useState("Untitled");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [status, setStatus] = useState("Saved");
  const [pendingSave, setPendingSave] = useState(false);

  const saveTimeout = useRef(null);

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
    setPendingSave(true);
    setStatus("Saving...");

    if (saveTimeout.current) clearTimeout(saveTimeout.current);

    saveTimeout.current = setTimeout(async () => {
      try {
        await authFetch(`${API_BASE}/api/notebooks/${id}`, {
          method: "PUT",
          body: JSON.stringify({ title, content }),
        });
        setPendingSave(false);
        setStatus("Saved");
      } catch {
        setStatus("Save failed");
      }
    }, 800);
  };

  const handleContentChange = (value) => {
    setContent(value);
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

  // ReactQuill modules & formats
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote"],
      ["image"],
    ],
    imageResize: {
      modules: ["Resize", "DisplaySize"],
    },
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "blockquote",
    "image",
  ];

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
      <p id="auto">{pendingSave ? "Saving..." : status}</p>

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

      <div id="editor">
        <ReactQuill
          theme="snow"
          value={content}
          onChange={handleContentChange}
          modules={modules}
          formats={formats}
          placeholder="Start writing..."
        />
      </div>
    </>
  );
}

export default Editor;
