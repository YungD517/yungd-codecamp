import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../utils/api";
import "./StudentDashboard.css";

const WEEK_LABELS = [
  "Foundations & Node.js",
  "Express.js",
  "Databases",
  "Structure & Validation",
  "Authentication",
  "Advanced & Deployment",
];

const ASSIGNMENT_SESSIONS = [3, 6, 12, 18];

export default function StudentDashboard() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchSessions();
  }, []);

  const completedIds = user?.completedSessions?.map((s) =>
    typeof s === "object" ? s._id : s
  ) || [];

  const completedCount = completedIds.length;
  const progress = sessions.length > 0 ? (completedCount / sessions.length) * 100 : 0;

  // Group sessions by week
  const weeks = {};
  sessions.forEach((session) => {
    const w = session.week || 1;
    if (!weeks[w]) weeks[w] = [];
    weeks[w].push(session);
  });

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
        <div className="dash-header">
          <div>
            <h1>Welcome, {user?.name?.split(" ")[0]}</h1>
            <p className="mt-8">
              {completedCount} of {sessions.length} sessions completed
            </p>
          </div>
          <div className="dash-progress-card card">
            <div className="dash-progress-label">
              <span>Progress</span>
              <span className="dash-progress-pct">{Math.round(progress)}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar__fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="dash-weeks mt-48">
          {Object.entries(weeks)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([weekNum, weekSessions]) => (
              <div key={weekNum} className="dash-week">
                <div className="dash-week__header">
                  <h3>Week {weekNum}</h3>
                  <span className="label">{WEEK_LABELS[weekNum - 1]}</span>
                </div>
                <div className="dash-week__sessions">
                  {weekSessions
                    .sort((a, b) => a.order - b.order)
                    .map((session) => {
                      const isCompleted = completedIds.includes(session._id);
                      const hasAssignment = ASSIGNMENT_SESSIONS.includes(session.sessionNumber);
                      return (
                        <Link
                          key={session._id}
                          to={`/session/${session._id}`}
                          className={`dash-session card card--clickable ${isCompleted ? "dash-session--done" : ""}`}
                        >
                          <div className="dash-session__top">
                            <span className="dash-session__num">
                              {session.sessionNumber}
                            </span>
                            <span className="dash-session__day">{session.day}</span>
                          </div>
                          <h4 className="dash-session__title">{session.title}</h4>
                          <div className="dash-session__tags">
                            <span className="badge badge--default">Quiz</span>
                            {hasAssignment && (
                              <span className="badge badge--accent">Assignment</span>
                            )}
                            {isCompleted && (
                              <span className="badge badge--success">Completed</span>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                </div>
              </div>
            ))}
        </div>

        {sessions.length === 0 && (
          <div className="empty-state mt-48">
            <h3>No sessions yet</h3>
            <p>Sessions will appear here once the tutor publishes them.</p>
          </div>
        )}
      </div>
    </div>
  );
}
