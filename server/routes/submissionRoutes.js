const express = require("express");
const router = express.Router();
const {
  submitAssignment,
  getMySubmissions,
  reviewSubmission,
} = require("../controllers/submissionController");
const protect = require("../middleware/auth");
const isTutor = require("../middleware/isTutor");

router.route("/").post(protect, submitAssignment);

router.get("/my", protect, getMySubmissions);

router.put("/:id/review", protect, isTutor, reviewSubmission);

module.exports = router;
