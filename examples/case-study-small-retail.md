# Small Retail Case Study

This case study shows the first paid-service shape for `business-tool-lab`: turn one small,
messy daily ledger into a short summary a manager can act on.

## Before

The starting file is a simple export with mixed sales, expenses, unpaid invoices, and a refund:

- [small-retail-messy-ledger.csv](./small-retail-messy-ledger.csv)
- 8 rows from one business day
- Counter sales, delivery sales, wholesale receivable, supplies, courier fees, packaging, and refund review

The issue is not that the data is huge. The issue is that a manager still has to read line by line
to answer basic questions.

## After

The cleaned output is a short daily digest:

- [daily-digest-output.md](./daily-digest-output.md)
- Total income, expenses, and net amount
- Unpaid income separated from paid sales
- Refunds surfaced as a review item
- Top paid income category highlighted

## Service Fit

This maps to the **Starter Cleanup** offer at **RMB 99+** when the request is one messy table and one
readable summary. If the same business needs this every day or every month, it becomes a small
workflow prototype instead of a one-off cleanup.

Public request link:
https://github.com/fabkshdkadhj/business-tool-lab/issues/new?template=business-report-request.yml
