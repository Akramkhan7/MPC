const router = require("express").Router();

const { protect } = require("../middleware/authMiddleware");
const { uploadCsv } = require("../middleware/uploadMiddleware");
const {
  uploadBatch,
  listBatches,
  getBatch,
  listCandidates,
  getSingleCandidate,
  listAllCandidates,
  getEmailLogs,
  downloadCertificatePdf

} = require("../controllers/batchController");

// ✅ Protected routes (token required)
router.post("/upload", protect, uploadCsv, uploadBatch);
router.get("/", protect, listBatches);
router.get("/candidates", protect, listAllCandidates);
router.get('/emaillogs',protect,getEmailLogs);
router.get('/certificates/:certificateId/download',downloadCertificatePdf)
// router.get("/:id", protect, getBatch);

router.get("/:id/candidates", protect, listCandidates);

router.get("/candidate/:candidateId", protect, getSingleCandidate);

module.exports = router;
