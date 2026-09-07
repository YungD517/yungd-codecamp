const express = require("express");
const router = express.Router();
const {
  getQuizBySession,
  createQuiz,
  updateQuiz,
  submitAttempt,
  getMyAttempts,
  getAllAttempts,
} = require("../controllers/quizController");
const protect = require("../middleware/auth");
const isTutor = require("../middleware/isTutor");

router.route("/").post(protect, isTutor, createQuiz);

router.get("/session/:sessionId", protect, getQuizBySession);

router.route("/:id").put(protect, isTutor, updateQuiz);

router.post("/:id/attempt", protect, submitAttempt);
router.get("/:id/attempts", protect, getMyAttempts);
router.get("/:id/all-attempts", protect, isTutor, getAllAttempts);

module.exports = router;
