const router = require("express").Router();

router.use("/auth", require("./authRoute"));
router.use("/batches", require("./batchRoute"));
router.use("/error-logs", require("./errorLogsRoute"));
router.use("/", require("./certificateRoute"));

module.exports = router;
