export function parseSettlementRows(text) {
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
      orderId: record.order_id,
      platform: (record.platform || "unknown").toLowerCase(),
      grossSales: parseMoney(record.gross_sales),
      expectedSettlement: parseMoney(record.expected_settlement),
      receivedSettlement: parseMoney(record.received_settlement),
      refundAmount: parseMoney(record.refund_amount),
      platformFee: parseMoney(record.platform_fee),
      status: (record.status || "unknown").toLowerCase(),
      note: record.note || "",
    };
  });
}

export function summarizeSettlementReconciliation(rows) {
  const anomalies = rows.flatMap((row) => buildSettlementAnomaly(row));
  const platformSummaries = buildPlatformSummaries(rows);

  return {
    totalGrossSales: sumBy(rows, "grossSales"),
    totalPlatformFees: sumBy(rows, "platformFee"),
    totalRefunds: sumBy(rows, "refundAmount"),
    totalExpectedSettlement: sumBy(rows, "expectedSettlement"),
    totalReceivedSettlement: sumBy(rows, "receivedSettlement"),
    settlementVariance: roundMoney(
      sumBy(rows, "receivedSettlement") - sumBy(rows, "expectedSettlement"),
    ),
    platformSummaries,
    highestRiskPlatform: findHighestRiskPlatform(platformSummaries),
    anomalies,
    actionItems: buildActionItems(anomalies),
  };
}

function buildSettlementAnomaly(row) {
  if (row.status === "refunded" || row.expectedSettlement <= 0) {
    return [];
  }

  const variance = roundMoney(row.receivedSettlement - row.expectedSettlement);

  if (Math.abs(variance) < 0.01) {
    return [];
  }

  if (row.receivedSettlement === 0) {
    return [
      {
        orderId: row.orderId,
        platform: row.platform,
        type: "missing-settlement",
        amount: row.expectedSettlement,
        message: `${row.orderId} has no settlement received; expected ${formatMoney(row.expectedSettlement)}.`,
      },
    ];
  }

  if (variance < 0) {
    return [
      {
        orderId: row.orderId,
        platform: row.platform,
        type: "short-settlement",
        amount: Math.abs(variance),
        message: `${row.orderId} settlement is short by ${formatMoney(Math.abs(variance))}.`,
      },
    ];
  }

  return [
    {
      orderId: row.orderId,
      platform: row.platform,
      type: "over-settlement",
      amount: variance,
      message: `${row.orderId} settlement is over by ${formatMoney(variance)}.`,
    },
  ];
}

function buildPlatformSummaries(rows) {
  const platforms = new Map();

  for (const row of rows) {
    const current = platforms.get(row.platform) || {
      platform: row.platform,
      grossSales: 0,
      expectedSettlement: 0,
      receivedSettlement: 0,
      variance: 0,
      refundAmount: 0,
    };

    current.grossSales = roundMoney(current.grossSales + row.grossSales);
    current.expectedSettlement = roundMoney(
      current.expectedSettlement + row.expectedSettlement,
    );
    current.receivedSettlement = roundMoney(
      current.receivedSettlement + row.receivedSettlement,
    );
    current.refundAmount = roundMoney(current.refundAmount + row.refundAmount);
    current.variance = roundMoney(current.receivedSettlement - current.expectedSettlement);

    platforms.set(row.platform, current);
  }

  return Array.from(platforms.values());
}

function findHighestRiskPlatform(platformSummaries) {
  let highest = null;

  for (const summary of platformSummaries) {
    const riskAmount = Math.abs(Math.min(summary.variance, 0));
    if (!highest || riskAmount > highest.amount) {
      highest = {
        platform: summary.platform,
        amount: riskAmount,
      };
    }
  }

  return highest;
}

function buildActionItems(anomalies) {
  if (anomalies.length === 0) {
    return ["No settlement gaps found in the provided sample."];
  }

  return anomalies.map((anomaly) => {
    if (anomaly.type === "missing-settlement") {
      return `Follow up ${formatMoney(anomaly.amount)} missing settlement from ${anomaly.platform} order ${anomaly.orderId}.`;
    }

    if (anomaly.type === "short-settlement") {
      return `Check ${formatMoney(anomaly.amount)} short settlement from ${anomaly.platform} order ${anomaly.orderId}.`;
    }

    return `Review ${formatMoney(anomaly.amount)} over settlement from ${anomaly.platform} order ${anomaly.orderId}.`;
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

function sumBy(rows, key) {
  return roundMoney(rows.reduce((total, row) => total + (row[key] || 0), 0));
}

function formatMoney(value) {
  return Number(value || 0).toFixed(2);
}

function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
