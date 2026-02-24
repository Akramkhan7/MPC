const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const nodemailer = require("nodemailer");
const { db } = require("../config/db");

// store PDFs here: backend/src/certificates/
const CERT_DIR = path.join(process.cwd(), "src", "certificates");
fs.mkdirSync(CERT_DIR, { recursive: true });

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

async function createCertificatePdf({
  name,
  course,
  grade,
  certificateNo,
  dateStr,
  verifyUrl,
  outPath,
}) {
  // QR code for verify URL
  const qrDataUrl = await QRCode.toDataURL(verifyUrl);
  const qrBuffer = Buffer.from(qrDataUrl.split(",")[1], "base64");

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const stream = fs.createWriteStream(outPath);

    doc.pipe(stream);

    // Header
    doc.fontSize(24).text("Certificate of Completion", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Certificate No: ${certificateNo}`, { align: "center" });

    doc.moveDown(2);

    doc.fontSize(14).text("This is to certify that", { align: "center" });
    doc.moveDown(0.7);

    doc.fontSize(26).text(name || "N/A", { align: "center" });
    doc.moveDown(0.8);

    doc.fontSize(14).text("has successfully completed the course", { align: "center" });
    doc.moveDown(0.6);

    doc.fontSize(18).text(course || "N/A", { align: "center" });
    doc.moveDown(1);

    doc.fontSize(14).text(`Grade: ${grade || "N/A"}`, { align: "center" });
    doc.fontSize(12).text(`Date: ${dateStr || "N/A"}`, { align: "center" });

    doc.moveDown(2);

    // QR code block
    doc.fontSize(12).text("Scan QR to verify:", { align: "center" });
    doc.moveDown(0.5);

    // center image
    const x = (doc.page.width - 120) / 2;
    doc.image(qrBuffer, x, doc.y, { width: 120 });

    doc.moveDown(6);
    doc.fontSize(10).text(verifyUrl, { align: "center", underline: true });

    doc.end();

    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}

function createMailer() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

async function sendCertificateEmail({ toEmail, pdfPath, certificateNo, name }) {
  const transporter = createMailer();

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Your Certificate is Ready 🎓",
    html: `
      <p>Hi ${name || ""},</p>
      <p>Congratulations! Your certificate is attached.</p>
      <p><b>Certificate No:</b> ${certificateNo}</p>
      <p>Thanks.</p>
    `,
    attachments: [
      {
        filename: `${certificateNo}.pdf`,
        path: pdfPath,
      },
    ],
  });
}

// ✅ POST /api/batches/:batchId/certificates/generate
async function generateCertificatesForBatch(req, res, next) {
  try {
    const batchId = Number(req.params.batchId);
    if (!batchId) {
      return res.status(400).json({ success: false, message: "Invalid batchId" });
    }

    // fetch valid candidates
    const [cands] = await db.execute(
      `SELECT id, name, email, course, grade, certificate_date
       FROM candidates
       WHERE batch_id=? AND validation_status='valid'`,
      [batchId]
    );

    if (cands.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid candidates found in this batch",
      });
    }

    let created = 0;
    let alreadyExists = 0;
    let emailSent = 0;
    let emailFailed = 0;

    for (const c of cands) {
      const certificateNo = makeCertificateNo(c.id);
      const verifyUrl = `${process.env.APP_URL || "http://localhost:5000"}/api/verify/${certificateNo}`;

      // check existing certificate
      const [exists] = await db.execute(
        `SELECT id, pdf_path, email_sent FROM certificates WHERE candidate_id=? LIMIT 1`,
        [c.id]
      );

      let certificateId;
      let pdfPath;

      if (exists.length > 0) {
        alreadyExists++;
        certificateId = exists[0].id;
        pdfPath = exists[0].pdf_path;
      } else {
        // create new PDF + insert certificate
        const fileName = `${certificateNo}.pdf`;
        pdfPath = path.join(CERT_DIR, fileName);

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
          [c.id, certificateNo, pdfPath]
        );

        certificateId = ins.insertId;
        created++;
      }

      // send email (only if email exists)
      if (c.email) {
        try {
          await sendCertificateEmail({
            toEmail: c.email,
            pdfPath,
            certificateNo,
            name: c.name,
          });

          await db.execute(
            `UPDATE certificates SET email_sent=1, email_sent_at=NOW() WHERE id=?`,
            [certificateId]
          );

          await db.execute(
            `INSERT INTO email_logs (certificate_id, batch_id, candidate_id, email, status)
             VALUES (?, ?, ?, ?, 'sent')`,
            [certificateId, batchId, c.id, c.email]
          );

          emailSent++;
        } catch (e) {
          emailFailed++;

          await db.execute(
            `INSERT INTO email_logs (certificate_id, batch_id, candidate_id, email, status, error_message)
             VALUES (?, ?, ?, ?, 'failed', ?)`,
            [certificateId, batchId, c.id, c.email, String(e.message || "Email failed").slice(0, 255)]
          );
        }
      } else {
        // no email -> treat as failed email log (optional)
        emailFailed++;
        await db.execute(
          `INSERT INTO email_logs (certificate_id, batch_id, candidate_id, email, status, error_message)
           VALUES (?, ?, ?, ?, 'failed', ?)`,
          [certificateId, batchId, c.id, null, "Candidate email missing"]
        );
      }
    }

    return res.json({
      success: true,
      message: "Certificates processed",
      data: {
        batchId,
        totalValid: cands.length,
        created,
        alreadyExists,
        emailSent,
        emailFailed,
      },
    });
  } catch (err) {
    next(err);
  }
}

// ✅ GET /api/batches/:batchId/certificates
async function listCertificatesByBatch(req, res, next) {
  try {
    const batchId = Number(req.params.batchId);
    if (!batchId) {
      return res.status(400).json({ success: false, message: "Invalid batchId" });
    }

    const [rows] = await db.execute(
      `SELECT cert.id as certificate_id, cert.certificate_no, cert.issued_at,
              cert.email_sent, cert.email_sent_at,
              c.id as candidate_id, c.row_no, c.name, c.email, c.course, c.grade
       FROM certificates cert
       JOIN candidates c ON c.id = cert.candidate_id
       WHERE c.batch_id=?
       ORDER BY c.row_no ASC`,
      [batchId]
    );

    return res.json({ success: true, data: rows });
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
      [certificateId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Certificate not found" });
    }

    const { certificate_no, pdf_path } = rows[0];

    if (!fs.existsSync(pdf_path)) {
      return res.status(404).json({
        success: false,
        message: "PDF missing on server",
      });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${certificate_no}.pdf"`
    );

    return fs.createReadStream(pdf_path).pipe(res);
  } catch (err) {
    next(err);
  }
}

// ✅ POST /api/certificates/:certificateId/resend-email
async function resendCertificateEmail(req, res, next) {
  try {
    const certificateId = Number(req.params.certificateId);

    const [rows] = await db.execute(
      `SELECT cert.id, cert.certificate_no, cert.pdf_path,
              c.id as candidate_id, c.batch_id, c.name, c.email
       FROM certificates cert
       JOIN candidates c ON c.id = cert.candidate_id
       WHERE cert.id=? LIMIT 1`,
      [certificateId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Certificate not found" });
    }

    const r = rows[0];

    if (!r.email) {
      return res.status(400).json({ success: false, message: "Candidate email missing" });
    }

    if (!fs.existsSync(r.pdf_path)) {
      return res.status(404).json({ success: false, message: "PDF missing on server" });
    }

    try {
      await sendCertificateEmail({
        toEmail: r.email,
        pdfPath: r.pdf_path,
        certificateNo: r.certificate_no,
        name: r.name,
      });

      await db.execute(
        `UPDATE certificates SET email_sent=1, email_sent_at=NOW() WHERE id=?`,
        [certificateId]
      );

      await db.execute(
        `INSERT INTO email_logs (certificate_id, batch_id, candidate_id, email, status)
         VALUES (?, ?, ?, ?, 'sent')`,
        [certificateId, r.batch_id, r.candidate_id, r.email]
      );

      return res.json({ success: true, message: "Email sent successfully" });
    } catch (e) {
      await db.execute(
        `INSERT INTO email_logs (certificate_id, batch_id, candidate_id, email, status, error_message)
         VALUES (?, ?, ?, ?, 'failed', ?)`,
        [certificateId, r.batch_id, r.candidate_id, r.email, String(e.message || "Email failed").slice(0, 255)]
      );

      return res.status(500).json({ success: false, message: "Email failed", error: e.message });
    }
  } catch (err) {
    next(err);
  }
}

// ✅ Public verify: GET /api/verify/:certificateNo
async function verifyCertificatePublic(req, res, next) {
  try {
    const certificateNo = String(req.params.certificateNo || "").trim();

    const [rows] = await db.execute(
      `SELECT cert.certificate_no, cert.issued_at,
              c.name, c.email, c.course, c.grade, c.certificate_date
       FROM certificates cert
       JOIN candidates c ON c.id = cert.candidate_id
       WHERE cert.certificate_no=? LIMIT 1`,
      [certificateNo]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        verified: false,
        message: "Certificate not found",
      });
    }

    return res.json({
      success: true,
      verified: true,
      data: rows[0],
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  generateCertificatesForBatch,
  listCertificatesByBatch,
  downloadCertificatePdf,
  resendCertificateEmail,
  verifyCertificatePublic,
};