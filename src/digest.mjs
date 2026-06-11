export function parseBusinessRows(text) {
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
      date: record.date,
      type: normalizeType(record.type),
      category: record.category || "uncategorized",
      customer: record.customer || "Unknown",
      amount: Number.parseFloat(record.amount || "0"),
      status: (record.status || "unknown").toLowerCase(),
      note: record.note || "",
    };
  });
}

export function summarizeDailyBusiness(rows) {
  const incomeRows = rows.filter((row) => row.type === "income");
  const expenseRows = rows.filter((row) => row.type === "expense");
  const refundRows = rows.filter((row) => row.type === "refund" || row.amount < 0);
  const unpaidIncomeRows = incomeRows.filter((row) => row.status === "unpaid");

  const totalIncome = sumAmounts(incomeRows.filter((row) => row.amount > 0));
  const totalExpense = sumAmounts(expenseRows);
  const refundTotal = Math.abs(sumAmounts(refundRows));
  const unpaidTotal = sumAmounts(unpaidIncomeRows.filter((row) => row.amount > 0));

  const incomeByCategory = groupAmountsByCategory(
    incomeRows.filter((row) => row.status !== "unpaid"),
  );
  const topIncomeCategory = findTopCategory(incomeByCategory);

  return {
    totalIncome,
    totalExpense,
    netAmount: totalIncome - totalExpense,
    unpaidTotal,
    refundTotal,
    topIncomeCategory,
    actionItems: buildActionItems({ unpaidTotal, refundTotal }),
  };
}

export function formatCurrency(value) {
  return Number(value || 0).toFixed(2);
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

function normalizeType(value) {
  const normalized = (value || "").toLowerCase();
  if (normalized === "expense" || normalized === "cost") {
    return "expense";
  }
  if (normalized === "refund" || normalized === "refunded") {
    return "refund";
  }
  return "income";
}

function sumAmounts(rows) {
  return roundMoney(rows.reduce((total, row) => total + (row.amount || 0), 0));
}

function groupAmountsByCategory(rows) {
  return rows.reduce((groups, row) => {
    const currentAmount = groups.get(row.category) || 0;
    groups.set(row.category, roundMoney(currentAmount + row.amount));
    return groups;
  }, new Map());
}

function findTopCategory(categoryMap) {
  let best = null;
  for (const [category, amount] of categoryMap.entries()) {
    if (!best || amount > best.amount) {
      best = { category, amount };
    }
  }
  return best;
}

function buildActionItems({ unpaidTotal, refundTotal }) {
  const items = [];

  if (unpaidTotal > 0) {
    items.push(`Collect ${formatCurrency(unpaidTotal)} from unpaid income records.`);
  }

  if (refundTotal > 0) {
    items.push(`Review ${formatCurrency(refundTotal)} in refunds or negative income records.`);
  }

  if (items.length === 0) {
    items.push("No urgent collection or refund review items found.");
  }

  return items;
}

function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
