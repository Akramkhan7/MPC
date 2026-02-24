const { db } = require("../config/db");
const { jsonToCsv } = require("../utils/exportCsvUtils");

// ✅ GET /api/error-logs?batchId=1&type=Invalid Email
async function listErrorLogs(req, res, next) {
  try {
    const batchId = req.query.batchId ? Number(req.query.batchId) : null;
    const type = req.query.type ? String(req.query.type) : null;

    let sql = `
      SELECT id, batch_id, row_no, name, email, error_type, reason, uploaded_file, created_at
      FROM error_logs
      WHERE 1=1
    `;
    const params = [];

    if (batchId) {
      sql += " AND batch_id = ?";
      params.push(batchId);
    }

    if (type && type !== "All") {
      sql += " AND error_type = ?";
      params.push(type);
    }

    sql += " ORDER BY id DESC LIMIT 500";

    const [rows] = await db.execute(sql, params);

    return res.json({
      success: true,
      data: rows.map((r) => ({
        id: r.id,
        record: `Row ${r.row_number}`,
        name: r.name || "",
        email: r.email || "",
        errorType: r.error_type,
        reason: r.reason,
        date: r.created_at,
        uploadedFile: r.uploaded_file,
        batchId: r.batch_id,
      })),
    });
  } catch (err) {
    next(err);
  }
}

// ✅ GET /api/error-logs/export?batchId=1&type=Invalid Email
async function exportErrorLogs(req, res, next) {
  try {
    const batchId = req.query.batchId ? Number(req.query.batchId) : null;
    const type = req.query.type ? String(req.query.type) : null;

    let sql = `
      SELECT row_no, name, email, error_type, reason, created_at, uploaded_file
      FROM error_logs
      WHERE 1=1
    `;
    const params = [];

    if (batchId) {
      sql += " AND batch_id = ?";
      params.push(batchId);
    }

    if (type && type !== "All") {
      sql += " AND error_type = ?";
      params.push(type);
    }

    sql += " ORDER BY id DESC LIMIT 5000";

    const [rows] = await db.execute(sql, params);

    const dataRows = rows.map((r) => ({
      record: `Row ${r.row_number}`,
      name: r.name || "",
      email: r.email || "",
      errorType: r.error_type,
      reason: r.reason,
      date: r.created_at,
      uploadedFile: r.uploaded_file,
    }));

    const csv = jsonToCsv(
      ["record", "name", "email", "errorType", "reason", "date", "uploadedFile"],
      dataRows
    );

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="error_logs.csv"`);

    return res.status(200).send(csv);
  } catch (err) {
    next(err);
  }
}

module.exports = { listErrorLogs, exportErrorLogs };