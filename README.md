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
