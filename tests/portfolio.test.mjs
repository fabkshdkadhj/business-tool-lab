import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("examples index catalogs the complete public case-study portfolio", async () => {
  const index = await readFile(new URL("../examples/index.md", import.meta.url), "utf8");

  assert.match(index, /Small Retail Case Study/);
  assert.match(index, /Multi-Platform Order Reconciliation/);
  assert.match(index, /Inventory Health Check/);
  assert.match(index, /Customer Follow-Up Aging/);
  assert.match(index, /Starter Cleanup/);
  assert.match(index, /Workflow Prototype/);
  assert.match(index, /Monthly Digest Setup/);
});

test("service guide explains scope, packages, and privacy boundaries", async () => {
  const service = await readFile(new URL("../SERVICE.md", import.meta.url), "utf8");

  assert.match(service, /Service Scope/);
  assert.match(service, /Starter Cleanup/);
  assert.match(service, /Workflow Prototype/);
  assert.match(service, /Monthly Digest Setup/);
  assert.match(service, /What I Need From You/);
  assert.match(service, /Do not send private customer data/);
});

test("public request form supports the complete portfolio categories", async () => {
  const template = await readFile(
    new URL("../.github/ISSUE_TEMPLATE/business-report-request.yml", import.meta.url),
    "utf8",
  );

  assert.match(template, /Daily digest/);
  assert.match(template, /Platform reconciliation/);
  assert.match(template, /Inventory health check/);
  assert.match(template, /Customer follow-up aging/);
});

test("landing page links to the examples index and service guide", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

  assert.match(html, /View all examples/);
  assert.match(html, /examples\/index.md/);
  assert.match(html, /Service guide/);
  assert.match(html, /SERVICE.md/);
});
