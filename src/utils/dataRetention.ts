export const DEFAULT_RETENTION_DAYS = 90;
export const CLEANUP_CHECK_INTERVAL = 30 * 24 * 60;

export const getRetentionCutoffDate = (
  retentionDays: number = DEFAULT_RETENTION_DAYS,
): string => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - retentionDays);
  return cutoff.toISOString().split("T")[0];
};

export const cleanupOldData = async (
  retentionDays: number = DEFAULT_RETENTION_DAYS,
): Promise<{
  removed: number;
  kept: number;
}> => {
  const cutoffDate = getRetentionCutoffDate(retentionDays);
  const result = await chrome.storage.local.get("usage");
  const usage = result.usage || {};

  let removedCount = 0;
  let keptCount = 0;

  const cleaned: any = {};

  Object.entries(usage).forEach(([date, data]) => {
    if (date >= cutoffDate) {
      cleaned[date] = data;
      keptCount++;
    } else {
      removedCount++;
    }
  });

  await chrome.storage.local.set({ usage: cleaned });

  console.log(
    `Data cleanup: Removed ${removedCount} days, kept ${keptCount} days`,
  );

  return { removed: removedCount, kept: keptCount };
};

export const getStorageStats = async (): Promise<{
  bytesInUse: number;
  totalDays: number;
  oldestDate: string | null;
  newestDate: string | null;
}> => {
  const result = await chrome.storage.local.get("usage");
  const usage = result.usage || {};

  const dates = Object.keys(usage).sort();

  return {
    bytesInUse: JSON.stringify(usage).length,
    totalDays: dates.length,
    oldestDate: dates.length > 0 ? dates[0] : null,
    newestDate: dates.length > 0 ? dates[dates.length - 1] : null,
  };
};
