import { useEffect } from "react";
import "../../index.css";
import { PopupHeader } from "./components/PopupHeader";
import { PopupStats } from "./components/PopupStats";
import { PopupCategorySummary } from "./components/PopupCategorySummary";
import { PopupFooter } from "./components/PopupFooter";
import { useStore } from "@/store/useStore";
import { getTodayDate } from "@/utils/helpers";
import { getTotalSeconds, IGNORED_DOMAINS } from "@/utils/data";
import type { Category } from "@/types";
import { CommonLoader } from "@/common/common-loader";

const Popup = () => {
  const { usage, categories, openTabsCount, isLoading, fetchData } = useStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const today = getTodayDate();
  const todayUsage = usage[today] || {};
  const totalSeconds = getTotalSeconds(usage, today);

  const categorySummary = Object.entries(todayUsage)
    .filter(([domain]) => !IGNORED_DOMAINS.includes(domain))
    .reduce((acc, [domain, seconds]) => {
      const category = categories[domain] || "Other";
      acc[category] = (acc[category] || 0) + seconds;
      return acc;
    }, {} as Record<Category, number>);

  const openOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  if (isLoading) {
    return (
      <div className="w-80 h-[450px] bg-background">
        <CommonLoader fullScreen={false} className="h-full" />
      </div>
    );
  }

  return (
    <div className="w-80 h-[450px] bg-background text-foreground font-sans selection:bg-indigo-500/30 overflow-hidden transition-colors duration-300">
      <PopupHeader onOpenOptions={openOptions} />

      <main className="space-y-6 p-4">
        <PopupStats totalSeconds={totalSeconds} openTabsCount={openTabsCount} />

        <PopupCategorySummary
          categorySummary={categorySummary}
          totalSeconds={totalSeconds}
        />

        <PopupFooter onOpenOptions={openOptions} />
      </main>
    </div>
  );
};

export default Popup;
