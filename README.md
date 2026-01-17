# Aegis Tracker - Website Productivity Analyzer

A premium Chrome Extension built with React, TypeScript, and Tailwind CSS to track and analyze your digital workspace efficiency.

![Aegis Tracker Preview](https://via.placeholder.com/800x450?text=Aegis+Tracker+Dashboard)

## Features

- **Active Tracking**: Only tracks time when the tab is active, window is focused, and you are not idle.
- **Categorization**: Automatically categorizes known domains (Work, Learning, Social, Other) and allows manual overrides.
- **Dashboard**: High-performance analytics dashboard featuring Recharts for daily and weekly insights.
- **Privacy First**: All data is stored locally in `chrome.storage.local`. No external servers or tracking.
- **Data Export**: Export your productivity data to CSV for external analysis.

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Charts**: Recharts
- **Build Tool**: Vite

## Installation

1. Clone this repository.
2. Run `npm install` (or `yarn`) to install dependencies.
3. Run `npm run build` (or `yarn build`) to generate the build output.

### Loading into Chrome
After building, your project directory will look like this:

```
productivity-analyzer/
├── dist/            ← LOAD THIS FOLDER
│   ├── manifest.json
│   ├── index.html
│   └── assets/
├── public/
├── src/
└── package.json
```

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** in the top right.
3. Click **Load unpacked**.
4. Select the **`dist`** folder (not the root project folder).

## Development

- `npm run dev`: Start Vite dev server (for UI development).
- `npm run build`: Build the extension for production.

## Privacy

Aegis Tracker does not collect any personally identifiable information. Your browsing history and time-tracking data never leave your device.
