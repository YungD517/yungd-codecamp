const Quiz = require("../models/Quiz");
const QuizAttempt = require("../models/QuizAttempt");
const User = require("../models/User");
const { ApiError } = require("../utils/errorHandler");

// @desc    Get quiz for a session
// @route   GET /api/quizzes/session/:sessionId
// @access  Private
exports.getQuizBySession = async (req, res, next) => {
  try {
    const isTutor = req.user.role === "tutor";

    let query = Quiz.findOne({ session: req.params.sessionId }).populate(
      "session",
      "sessionNumber title"
    );

    const quiz = await query;

    if (!quiz) {
      return next(new ApiError("Quiz not found for this session", 404));
    }

    // Students can only see published quizzes
    if (!isTutor && !quiz.isPublished) {
      return next(new ApiError("Quiz not found for this session", 404));
    }

    const result = quiz.toObject();

    // CRITICAL: Hide correct answers from students
    if (!isTutor) {
      result.questions = result.questions.map((q) => {
        delete q.correctAnswer;
        return q;
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a quiz
// @route   POST /api/quizzes
// @access  Tutor only
exports.createQuiz = async (req, res, next) => {
  try {
    // Check if quiz already exists for this session
    const existingQuiz = await Quiz.findOne({ session: req.body.session });
    if (existingQuiz) {
      return next(new ApiError("A quiz already exists for this session", 400));
    }

    const quiz = await Quiz.create(req.body);

    res.status(201).json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a quiz
// @route   PUT /api/quizzes/:id
// @access  Tutor only
exports.updateQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!quiz) {
      return next(new ApiError("Quiz not found", 404));
    }

    res.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit a quiz attempt
// @route   POST /api/quizzes/:id/attempt
// @access  Student only
exports.submitAttempt = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return next(new ApiError("Quiz not found", 404));
    }

    if (!quiz.isPublished) {
      return next(new ApiError("Quiz is not available yet", 400));
    }

    const { answers } = req.body;

    if (!answers || answers.length !== 10) {
      return next(new ApiError("Please answer all 10 questions", 400));
    }

    // Calculate score server-side
    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        score++;
      }
    });

    // Get attempt number
    const previousAttempts = await QuizAttempt.countDocuments({
      student: req.user._id,
      quiz: quiz._id,
    });

    const attempt = await QuizAttempt.create({
      student: req.user._id,
      quiz: quiz._id,
      session: quiz.session,
      answers,
      score,
      attemptNumber: previousAttempts + 1,
    });

    // Mark session as complete on first attempt
    if (previousAttempts === 0) {
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { completedSessions: quiz.session },
      });
    }

    // Return attempt with correct answers so student can review
    const reviewData = quiz.questions.map((q, i) => ({
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      studentAnswer: answers[i],
      isCorrect: answers[i] === q.correctAnswer,
    }));

    res.status(201).json({
      success: true,
      data: {
        score,
        totalQuestions: 10,
        attemptNumber: attempt.attemptNumber,
        review: reviewData,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get own attempts for a quiz
// @route   GET /api/quizzes/:id/attempts
// @access  Student
exports.getMyAttempts = async (req, res, next) => {
  try {
    const attempts = await QuizAttempt.find({
      student: req.user._id,
      quiz: req.params.id,
    }).sort("-createdAt");

    res.status(200).json({
      success: true,
      count: attempts.length,
      data: attempts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all student attempts for a quiz
// @route   GET /api/quizzes/:id/all-attempts
// @access  Tutor only
exports.getAllAttempts = async (req, res, next) => {
  try {
    const attempts = await QuizAttempt.find({ quiz: req.params.id })
      .populate("student", "name email")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: attempts.length,
      data: attempts,
    });
  } catch (error) {
    next(error);
  }
};
