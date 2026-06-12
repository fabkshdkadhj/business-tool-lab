import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  parseSettlementRows,
  summarizeSettlementReconciliation,
} from "../src/reconcile.mjs";

test("marketplace reconciliation example finds missing and short settlements", async () => {
  const marketplaceCsv = await readFile(
    new URL("../examples/multi-platform-order-reconciliation.csv", import.meta.url),
    "utf8",
  );

  const rows = parseSettlementRows(marketplaceCsv);
  const summary = summarizeSettlementReconciliation(rows);

  assert.equal(rows.length, 6);
  assert.equal(summary.totalGrossSales, 1460);
  assert.equal(summary.totalPlatformFees, 94);
  assert.equal(summary.totalRefunds, 88);
  assert.equal(summary.totalExpectedSettlement, 1278);
  assert.equal(summary.totalReceivedSettlement, 1122);
  assert.equal(summary.settlementVariance, -156);
  assert.deepEqual(summary.highestRiskPlatform, {
    platform: "douyin",
    amount: 143,
  });
  assert.deepEqual(summary.anomalies, [
    {
      orderId: "DYT-1002",
      platform: "douyin",
      type: "missing-settlement",
      amount: 143,
      message: "DYT-1002 has no settlement received; expected 143.00.",
    },
    {
      orderId: "MT-2088",
      platform: "meituan",
      type: "short-settlement",
      amount: 13,
      message: "MT-2088 settlement is short by 13.00.",
    },
  ]);
  assert.deepEqual(summary.actionItems, [
    "Follow up 143.00 missing settlement from douyin order DYT-1002.",
    "Check 13.00 short settlement from meituan order MT-2088.",
  ]);
});

test("marketplace reconciliation case study explains the paid workflow shape", async () => {
  const [caseStudy, output] = await Promise.all([
    readFile(
      new URL("../examples/case-study-marketplace-reconciliation.md", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../examples/order-reconciliation-output.md", import.meta.url), "utf8"),
  ]);

  assert.match(caseStudy, /Before/);
  assert.match(caseStudy, /After/);
  assert.match(caseStudy, /multi-platform-order-reconciliation.csv/);
  assert.match(caseStudy, /order-reconciliation-output.md/);
  assert.match(caseStudy, /RMB 299\+/);
  assert.match(output, /Missing settlement/);
  assert.match(output, /Short settlement/);
});

test("landing page and README link to the marketplace reconciliation case study", async () => {
  const [html, readme] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../README.md", import.meta.url), "utf8"),
  ]);

  assert.match(html, /Multi-Platform Order Reconciliation/);
  assert.match(html, /examples\/case-study-marketplace-reconciliation.md/);
  assert.match(readme, /Multi-Platform Order Reconciliation/);
  assert.match(readme, /examples\/case-study-marketplace-reconciliation.md/);
});
