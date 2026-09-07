const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const { ApiError } = require("../utils/errorHandler");

// @desc    Get assignments for a session checkpoint
// @route   GET /api/assignments/session/:sessionId
// @access  Private
exports.getAssignmentsBySession = async (req, res, next) => {
  try {
    let query = Assignment.find({
      session: req.params.sessionId,
    }).sort("assignmentNumber");

    // Students only see published
    if (req.user.role !== "tutor") {
      query = query.find({ isPublished: true });
    }

    const assignments = await query;

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create an assignment
// @route   POST /api/assignments
// @access  Tutor only
exports.createAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.create(req.body);

    res.status(201).json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an assignment
// @route   PUT /api/assignments/:id
// @access  Tutor only
exports.updateAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!assignment) {
      return next(new ApiError("Assignment not found", 404));
    }

    res.status(200).json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all submissions for an assignment
// @route   GET /api/assignments/:id/submissions
// @access  Tutor only
exports.getSubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({
      assignment: req.params.id,
    })
      .populate("student", "name email")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error) {
    next(error);
  }
};
