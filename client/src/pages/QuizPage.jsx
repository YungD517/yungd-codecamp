import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../utils/api";
import toast from "react-hot-toast";
import "./QuizPage.css";

export default function QuizPage() {
  const { sessionId } = useParams();
  const { fetchUser } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await api.get(`/quizzes/session/${sessionId}`);
        setQuiz(data.data);

        // Fetch previous attempts
        const attData = await api.get(`/quizzes/${data.data._id}/attempts`);
        setAttempts(attData.data.data);
      } catch {
        setQuiz(null);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [sessionId]);

  const handleSelect = (questionIndex, optionIndex) => {
    if (result) return;
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < 10) {
      toast.error("Answer all 10 questions before submitting");
      return;
    }

    setSubmitting(true);
    try {
      const answerArray = Array.from({ length: 10 }, (_, i) => answers[i]);
      const { data } = await api.post(`/quizzes/${quiz._id}/attempt`, {
        answers: answerArray,
      });
      setResult(data.data);
      toast.success(`You scored ${data.data.score}/10`);
      // Refresh user to update completedSessions
      fetchUser();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setResult(null);
  };

  const getDifficultyColor = (diff) => {
    if (diff === "easy") return "badge--success";
    if (diff === "medium") return "badge--accent";
    return "badge--error";
  };

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="page">
        <div className="container container--narrow empty-state">
          <h3>No quiz available for this session yet</h3>
          <Link to={`/session/${sessionId}`} className="btn btn--secondary mt-24">
            Back to Session
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page fade-in">
      <div className="container container--narrow">
        <Link to={`/session/${sessionId}`} className="session-back">
          ← Back to Session
        </Link>

        <div className="quiz-header mt-24">
          <h1>Quiz — {quiz.session?.title || "Session Quiz"}</h1>
          <p className="mt-8">
            10 questions. {result ? "Review your answers below." : "Select one answer per question."}
          </p>
          {attempts.length > 0 && !result && (
            <p className="quiz-attempts-note mt-8">
              Previous attempts: {attempts.length} — Best score: {Math.max(...attempts.map((a) => a.score))}/10
            </p>
          )}
        </div>

        <div className="quiz-questions mt-32">
          {quiz.questions.map((q, qIndex) => {
            const reviewItem = result?.review?.[qIndex];
            return (
              <div key={qIndex} className="quiz-question card">
                <div className="quiz-question__header">
                  <span className="quiz-question__num">{qIndex + 1}</span>
                  <span className={`badge ${getDifficultyColor(q.difficulty)}`}>
                    {q.difficulty}
                  </span>
                </div>
                <p className="quiz-question__text">{q.questionText}</p>
                <div className="quiz-options">
                  {q.options.map((option, oIndex) => {
                    let optionClass = "quiz-option";
                    if (result) {
                      if (reviewItem.correctAnswer === oIndex) {
                        optionClass += " quiz-option--correct";
                      }
                      if (reviewItem.studentAnswer === oIndex && !reviewItem.isCorrect) {
                        optionClass += " quiz-option--wrong";
                      }
                    } else if (answers[qIndex] === oIndex) {
                      optionClass += " quiz-option--selected";
                    }

                    return (
                      <button
                        key={oIndex}
                        className={optionClass}
                        onClick={() => handleSelect(qIndex, oIndex)}
                        disabled={!!result}
                      >
                        <span className="quiz-option__letter">
                          {String.fromCharCode(65 + oIndex)}
                        </span>
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="quiz-footer mt-32">
          {result ? (
            <div className="quiz-result card">
              <h2>
                Score: {result.score}/{result.totalQuestions}
              </h2>
              <p>Attempt #{result.attemptNumber}</p>
              <button onClick={handleRetake} className="btn btn--primary mt-16">
                Retake Quiz
              </button>
            </div>
          ) : (
            <button
              onClick={handleSubmit}
              className="btn btn--primary btn--lg btn--full"
              disabled={submitting || Object.keys(answers).length < 10}
            >
              {submitting
                ? "Submitting..."
                : `Submit (${Object.keys(answers).length}/10 answered)`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
