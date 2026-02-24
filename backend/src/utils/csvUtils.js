const fs = require("fs");
const { parse } = require("csv-parse");

function normalizeHeader(h) {
  return String(h || "").trim().toLowerCase();
}

function normalizeCell(v) {
  return String(v ?? "").trim();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

function isValidDateYYYYMMDD(dateStr) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(dateStr || "").trim());
}

function parseCsvFile(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    let headers = [];

    fs.createReadStream(filePath)
      .pipe(
        parse({
          columns: (h) => {
            headers = h.map(normalizeHeader);
            return headers;
          },
          trim: true,
          skip_empty_lines: true,
        })
      )
      .on("data", (row) => rows.push(row))
      .on("end", () => resolve({ headers, rows }))
      .on("error", reject);
  });
}

// map aliases → real key present in csv
function resolveHeaderKey(headers, aliases) {
  for (const a of aliases) {
    const key = normalizeHeader(a);
    if (headers.includes(key)) return key;
  }
  return null;
}

module.exports = {
  normalizeHeader,
  normalizeCell,
  isValidEmail,
  isValidDateYYYYMMDD,
  parseCsvFile,
  resolveHeaderKey,
};