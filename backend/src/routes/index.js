const router = require("express").Router();

router.use("/auth", require("./authRoute"));
router.use("/batches", require("./batchRoute"));
router.use("/error-logs", require("./errorLogsRoute"));

module.exports = router;
