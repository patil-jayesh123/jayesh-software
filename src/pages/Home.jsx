import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiGrid, FiList, FiBook } from "react-icons/fi";
import NoteCard from "../component/NoteCard";
import NoteModal from "../component/NoteModal";
import ConfirmModal from "../component/ConfirmModal";
import Topbar from "../component/Topbar";
import Sidebar from "../component/Sidebar";
import { useAuth } from "../contex/ContextProvider";
import { Link } from "react-router-dom";

const API = "https://note-dacr.onrender.com";
const FILTERS = ["all", "personal", "work", "ideas", "other"];

// Shared axios helper — logs full error to console, shows message in toast
const apiCall = async (method, url, data, token) => {
  console.log("api called jp");
  try {
    const res = await axios({
      method,
      url,
      data,
      headers: { Authorization: `Bearer ${token}` },
    });
    return { ok: true, data: res.data };
  } catch (err) {
    const msg = err.response?.data?.message || err.message || "Request failed";
    console.error(
      `API ${method.toUpperCase()} ${url} failed:`,
      err.response?.data || err.message,
    );
    return { ok: false, msg };
  }
};

export default function Home() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [archivedNotes, setArchivedNotes] = useState([]);
  const [trashedNotes, setTrashedNotes] = useState([]);
  const [query, setQuery] = useState("");
  const [view, setView] = useState("grid");
  const [filter, setFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) fetchAll();
  }, [token]);

  const fetchAll = async () => {
    const r = await apiCall("get", `${API}/api/note`, null, token);
    if (!r.ok) {
      toast.error("Failed to load notes: " + r.msg);
      return;
    }
    const all = r.data.notes || [];
    setNotes(all.filter((n) => !n.archived && !n.trashed));
    setArchivedNotes(all.filter((n) => n.archived && !n.trashed));
    setTrashedNotes(all.filter((n) => n.trashed));
  };

  const filtered = useMemo(
    () =>
      notes.filter((n) => {
        const q = query.toLowerCase();
        const matchQ =
          !q ||
          n.title.toLowerCase().includes(q) ||
          (n.description || "").toLowerCase().includes(q);
        const matchF = filter === "all" || n.tag === filter;
        return matchQ && matchF;
      }),
    [notes, query, filter],
  );

  const handleSave = async (title, description, tag, id) => {
    const body = { title, description, tag };
    const r = id
      ? await apiCall("put", `${API}/api/note/${id}`, body, token)
      : await apiCall("post", `${API}/api/note/add`, body, token);
    if (!r.ok) {
      toast.error("Save failed: " + r.msg);
      return;
    }
    toast.success(id ? "Note updated" : "Note added");
    setModalOpen(false);
    setEditNote(null);
    fetchAll();
  };

  const handleArchive = async (id) => {
    const r = await apiCall(
      "put",
      `${API}/api/note/${id}`,
      { archived: true, trashed: false },
      token,
    );
    if (!r.ok) {
      toast.error("Archive failed: " + r.msg);
      return;
    }
    toast.success("Note archived");
    fetchAll();
  };

  const handleTrash = async (id) => {
    const r = await apiCall(
      "put",
      `${API}/api/note/${id}`,
      { trashed: true, archived: false },
      token,
    );
    if (!r.ok) {
      toast.error("Delete failed: " + r.msg);
      return;
    }
    toast.success("Moved to trash");
    fetchAll();
  };

  if (!user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 24,
          padding: 24,
        }}
      >
        <div style={{ fontSize: 56 }}>📝</div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "var(--text-primary)",
            textAlign: "center",
          }}
        >
          Welcome to NoteApp
        </h1>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: 15,
            maxWidth: 360,
            textAlign: "center",
            lineHeight: 1.7,
          }}
        >
          Capture ideas, create notes, and stay organized — all in one beautiful
          workspace.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <Link
            to="/login"
            className="btn btn-primary"
            style={{ padding: "0 28px", height: 44, fontSize: 15 }}
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="btn btn-secondary"
            style={{ padding: "0 28px", height: 44, fontSize: 15 }}
          >
            Create account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 99,
          }}
        />
      )}
      <Sidebar
        notes={notes}
        archivedNotes={archivedNotes}
        trashedNotes={trashedNotes}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="main-content">
        <Topbar
          query={query}
          onSearch={setQuery}
          onNewNote={() => {
            setEditNote(null);
            setModalOpen(true);
          }}
          onMenuToggle={() => setSidebarOpen((o) => !o)}
          title="Home"
        />
        <div className="page-content">
          <div className="stats-bar">
            {[
              {
                icon: "📝",
                label: "Total notes",
                val: notes.length,
                bg: "var(--accent-light)",
                color: "var(--accent)",
              },
              {
                icon: "📦",
                label: "Archived",
                val: archivedNotes.length,
                bg: "var(--warning-light)",
                color: "var(--warning)",
              },
              {
                icon: "🗑️",
                label: "In trash",
                val: trashedNotes.length,
                bg: "var(--danger-light)",
                color: "var(--danger)",
              },
              {
                icon: "🔍",
                label: "Showing",
                val: filtered.length,
                bg: "var(--teal-light)",
                color: "var(--teal)",
              },
            ].map((s) => (
              <div className="stat-card" key={s.label}>
                <div
                  className="stat-icon"
                  style={{ background: s.bg, color: s.color }}
                >
                  {s.icon}
                </div>
                <div>
                  <div className="stat-num">{s.val}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="notes-toolbar">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`filter-chip ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f === "personal" && "👤 "}
                {f === "work" && "💼 "}
                {f === "ideas" && "💡 "}
                {f === "other" && "📌 "}
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f !== "all" && (
                  <span
                    style={{
                      marginLeft: 4,
                      fontSize: 11,
                      fontWeight: 600,
                      background:
                        filter === f ? "var(--accent)" : "var(--bg-active)",
                      color: filter === f ? "#fff" : "var(--text-muted)",
                      borderRadius: 99,
                      padding: "0 6px",
                      minWidth: 18,
                      textAlign: "center",
                      display: "inline-block",
                    }}
                  >
                    {notes.filter((n) => n.tag === f).length}
                  </span>
                )}
              </button>
            ))}
            <div className="view-toggle" style={{ marginLeft: "auto" }}>
              <button
                className={`icon-btn ${view === "grid" ? "active" : ""}`}
                onClick={() => setView("grid")}
                title="Grid view"
              >
                <FiGrid />
              </button>
              <button
                className={`icon-btn ${view === "list" ? "active" : ""}`}
                onClick={() => setView("list")}
                title="List view"
              >
                <FiList />
              </button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <FiBook />
              </div>
              <div className="empty-title">
                {query
                  ? "No notes match your search"
                  : filter !== "all"
                    ? `No ${filter} notes yet`
                    : "No notes yet"}
              </div>
              <div className="empty-desc">
                {query
                  ? "Try a different keyword."
                  : 'Click "New note" to create your first one.'}
              </div>
            </div>
          ) : (
            <div className={view === "grid" ? "notes-grid" : "notes-list"}>
              {filtered.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  view={view}
                  mode="active"
                  onEdit={(n) => {
                    setEditNote(n);
                    setModalOpen(true);
                  }}
                  onArchive={handleArchive}
                  onDelete={(id) => setConfirmDelete(id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <NoteModal
          note={editNote}
          onClose={() => {
            setModalOpen(false);
            setEditNote(null);
          }}
          onSave={handleSave}
        />
      )}
      {confirmDelete && (
        <ConfirmModal
          title="Move to trash"
          message="This note will be moved to trash. You can restore it later."
          confirmLabel="Move to trash"
          danger
          onConfirm={() => {
            handleTrash(confirmDelete);
            setConfirmDelete(null);
          }}
          onClose={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
