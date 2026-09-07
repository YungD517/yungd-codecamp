const express = require("express");
const router = express.Router();
const {
  getAllSessions,
  getSession,
  createSession,
  updateSession,
  deleteSession,
} = require("../controllers/sessionController");
const protect = require("../middleware/auth");
const isTutor = require("../middleware/isTutor");

router.route("/").get(protect, getAllSessions).post(protect, isTutor, createSession);

router
  .route("/:id")
  .get(protect, getSession)
  .put(protect, isTutor, updateSession)
  .delete(protect, isTutor, deleteSession);

module.exports = router;
