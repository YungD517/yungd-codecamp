import { useState, useEffect } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import "./ManagePages.css";

const EMPTY_QUESTION = {
  questionText: "", options: ["", "", "", ""], correctAnswer: 0, difficulty: "easy",
};

export default function ManageQuizzes() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [existingQuiz, setExistingQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const { data } = await api.get("/sessions");
        setSessions(data.data);
      } catch { /* */ } finally { setLoading(false); }
    };
    fetchSessions();
  }, []);

  useEffect(() => {
    if (!selectedSession) { setExistingQuiz(null); setQuestions([]); return; }
    const fetchQuiz = async () => {
      try {
        const { data } = await api.get(`/quizzes/session/${selectedSession}`);
        setExistingQuiz(data.data);
        setQuestions(data.data.questions);
        setIsPublished(data.data.isPublished);
      } catch {
        setExistingQuiz(null);
        setQuestions(Array.from({ length: 10 }, () => ({ ...EMPTY_QUESTION, options: ["", "", "", ""] })));
        setIsPublished(false);
      }
    };
    fetchQuiz();
  }, [selectedSession]);

  const updateQuestion = (qi, field, value) => {
    setQuestions((prev) => {
      const q = [...prev];
      q[qi] = { ...q[qi], [field]: value };
      return q;
    });
  };

  const updateOption = (qi, oi, value) => {
    setQuestions((prev) => {
      const q = [...prev];
      const opts = [...q[qi].options];
      opts[oi] = value;
      q[qi] = { ...q[qi], options: opts };
      return q;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const easy = questions.filter((q) => q.difficulty === "easy").length;
    const medium = questions.filter((q) => q.difficulty === "medium").length;
    const hard = questions.filter((q) => q.difficulty === "hard").length;

    if (questions.length !== 10) { toast.error("Must have exactly 10 questions"); return; }
    if (easy !== 3 || medium !== 2 || hard !== 5) {
      toast.error("Need 3 easy, 2 medium, 5 hard questions"); return;
    }

    setSaving(true);
    try {
      const payload = { session: selectedSession, questions, isPublished };
      if (existingQuiz) {
        await api.put(`/quizzes/${existingQuiz._id}`, payload);
        toast.success("Quiz updated");
      } else {
        await api.post("/quizzes", payload);
        toast.success("Quiz created");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const getDiffBadge = (diff) => {
    if (diff === "easy") return "badge--success";
    if (diff === "medium") return "badge--accent";
    return "badge--error";
  };

  if (loading) return <div className="loader"><div className="spinner" /></div>;

  return (
    <div className="page fade-in">
      <div className="container">
        <h1>Manage Quizzes</h1>
        <p className="mt-8">Create or edit quizzes for each session.</p>

        <div className="form-group mt-32" style={{ maxWidth: 400 }}>
          <label>Select Session</label>
          <select className="form-select" value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}>
            <option value="">Choose a session...</option>
            {sessions.sort((a, b) => a.sessionNumber - b.sessionNumber).map((s) => (
              <option key={s._id} value={s._id}>
                Session {s.sessionNumber}: {s.title}
              </option>
            ))}
          </select>
        </div>

        {selectedSession && questions.length > 0 && (
          <form onSubmit={handleSubmit} className="mt-32">
            <div className="quiz-difficulty-count mb-24">
              <span className="badge badge--success">Easy: {questions.filter((q) => q.difficulty === "easy").length}/3</span>
              <span className="badge badge--accent">Medium: {questions.filter((q) => q.difficulty === "medium").length}/2</span>
              <span className="badge badge--error">Hard: {questions.filter((q) => q.difficulty === "hard").length}/5</span>
            </div>

            {questions.map((q, qi) => (
              <div key={qi} className="card mb-16" style={{ padding: 24 }}>
                <div className="flex items-center justify-between mb-16">
                  <h4>Question {qi + 1}</h4>
                  <select className="form-select" style={{ width: 120 }}
                    value={q.difficulty}
                    onChange={(e) => updateQuestion(qi, "difficulty", e.target.value)}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Question</label>
                  <input type="text" className="form-input" value={q.questionText}
                    onChange={(e) => updateQuestion(qi, "questionText", e.target.value)}
                    placeholder="Enter your question..."
                    required
                  />
                </div>

                {q.options.map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-8 mb-8">
                    <input type="radio" name={`correct-${qi}`}
                      checked={q.correctAnswer === oi}
                      onChange={() => updateQuestion(qi, "correctAnswer", oi)}
                    />
                    <span className="quiz-option__letter" style={{ width: 24, height: 24, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 600, borderRadius: 4, background: q.correctAnswer === oi ? "var(--success)" : "var(--bg-elevated)", color: q.correctAnswer === oi ? "#fff" : "var(--text-secondary)", border: "1px solid var(--border-default)", flexShrink: 0 }}>
                      {String.fromCharCode(65 + oi)}
                    </span>
                    <input type="text" className="form-input" value={opt}
                      onChange={(e) => updateOption(qi, oi, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                      required
                      style={{ flex: 1 }}
                    />
                  </div>
                ))}
              </div>
            ))}

            <div className="flex items-center gap-16 mt-24">
              <label className="manage-toggle">
                <input type="checkbox" checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                />
                <span>Publish quiz</span>
              </label>
            </div>

            <button type="submit" className="btn btn--primary btn--lg mt-24" disabled={saving}>
              {saving ? "Saving..." : existingQuiz ? "Update Quiz" : "Create Quiz"}
            </button>
          </form>
        )}

        {selectedSession && questions.length === 0 && !existingQuiz && (
          <div className="empty-state mt-32">
            <p>Loading quiz form...</p>
          </div>
        )}
      </div>
    </div>
  );
}
