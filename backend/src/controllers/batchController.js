const { db } = require("../config/db");
const {
  parseCsvFile,
  normalizeCell,
  isValidEmail,
  isValidDateYYYYMMDD,
  resolveHeaderKey,
} = require("../utils/csvUtils");

const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const nodemailer = require("nodemailer");

// Required fields for your UI
const REQUIRED = {
  name: ["name"],
  email: ["email", "email address", "email_address"],
  grade: ["grade"],
  course: ["course", "course name", "course_name"],
  certificate_date: ["certificate_date", "date", "issue_date"],
};

function getMissingHeaders(headers) {
  const missing = [];
  for (const [field, aliases] of Object.entries(REQUIRED)) {
    const key = resolveHeaderKey(headers, aliases);
    if (!key) missing.push(field);
  }
  return missing;
}

function uiStatus(status, uiErrorType) {
  if (status === "valid") return "Valid";
  return uiErrorType || "Invalid";
}

// --- DIRECTORY SETUP ---
const CERT_DIR = path.join(process.cwd(), "src", "certificates");
fs.mkdirSync(CERT_DIR, { recursive: true });

// --- HELPER FUNCTIONS ---
function getMissingHeaders(headers) {
  const missing = [];
  for (const [field, aliases] of Object.entries(REQUIRED)) {
    const key = resolveHeaderKey(headers, aliases);
    if (!key) missing.push(field);
  }
  return missing;
}

function uiStatus(status, uiErrorType) {
  if (status === "valid") return "Valid";
  return uiErrorType || "Invalid";
}

function makeCertificateNo(candidateId) {
  return `MPC-${String(candidateId).padStart(6, "0")}`;
}

function toYYYYMMDD(dateVal) {
  if (!dateVal) return "";
  try {
    return new Date(dateVal).toISOString().slice(0, 10);
  } catch {
    return "";
  }
}

// --- PDF & EMAIL GENERATION LOGIC ---

async function createCertificatePdf({
  name,
  course,
  grade,
  certificateNo,
  dateStr,
  verifyUrl,
  outPath,
}) {
  const qrDataUrl = await QRCode.toDataURL(verifyUrl);
  const qrBuffer = Buffer.from(qrDataUrl.split(",")[1], "base64");

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margin: 0,
    });

    const stream = fs.createWriteStream(outPath);
    doc.pipe(stream);

    const width = doc.page.width;
    const height = doc.page.height;

    /* ================= BACKGROUND ================= */

    doc.rect(0, 0, width, height).fill("#fdfcf9");

    // Left Vertical Ribbon
    doc.rect(0, 0, 40, height).fill("#0B3D91");
    doc.rect(40, 0, 8, height).fill("#1E5ED6");

    // Bottom Ribbon
    doc.rect(0, height - 60, width, 60).fill("#0B3D91");
    doc.rect(0, height - 60, width, 8).fill("#1E5ED6");

    doc.fillColor("black");

    /* ================= TITLE ================= */

    doc
      .font("Times-Bold")
      .fontSize(48)
      .text("Award Certificate", 0, 110, { align: "center" });

    /* ================= PRESENTED TEXT ================= */

    doc
      .font("Times-Roman")
      .fontSize(22)
      .text("Presented to", 0, 200, { align: "center" });

    /* ================= NAME ================= */

    doc
      .font("Times-Bold")
      .fontSize(42)
      .text(name || "N/A", {
        align: "center",
      });

    doc.moveDown(0.5);

    doc
      .font("Times-Roman")
      .fontSize(22)
      .text("for", { align: "center" });

    /* ================= COURSE / REASON ================= */

    doc
      .font("Times-Italic")
      .fontSize(28)
      .text(course || "N/A", { align: "center" });

    doc.moveDown(0.5);

    /* ================= GRADE ================= */

    doc
      .font("Times-Roman")
      .fontSize(20)
      .text(`Grade: ${grade || "N/A"}`, { align: "center" });

    /* ================= SEAL ================= */

    const centerX = width / 2;
    const sealY = height - 170;

    doc
      .circle(centerX, sealY, 40)
      .fillAndStroke("#1E5ED6", "#0B3D91");

    doc
      .circle(centerX, sealY, 30)
      .fill("#ffffff");

    /* ================= SIGNATURE ================= */

    doc
      .moveTo(150, height - 130)
      .lineTo(320, height - 130)
      .stroke();

    doc
      .fontSize(16)
      .text("Authorized Signature", 150, height - 110);

    /* ================= DATE ================= */

    doc
      .moveTo(width - 320, height - 130)
      .lineTo(width - 150, height - 130)
      .stroke();

    doc
      .fontSize(16)
      .text(dateStr || "Date", width - 300, height - 110);

    /* ================= CERTIFICATE NUMBER ================= */

    doc
      .fontSize(12)
      .text(`Certificate No: ${certificateNo}`, 60, height - 40);

    /* ================= QR CODE ================= */

    doc.image(qrBuffer, width - 130, height - 130, {
      width: 80,
    });

    doc.end();

    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}

function createMailer() {
  return nodemailer.createTransport({
    service: "gmail", // Change if using Hostinger, AWS, etc.
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

async function sendCertificateEmail({ toEmail, pdfPath, certificateNo, name, grade ,course}) {
  const transporter = createMailer();

  await transporter.sendMail({
    from: `"Admin Team" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your Certificate is Ready 🎓",
    html: `

    Dear ${name || ""},
   
Congratulations on completing ${course}!

Your grade: ${grade}
Certificate ID: ${certificateNo}

Please find your certificate attached.

Best regards,
CertifyPro Team

    `,
    attachments: [
      {
        filename: `${certificateNo}.pdf`,
        path: pdfPath,
      },
    ],
  });
}

// --- BACKGROUND WORKER (Automated Generation) ---

async function processBatchCertificatesBackground(batchId) {
  try {
    console.log(`[BACKGROUND] Starting generation for batch ${batchId}...`);

    // fetch valid candidates
    const [cands] = await db.execute(
      `SELECT id, name, email, course, grade, certificate_date
       FROM candidates
       WHERE batch_id=? AND validation_status='valid'`,
      [batchId],
    );

    if (cands.length === 0) {
      console.log(
        `[BACKGROUND] No valid candidates found for batch ${batchId}`,
      );
      return;
    }

    for (const c of cands) {
      const certificateNo = makeCertificateNo(c.id);
      const verifyUrl = `${process.env.APP_URL || "http://localhost:5000"}/api/verify/${certificateNo}`;

      // check existing certificate
      const [exists] = await db.execute(
        `SELECT id, pdf_path, email_sent FROM certificates WHERE candidate_id=? LIMIT 1`,
        [c.id],
      );

      let certificateId;
      let pdfPath;
      let shouldSendEmail = true;

      if (exists.length > 0) {
        certificateId = exists[0].id;
        pdfPath = exists[0].pdf_path;
        if (exists[0].email_sent) shouldSendEmail = false;
      } else {
        // create new PDF + insert certificate
        const fileName = `${certificateNo}.pdf`;
        pdfPath = path.join(CERT_DIR, fileName);

        // AWAIT is critical here so it finishes writing the file before sending email
        await createCertificatePdf({
          name: c.name,
          course: c.course,
          grade: c.grade,
          certificateNo,
          dateStr: toYYYYMMDD(c.certificate_date),
          verifyUrl,
          outPath: pdfPath,
        });

        const [ins] = await db.execute(
          `INSERT INTO certificates (candidate_id, certificate_no, pdf_path)
           VALUES (?, ?, ?)`,
          [c.id, certificateNo, pdfPath],
        );

        certificateId = ins.insertId;
      }

      // Send email
      if (shouldSendEmail && c.email) {
        try {
          await sendCertificateEmail({
            toEmail: c.email,
            pdfPath,
            certificateNo,
            name: c.name,
          course: c.course,
          grade: c.grade,
          dateStr: toYYYYMMDD(c.certificate_date),

          });

          await db.execute(
            `UPDATE certificates SET email_sent=1, email_sent_at=NOW() WHERE id=?`,
            [certificateId],
          );

          await db.execute(
            `INSERT INTO email_logs (certificate_id, batch_id, candidate_id, email, status)
             VALUES (?, ?, ?, ?, 'sent')`,
            [certificateId, batchId, c.id, c.email],
          );
          console.log(`[BACKGROUND] Sent cert to ${c.email}`);
        } catch (e) {
          console.error(`[BACKGROUND] Failed to send to ${c.email}`, e.message);
          await db.execute(
            `INSERT INTO email_logs (certificate_id, batch_id, candidate_id, email, status, error_message)
             VALUES (?, ?, ?, ?, 'failed', ?)`,
            [
              certificateId,
              batchId,
              c.id,
              c.email,
              String(e.message).slice(0, 255),
            ],
          );
        }
      }
    }
    console.log(`[BACKGROUND] Finished processing batch ${batchId}!`);
  } catch (err) {
    console.error(`[BACKGROUND ERROR] Batch ${batchId} failed:`, err);
  }
}

// --- YOUR EXISTING CONTROLLER ---

// ✅ POST /api/batches/upload
async function uploadBatch(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "CSV file required (form-data key: file)",
      });
    }

    const uploadFileName = req.file.originalname;
    const { headers, rows } = await parseCsvFile(req.file.path);

    // Step-1 Strict header validation (missing column => reject)
    const missing = getMissingHeaders(headers);
    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "CSV missing required columns",
        missingColumns: missing,
      });
    }

    // Resolve actual keys
    const keyName = resolveHeaderKey(headers, REQUIRED.name);
    const keyEmail = resolveHeaderKey(headers, REQUIRED.email);
    const keyGrade = resolveHeaderKey(headers, REQUIRED.grade);
    const keyCourse = resolveHeaderKey(headers, REQUIRED.course);
    const keyDate = resolveHeaderKey(headers, REQUIRED.certificate_date);

    // Create batch
    const [batchRes] = await db.execute(
      `INSERT INTO certificate_batches
       (original_file_name, stored_file_path, total_records, status)
       VALUES (?, ?, ?, 'processing')`,
      [uploadFileName, req.file.path, rows.length],
    );
    const batchId = batchRes.insertId;

    let valid = 0;
    let invalid = 0;

    const preview = [];
    const PREVIEW_LIMIT = 200;

    for (let i = 0; i < rows.length; i++) {
      const rowNumber = i + 2;

      const name = normalizeCell(rows[i][keyName]);
      const email = normalizeCell(rows[i][keyEmail]).toLowerCase();
      const grade = normalizeCell(rows[i][keyGrade]);
      const course = normalizeCell(rows[i][keyCourse]);
      const dateRaw = normalizeCell(rows[i][keyDate]);

      let validation_status = "valid";
      let validation_error = null;

      let error_type = null;
      let reason = null;
      let uiErrorType = null;

      // Step-2 row validation => error_logs
      if (!name) {
        validation_status = "invalid";
        validation_error = "Name field is empty";
        error_type = "Missing Field";
        reason = "Name field is empty";
        uiErrorType = "Missing name";
      } else if (!email) {
        validation_status = "invalid";
        validation_error = "Email field is empty";
        error_type = "Missing Field";
        reason = "Email field is empty";
        uiErrorType = "Missing email";
      } else if (!isValidEmail(email)) {
        validation_status = "invalid";
        validation_error = "Email format is invalid";
        error_type = "Invalid Email";
        reason = "Email format is invalid";
        uiErrorType = "Invalid email";
      } else if (!grade) {
        validation_status = "invalid";
        validation_error = "Grade field is empty";
        error_type = "Missing Field";
        reason = "Grade field is empty";
        uiErrorType = "Missing grade";
      } else if (!course) {
        validation_status = "invalid";
        validation_error = "Course field is empty";
        error_type = "Missing Field";
        reason = "Course field is empty";
        uiErrorType = "Missing course";
      } else if (!dateRaw) {
        validation_status = "invalid";
        validation_error = "Date field is empty";
        error_type = "Missing Field";
        reason = "Date field is empty";
        uiErrorType = "Missing date";
      } else if (!isValidDateYYYYMMDD(dateRaw)) {
        validation_status = "invalid";
        validation_error = "Date format must be YYYY-MM-DD";
        error_type = "Invalid Date";
        reason = "Date format must be YYYY-MM-DD";
        uiErrorType = "Invalid date";
      }

      if (validation_status === "valid") valid++;
      else invalid++;

      // Insert candidate always (preview)
      await db.execute(
        `INSERT INTO candidates
         (batch_id, row_no, name, email, grade, course, certificate_date, validation_status, validation_error)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          batchId,
          rowNumber,
          name || null,
          email || null,
          grade || null,
          course || null,
          validation_status === "valid" ? dateRaw : null,
          validation_status,
          validation_error,
        ],
      );

      // Insert error log if invalid
      if (validation_status === "invalid") {
        await db.execute(
          `INSERT INTO error_logs
           (batch_id, row_no, name, email, error_type, reason, uploaded_file)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            batchId,
            rowNumber,
            name || null,
            email || null,
            error_type,
            reason,
            uploadFileName,
          ],
        );
      }

      // Preview
      if (preview.length < PREVIEW_LIMIT) {
        preview.push({
          row: rowNumber,
          name: name || "",
          email: email || "",
          grade: grade || "",
          course: course || "",
          status: uiStatus(validation_status, uiErrorType),
        });
      }
    }

    // update batch
    await db.execute(
      `UPDATE certificate_batches
       SET valid_records=?, invalid_records=?, status='completed'
       WHERE id=?`,
      [valid, invalid, batchId],
    );

    // 👇 THIS IS THE ONLY ADDITION TO YOUR UPLOAD LOGIC 👇
    // Trigger background generation for this batch.
    // Notice there is no "await" here, so it doesn't block the response!
    if (valid > 0) {
      processBatchCertificatesBackground(batchId).catch((err) => {
        console.error("Background worker failed:", err);
      });
    }

    return res.status(201).json({
      success: true,
      message:
        "CSV uploaded successfully. Certificates are generating in the background.",
      data: {
        batchId,
        fileName: uploadFileName,
        stats: { total: rows.length, valid, invalid },
        preview,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  uploadBatch,
  // ... export any other controllers you have here ...
};

// ✅ GET /api/batches (Upload History)
async function listBatches(req, res, next) {
  try {
    const [rows] = await db.execute(
      `SELECT id, original_file_name, total_records, valid_records, invalid_records, status, created_at
       FROM certificate_batches
       ORDER BY id DESC
       LIMIT 200`,
    );

    return res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

// ✅ GET /api/batches/:id (Batch summary)
async function getBatch(req, res, next) {
  try {
    const id = Number(req.params.id);
    const [rows] = await db.execute(
      `SELECT id, original_file_name, total_records, valid_records, invalid_records, status, created_at
       FROM certificate_batches
       WHERE id=? LIMIT 1`,
      [id],
    );
    if (rows.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "Batch not found" });

    return res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
}

// ✅ GET /api/batches/:id/candidates
async function listCandidates(req, res, next) {
  try {
    const batchId = Number(req.params.id);
    // Force numbers and handle NaN/Defaults
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 50);
    const offset = (page - 1) * limit;

    const status = String(req.query.status || "all").toLowerCase();

    let where = "WHERE batch_id = ?";
    let params = [batchId];

    if (status === "valid" || status === "invalid") {
      where += " AND validation_status = ?";
      params.push(status);
    }

    const [[countRow]] = await db.execute(
      `SELECT COUNT(*) as total FROM candidates ${where}`,
      params,
    );

    // Explicitly add limit and offset as numbers at the end of the array
    const query = `
      SELECT row_no, name, email, grade, course, validation_status, validation_error
      FROM candidates
      ${where}
      ORDER BY row_no ASC
      LIMIT ? OFFSET ?`;

    const [rows] = await db.execute(query, [...params, limit, offset]);

    return res.json({
      success: true,
      data: rows.map((r) => ({
        row: r.row_no, // Fixed: r.row_number was used in your code, but DB column is row_no
        name: r.name || "",
        email: r.email || "",
        grade: r.grade || "",
        course: r.course || "",
        status:
          r.validation_status === "valid"
            ? "Valid"
            : r.validation_error || "Invalid",
      })),
      pagination: {
        page,
        limit,
        total: countRow.total,
        totalPages: Math.ceil(countRow.total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
}

// ✅ GET /api/batches/candidates (All candidates across batches)
async function listCandidates(req, res, next) {
  try {
    const batchId = parseInt(req.params.id, 10);
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;

    if (isNaN(batchId)) {
      return res.status(400).json({ success: false, message: "Invalid batch id" });
    }

    const offset = (page - 1) * limit;

    const sql = `
      SELECT row_no, name, email, grade, course, validation_status, validation_error
      FROM candidates
      WHERE batch_id = ?
      ORDER BY row_no ASC
      LIMIT ${limit} OFFSET ${offset}
    `;

    // ✅ IMPORTANT: Only pass batchId now
    const [rows] = await db.execute(sql, [batchId]);

    return res.json({
      success: true,
      data: rows,
    });

  } catch (err) {
    console.error("listCandidates error:", err);
    next(err);
  }
}

// ✅ GET /api/batches/candidates (All candidates across batches)
async function listAllCandidates(req, res, next) {
  try {
    const status = String(req.query.status || "all").toLowerCase();

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 50);
    const offset = (page - 1) * limit;

    let whereClause = "";
    let whereParams = [];

    if (status === "valid" || status === "invalid") {
      whereClause = "WHERE c.validation_status = ?"; // Added c. prefix
      whereParams.push(status);
    }

    const [[countRow]] = await db.execute(
      `SELECT COUNT(*) as total FROM candidates c ${whereClause}`, // Added c. alias
      whereParams,
    );

    // 👇 ADDED LEFT JOIN TO GET CERTIFICATE ID 👇
    const query = `
      SELECT 
        c.id as candidate_id,
        c.batch_id,
        c.row_no,
        c.name,
        c.email,
        c.grade,
        c.course,
        c.certificate_date,
        c.validation_status,
        c.validation_error,
        cert.id as certificate_id, 
        cert.certificate_no
      FROM candidates c
      LEFT JOIN certificates cert ON c.id = cert.candidate_id
      ${whereClause}
      ORDER BY c.id DESC
      LIMIT ? OFFSET ?
    `;

    const params = [...whereParams, limit, offset];
    const [rows] = await db.query(query, params);

    return res.json({
      success: true,
      data: rows.map((r) => ({
        id: r.candidate_id,
        batchId: r.batch_id,
        row: r.row_no,
        name: r.name,
        email: r.email,
        grade: r.grade,
        course: r.course,
        certificateDate: r.certificate_date,
        status: r.validation_status === "valid" ? "Valid" : "Invalid",

        // 👇 NEW FIELDS RETURNED TO FRONTEND 👇
        certificateId: r.certificate_id || null,
        certificateNo: r.certificate_no || null,
      })),
      pagination: {
        page,
        limit,
        total: countRow.total,
        totalPages: Math.ceil(countRow.total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getSingleCandidate(req, res, next) {
  try {
    const candidateId = Number(req.params.candidateId);

    const [rows] = await db.execute(
      `SELECT id, batch_id, row_no, name, email, grade, course,
              certificate_date, validation_status, validation_error, created_at
       FROM candidates
       WHERE id=? LIMIT 1`,
      [candidateId],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    next(err);
  }
}
// ✅ GET /api/certificates/:certificateId/download
async function downloadCertificatePdf(req, res, next) {
  try {
    const certificateId = Number(req.params.certificateId);

    const [rows] = await db.execute(
      `SELECT certificate_no, pdf_path FROM certificates WHERE id=? LIMIT 1`,
      [certificateId],
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Certificate not found" });
    }

    const { certificate_no, pdf_path } = rows[0];

    // Check if the file actually exists on the disk
    const fs = require("fs");
    if (!fs.existsSync(pdf_path)) {
      return res
        .status(404)
        .json({ success: false, message: "PDF missing on server" });
    }

    // Stream the file to the frontend
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${certificate_no}.pdf"`,
    );

    return fs.createReadStream(pdf_path).pipe(res);
  } catch (err) {
    next(err);
  }
}

// ✅ GET /api/emails/logs
async function getEmailLogs(req, res, next) {
  try {
    const batchId = req.query.batchId;

    // We use LEFT JOINs starting from 'candidates' so we can see 'Pending' status
    // for candidates who haven't had an email sent yet.
    let query = `
      SELECT 
        c.email AS recipient,
        c.name,
        cert.certificate_no AS cert_id,
        el.status AS log_status,
        el.created_at AS sent_at,
        el.error_message
      FROM candidates c
      LEFT JOIN certificates cert ON c.id = cert.candidate_id
      LEFT JOIN email_logs el ON c.id = el.candidate_id
      WHERE c.validation_status = 'valid'
    `;

    const params = [];

    // Optional: filter by batch if an admin is viewing a specific upload
    if (batchId) {
      query += ` AND c.batch_id = ?`;
      params.push(Number(batchId));
    }

    query += ` ORDER BY c.id DESC`;

    const [rows] = await db.query(query, params);

    // Map database rows to the exact format your frontend expects
    const mappedData = rows.map((r) => {
      let currentStatus = "Pending";
      if (r.log_status === "sent") currentStatus = "Sent";
      if (r.log_status === "failed") currentStatus = "Failed";

      return {
        recipient: r.recipient || "—",
        name: r.name || "—",
        id: r.cert_id || "Pending Generation",
        status: currentStatus,
        sentAt: r.sent_at,
        errorMessage: r.error_message,
      };
    });

    return res.json({ success: true, data: mappedData });
  } catch (err) {
    next(err);
  }
}
module.exports = {
  uploadBatch,
  listBatches,
  getBatch,
  listCandidates,
  getSingleCandidate,
  listAllCandidates,
  getEmailLogs,
  downloadCertificatePdf,
};
