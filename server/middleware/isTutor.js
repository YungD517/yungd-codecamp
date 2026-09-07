const { ApiError } = require("../utils/errorHandler");

const isTutor = (req, res, next) => {
  if (req.user.role !== "tutor") {
    return next(new ApiError("Access denied — tutor only", 403));
  }
  next();
};

module.exports = isTutor;
