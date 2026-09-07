const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student reference is required"],
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: [true, "Quiz reference is required"],
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: [true, "Session reference is required"],
    },
    answers: {
      type: [Number],
      required: [true, "Answers are required"],
      validate: {
        validator: (arr) => arr.length === 10,
        message: "Must provide answers for all 10 questions",
      },
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    totalQuestions: {
      type: Number,
      default: 10,
    },
    attemptNumber: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient querying
quizAttemptSchema.index({ student: 1, quiz: 1 });
quizAttemptSchema.index({ student: 1, session: 1 });

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);
