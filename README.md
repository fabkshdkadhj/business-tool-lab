# Daily Business Digest

Turn a simple CSV export into a short manager-facing daily report.

This is the first public demo in `business-tool-lab`. It is intentionally small: the goal is to show a clear workflow result, not to claim a giant business platform.

## What It Does

- Parses pasted CSV rows
- Calculates income, expenses, net amount, unpaid income, and refunds
- Finds the top income category
- Generates action items a manager can review quickly

## Expected CSV Columns

```csv
date,type,category,customer,amount,status,note
2026-06-12,income,retail,Walk-in,268,paid,morning orders
```

Supported `type` values:

- `income`
- `expense`
- `refund`

Any negative income is treated as a refund review item.

## Local Verification

```powershell
node --test tests/*.test.mjs
```

## Why This Exists

Many small teams do not need a large system first. They need a clean daily summary:

- What came in?
- What went out?
- What is unpaid?
- What needs attention tomorrow?

This demo is a small proof of that workflow.

## Case Study

See the first public before-and-after sample:

- [Small Retail Case Study](examples/case-study-small-retail.md)
- [Messy sample ledger](examples/small-retail-messy-ledger.csv)
- [Daily digest output](examples/daily-digest-output.md)

The case maps a small shop ledger into a manager summary with income, expenses, unpaid invoices,
refund review, and the top paid income category.

## Service Offer

This repository can also be used as a lightweight service sample for small business reporting work.

Starter options:

- **Starter Cleanup**: clean one messy table and return a readable summary, issue list, and corrected file structure.
- **Workflow Prototype**: build a small browser-based tool for one recurring report, checklist, or data cleanup step.
- **Monthly Digest Setup**: set up a repeatable monthly report format with sample data, rules, and handoff notes.

To request a sample adaptation, open a public GitHub issue using the business report request form:

https://github.com/fabkshdkadhj/business-tool-lab/issues/new?template=business-report-request.yml

Do not paste private customer data, account numbers, medical information, passwords, or internal company secrets into a public issue.
