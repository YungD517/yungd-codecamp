const User = require("../models/User");
const QuizAttempt = require("../models/QuizAttempt");
const Submission = require("../models/Submission");
const { ApiError } = require("../utils/errorHandler");

// @desc    Get all students
// @route   GET /api/users/students
// @access  Tutor only
exports.getAllStudents = async (req, res, next) => {
  try {
    const students = await User.find({ role: "student" })
      .select("name email completedSessions createdAt")
      .populate("completedSessions", "sessionNumber title")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single student
// @route   GET /api/users/students/:id
// @access  Tutor only
exports.getStudent = async (req, res, next) => {
  try {
    const student = await User.findById(req.params.id)
      .select("name email completedSessions createdAt")
      .populate("completedSessions", "sessionNumber title week day");

    if (!student || student.role !== "student") {
      return next(new ApiError("Student not found", 404));
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed student progress
// @route   GET /api/users/students/:id/progress
// @access  Tutor only
exports.getStudentProgress = async (req, res, next) => {
  try {
    const student = await User.findById(req.params.id).select("name email");

    if (!student || student.role !== "student") {
      return next(new ApiError("Student not found", 404));
    }

    // Get all quiz attempts — only best score per quiz
    const quizAttempts = await QuizAttempt.find({ student: req.params.id })
      .populate("session", "sessionNumber title week day")
      .sort("session");

    // Group attempts by session and get best score
    const quizProgress = {};
    quizAttempts.forEach((attempt) => {
      const sessionId = attempt.session._id.toString();
      if (
        !quizProgress[sessionId] ||
        attempt.score > quizProgress[sessionId].bestScore
      ) {
        quizProgress[sessionId] = {
          session: attempt.session,
          bestScore: attempt.score,
          totalAttempts: quizProgress[sessionId]
            ? quizProgress[sessionId].totalAttempts + 1
            : 1,
        };
      } else {
        quizProgress[sessionId].totalAttempts++;
      }
    });

    // Get all submissions
    const submissions = await Submission.find({ student: req.params.id })
      .populate({
        path: "assignment",
        select: "title assignmentNumber session",
        populate: { path: "session", select: "sessionNumber title" },
      })
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      data: {
        student,
        quizProgress: Object.values(quizProgress),
        submissions,
        completedSessions: Object.keys(quizProgress).length,
        totalSessions: 18,
      },
    });
  } catch (error) {
    next(error);
  }
};
