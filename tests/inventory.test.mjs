import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  parseInventoryRows,
  summarizeInventoryHealth,
} from "../src/inventory.mjs";

test("inventory case study finds slow stock, dead stock, and reorder risks", async () => {
  const inventoryCsv = await readFile(
    new URL("../examples/inventory-health-check.csv", import.meta.url),
    "utf8",
  );

  const rows = parseInventoryRows(inventoryCsv);
  const summary = summarizeInventoryHealth(rows);

  assert.equal(rows.length, 6);
  assert.equal(summary.totalStockValue, 1571);
  assert.equal(summary.slowMovingValue, 1295);
  assert.equal(summary.deadStockValue, 551);
  assert.deepEqual(summary.topSlowMovingItem, {
    sku: "ALT-HAT-01",
    name: "Wool Hat",
    value: 648,
  });
  assert.deepEqual(
    summary.reorderRisks.map((item) => item.sku),
    ["ALT-GLOVE-02", "ALT-SNACK-05"],
  );
  assert.deepEqual(summary.actionItems, [
    "Review 648.00 tied up in slow-moving Wool Hat stock.",
    "Clear or bundle 551.00 in dead-stock Tourist Mug inventory.",
    "Reorder at least 12 Trail Snack units to reach the reorder point.",
    "Reorder at least 4 Thermal Gloves units to reach the reorder point.",
  ]);
});

test("inventory case study explains the paid workflow shape", async () => {
  const [caseStudy, output] = await Promise.all([
    readFile(new URL("../examples/case-study-inventory-health.md", import.meta.url), "utf8"),
    readFile(new URL("../examples/inventory-health-output.md", import.meta.url), "utf8"),
  ]);

  assert.match(caseStudy, /Before/);
  assert.match(caseStudy, /After/);
  assert.match(caseStudy, /inventory-health-check.csv/);
  assert.match(caseStudy, /inventory-health-output.md/);
  assert.match(caseStudy, /RMB 299\+/);
  assert.match(output, /Slow-moving stock/);
  assert.match(output, /Reorder risks/);
});

test("landing page and README link to the inventory case study", async () => {
  const [html, readme] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../README.md", import.meta.url), "utf8"),
  ]);

  assert.match(html, /Inventory Health Check/);
  assert.match(html, /examples\/case-study-inventory-health.md/);
  assert.match(readme, /Inventory Health Check/);
  assert.match(readme, /examples\/case-study-inventory-health.md/);
});
