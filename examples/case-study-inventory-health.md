# Inventory Health Check

This case study shows how a small inventory sheet can become a practical stock-risk report.

## Before

The starting file is a small inventory export:

- [inventory-health-check.csv](./inventory-health-check.csv)
- 6 SKUs with stock on hand, 30-day sales, unit cost, reorder point, and days since last sale
- A mix of slow-moving stock, dead stock, steady sellers, and reorder risks

The problem is that the business owner can see the rows but not the priority order.

## After

The output becomes an inventory health report:

- [inventory-health-output.md](./inventory-health-output.md)
- Total stock value
- Slow-moving and dead-stock value
- Reorder-risk items
- A short action list for clearance, bundling, and reorder decisions

## Service Fit

This maps to the **Workflow Prototype** offer at **RMB 299+** when a shop wants to repeat the same
inventory review every week or month. A one-off cleanup can start smaller, but the useful version is
a repeatable rule set.

Public request link:
https://github.com/fabkshdkadhj/business-tool-lab/issues/new?template=business-report-request.yml
