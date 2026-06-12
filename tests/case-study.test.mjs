import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  parseBusinessRows,
  summarizeDailyBusiness,
} from "../src/digest.mjs";

test("case study example data produces the published daily digest outcome", async () => {
  const messyLedger = await readFile(
    new URL("../examples/small-retail-messy-ledger.csv", import.meta.url),
    "utf8",
  );

  const rows = parseBusinessRows(messyLedger);
  const summary = summarizeDailyBusiness(rows);

  assert.equal(rows.length, 8);
  assert.equal(summary.totalIncome, 1480);
  assert.equal(summary.totalExpense, 317.5);
  assert.equal(summary.netAmount, 1162.5);
  assert.equal(summary.unpaidTotal, 380);
  assert.equal(summary.refundTotal, 45);
  assert.deepEqual(summary.topIncomeCategory, {
    category: "counter-sales",
    amount: 785,
  });
});

test("case study markdown explains the before and after workflow", async () => {
  const caseStudy = await readFile(
    new URL("../examples/case-study-small-retail.md", import.meta.url),
    "utf8",
  );

  assert.match(caseStudy, /Before/);
  assert.match(caseStudy, /After/);
  assert.match(caseStudy, /small-retail-messy-ledger.csv/);
  assert.match(caseStudy, /daily-digest-output.md/);
  assert.match(caseStudy, /RMB 99\+/);
});

test("landing page and README link to the small retail case study", async () => {
  const [html, readme] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../README.md", import.meta.url), "utf8"),
  ]);

  assert.match(html, /Small Retail Case Study/);
  assert.match(html, /examples\/case-study-small-retail.md/);
  assert.match(readme, /Case Study/);
  assert.match(readme, /examples\/case-study-small-retail.md/);
});
