const mongoose = require("mongoose");

const codeSnippetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Code snippet title is required"],
      trim: true,
    },
    studentCode: {
      type: String,
      required: [true, "Student code is required"],
    },
    tutorCode: {
      type: String,
      required: [true, "Tutor code is required"],
    },
    language: {
      type: String,
      default: "javascript",
    },
  },
  { _id: true }
);

const sessionSchema = new mongoose.Schema(
  {
    sessionNumber: {
      type: Number,
      required: [true, "Session number is required"],
      unique: true,
      min: 1,
      max: 18,
    },
    title: {
      type: String,
      required: [true, "Session title is required"],
      trim: true,
    },
    studentContent: {
      type: String,
      required: [true, "Student content is required"],
    },
    tutorContent: {
      type: String,
      required: [true, "Tutor content is required"],
    },
    codeSnippets: [codeSnippetSchema],
    week: {
      type: Number,
      required: [true, "Week number is required"],
      min: 1,
      max: 6,
    },
    day: {
      type: String,
      required: [true, "Day is required"],
      enum: ["Monday", "Tuesday", "Wednesday"],
    },
    order: {
      type: Number,
      required: true,
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

module.exports = mongoose.model("Session", sessionSchema);
