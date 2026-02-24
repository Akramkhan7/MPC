const { db } = require("../config/db");
const {
  parseCsvFile,
  normalizeCell,
  isValidEmail,
  isValidDateYYYYMMDD,
  resolveHeaderKey,
} = require("../utils/csvUtils");

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

    return res.status(201).json({
      success: true,
      message: "CSV uploaded successfully",
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

// ✅ GET /api/batches/:id/candidates?page=1&limit=50&status=valid|invalid|all
async function listCandidates(req, res, next) {
  try {
    const batchId = Number(req.params.id);
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(200, Math.max(1, Number(req.query.limit || 50)));
    const status = String(req.query.status || "all").toLowerCase();

    let where = "WHERE batch_id=?";
    const params = [batchId];

    if (status === "valid" || status === "invalid") {
      where += " AND validation_status=?";
      params.push(status);
    }

    const offset = (page - 1) * limit;

    const [[countRow]] = await db.execute(
      `SELECT COUNT(*) as total FROM candidates ${where}`,
      params,
    );

    const [rows] = await db.execute(
      `SELECT row_no, name, email, grade, course, validation_status, validation_error
       FROM candidates
       ${where}
       ORDER BY row_no ASC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset],
    );

    return res.json({
      success: true,
      data: rows.map((r) => ({
        row: r.row_number,
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

async function getSingleCandidate(req, res, next) {
  try {
    const candidateId = Number(req.params.candidateId);

    const [rows] = await db.execute(
      `SELECT id, batch_id, row_no, name, email, grade, course,
              certificate_date, validation_status, validation_error, created_at
       FROM candidates
       WHERE id=? LIMIT 1`,
      [candidateId]
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
module.exports = { uploadBatch, listBatches, getBatch, listCandidates,getSingleCandidate };
