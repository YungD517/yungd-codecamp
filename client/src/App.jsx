import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import SessionView from "./pages/SessionView";
import QuizPage from "./pages/QuizPage";
import AssignmentPage from "./pages/AssignmentPage";
import TutorDashboard from "./pages/TutorDashboard";
import ManageLessons from "./pages/ManageLessons";
import ManageQuizzes from "./pages/ManageQuizzes";
import ManageAssignments from "./pages/ManageAssignments";
import StudentList from "./pages/StudentList";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1a1e25",
              color: "#e2e4e9",
              border: "1px solid #2a2f38",
              fontSize: "0.875rem",
            },
          }}
        />
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student */}
          <Route path="/dashboard" element={
            <ProtectedRoute><StudentDashboard /></ProtectedRoute>
          } />
          <Route path="/session/:id" element={
            <ProtectedRoute><SessionView /></ProtectedRoute>
          } />
          <Route path="/quiz/:sessionId" element={
            <ProtectedRoute><QuizPage /></ProtectedRoute>
          } />
          <Route path="/assignments/:sessionId" element={
            <ProtectedRoute><AssignmentPage /></ProtectedRoute>
          } />

          {/* Tutor */}
          <Route path="/tutor" element={
            <ProtectedRoute role="tutor"><TutorDashboard /></ProtectedRoute>
          } />
          <Route path="/tutor/lessons" element={
            <ProtectedRoute role="tutor"><ManageLessons /></ProtectedRoute>
          } />
          <Route path="/tutor/quizzes" element={
            <ProtectedRoute role="tutor"><ManageQuizzes /></ProtectedRoute>
          } />
          <Route path="/tutor/assignments" element={
            <ProtectedRoute role="tutor"><ManageAssignments /></ProtectedRoute>
          } />
          <Route path="/tutor/students" element={
            <ProtectedRoute role="tutor"><StudentList /></ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}
