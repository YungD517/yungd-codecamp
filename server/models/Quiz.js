const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: [true, "Question text is required"],
      trim: true,
    },
    options: {
      type: [String],
      required: [true, "Options are required"],
      validate: {
        validator: (arr) => arr.length === 4,
        message: "Each question must have exactly 4 options",
      },
    },
    correctAnswer: {
      type: Number,
      required: [true, "Correct answer index is required"],
      min: 0,
      max: 3,
    },
    difficulty: {
      type: String,
      required: [true, "Difficulty level is required"],
      enum: ["easy", "medium", "hard"],
    },
  },
  { _id: true }
);

const quizSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: [true, "Session reference is required"],
      unique: true,
    },
    questions: {
      type: [questionSchema],
      validate: {
        validator: function (arr) {
          if (arr.length !== 10) return false;
          const easy = arr.filter((q) => q.difficulty === "easy").length;
          const medium = arr.filter((q) => q.difficulty === "medium").length;
          const hard = arr.filter((q) => q.difficulty === "hard").length;
          return easy === 3 && medium === 2 && hard === 5;
        },
        message:
          "Quiz must have exactly 10 questions: 3 easy, 2 medium, 5 hard",
      },
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Quiz", quizSchema);
