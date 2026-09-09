import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../utils/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "../components/common/CodeBlock";
import "./SessionView.css";

export default function SessionView() {
  const { id } = useParams();
  const { user } = useAuth();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const isTutor = user?.role === "tutor";

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data } = await api.get(`/sessions/${id}`);
        setSession(data.data);
      } catch {
        setSession(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [id]);

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="page">
        <div className="container container--narrow empty-state">
          <h3>Session not found</h3>
        </div>
      </div>
    );
  }

  const content = isTutor ? session.tutorContent : session.studentContent;

  return (
    <div className="page fade-in">
      <div className="container container--narrow">
        <Link
          to={isTutor ? "/tutor" : "/dashboard"}
          className="session-back"
        >
          ← Back to Dashboard
        </Link>

        <div className="session-header mt-24">
          <div className="session-meta">
            <span className="badge badge--accent">
              Session {session.sessionNumber}
            </span>
            <span className="label">
              Week {session.week} — {session.day}
            </span>
          </div>
          <h1 className="mt-8">{session.title}</h1>
        </div>

        <div className="session-content mt-32">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>

        {session.codeSnippets?.length > 0 && (
          <div className="session-code mt-32">
            <h3>Code</h3>
            {session.codeSnippets.map((snippet, i) => (
              <CodeBlock
                key={i}
                title={snippet.title}
                code={isTutor ? snippet.tutorCode : snippet.studentCode}
                language={snippet.language}
              />
            ))}
          </div>
        )}

        <div className="session-actions mt-48">
          <Link
            to={`/quiz/${session._id}`}
            className="btn btn--primary btn--lg btn--full"
          >
            Take Quiz
          </Link>
          <Link
            to={`/assignments/${session._id}`}
            className="btn btn--secondary btn--lg btn--full mt-16"
          >
            View Assignments
          </Link>
        </div>
      </div>
    </div>
  );
}
