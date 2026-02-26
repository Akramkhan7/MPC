const { db } = require("../config/db");
const { jsonToCsv } = require("../utils/exportCsvUtils");


// ===============================
// 1️⃣ LIST ERROR LOGS
// ===============================
async function listErrorLogs(req, res, next) {
  try {
    const batchId = req.query.batchId;
    const type = req.query.type;

    let sql = `
      SELECT id, batch_id, row_no, name, email, error_type, reason, uploaded_file, created_at
      FROM error_logs
      WHERE 1=1
    `;

    const params = [];

    // Filter by batch
    if (batchId) {
      sql += " AND batch_id = ?";
      params.push(batchId);
    }

    // Filter by error type
    if (type && type !== "All") {
      sql += " AND error_type = ?";
      params.push(type);
    }

    sql += " ORDER BY id DESC";

    const [rows] = await db.execute(sql, params);

    res.json({
      success: true,
      data: rows
    });

  } catch (err) {
    next(err);
  }
}


// ===============================
// 2️⃣ EXPORT ERROR LOGS AS CSV
// ===============================
async function exportErrorLogs(req, res, next) {
  try {
    const batchId = req.query.batchId;
    const type = req.query.type;

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

    sql += " ORDER BY id DESC";

    const [rows] = await db.execute(sql, params);

    // Convert to CSV
    const csv = jsonToCsv(
      ["row_no", "name", "email", "error_type", "reason", "created_at", "uploaded_file"],
      rows
    );

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=error_logs.csv");

    res.status(200).send(csv);

  } catch (err) {
    next(err);
  }
}

module.exports = {
  listErrorLogs,
  exportErrorLogs
};