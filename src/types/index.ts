export type Category = "Work" | "Learning" | "Social" | "Other";

export interface DomainInfo {
  domain: string;
  category: Category;
}

export interface DailyUsage {
  [domain: string]: number;
}

export interface UsageStore {
  [date: string]: DailyUsage;
}

export interface StorageData {
  usage: UsageStore;
  categories: Record<string, Category>;
  settings: {
    idleThreshold: number;
  };
}

export const DEFAULT_CATEGORIES: Record<string, Category> = {
  "github.com": "Work",
  "gitlab.com": "Work",
  "bitbucket.org": "Work",
  "stackoverflow.com": "Work",
  "stackexchange.com": "Work",
  "linkedin.com": "Work",
  "notion.so": "Work",
  "figma.com": "Work",
  "canva.com": "Work",
  "trello.com": "Work",
  "asana.com": "Work",
  "slack.com": "Work",
  "teams.microsoft.com": "Work",
  "zoom.us": "Work",
  "meet.google.com": "Work",
  "docs.google.com": "Work",
  "sheets.google.com": "Work",
  "drive.google.com": "Work",
  "dropbox.com": "Work",
  "aws.amazon.com": "Work",
  "cloud.google.com": "Work",
  "azure.microsoft.com": "Work",
  "vercel.com": "Work",
  "netlify.com": "Work",
  "heroku.com": "Work",

  // Learning & Education
  "coursera.org": "Learning",
  "udemy.com": "Learning",
  "edx.org": "Learning",
  "khanacademy.org": "Learning",
  "codecademy.com": "Learning",
  "freecodecamp.org": "Learning",
  "pluralsight.com": "Learning",
  "udacity.com": "Learning",
  "linkedin.com/learning": "Learning",
  "skillshare.com": "Learning",
  "youtube.com/watch": "Learning",
  "medium.com": "Learning",
  "dev.to": "Learning",
  "hackernoon.com": "Learning",
  "wikipedia.org": "Learning",
  "arxiv.org": "Learning",

  // Social Media
  "twitter.com": "Social",
  "x.com": "Social",
  "facebook.com": "Social",
  "instagram.com": "Social",
  "tiktok.com": "Social",
  "reddit.com": "Social",
  "pinterest.com": "Social",
  "snapchat.com": "Social",
  "whatsapp.com": "Social",
  "telegram.org": "Social",
  "discord.com": "Social",

  // Entertainment & Other
  "youtube.com": "Other",
  "netflix.com": "Other",
  "twitch.tv": "Other",
  "spotify.com": "Other",
  "soundcloud.com": "Other",
  "amazon.com": "Other",
  "ebay.com": "Other",
  "news.ycombinator.com": "Learning",
};
