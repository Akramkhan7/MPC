const router = require("express").Router();
const { listErrorLogs, exportErrorLogs } = require("../controllers/errorLogsController");

router.get("/", listErrorLogs);
router.get("/export", exportErrorLogs);

module.exports = router;