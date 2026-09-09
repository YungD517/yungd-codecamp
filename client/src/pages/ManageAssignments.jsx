import { useState, useEffect } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import "./ManagePages.css";

const CHECKPOINT_SESSIONS = [3, 6, 12, 18];

export default function ManageAssignments() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "", description: "", assignmentNumber: 1, isPublished: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const { data } = await api.get("/sessions");
        const checkpoints = data.data.filter((s) =>
          CHECKPOINT_SESSIONS.includes(s.sessionNumber)
        );
        setSessions(checkpoints);
      } catch { /* */ } finally { setLoading(false); }
    };
    fetchSessions();
  }, []);

  useEffect(() => {
    if (!selectedSession) { setAssignments([]); return; }
    const fetchAssignments = async () => {
      try {
        const { data } = await api.get(`/assignments/session/${selectedSession}`);
        setAssignments(data.data);
      } catch { setAssignments([]); }
    };
    fetchAssignments();
  }, [selectedSession]);

  const resetForm = () => {
    setForm({ title: "", description: "", assignmentNumber: 1, isPublished: false });
    setEditing(null);
  };

  const handleEdit = (a) => {
    setForm({
      title: a.title,
      description: a.description,
      assignmentNumber: a.assignmentNumber,
      isPublished: a.isPublished,
    });
    setEditing(a._id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, session: selectedSession };
      if (editing) {
        await api.put(`/assignments/${editing}`, payload);
        toast.success("Assignment updated");
      } else {
        await api.post("/assignments", payload);
        toast.success("Assignment created");
      }
      resetForm();
      const { data } = await api.get(`/assignments/session/${selectedSession}`);
      setAssignments(data.data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleViewSubmissions = async (assignmentId) => {
    try {
      const { data } = await api.get(`/assignments/${assignmentId}/submissions`);
      const subs = data.data;
      if (subs.length === 0) {
        toast("No submissions yet");
      } else {
        toast(`${subs.length} submission(s) received`);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className="loader"><div className="spinner" /></div>;

  return (
    <div className="page fade-in">
      <div className="container">
        <h1>Manage Assignments</h1>
        <p className="mt-8">Create assignments at checkpoint sessions (3, 6, 12, 18).</p>

        <div className="form-group mt-32" style={{ maxWidth: 400 }}>
          <label>Select Checkpoint Session</label>
          <select className="form-select" value={selectedSession}
            onChange={(e) => { setSelectedSession(e.target.value); resetForm(); }}>
            <option value="">Choose a session...</option>
            {sessions.sort((a, b) => a.sessionNumber - b.sessionNumber).map((s) => (
              <option key={s._id} value={s._id}>
                Session {s.sessionNumber}: {s.title}
              </option>
            ))}
          </select>
        </div>

        {selectedSession && (
          <>
            <form onSubmit={handleSubmit} className="manage-form mt-32">
              <h3>{editing ? "Edit Assignment" : "Add Assignment"}</h3>

              <div className="grid-2 mt-16">
                <div className="form-group">
                  <label>Title</label>
                  <input type="text" className="form-input" value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Bookstore API" required
                  />
                </div>
                <div className="form-group">
                  <label>Assignment Number</label>
                  <input type="number" className="form-input" min="1" max="3"
                    value={form.assignmentNumber}
                    onChange={(e) => setForm({ ...form, assignmentNumber: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description (Markdown)</label>
                <textarea className="form-textarea" rows="8" value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="What the student needs to build..." required
                />
              </div>

              <div className="flex items-center gap-16">
                <label className="manage-toggle">
                  <input type="checkbox" checked={form.isPublished}
                    onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  />
                  <span>Publish</span>
                </label>
              </div>

              <div className="flex gap-12 mt-24">
                <button type="submit" className="btn btn--primary" disabled={saving}>
                  {saving ? "Saving..." : editing ? "Update" : "Create"}
                </button>
                {editing && (
                  <button type="button" className="btn btn--secondary" onClick={resetForm}>
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {assignments.length > 0 && (
              <div className="mt-32">
                <h3>Existing Assignments</h3>
                <div className="table-wrapper mt-16">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Status</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignments.map((a) => (
                        <tr key={a._id}>
                          <td style={{ fontFamily: "var(--font-mono)" }}>{a.assignmentNumber}</td>
                          <td style={{ color: "var(--text-primary)" }}>{a.title}</td>
                          <td>
                            <span className={`badge ${a.isPublished ? "badge--success" : "badge--default"}`}>
                              {a.isPublished ? "Published" : "Draft"}
                            </span>
                          </td>
                          <td>
                            <div className="flex gap-8">
                              <button className="btn btn--ghost" onClick={() => handleEdit(a)}>Edit</button>
                              <button className="btn btn--ghost" onClick={() => handleViewSubmissions(a._id)}>Submissions</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
