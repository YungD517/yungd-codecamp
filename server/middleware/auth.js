const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { ApiError } = require("../utils/errorHandler");

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(new ApiError("Not authorized — please log in", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ApiError("User no longer exists", 401));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError("Not authorized — invalid token", 401));
  }
};

module.exports = protect;