const express = require("express");
const router = express.Router();
const {
  getAllStudents,
  getStudent,
  getStudentProgress,
} = require("../controllers/userController");
const protect = require("../middleware/auth");
const isTutor = require("../middleware/isTutor");

router.get("/students", protect, isTutor, getAllStudents);
router.get("/students/:id", protect, isTutor, getStudent);
router.get("/students/:id/progress", protect, isTutor, getStudentProgress);

module.exports = router;
