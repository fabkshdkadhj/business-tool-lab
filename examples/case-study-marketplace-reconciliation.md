# Multi-Platform Order Reconciliation

This case study shows a more valuable workflow than a one-day sales digest: compare order exports
against payment settlement exports and surface the rows that need follow-up.

## Before

The sample starts as one normalized export:

- [multi-platform-order-reconciliation.csv](./multi-platform-order-reconciliation.csv)
- 6 orders across Douyin, Meituan, Kuaishou, and a mini-program
- Normal settlements, one refund, one missing settlement, and one short settlement

The painful part is not reading the rows. The painful part is knowing which rows matter after platform
fees, refunds, and settlement timing are mixed together.

## After

The output becomes an exception-first report:

- [order-reconciliation-output.md](./order-reconciliation-output.md)
- Gross sales, platform fees, refunds, expected settlement, and received settlement
- Highest-risk platform by missing/short settlement amount
- A short action list for the two rows that need follow-up

## Service Fit

This maps to the **Workflow Prototype** offer at **RMB 299+** when the business repeats the same
platform reconciliation every week or month. The first job can be a one-off cleanup, but the stronger
offer is a repeatable browser tool or spreadsheet rule set.

Public request link:
https://github.com/fabkshdkadhj/business-tool-lab/issues/new?template=business-report-request.yml
