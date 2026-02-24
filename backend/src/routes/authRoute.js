const router = require("express").Router();
const { login, register ,me , updateAdmin } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);

router.get("/me", protect, me);
router.put("/update", protect, updateAdmin);
module.exports = router;
