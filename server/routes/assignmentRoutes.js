const express = require("express");
const router = express.Router();
const {
  getAssignmentsBySession,
  createAssignment,
  updateAssignment,
  getSubmissions,
} = require("../controllers/assignmentController");
const protect = require("../middleware/auth");
const isTutor = require("../middleware/isTutor");

router.route("/").post(protect, isTutor, createAssignment);

router.get("/session/:sessionId", protect, getAssignmentsBySession);

router.route("/:id").put(protect, isTutor, updateAssignment);

router.get("/:id/submissions", protect, isTutor, getSubmissions);

module.exports = router;
