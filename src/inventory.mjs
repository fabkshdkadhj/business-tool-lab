export function parseInventoryRows(text) {
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

    const onHand = parseNumber(record.on_hand);
    const unitCost = parseNumber(record.unit_cost);

    return {
      sku: record.sku,
      name: record.name || "Unknown item",
      category: record.category || "uncategorized",
      onHand,
      unitsSold30d: parseNumber(record.units_sold_30d),
      unitCost,
      stockValue: roundMoney(onHand * unitCost),
      reorderPoint: parseNumber(record.reorder_point),
      daysSinceSale: parseNumber(record.days_since_sale),
      supplier: record.supplier || "Unknown supplier",
      note: record.note || "",
    };
  });
}

export function summarizeInventoryHealth(rows) {
  const slowMovingItems = rows.filter(
    (row) => row.unitsSold30d <= 5 && row.onHand > row.reorderPoint,
  );
  const deadStockItems = rows.filter(
    (row) => row.unitsSold30d === 0 || row.daysSinceSale >= 90,
  );
  const reorderRisks = rows.filter((row) => row.onHand < row.reorderPoint);
  const topSlowMovingItem = findTopStockValue(slowMovingItems);

  return {
    totalStockValue: sumStockValue(rows),
    slowMovingValue: sumStockValue(slowMovingItems),
    deadStockValue: sumStockValue(deadStockItems),
    slowMovingItems,
    deadStockItems,
    reorderRisks,
    topSlowMovingItem,
    actionItems: buildActionItems({
      topSlowMovingItem,
      topDeadStockItem: findTopStockValue(deadStockItems),
      reorderRisks,
    }),
  };
}

function buildActionItems({ topSlowMovingItem, topDeadStockItem, reorderRisks }) {
  const items = [];

  if (topSlowMovingItem) {
    items.push(
      `Review ${formatMoney(topSlowMovingItem.value)} tied up in slow-moving ${topSlowMovingItem.name} stock.`,
    );
  }

  if (topDeadStockItem) {
    items.push(
      `Clear or bundle ${formatMoney(topDeadStockItem.value)} in dead-stock ${topDeadStockItem.name} inventory.`,
    );
  }

  const reorderActions = [...reorderRisks]
    .map((row) => ({
      ...row,
      reorderGap: row.reorderPoint - row.onHand,
    }))
    .sort((left, right) => right.reorderGap - left.reorderGap);

  for (const row of reorderActions) {
    items.push(
      `Reorder at least ${row.reorderGap} ${row.name} units to reach the reorder point.`,
    );
  }

  if (items.length === 0) {
    items.push("No slow-moving stock, dead stock, or reorder risks found.");
  }

  return items;
}

function findTopStockValue(rows) {
  let best = null;

  for (const row of rows) {
    if (!best || row.stockValue > best.value) {
      best = {
        sku: row.sku,
        name: row.name,
        value: row.stockValue,
      };
    }
  }

  return best;
}

function sumStockValue(rows) {
  return roundMoney(rows.reduce((total, row) => total + row.stockValue, 0));
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

function parseNumber(value) {
  return Number.parseFloat(value || "0");
}

function formatMoney(value) {
  return Number(value || 0).toFixed(2);
}

function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
