import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  parseFollowUpRows,
  summarizeFollowUpAging,
} from "../src/followup.mjs";

test("follow-up case study ranks overdue invoices by urgency", async () => {
  const followUpCsv = await readFile(
    new URL("../examples/customer-follow-up-aging.csv", import.meta.url),
    "utf8",
  );

  const rows = parseFollowUpRows(followUpCsv);
  const summary = summarizeFollowUpAging(rows, "2026-06-12");

  assert.equal(rows.length, 5);
  assert.equal(summary.totalOpenAmount, 1390);
  assert.equal(summary.overdueAmount, 1150);
  assert.equal(summary.dueSoonAmount, 240);
  assert.equal(summary.criticalAmount, 150);
  assert.deepEqual(summary.oldestOverdueInvoice, {
    customer: "Travel Desk",
    invoiceId: "INV-1004",
    daysOverdue: 35,
    amount: 150,
  });
  assert.deepEqual(
    summary.followUpQueue.map((item) => item.invoiceId),
    ["INV-1004", "INV-1002", "INV-1001"],
  );
  assert.deepEqual(summary.actionItems, [
    "Escalate Travel Desk invoice INV-1004: 150.00 is 35 days overdue.",
    "Follow up Lake Tour Co invoice INV-1002: 620.00 is 18 days overdue.",
    "Follow up Blue Door Cafe invoice INV-1001: 380.00 is 7 days overdue.",
  ]);
});

test("follow-up case study explains the paid workflow shape", async () => {
  const [caseStudy, output] = await Promise.all([
    readFile(new URL("../examples/case-study-customer-follow-up.md", import.meta.url), "utf8"),
    readFile(new URL("../examples/customer-follow-up-output.md", import.meta.url), "utf8"),
  ]);

  assert.match(caseStudy, /Before/);
  assert.match(caseStudy, /After/);
  assert.match(caseStudy, /customer-follow-up-aging.csv/);
  assert.match(caseStudy, /customer-follow-up-output.md/);
  assert.match(caseStudy, /RMB 499\+/);
  assert.match(output, /Overdue amount/);
  assert.match(output, /Follow-up queue/);
});

test("landing page and README link to the customer follow-up case study", async () => {
  const [html, readme] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../README.md", import.meta.url), "utf8"),
  ]);

  assert.match(html, /Customer Follow-Up Aging/);
  assert.match(html, /examples\/case-study-customer-follow-up.md/);
  assert.match(readme, /Customer Follow-Up Aging/);
  assert.match(readme, /examples\/case-study-customer-follow-up.md/);
});
