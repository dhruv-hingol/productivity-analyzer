import type { UsageStore, Category } from '../types';

export const exportToCSV = (usage: UsageStore, categories: Record<string, Category>) => {
    const rows = [['Date', 'Domain', 'Category', 'Time Spent (minutes)', 'Time Spent (seconds)']];

    Object.entries(usage).forEach(([date, dayUsage]) => {
        Object.entries(dayUsage).forEach(([domain, seconds]) => {
            const category = categories[domain] || 'Other';
            rows.push([
                date,
                domain,
                category,
                (seconds / 60).toFixed(2),
                seconds.toString()
            ]);
        });
    });

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `productivity_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
