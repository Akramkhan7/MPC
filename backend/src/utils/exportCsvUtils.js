function toCsvValue(v) {
  const s = String(v ?? "");
  // escape quotes
  const escaped = s.replace(/"/g, '""');
  // wrap if needed
  if (/[",\n]/.test(escaped)) return `"${escaped}"`;
  return escaped;
}

function jsonToCsv(headers, rows) {
  const head = headers.map(toCsvValue).join(",") + "\n";
  const body = rows
    .map((r) => headers.map((h) => toCsvValue(r[h])).join(","))
    .join("\n");
  return head + body;
}

module.exports = { jsonToCsv };