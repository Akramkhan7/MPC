const jwt = require("jsonwebtoken");

function verifyToken(req, res) {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      valid: false,
      message: "Authorization token required",
    });
  }

  const token = authHeader.split(" ")[1];

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return res.status(200).json({
      valid: true,
      adminId: decoded.adminId, // ✅ useful
      message: "Admin verified successfully",
    });

  } catch (err) {

    return res.status(401).json({
      valid: false,
      message: "Invalid or expired token",
    });

  }
}

module.exports = { verifyToken };