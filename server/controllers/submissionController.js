const Submission = require("../models/Submission");
const Assignment = require("../models/Assignment");
const { ApiError } = require("../utils/errorHandler");

// @desc    Submit a GitHub link for an assignment
// @route   POST /api/submissions
// @access  Student
exports.submitAssignment = async (req, res, next) => {
  try {
    const { assignment, githubLink } = req.body;

    if (!assignment || !githubLink) {
      return next(
        new ApiError("Please provide assignment ID and GitHub link", 400)
      );
    }

    // Check assignment exists and is published
    const assignmentDoc = await Assignment.findById(assignment);
    if (!assignmentDoc) {
      return next(new ApiError("Assignment not found", 404));
    }
    if (!assignmentDoc.isPublished) {
      return next(new ApiError("Assignment is not available yet", 400));
    }

    // Check if already submitted
    const existing = await Submission.findOne({
      student: req.user._id,
      assignment,
    });
    if (existing) {
      return next(
        new ApiError(
          "You have already submitted this assignment. Contact the tutor to update.",
          400
        )
      );
    }

    const submission = await Submission.create({
      student: req.user._id,
      assignment,
      githubLink,
    });

    res.status(201).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get own submissions
// @route   GET /api/submissions/my
// @access  Student
exports.getMySubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({
      student: req.user._id,
    })
      .populate({
        path: "assignment",
        select: "title assignmentNumber session",
        populate: { path: "session", select: "sessionNumber title" },
      })
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

// @desc    Review/grade a submission
// @route   PUT /api/submissions/:id/review
// @access  Tutor only
exports.reviewSubmission = async (req, res, next) => {
  try {
    const { grade } = req.body;

    if (!grade || !["pass", "fail"].includes(grade)) {
      return next(new ApiError("Grade must be 'pass' or 'fail'", 400));
    }

    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { grade, isReviewed: true },
      { new: true, runValidators: true }
    ).populate("student", "name email");

    if (!submission) {
      return next(new ApiError("Submission not found", 404));
    }

    res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};
