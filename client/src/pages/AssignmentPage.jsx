import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import "./AssignmentPage.css";

export default function AssignmentPage() {
  const { sessionId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [githubLinks, setGithubLinks] = useState({});
  const [submitting, setSubmitting] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assignData, subData] = await Promise.all([
          api.get(`/assignments/session/${sessionId}`),
          api.get("/submissions/my"),
        ]);
        setAssignments(assignData.data.data);
        setSubmissions(subData.data.data);
      } catch {
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sessionId]);

  const getSubmission = (assignmentId) =>
    submissions.find((s) => {
      const aId = typeof s.assignment === "object" ? s.assignment._id : s.assignment;
      return aId === assignmentId;
    });

  const handleSubmit = async (assignmentId) => {
    const link = githubLinks[assignmentId];
    if (!link || !link.includes("github.com")) {
      toast.error("Please enter a valid GitHub URL");
      return;
    }

    setSubmitting(assignmentId);
    try {
      const { data } = await api.post("/submissions", {
        assignment: assignmentId,
        githubLink: link,
      });
      setSubmissions((prev) => [...prev, data.data]);
      toast.success("Assignment submitted!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(null);
    }
  };

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="page fade-in">
      <div className="container container--narrow">
        <Link to={`/session/${sessionId}`} className="session-back">
          ← Back to Session
        </Link>

        <h1 className="mt-24">Assignments</h1>

        {assignments.length === 0 ? (
          <div className="empty-state mt-32">
            <h3>No assignments for this session</h3>
            <p>Assignments are available at checkpoint sessions (3, 6, 12, 18).</p>
          </div>
        ) : (
          <div className="assignment-list mt-32">
            {assignments.map((assignment) => {
              const submission = getSubmission(assignment._id);
              return (
                <div key={assignment._id} className="assignment-item card">
                  <div className="assignment-item__header">
                    <h3>
                      Option {assignment.assignmentNumber}: {assignment.title}
                    </h3>
                    {submission && (
                      <span
                        className={`badge ${
                          submission.grade === "pass"
                            ? "badge--success"
                            : submission.grade === "fail"
                            ? "badge--error"
                            : "badge--default"
                        }`}
                      >
                        {submission.grade === "pending"
                          ? "Submitted"
                          : submission.grade}
                      </span>
                    )}
                  </div>

                  <div className="assignment-item__body mt-16">
                    <ReactMarkdown>{assignment.description}</ReactMarkdown>
                  </div>

                  {submission ? (
                    <div className="assignment-submitted mt-16">
                      <p className="label">Your submission:</p>
                      <a
                        href={submission.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {submission.githubLink}
                      </a>
                    </div>
                  ) : (
                    <div className="assignment-submit mt-16">
                      <div className="flex gap-8">
                        <input
                          type="url"
                          className="form-input"
                          placeholder="https://github.com/your-username/your-repo"
                          value={githubLinks[assignment._id] || ""}
                          onChange={(e) =>
                            setGithubLinks((prev) => ({
                              ...prev,
                              [assignment._id]: e.target.value,
                            }))
                          }
                        />
                        <button
                          className="btn btn--primary"
                          onClick={() => handleSubmit(assignment._id)}
                          disabled={submitting === assignment._id}
                        >
                          {submitting === assignment._id ? "..." : "Submit"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
