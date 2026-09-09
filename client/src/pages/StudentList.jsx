import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import "./ManagePages.css";

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data } = await api.get("/users/students");
        setStudents(data.data);
      } catch { /* */ } finally { setLoading(false); }
    };
    fetchStudents();
  }, []);

  const viewProgress = async (student) => {
    setSelectedStudent(student);
    setLoadingProgress(true);
    try {
      const { data } = await api.get(`/users/students/${student._id}/progress`);
      setProgress(data.data);
    } catch {
      setProgress(null);
    } finally {
      setLoadingProgress(false);
    }
  };

  if (loading) return <div className="loader"><div className="spinner" /></div>;

  return (
    <div className="page fade-in">
      <div className="container">
        <h1>Students</h1>
        <p className="mt-8">{students.length} enrolled student{students.length !== 1 ? "s" : ""}</p>

        {students.length === 0 ? (
          <div className="empty-state mt-32">
            <h3>No students enrolled yet</h3>
            <p>Students will appear here once they register.</p>
          </div>
        ) : (
          <div className="table-wrapper mt-32">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Sessions Completed</th>
                  <th>Joined</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s._id}>
                    <td style={{ color: "var(--text-primary)", fontWeight: 500 }}>{s.name}</td>
                    <td>{s.email}</td>
                    <td>
                      <span style={{ fontFamily: "var(--font-mono)" }}>
                        {s.completedSessions?.length || 0}/18
                      </span>
                    </td>
                    <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn--ghost" onClick={() => viewProgress(s)}>
                        Progress
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedStudent && (
          <div className="student-detail mt-48">
            <h2>{selectedStudent.name}'s Progress</h2>

            {loadingProgress ? (
              <div className="loader"><div className="spinner" /></div>
            ) : progress ? (
              <div className="mt-24">
                <div className="flex gap-24 mb-24">
                  <div className="card" style={{ padding: "16px 20px" }}>
                    <p className="label">Sessions Completed</p>
                    <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--accent)" }}>
                      {progress.completedSessions}/{progress.totalSessions}
                    </p>
                  </div>
                  <div className="card" style={{ padding: "16px 20px" }}>
                    <p className="label">Assignments Submitted</p>
                    <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)" }}>
                      {progress.submissions?.length || 0}
                    </p>
                  </div>
                </div>

                {progress.quizProgress?.length > 0 && (
                  <div>
                    <h3 className="mb-16">Quiz Scores</h3>
                    <div className="table-wrapper">
                      <table>
                        <thead>
                          <tr>
                            <th>Session</th>
                            <th>Best Score</th>
                            <th>Attempts</th>
                          </tr>
                        </thead>
                        <tbody>
                          {progress.quizProgress.map((qp, i) => (
                            <tr key={i}>
                              <td style={{ color: "var(--text-primary)" }}>
                                {qp.session?.title || `Session ${qp.session?.sessionNumber}`}
                              </td>
                              <td>
                                <span style={{ fontFamily: "var(--font-mono)", color: qp.bestScore >= 7 ? "var(--success)" : qp.bestScore >= 5 ? "var(--warning)" : "var(--error)" }}>
                                  {qp.bestScore}/10
                                </span>
                              </td>
                              <td>{qp.totalAttempts}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {progress.submissions?.length > 0 && (
                  <div className="mt-32">
                    <h3 className="mb-16">Assignment Submissions</h3>
                    <div className="table-wrapper">
                      <table>
                        <thead>
                          <tr>
                            <th>Assignment</th>
                            <th>GitHub Link</th>
                            <th>Grade</th>
                          </tr>
                        </thead>
                        <tbody>
                          {progress.submissions.map((sub) => (
                            <tr key={sub._id}>
                              <td style={{ color: "var(--text-primary)" }}>
                                {sub.assignment?.title || "Assignment"}
                              </td>
                              <td>
                                <a href={sub.githubLink} target="_blank" rel="noopener noreferrer">
                                  {sub.githubLink.replace("https://github.com/", "")}
                                </a>
                              </td>
                              <td>
                                <span className={`badge ${
                                  sub.grade === "pass" ? "badge--success" :
                                  sub.grade === "fail" ? "badge--error" : "badge--default"
                                }`}>
                                  {sub.grade}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="mt-16">Could not load progress.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
