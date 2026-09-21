import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../utils/api";
import toast from "react-hot-toast";
import "./QuizPage.css";
 
// Fisher-Yates shuffle — returns a new shuffled array of indices [0..n-1]
function shuffledIndices(n) {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
 
export default function QuizPage() {
  const { sessionId } = useParams();
  const { fetchUser } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({}); // keyed by ORIGINAL question index
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [attempts, setAttempts] = useState([]);
 
  // Shuffle order — regenerated only when quiz loads or is retaken
  const [questionOrder, setQuestionOrder] = useState([]); // shuffled original-question-indices
  const [optionOrders, setOptionOrders] = useState([]); // per original question index: shuffled original-option-indices
 
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await api.get(`/quizzes/session/${sessionId}`);
        setQuiz(data.data);
        setQuestionOrder(shuffledIndices(data.data.questions.length));
        setOptionOrders(
          data.data.questions.map((q) => shuffledIndices(q.options.length))
        );
 
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
 
  // originalQIndex = the question's real index in quiz.questions
  // originalOIndex = the option's real index within that question's options
  const handleSelect = (originalQIndex, originalOIndex) => {
    if (result) return;
    setAnswers((prev) => ({ ...prev, [originalQIndex]: originalOIndex }));
  };
 
  const handleSubmit = async () => {
    if (Object.keys(answers).length < 10) {
      toast.error("Answer all 10 questions before submitting");
      return;
    }
 
    setSubmitting(true);
    try {
      // Build the answer array in ORIGINAL question order — this is what the server expects
      const answerArray = Array.from({ length: 10 }, (_, i) => answers[i]);
      const { data } = await api.post(`/quizzes/${quiz._id}/attempt`, {
        answers: answerArray,
      });
      setResult(data.data);
      toast.success(`You scored ${data.data.score}/10`);
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
    // Reshuffle for the retake
    setQuestionOrder(shuffledIndices(quiz.questions.length));
    setOptionOrders(quiz.questions.map((q) => shuffledIndices(q.options.length)));
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
          {questionOrder.map((originalQIndex, displayIndex) => {
            const q = quiz.questions[originalQIndex];
            const optOrder = optionOrders[originalQIndex] || [0, 1, 2, 3];
            const reviewItem = result?.review?.[originalQIndex];
 
            return (
              <div key={originalQIndex} className="quiz-question card">
                <div className="quiz-question__header">
                  <span className="quiz-question__num">{displayIndex + 1}</span>
                </div>
                <p className="quiz-question__text">{q.questionText}</p>
                <div className="quiz-options">
                  {optOrder.map((originalOIndex) => {
                    const optionText = q.options[originalOIndex];
                    let optionClass = "quiz-option";
 
                    if (result) {
                      if (reviewItem.correctAnswer === originalOIndex) {
                        optionClass += " quiz-option--correct";
                      }
                      if (
                        reviewItem.studentAnswer === originalOIndex &&
                        !reviewItem.isCorrect
                      ) {
                        optionClass += " quiz-option--wrong";
                      }
                    } else if (answers[originalQIndex] === originalOIndex) {
                      optionClass += " quiz-option--selected";
                    }
 
                    return (
                      <button
                        key={originalOIndex}
                        className={optionClass}
                        onClick={() => handleSelect(originalQIndex, originalOIndex)}
                        disabled={!!result}
                      >
                        <span className="quiz-option__letter">
                          {String.fromCharCode(
                            65 + optOrder.indexOf(originalOIndex)
                          )}
                        </span>
                        {optionText}
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