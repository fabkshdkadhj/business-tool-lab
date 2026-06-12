# Customer Follow-Up Aging

This case study shows a simple repeatable follow-up workflow for unpaid invoices, overdue accounts,
or service records that need action.

## Before

The starting file is a small follow-up export:

- [customer-follow-up-aging.csv](./customer-follow-up-aging.csv)
- 5 invoices with due dates, status, last contact dates, owners, and notes
- Paid, not-yet-due, overdue, and critical overdue rows mixed together

The issue is not that the team lacks data. The issue is that the next call list is buried in it.

## After

The output becomes an aging and follow-up queue:

- [customer-follow-up-output.md](./customer-follow-up-output.md)
- Open, overdue, due-soon, and critical amounts
- The oldest overdue invoice
- A ranked follow-up queue with direct action items

## Service Fit

This maps to the **Monthly Digest Setup** offer at **RMB 499+** when the same aging or follow-up
report needs to be generated on a schedule. It can also be reduced to a smaller cleanup job for one
safe sample file.

Public request link:
https://github.com/fabkshdkadhj/business-tool-lab/issues/new?template=business-report-request.yml
