import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("landing page presents a service funnel around the digest demo", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

  assert.match(html, /Starter Cleanup/);
  assert.match(html, /Workflow Prototype/);
  assert.match(html, /Monthly Digest Setup/);
  assert.match(html, /Open a request/);
  assert.match(html, /issues\/new\?template=business-report-request.yml/);
});

test("repository includes a structured public request issue template", async () => {
  const template = await readFile(
    new URL("../.github/ISSUE_TEMPLATE/business-report-request.yml", import.meta.url),
    "utf8",
  );

  assert.match(template, /name: Business report request/);
  assert.match(template, /Data source/);
  assert.match(template, /Desired output/);
  assert.match(template, /Do not paste private customer data/);
});

test("README explains the offer, not just the code demo", async () => {
  const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");

  assert.match(readme, /Service Offer/);
  assert.match(readme, /Starter Cleanup/);
  assert.match(readme, /Workflow Prototype/);
  assert.match(readme, /public GitHub issue/);
});
