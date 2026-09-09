import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="container navbar__inner">
        <Link to={user ? (user.role === "tutor" ? "/tutor" : "/dashboard") : "/"} className="navbar__brand">
          YungD<span className="navbar__brand-accent">CodeCamp</span>
        </Link>

        <div className="navbar__right">
          {user ? (
            <>
              {user.role === "tutor" && (
                <div className="navbar__links">
                  <Link to="/tutor">Dashboard</Link>
                  <Link to="/tutor/lessons">Lessons</Link>
                  <Link to="/tutor/quizzes">Quizzes</Link>
                  <Link to="/tutor/assignments">Assignments</Link>
                  <Link to="/tutor/students">Students</Link>
                </div>
              )}
              <div className="navbar__user">
                <span className="navbar__name">{user.name}</span>
                <span className="badge badge--accent">{user.role}</span>
                <button onClick={handleLogout} className="btn btn--ghost">
                  Log out
                </button>
              </div>
            </>
          ) : (
            <div className="navbar__links">
              <Link to="/login">Log in</Link>
              <Link to="/register" className="btn btn--primary">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
