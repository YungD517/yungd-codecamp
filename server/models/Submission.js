const mongoose = require("mongoose");
const validator = require("validator");

const submissionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student reference is required"],
    },
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: [true, "Assignment reference is required"],
    },
    githubLink: {
      type: String,
      required: [true, "GitHub link is required"],
      trim: true,
      validate: {
        validator: (value) =>
          validator.isURL(value) && value.includes("github.com"),
        message: "Please provide a valid GitHub URL",
      },
    },
    isReviewed: {
      type: Boolean,
      default: false,
    },
    grade: {
      type: String,
      enum: ["pending", "pass", "fail"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// A student can only submit once per assignment
submissionSchema.index({ student: 1, assignment: 1 }, { unique: true });

module.exports = mongoose.model("Submission", submissionSchema);
