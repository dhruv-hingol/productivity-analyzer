import type { UsageStore } from "../types";
import { getTotalSeconds } from "./data";

/**
 * Gets the date range for a specific number of days before the end date
 */
export const getDateRangeForDays = (
  endDate: string,
  days: number
): string[] => {
  const dates = [];
  const end = new Date(endDate);

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split("T")[0]);
  }

  return dates;
};

/**
 * Gets total seconds for a date range
 */
export const getTotalSecondsInRange = (
  usage: UsageStore,
  startDate: string,
  endDate: string
): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let total = 0;

  const current = new Date(start);
  while (current <= end) {
    const dateStr = current.toISOString().split("T")[0];
    total += getTotalSeconds(usage, dateStr);
    current.setDate(current.getDate() + 1);
  }

  return total;
};

/**
 * Compares current week with previous week
 */
export const getWeekComparison = (
  usage: UsageStore,
  currentWeekStart: string,
  currentWeekEnd: string
) => {
  const currentTotal = getTotalSecondsInRange(
    usage,
    currentWeekStart,
    currentWeekEnd
  );

  // Calculate previous week dates
  const currentStart = new Date(currentWeekStart);
  const prevWeekStart = new Date(currentStart);
  prevWeekStart.setDate(prevWeekStart.getDate() - 7);
  const prevWeekEnd = new Date(currentStart);
  prevWeekEnd.setDate(prevWeekEnd.getDate() - 1);

  const previousTotal = getTotalSecondsInRange(
    usage,
    prevWeekStart.toISOString().split("T")[0],
    prevWeekEnd.toISOString().split("T")[0]
  );

  const change =
    previousTotal > 0
      ? ((currentTotal - previousTotal) / previousTotal) * 100
      : 0;

  return {
    currentTotal,
    previousTotal,
    change,
    trend: change > 0 ? "up" : change < 0 ? "down" : "stable",
  };
};

/**
 * Gets day-over-day comparison for today
 */
export const getDayComparison = (usage: UsageStore, date: string) => {
  const todayTotal = getTotalSeconds(usage, date);

  const yesterday = new Date(date);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];
  const yesterdayTotal = getTotalSeconds(usage, yesterdayStr);

  const change =
    yesterdayTotal > 0
      ? ((todayTotal - yesterdayTotal) / yesterdayTotal) * 100
      : 0;

  return {
    todayTotal,
    yesterdayTotal,
    change,
    trend: change > 0 ? "up" : change < 0 ? "down" : "stable",
  };
};
