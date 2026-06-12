# Business Tool Lab

Turn simple CSV exports into short manager-facing reports, exception lists, and workflow samples.

This repository is intentionally small: the goal is to show clear workflow results, not to claim a
giant business platform.

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

## Case Studies

See the public before-and-after samples:

- [Small Retail Case Study](examples/case-study-small-retail.md): a shop ledger becomes a daily manager summary.
- [Multi-Platform Order Reconciliation](examples/case-study-marketplace-reconciliation.md): platform settlement rows become an exception list.
- [Inventory Health Check](examples/case-study-inventory-health.md): stock rows become a slow-stock, dead-stock, and reorder-risk report.
- [Customer Follow-Up Aging](examples/case-study-customer-follow-up.md): unpaid invoices become an aging summary and follow-up queue.

Sample inputs and outputs:

- [Small retail ledger](examples/small-retail-messy-ledger.csv)
- [Daily digest output](examples/daily-digest-output.md)
- [Multi-platform order reconciliation CSV](examples/multi-platform-order-reconciliation.csv)
- [Order reconciliation output](examples/order-reconciliation-output.md)
- [Inventory health CSV](examples/inventory-health-check.csv)
- [Inventory health output](examples/inventory-health-output.md)
- [Customer follow-up CSV](examples/customer-follow-up-aging.csv)
- [Customer follow-up output](examples/customer-follow-up-output.md)
- [Full examples index](examples/index.md)

## Service Offer

This repository can also be used as a lightweight service sample for small business reporting work.

Starter options:

- **Starter Cleanup**: clean one messy table and return a readable summary, issue list, and corrected file structure.
- **Workflow Prototype**: build a small browser-based tool for one recurring report, checklist, or data cleanup step.
- **Monthly Digest Setup**: set up a repeatable monthly report format with sample data, rules, and handoff notes.

See [SERVICE.md](SERVICE.md) for the service scope, privacy boundary, and request checklist.

To request a sample adaptation, open a public GitHub issue using the business report request form:

https://github.com/fabkshdkadhj/business-tool-lab/issues/new?template=business-report-request.yml

Do not paste private customer data, account numbers, medical information, passwords, or internal company secrets into a public issue.
