const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  let token = req.header("Authorization");

  console.log("Received Token:", token); // ✅ Debugging

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length); // ✅ Remove "Bearer " prefix
  }

  try {
    console.log("Verifying Token:", token); // ✅ Debugging
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    res.status(401).json({ message: "Invalid token", error: error.message });
  }
};

module.exports = authMiddleware;
