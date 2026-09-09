import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import "./TutorDashboard.css";

export default function TutorDashboard() {
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stuData, sesData] = await Promise.all([
          api.get("/users/students"),
          api.get("/sessions"),
        ]);
        setStudents(stuData.data.data);
        setSessions(sesData.data.data);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const publishedCount = sessions.filter((s) => s.isPublished).length;

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="page fade-in">
      <div className="container">
        <h1>Tutor Dashboard</h1>
        <p className="mt-8">Manage your course content and track student progress.</p>

        <div className="tutor-stats mt-32">
          <div className="card tutor-stat">
            <p className="tutor-stat__num">{students.length}</p>
            <p className="label">Enrolled Students</p>
          </div>
          <div className="card tutor-stat">
            <p className="tutor-stat__num">{sessions.length}</p>
            <p className="label">Total Sessions</p>
          </div>
          <div className="card tutor-stat">
            <p className="tutor-stat__num">{publishedCount}</p>
            <p className="label">Published Sessions</p>
          </div>
          <div className="card tutor-stat">
            <p className="tutor-stat__num">{18 - sessions.length}</p>
            <p className="label">Sessions Remaining</p>
          </div>
        </div>

        <div className="tutor-quick mt-48">
          <h2>Quick Actions</h2>
          <div className="tutor-quick__grid mt-16">
            <Link to="/tutor/lessons" className="card card--clickable tutor-action">
              <h4>Manage Lessons</h4>
              <p>Create and edit session content</p>
            </Link>
            <Link to="/tutor/quizzes" className="card card--clickable tutor-action">
              <h4>Manage Quizzes</h4>
              <p>Add quiz questions per session</p>
            </Link>
            <Link to="/tutor/assignments" className="card card--clickable tutor-action">
              <h4>Manage Assignments</h4>
              <p>Create assignment checkpoints</p>
            </Link>
            <Link to="/tutor/students" className="card card--clickable tutor-action">
              <h4>View Students</h4>
              <p>Track progress and submissions</p>
            </Link>
          </div>
        </div>

        {sessions.length > 0 && (
          <div className="tutor-sessions mt-48">
            <h2>All Sessions</h2>
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
                  {sessions
                    .sort((a, b) => a.sessionNumber - b.sessionNumber)
                    .map((session) => (
                      <tr key={session._id}>
                        <td>
                          <span style={{ fontFamily: "var(--font-mono)" }}>
                            {session.sessionNumber}
                          </span>
                        </td>
                        <td style={{ color: "var(--text-primary)" }}>
                          {session.title}
                        </td>
                        <td>{session.week}</td>
                        <td>{session.day}</td>
                        <td>
                          <span
                            className={`badge ${
                              session.isPublished ? "badge--success" : "badge--default"
                            }`}
                          >
                            {session.isPublished ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td>
                          <Link
                            to={`/session/${session._id}`}
                            className="btn btn--ghost"
                          >
                            View
                          </Link>
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
