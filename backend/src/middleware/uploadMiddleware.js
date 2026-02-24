const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(process.cwd(), "src", "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}_${safeName}`);
  },
});

function fileFilter(req, file, cb) {
  const isCsv =
    file.mimetype === "text/csv" ||
    file.originalname.toLowerCase().endsWith(".csv");
  if (!isCsv) return cb(new Error("Only CSV files allowed"));
  cb(null, true);
}

const uploadCsv = multer({ storage, fileFilter }).single("file");

module.exports = { uploadCsv };