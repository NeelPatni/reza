const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Please Login",
      });
    }

    // Extract token
    const token =
      authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Save user info
    req.user = decoded;

    next();
  } catch (error) {
    console.log(
      "JWT ERROR:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};