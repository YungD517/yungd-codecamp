const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: [true, "Session reference is required"],
    },
    title: {
      type: String,
      required: [true, "Assignment title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Assignment description is required"],
    },
    assignmentNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 3,
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

// One session can have multiple assignments but each number is unique per session
assignmentSchema.index({ session: 1, assignmentNumber: 1 }, { unique: true });

module.exports = mongoose.model("Assignment", assignmentSchema);
