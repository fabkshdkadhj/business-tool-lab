const DAY_MS = 24 * 60 * 60 * 1000;

export function parseFollowUpRows(text) {
  if (!text || !text.trim()) {
    return [];
  }

  const [headerLine, ...dataLines] = text
    .trim()
    .split(/\r?\n/)
    .filter((line) => line.trim());

  const headers = splitCsvLine(headerLine).map((header) => normalizeKey(header));

  return dataLines.map((line) => {
    const values = splitCsvLine(line);
    const record = Object.fromEntries(
      headers.map((header, index) => [header, values[index]?.trim() ?? ""]),
    );

    return {
      customer: record.customer || "Unknown customer",
      invoiceId: record.invoice_id,
      amount: parseMoney(record.amount),
      dueDate: record.due_date,
      lastContactDate: record.last_contact_date,
      status: (record.status || "unknown").toLowerCase(),
      owner: record.owner || "Unassigned",
      note: record.note || "",
    };
  });
}

export function summarizeFollowUpAging(rows, asOfDate) {
  const asOf = parseDate(asOfDate);
  const openRows = rows.filter((row) => row.status !== "paid");
  const enrichedRows = openRows.map((row) => enrichInvoice(row, asOf));
  const overdueRows = enrichedRows.filter((row) => row.daysOverdue > 0);
  const dueSoonRows = enrichedRows.filter((row) => row.daysOverdue <= 0 && row.daysUntilDue <= 7);
  const criticalRows = overdueRows.filter((row) => row.daysOverdue >= 30);
  const followUpQueue = overdueRows
    .filter((row) => row.daysOverdue >= 7)
    .sort((left, right) => right.daysOverdue - left.daysOverdue);

  return {
    totalOpenAmount: sumAmounts(openRows),
    overdueAmount: sumAmounts(overdueRows),
    dueSoonAmount: sumAmounts(dueSoonRows),
    criticalAmount: sumAmounts(criticalRows),
    oldestOverdueInvoice: buildOldestOverdueInvoice(overdueRows),
    followUpQueue,
    actionItems: buildActionItems(followUpQueue),
  };
}

function enrichInvoice(row, asOf) {
  const dueDate = parseDate(row.dueDate);
  const daysUntilDue = diffDays(dueDate, asOf);
  const daysOverdue = Math.max(0, -daysUntilDue);

  return {
    ...row,
    daysUntilDue,
    daysOverdue,
  };
}

function buildOldestOverdueInvoice(rows) {
  let oldest = null;

  for (const row of rows) {
    if (!oldest || row.daysOverdue > oldest.daysOverdue) {
      oldest = {
        customer: row.customer,
        invoiceId: row.invoiceId,
        daysOverdue: row.daysOverdue,
        amount: row.amount,
      };
    }
  }

  return oldest;
}

function buildActionItems(followUpQueue) {
  if (followUpQueue.length === 0) {
    return ["No overdue invoices need follow-up in the provided sample."];
  }

  return followUpQueue.map((row) => {
    const verb = row.daysOverdue >= 30 ? "Escalate" : "Follow up";
    return `${verb} ${row.customer} invoice ${row.invoiceId}: ${formatMoney(row.amount)} is ${row.daysOverdue} days overdue.`;
  });
}

function splitCsvLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === "\"" && nextChar === "\"") {
      current += "\"";
      index += 1;
    } else if (char === "\"") {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current);
  return values;
}

function normalizeKey(value) {
  return value.trim().toLowerCase().replace(/\s+/g, "_");
}

function parseMoney(value) {
  return Number.parseFloat(value || "0");
}

function parseDate(value) {
  return new Date(`${value}T00:00:00Z`);
}

function diffDays(leftDate, rightDate) {
  return Math.round((leftDate.getTime() - rightDate.getTime()) / DAY_MS);
}

function sumAmounts(rows) {
  return roundMoney(rows.reduce((total, row) => total + (row.amount || 0), 0));
}

function formatMoney(value) {
  return Number(value || 0).toFixed(2);
}

function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
