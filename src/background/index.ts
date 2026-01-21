const getDomain = (url: string | undefined, title?: string): string | null => {
  if (!url || url === "about:blank" || url.startsWith("chrome://newtab"))
    return null;

  try {
    const urlObj = new URL(url);

    if (urlObj.protocol === "chrome:" || urlObj.protocol === "edge:") {
      const pageName = urlObj.hostname || urlObj.pathname.split("/")[1] || "";
      if (!pageName || pageName === "newtab") return null;

      const capitalized = pageName.charAt(0).toUpperCase() + pageName.slice(1);
      return `Browser: ${capitalized}`;
    }

    if (urlObj.protocol === "chrome-extension:") {
      if (title?.includes("Productivity Analyzer")) return null;
      return title ? `Extension: ${title}` : "Browser Extension";
    }

    if (urlObj.protocol === "file:") {
      return title ? `File: ${title}` : "Local File";
    }

    let domain = urlObj.hostname;
    if (domain) return domain;

    if (title && !["new tab", "empty page"].includes(title.toLowerCase()))
      return title;
    return null;
  } catch {
    if (title && !["new tab", "empty page"].includes(title.toLowerCase()))
      return title;
    return null;
  }
};

const getTodayDate = (): string => {
  const date = new Date();
  return date.toISOString().split("T")[0];
};

const MAX_SESSION_DURATION = 4 * 3600;
const MIN_SESSION_DURATION = 1;

const validateDuration = (duration: number): number => {
  if (duration < MIN_SESSION_DURATION) {
    return 0;
  }

  if (duration > MAX_SESSION_DURATION) {
    console.warn(
      `Session duration ${duration}s exceeds maximum ${MAX_SESSION_DURATION}s, capping to maximum`,
    );
    return MAX_SESSION_DURATION;
  }

  return duration;
};

const isAnomalousDuration = (duration: number, domain: string): boolean => {
  if (duration > 3 * 3600) {
    console.warn(
      `Potential anomaly: ${domain} tracked for ${duration}s (${Math.round(
        duration / 3600,
      )}h)`,
    );
    return true;
  }

  return false;
};

const DEFAULT_RETENTION_DAYS = 90;

const getRetentionCutoffDate = (
  retentionDays: number = DEFAULT_RETENTION_DAYS,
): string => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - retentionDays);
  return cutoff.toISOString().split("T")[0];
};

const cleanupOldData = async (
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

interface DailyUsage {
  [domain: string]: number;
}

interface UsageStore {
  [date: string]: DailyUsage;
}

class UsageTracker {
  private currentDomain: string | null = null;
  private startTime: number | null = null;
  private isIdle = false;
  private lastDomain: string | null = null;
  private lastLeaveTime: number | null = null;
  private saveQueue: Promise<void> = Promise.resolve();
  private domainSwitchTimeout: any = null;

  constructor() {
    this.init();
  }

  private init() {
    console.log("[UsageTracker] Initializing background service worker...");

    chrome.tabs.onActivated.addListener(this.handleTabActivated.bind(this));
    chrome.tabs.onUpdated.addListener(this.handleTabUpdated.bind(this));
    chrome.windows.onFocusChanged.addListener(
      this.handleWindowFocusChanged.bind(this),
    );
    chrome.idle.onStateChanged.addListener((state: any) =>
      this.handleIdleStateChanged(state),
    );
    chrome.tabs.onRemoved.addListener(this.handleTabRemoved.bind(this));

    chrome.idle.setDetectionInterval(20);

    chrome.alarms.create("periodicUpdate", { periodInMinutes: 0.1 });

    chrome.alarms.create("dataCleanup", { periodInMinutes: 60 * 24 * 30 });

    chrome.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === "periodicUpdate") {
        console.log("[UsageTracker] Periodic heartbeat triggered");
        this.saveCurrentUsage();
        this.updateOpenDomains();
      } else if (alarm.name === "dataCleanup") {
        this.performDataCleanup();
      }
    });

    this.updateActiveTab();

    console.log("[UsageTracker] Initialization complete");
  }

  private async updateActiveTab() {
    try {
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (tabs[0]) {
        const domain = getDomain(tabs[0].url, tabs[0].title);
        console.log("[UsageTracker] Active tab on startup:", domain || "null");
        await this.switchDomain(domain);
      }
    } catch (error) {
      console.error("[UsageTracker] Error updating active tab:", error);
    }
  }

  private handleTabActivated(activeInfo: { tabId: number; windowId: number }) {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
      if (chrome.runtime.lastError) {
        console.error(
          "[UsageTracker] Error getting tab:",
          chrome.runtime.lastError,
        );
        return;
      }
      const domain = getDomain(tab.url, tab.title);
      console.log("[UsageTracker] Tab activated:", domain || "null");
      this.switchDomain(domain);
    });
  }

  private handleTabUpdated(
    _tabId: number,
    changeInfo: { url?: string; status?: string },
    tab: chrome.tabs.Tab,
  ) {
    if (tab.active) {
      const url = changeInfo.url || tab.url;
      if (url) {
        const domain = getDomain(url, tab.title);
        console.log("[UsageTracker] Tab updated:", domain || "null");
        this.switchDomain(domain);
      }
    }
  }

  private handleWindowFocusChanged(windowId: number) {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
      console.log("[UsageTracker] Window focus lost");
      this.switchDomain(null);
    } else {
      console.log("[UsageTracker] Window focus gained");
      this.updateActiveTab();
    }
  }

  private handleIdleStateChanged(newState: chrome.idle.IdleState) {
    this.isIdle = newState !== "active";
    console.log("[UsageTracker] Idle state changed:", newState);

    if (this.isIdle) {
      this.saveCurrentUsage(20);
      this.startTime = null;
    } else {
      this.startTime = Date.now();
      this.updateActiveTab();
    }
  }

  private handleTabRemoved() {
    this.updateOpenDomains();
  }

  private async updateOpenDomains() {
    try {
      const tabs = await chrome.tabs.query({});
      const domains = new Set<string>();
      tabs.forEach((tab) => {
        const domain = getDomain(tab.url, tab.title);
        if (domain) domains.add(domain);
      });
      await chrome.storage.local.set({ openTabsCount: domains.size });
      console.log("[UsageTracker] Open tabs count:", domains.size);
    } catch (error) {
      console.error("[UsageTracker] Error updating open domains:", error);
    }
  }

  private async switchDomain(newDomain: string | null) {
    if (this.currentDomain === newDomain) return;

    if (this.domainSwitchTimeout) {
      clearTimeout(this.domainSwitchTimeout);
      this.domainSwitchTimeout = null;
    }

    if (newDomain === null && this.currentDomain !== null) {
      this.domainSwitchTimeout = setTimeout(() => {
        this.performSwitch(null);
        this.domainSwitchTimeout = null;
      }, 3000);
      return;
    }

    await this.performSwitch(newDomain);
  }

  private async performSwitch(newDomain: string | null) {
    if (this.currentDomain === newDomain) return;

    const now = Date.now();

    if (
      newDomain &&
      this.lastDomain === newDomain &&
      this.lastLeaveTime &&
      now - this.lastLeaveTime < 20000
    ) {
      console.log(
        `[UsageTracker] Grace period: Bridging back to ${newDomain} (gap: ${
          now - this.lastLeaveTime
        }ms)`,
      );
      this.currentDomain = newDomain;
      this.startTime = this.lastLeaveTime;
      this.lastDomain = null;
      this.lastLeaveTime = null;
      return;
    }

    await this.saveCurrentUsage();

    if (this.currentDomain) {
      this.lastDomain = this.currentDomain;
      this.lastLeaveTime = now;
    }

    this.currentDomain = newDomain;
    this.startTime = newDomain && !this.isIdle ? Date.now() : null;

    console.log(
      `[UsageTracker] Session ${newDomain ? "started" : "ended"} for: ${
        newDomain || "null"
      }`,
    );

    await this.updateOpenDomains();
  }

  private saveCurrentUsage(excludeSeconds = 0) {
    this.saveQueue = this.saveQueue.then(() =>
      this.performSave(excludeSeconds),
    );
    return this.saveQueue;
  }

  private async performSave(excludeSeconds = 0) {
    if (!this.currentDomain || !this.startTime) return;

    try {
      const now = Date.now();
      let duration = Math.round((now - this.startTime) / 1000) - excludeSeconds;

      const validDuration = validateDuration(duration);

      if (validDuration <= 0) {
        if (!this.isIdle) this.startTime = now;
        return;
      }

      if (isAnomalousDuration(validDuration, this.currentDomain)) {
        console.warn(
          `[UsageTracker] Anomalous duration detected for ${this.currentDomain}: ${validDuration}s`,
        );
      }

      const today = getTodayDate();
      const result = (await chrome.storage.local.get("usage")) as {
        usage?: UsageStore;
      };

      if (chrome.runtime.lastError) {
        console.error(
          "[UsageTracker] Storage read error:",
          chrome.runtime.lastError,
        );
        return;
      }

      const usage = result.usage || {};

      if (!usage[today]) usage[today] = {};
      usage[today][this.currentDomain] =
        (usage[today][this.currentDomain] || 0) + validDuration;

      await chrome.storage.local.set({ usage });

      if (chrome.runtime.lastError) {
        console.error(
          "[UsageTracker] Storage write error:",
          chrome.runtime.lastError,
        );
        return;
      }

      this.startTime = now;
    } catch (error) {
      console.error("[UsageTracker] Error saving usage:", error);
    }
  }

  private async performDataCleanup() {
    try {
      const result = await cleanupOldData();
    } catch (error) {
      console.error("[UsageTracker] Error during data cleanup:", error);
    }
  }
}

new UsageTracker();
