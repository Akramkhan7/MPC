const router = require("express").Router();
const {
  login,
  register,
  me,
  updateAdmin,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const {verifyToken} = require("../controllers/verifyToken")

router.post("/register", register);
router.post("/login", login);
router.get("/verify", verifyToken);

router.get("/me", protect, me);
router.put("/update", protect, updateAdmin);
module.exports = router;
