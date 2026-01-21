import type { UsageStore, Category } from "@/types";
import { formatDuration } from "./format";

export const exportToJSON = (
  usage: UsageStore,
  categories: Record<string, Category>,
) => {
  const exportData = {
    exportDate: new Date().toISOString(),
    version: "1.0",
    usage,
    categories,
    summary: {
      totalDays: Object.keys(usage).length,
      totalDomains: Object.keys(categories).length,
      dateRange: {
        start: Object.keys(usage).sort()[0] || null,
        end: Object.keys(usage).sort().reverse()[0] || null,
      },
    },
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `productivity-data-${
    new Date().toISOString().split("T")[0]
  }.json`;
  a.click();

  URL.revokeObjectURL(url);
};

export const exportToHTML = (
  usage: UsageStore,
  categories: Record<string, Category>,
) => {
  let totalSeconds = 0;
  const categoryTotals: Record<string, number> = {};

  Object.values(usage).forEach((dayUsage) => {
    Object.entries(dayUsage).forEach(([domain, seconds]) => {
      totalSeconds += seconds;
      const category = categories[domain] || "Other";
      categoryTotals[category] = (categoryTotals[category] || 0) + seconds;
    });
  });

  const dates = Object.keys(usage).sort();
  const dateRange =
    dates.length > 0 ? `${dates[0]} to ${dates[dates.length - 1]}` : "No data";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Productivity Report</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 1200px; margin: 40px auto; padding: 20px; background: #f5f5f5; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 12px; margin-bottom: 30px; }
    .header h1 { margin: 0 0 10px 0; font-size: 32px; }
    .header p { margin: 0; opacity: 0.9; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .card { background: white; padding: 24px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .card h3 { margin: 0 0 8px 0; color: #666; font-size: 14px; text-transform: uppercase; }
    .card .value { font-size: 32px; font-weight: bold; color: #333; }
    table { width: 100%; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    th { background: #667eea; color: white; padding: 16px; text-align: left; }
    td { padding: 12px 16px; border-bottom: 1px solid #eee; }
    tr:last-child td { border-bottom: none; }
    .category-work { color: #3b82f6; }
    .category-learning { color: #10b981; }
    .category-social { color: #a855f7; }
    .category-other { color: #64748b; }
  </style>
</head>
<body>
  <div class="header">
    <h1>📊 Productivity Report</h1>
    <p>Generated on ${new Date().toLocaleString()}</p>
    <p>Date range: ${dateRange}</p>
  </div>

  <div class="summary">
    <div class="card">
      <h3>Total Active Time</h3>
      <div class="value">${formatDuration(totalSeconds)}</div>
    </div>
    <div class="card">
      <h3>Days Tracked</h3>
      <div class="value">${dates.length}</div>
    </div>
    <div class="card">
      <h3>Unique Domains</h3>
      <div class="value">${Object.keys(categories).length}</div>
    </div>
  </div>

  <div class="card" style="margin-bottom: 20px;">
    <h2 style="margin-top: 0;">Category Breakdown</h2>
    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th>Total Time</th>
          <th>Percentage</th>
        </tr>
      </thead>
      <tbody>
        ${Object.entries(categoryTotals)
          .sort(([, a], [, b]) => b - a)
          .map(
            ([category, seconds]) => `
          <tr>
            <td class="category-${category.toLowerCase()}">${category}</td>
            <td>${formatDuration(seconds)}</td>
            <td>${((seconds / totalSeconds) * 100).toFixed(1)}%</td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
  </div>

  <div class="card">
    <h2 style="margin-top: 0;">Daily Summary</h2>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Total Time</th>
          <th>Domains Visited</th>
        </tr>
      </thead>
      <tbody>
        ${dates
          .reverse()
          .map((date) => {
            const dayUsage = usage[date];
            const dayTotal = Object.values(dayUsage).reduce(
              (sum, s) => sum + s,
              0,
            );
            const domainCount = Object.keys(dayUsage).length;
            return `
          <tr>
            <td>${date}</td>
            <td>${formatDuration(dayTotal)}</td>
            <td>${domainCount}</td>
          </tr>
        `;
          })
          .join("")}
      </tbody>
    </table>
  </div>

  <p style="text-align: center; color: #999; margin-top: 40px;">
    Generated by Productivity Analyzer • All data is local and private
  </p>
</body>
</html>
  `;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `productivity-report-${
    new Date().toISOString().split("T")[0]
  }.html`;
  a.click();

  URL.revokeObjectURL(url);
};
