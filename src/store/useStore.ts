import { create } from 'zustand';
import type { UsageStore, Category } from '../types';
import { DEFAULT_CATEGORIES } from '../types';

interface AppState {
    usage: UsageStore;
    categories: Record<string, Category>;
    openTabsCount: number;
    isLoading: boolean;
    fetchData: () => Promise<void>;
    updateCategory: (domain: string, category: Category) => Promise<void>;
    resetData: () => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
    usage: {},
    categories: DEFAULT_CATEGORIES,
    openTabsCount: 0,
    isLoading: true,

    fetchData: async () => {
        set({ isLoading: true });
        const result = await chrome.storage.local.get(['usage', 'categories', 'openTabsCount']);
        set({
            usage: (result.usage as UsageStore) || {},
            categories: { ...DEFAULT_CATEGORIES, ...(result.categories || {}) },
            openTabsCount: (result.openTabsCount as number) || 0,
            isLoading: false,
        });
    },

    updateCategory: async (domain, category) => {
        const newCategories = { ...get().categories, [domain]: category };
        await chrome.storage.local.set({ categories: newCategories });
        set({ categories: newCategories });
    },

    resetData: async () => {
        await chrome.storage.local.set({ usage: {} });
        set({ usage: {} });
    },
}));
