import { useState, useEffect } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import "./ManagePages.css";

const EMPTY_SNIPPET = { title: "", studentCode: "", tutorCode: "", language: "javascript" };

export default function ManageLessons() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    sessionNumber: "",
    title: "",
    studentContent: "",
    tutorContent: "",
    week: "",
    day: "Monday",
    order: "",
    isPublished: false,
    codeSnippets: [],
  });
  const [saving, setSaving] = useState(false);

  const fetchSessions = async () => {
    try {
      const { data } = await api.get("/sessions");
      setSessions(data.data);
    } catch {
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSessions(); }, []);

  const resetForm = () => {
    setForm({
      sessionNumber: "", title: "", studentContent: "", tutorContent: "",
      week: "", day: "Monday", order: "", isPublished: false, codeSnippets: [],
    });
    setEditing(null);
  };

  const handleEdit = (session) => {
    setForm({
      sessionNumber: session.sessionNumber,
      title: session.title,
      studentContent: session.studentContent,
      tutorContent: session.tutorContent,
      week: session.week,
      day: session.day,
      order: session.order,
      isPublished: session.isPublished,
      codeSnippets: session.codeSnippets || [],
    });
    setEditing(session._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addSnippet = () => {
    setForm((prev) => ({
      ...prev,
      codeSnippets: [...prev.codeSnippets, { ...EMPTY_SNIPPET }],
    }));
  };

  const updateSnippet = (index, field, value) => {
    setForm((prev) => {
      const snippets = [...prev.codeSnippets];
      snippets[index] = { ...snippets[index], [field]: value };
      return { ...prev, codeSnippets: snippets };
    });
  };

  const removeSnippet = (index) => {
    setForm((prev) => ({
      ...prev,
      codeSnippets: prev.codeSnippets.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        sessionNumber: Number(form.sessionNumber),
        week: Number(form.week),
        order: Number(form.order),
      };

      if (editing) {
        await api.put(`/sessions/${editing}`, payload);
        toast.success("Session updated");
      } else {
        await api.post("/sessions", payload);
        toast.success("Session created");
      }
      resetForm();
      fetchSessions();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loader"><div className="spinner" /></div>;
  }

  return (
    <div className="page fade-in">
      <div className="container">
        <h1>{editing ? "Edit Session" : "Create Session"}</h1>
        <p className="mt-8">
          {editing
            ? "Update the session content below."
            : "Add a new lesson session to the course."}
        </p>

        <form onSubmit={handleSubmit} className="manage-form mt-32">
          <div className="grid-2">
            <div className="form-group">
              <label>Session Number (1–18)</label>
              <input type="number" className="form-input" min="1" max="18"
                value={form.sessionNumber}
                onChange={(e) => setForm({ ...form, sessionNumber: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Title</label>
              <input type="text" className="form-input" placeholder="e.g. Your First Node.js Server"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label>Week (1–6)</label>
              <input type="number" className="form-input" min="1" max="6"
                value={form.week}
                onChange={(e) => setForm({ ...form, week: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Day</label>
              <select className="form-select" value={form.day}
                onChange={(e) => setForm({ ...form, day: e.target.value })}>
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
              </select>
            </div>
            <div className="form-group">
              <label>Order</label>
              <input type="number" className="form-input" min="1" max="18"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Student Content (Markdown)</label>
            <textarea className="form-textarea" rows="10"
              placeholder="The clean, concise version students will see..."
              value={form.studentContent}
              onChange={(e) => setForm({ ...form, studentContent: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Tutor Content (Markdown)</label>
            <textarea className="form-textarea" rows="12"
              placeholder="The extended version with deeper explanations, follow-up questions, teaching notes..."
              value={form.tutorContent}
              onChange={(e) => setForm({ ...form, tutorContent: e.target.value })}
              required
            />
          </div>

          <div className="manage-snippets">
            <div className="flex items-center justify-between mb-16">
              <h3>Code Snippets</h3>
              <button type="button" className="btn btn--secondary" onClick={addSnippet}>
                Add Snippet
              </button>
            </div>

            {form.codeSnippets.map((snippet, i) => (
              <div key={i} className="card snippet-card mb-16">
                <div className="flex items-center justify-between mb-16">
                  <h4>Snippet {i + 1}</h4>
                  <button type="button" className="btn btn--ghost" onClick={() => removeSnippet(i)}>
                    Remove
                  </button>
                </div>
                <div className="form-group">
                  <label>Snippet Title</label>
                  <input type="text" className="form-input" value={snippet.title}
                    onChange={(e) => updateSnippet(i, "title", e.target.value)}
                    placeholder="e.g. Basic Express Server"
                  />
                </div>
                <div className="form-group">
                  <label>Student Code (clean, no comments)</label>
                  <textarea className="form-textarea" rows="8"
                    style={{ fontFamily: "var(--font-mono)", fontSize: "0.8375rem" }}
                    value={snippet.studentCode}
                    onChange={(e) => updateSnippet(i, "studentCode", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Tutor Code (with line-by-line comments)</label>
                  <textarea className="form-textarea" rows="10"
                    style={{ fontFamily: "var(--font-mono)", fontSize: "0.8375rem" }}
                    value={snippet.tutorCode}
                    onChange={(e) => updateSnippet(i, "tutorCode", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-16 mt-24">
            <label className="manage-toggle">
              <input type="checkbox" checked={form.isPublished}
                onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
              />
              <span>Publish (visible to students)</span>
            </label>
          </div>

          <div className="flex gap-12 mt-24">
            <button type="submit" className="btn btn--primary btn--lg" disabled={saving}>
              {saving ? "Saving..." : editing ? "Update Session" : "Create Session"}
            </button>
            {editing && (
              <button type="button" className="btn btn--secondary btn--lg" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        {sessions.length > 0 && (
          <div className="mt-48">
            <h2>Existing Sessions</h2>
            <div className="table-wrapper mt-16">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Week</th>
                    <th>Day</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.sort((a, b) => a.sessionNumber - b.sessionNumber).map((s) => (
                    <tr key={s._id}>
                      <td style={{ fontFamily: "var(--font-mono)" }}>{s.sessionNumber}</td>
                      <td style={{ color: "var(--text-primary)" }}>{s.title}</td>
                      <td>{s.week}</td>
                      <td>{s.day}</td>
                      <td>
                        <span className={`badge ${s.isPublished ? "badge--success" : "badge--default"}`}>
                          {s.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn--ghost" onClick={() => handleEdit(s)}>
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
