import {
  formatCurrency,
  parseBusinessRows,
  summarizeDailyBusiness,
} from "./digest.mjs";

const sampleData = `date,type,category,customer,amount,status,note
2026-06-12,income,retail,Walk-in,268,paid,morning orders
2026-06-12,income,retail,Walk-in,156,paid,afternoon orders
2026-06-12,income,service,Acme Shop,480,unpaid,invoice pending
2026-06-12,expense,supplies,Paper Vendor,92,paid,receipt paper
2026-06-12,expense,delivery,Local Courier,38,paid,same-day delivery
2026-06-12,income,retail,Walk-in,-20,refunded,customer refund`;

const input = document.querySelector("#business-data");
const loadSampleButton = document.querySelector("#load-sample");
const generateButton = document.querySelector("#generate-report");
const output = document.querySelector("#report-output");

loadSampleButton.addEventListener("click", () => {
  input.value = sampleData;
  renderReport();
});

generateButton.addEventListener("click", renderReport);

input.value = sampleData;
renderReport();

function renderReport() {
  const rows = parseBusinessRows(input.value);
  if (rows.length === 0) {
    output.innerHTML = `<p class="empty-state">Paste CSV rows to generate a report.</p>`;
    return;
  }

  const summary = summarizeDailyBusiness(rows);
  const dateLabel = rows[0]?.date || "Today";

  output.innerHTML = `
    <div class="report-header">
      <p class="eyebrow">${escapeHtml(dateLabel)}</p>
      <h2>Daily Business Digest</h2>
      <p>${rows.length} records analyzed. Numbers are based only on the pasted data.</p>
    </div>

    <div class="metric-grid">
      ${metricCard("Income", summary.totalIncome)}
      ${metricCard("Expenses", summary.totalExpense)}
      ${metricCard("Net", summary.netAmount)}
      ${metricCard("Unpaid", summary.unpaidTotal)}
    </div>

    <section class="report-section">
      <h3>Top Income Category</h3>
      <p>${summary.topIncomeCategory
        ? `${escapeHtml(summary.topIncomeCategory.category)}: ${formatCurrency(summary.topIncomeCategory.amount)}`
        : "No income category found."}</p>
    </section>

    <section class="report-section">
      <h3>Action Items</h3>
      <ul>
        ${summary.actionItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </section>
  `;
}

function metricCard(label, value) {
  return `
    <article class="metric-card">
      <span>${label}</span>
      <strong>${formatCurrency(value)}</strong>
    </article>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}
