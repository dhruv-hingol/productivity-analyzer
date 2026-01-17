import type { UsageStore } from "../types";

export const IGNORED_DOMAINS = [
  "Empty Page",
  "unknown",
  "internal",
  "null",
  "Browser Extension",
  "Extension: Productivity Analyzer",
];

export const getDateRange = (startDate: string, endDate: string): string[] => {
  const dates = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Calculate the number of days between start and end
  const daysDiff = Math.floor(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  for (let i = 0; i <= daysDiff; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
};

export const getLast7Days = (endDate: string): string[] => {
  const dates = [];
  const end = new Date(endDate);
  for (let i = 6; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
};

export const aggregateWeeklyData = (
  usage: UsageStore,
  startDate: string,
  endDate: string
) => {
  const dateRange = getDateRange(startDate, endDate);
  return dateRange.map((date) => {
    const dayUsage = usage[date] || {};
    const totalSeconds = Object.entries(dayUsage)
      .filter(([domain]) => !IGNORED_DOMAINS.includes(domain))
      .reduce((acc, [, curr]) => acc + curr, 0);

    return {
      date,
      displayDate: new Date(date).toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      hours: Math.round((totalSeconds / 3600) * 100) / 100,
    };
  });
};

export const getTopDomains = (usage: UsageStore, date: string, limit = 10) => {
  const dayUsage = usage[date] || {};
  return Object.entries(dayUsage)
    .filter(([domain]) => !IGNORED_DOMAINS.includes(domain))
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([domain, seconds]) => ({
      domain,
      seconds,
      minutes: Math.round(seconds / 60),
    }));
};

export const getTotalSeconds = (usage: UsageStore, date: string): number => {
  const dayUsage = usage[date] || {};
  return Object.entries(dayUsage)
    .filter(([domain]) => !IGNORED_DOMAINS.includes(domain))
    .reduce((acc, [, seconds]) => acc + seconds, 0);
};

export const getUniqueDomainsCount = (
  usage: UsageStore,
  date: string
): number => {
  const dayUsage = usage[date] || {};
  return Object.keys(dayUsage).filter(
    (domain) => !IGNORED_DOMAINS.includes(domain)
  ).length;
};
