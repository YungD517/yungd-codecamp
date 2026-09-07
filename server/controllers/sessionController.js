const Session = require("../models/Session");
const { ApiError } = require("../utils/errorHandler");

// @desc    Get all sessions
// @route   GET /api/sessions
// @access  Private
exports.getAllSessions = async (req, res, next) => {
  try {
    const isTutor = req.user.role === "tutor";

    // Select fields based on role
    let query = Session.find({ isPublished: true }).sort("order");

    // Tutors see all sessions including unpublished
    if (isTutor) {
      query = Session.find().sort("order");
    }

    const sessions = await query;

    // Strip tutor content for students
    const result = sessions.map((session) => {
      const s = session.toObject();
      if (!isTutor) {
        delete s.tutorContent;
        // Strip tutor code from snippets
        s.codeSnippets = s.codeSnippets.map((snippet) => {
          delete snippet.tutorCode;
          return snippet;
        });
      }
      return s;
    });

    res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single session
// @route   GET /api/sessions/:id
// @access  Private
exports.getSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return next(new ApiError("Session not found", 404));
    }

    // Students can only see published sessions
    if (req.user.role !== "tutor" && !session.isPublished) {
      return next(new ApiError("Session not found", 404));
    }

    const result = session.toObject();

    // Strip tutor content for students
    if (req.user.role !== "tutor") {
      delete result.tutorContent;
      result.codeSnippets = result.codeSnippets.map((snippet) => {
        delete snippet.tutorCode;
        return snippet;
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

// @desc    Create a session
// @route   POST /api/sessions
// @access  Tutor only
exports.createSession = async (req, res, next) => {
  try {
    const session = await Session.create(req.body);

    res.status(201).json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a session
// @route   PUT /api/sessions/:id
// @access  Tutor only
exports.updateSession = async (req, res, next) => {
  try {
    const session = await Session.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!session) {
      return next(new ApiError("Session not found", 404));
    }

    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a session
// @route   DELETE /api/sessions/:id
// @access  Tutor only
exports.deleteSession = async (req, res, next) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);

    if (!session) {
      return next(new ApiError("Session not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Session deleted",
    });
  } catch (error) {
    next(error);
  }
};
