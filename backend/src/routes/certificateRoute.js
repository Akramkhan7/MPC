const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const {
  generateCertificatesForBatch,
  listCertificatesByBatch,
  downloadCertificatePdf,
  verifyCertificatePublic,
  resendCertificateEmail,
} = require("../controllers/certificateController");

// ✅ Generate for batch
router.post("/batches/:batchId/certificates/generate", protect, generateCertificatesForBatch);

// ✅ List certificates for batch (for UI)
router.get("/batches/:batchId/certificates", protect, listCertificatesByBatch);

// ✅ Download PDF
router.get("/certificates/:certificateId/download", protect, downloadCertificatePdf);

// ✅ Resend email (manual retry)
router.post("/certificates/:certificateId/resend-email", protect, resendCertificateEmail);

// ✅ Public verify (no token)
router.get("/verify/:certificateNo", verifyCertificatePublic);

module.exports = router;