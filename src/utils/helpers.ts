export const getDomain = (
  url: string | undefined,
  title?: string
): string | null => {
  if (!url || url === "about:blank" || url.startsWith("chrome://newtab"))
    return null;

  try {
    const urlObj = new URL(url);

    // Handle Chrome/Internal pages
    if (urlObj.protocol === "chrome:" || urlObj.protocol === "edge:") {
      const pageName = urlObj.hostname || urlObj.pathname.split("/")[1] || "";
      if (!pageName || pageName === "newtab") return null;

      const capitalized = pageName.charAt(0).toUpperCase() + pageName.slice(1);
      return `Browser: ${capitalized}`;
    }

    // Handle Extensions (Filter out our own extension)
    if (urlObj.protocol === "chrome-extension:") {
      // Filter out our own dashboard/options
      if (title?.includes("Productivity Analyzer")) return null;
      return title ? `Extension: ${title}` : "Browser Extension";
    }

    // Handle Local Files
    if (urlObj.protocol === "file:") {
      return title ? `File: ${title}` : "Local File";
    }

    // Standard hostnames (keep www. as requested)
    let domain = urlObj.hostname;
    if (domain) return domain;

    // Fallback for cases with no hostname
    if (title && !["new tab", "empty page"].includes(title.toLowerCase()))
      return title;
    return null;
  } catch {
    // Fallback for malformed URLs
    if (title && !["new tab", "empty page"].includes(title.toLowerCase()))
      return title;
    return null;
  }
};

export const getTodayDate = (): string => {
  const date = new Date();
  return date.toISOString().split("T")[0];
};

export const formatMinutesToTime = (minutes: number): string => {
  const totalSeconds = Math.floor(minutes * 60);
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(
    2,
    "0"
  )}:${String(secs).padStart(2, "0")}`;
};

export const formatHoursToTime = (hours: number): string => {
  const totalSeconds = Math.floor(hours * 3600);
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
    2,
    "0"
  )}:${String(secs).padStart(2, "0")}`;
};
