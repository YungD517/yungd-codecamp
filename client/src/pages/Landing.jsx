import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Landing.css";

const WEEKS = [
  { num: 1, title: "Foundations & Node.js", topics: "How the internet works, HTTP, Node.js basics, modules" },
  { num: 2, title: "Express.js", topics: "Routing, middleware, request handling, full CRUD APIs" },
  { num: 3, title: "Databases", topics: "MongoDB, Mongoose, schemas, real database-backed APIs" },
  { num: 4, title: "Structure & Validation", topics: "MVC pattern, input validation, Git & GitHub" },
  { num: 5, title: "Authentication", topics: "bcrypt, JWT, protected routes, security" },
  { num: 6, title: "Advanced & Deployment", topics: "Relationships, pagination, deploying to production" },
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="landing fade-in">
      <section className="landing__hero">
        <div className="container container--narrow">
          <p className="landing__eyebrow">AWAKE 8.0 — Backend Development Track</p>
          <h1 className="landing__title">
            Learn to build real backends with Node.js, Express, and MongoDB.
          </h1>
          <p className="landing__subtitle">
            18 sessions. 18 quizzes. 4 hands-on projects. Go from zero to
            deploying your own API in 6 weeks.
          </p>
          <div className="landing__cta">
            {user ? (
              <Link
                to={user.role === "tutor" ? "/tutor" : "/dashboard"}
                className="btn btn--primary btn--lg"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn--primary btn--lg">
                  Join the course
                </Link>
                <Link to="/login" className="btn btn--secondary btn--lg">
                  Already enrolled? Log in
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="landing__what">
        <div className="container">
          <h2>What you'll build</h2>
          <div className="landing__builds">
            <div className="card">
              <h4>REST APIs</h4>
              <p>
                Build complete APIs with routing, validation, and proper error
                handling that you can test with Postman.
              </p>
            </div>
            <div className="card">
              <h4>Database-backed apps</h4>
              <p>
                Connect to MongoDB, design schemas, and perform real CRUD
                operations — no more fake data that disappears on restart.
              </p>
            </div>
            <div className="card">
              <h4>Secure authentication</h4>
              <p>
                Implement user registration, login, JWT tokens, and
                role-based access control the way production apps do it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="landing__weeks">
        <div className="container">
          <h2>6 weeks, 18 sessions</h2>
          <div className="landing__week-list">
            {WEEKS.map((week) => (
              <div key={week.num} className="landing__week-item">
                <div className="landing__week-num">{week.num}</div>
                <div>
                  <h4>{week.title}</h4>
                  <p>{week.topics}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing__bottom-cta">
        <div className="container container--narrow text-center">
          <h2>Ready to start?</h2>
          <p>No prerequisites. Bring your laptop and your curiosity.</p>
          {!user && (
            <Link to="/register" className="btn btn--primary btn--lg mt-24">
              Sign up for free
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
