const express = require("express");
const router = express.Router();
const { register, login, logout, getMe } = require("../controllers/authController");
const protect = require("../middleware/auth");
const { loginLimiter } = require("../middleware/rateLimiter");

router.post("/register", register);
router.post("/login", loginLimiter, login);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

module.exports = router;
