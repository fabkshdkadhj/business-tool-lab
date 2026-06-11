import test from "node:test";
import assert from "node:assert/strict";

import {
  parseBusinessRows,
  summarizeDailyBusiness,
  formatCurrency,
} from "../src/digest.mjs";

const sampleCsv = `date,type,category,customer,amount,status,note
2026-06-12,income,retail,Walk-in,268,paid,morning orders
2026-06-12,income,retail,Walk-in,156,paid,afternoon orders
2026-06-12,income,service,Acme Shop,480,unpaid,invoice pending
2026-06-12,expense,supplies,Paper Vendor,92,paid,receipt paper
2026-06-12,expense,delivery,Local Courier,38,paid,same-day delivery
2026-06-12,income,retail,Walk-in,-20,refunded,customer refund`;

test("parseBusinessRows turns pasted CSV text into normalized business rows", () => {
  const rows = parseBusinessRows(sampleCsv);

  assert.equal(rows.length, 6);
  assert.deepEqual(rows[0], {
    date: "2026-06-12",
    type: "income",
    category: "retail",
    customer: "Walk-in",
    amount: 268,
    status: "paid",
    note: "morning orders",
  });
});

test("summarizeDailyBusiness produces manager-facing totals and action items", () => {
  const rows = parseBusinessRows(sampleCsv);
  const summary = summarizeDailyBusiness(rows);

  assert.equal(summary.totalIncome, 904);
  assert.equal(summary.totalExpense, 130);
  assert.equal(summary.netAmount, 774);
  assert.equal(summary.unpaidTotal, 480);
  assert.equal(summary.refundTotal, 20);
  assert.deepEqual(summary.topIncomeCategory, {
    category: "retail",
    amount: 404,
  });
  assert.deepEqual(summary.actionItems, [
    "Collect 480.00 from unpaid income records.",
    "Review 20.00 in refunds or negative income records.",
  ]);
});

test("formatCurrency keeps plain business numbers readable", () => {
  assert.equal(formatCurrency(774), "774.00");
  assert.equal(formatCurrency(12.5), "12.50");
});
