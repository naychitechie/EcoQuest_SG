import { STORAGE_KEYS } from '@/lib/constants';

export type AppTheme = 'light' | 'dark' | 'auto';

export interface AppPreferences {
  theme: AppTheme;
  ecoPrecision: boolean;
}

export const DEFAULT_APP_PREFERENCES: AppPreferences = {
  theme: 'dark',
  ecoPrecision: true,
};

export function readAppPreferences(): AppPreferences {
  if (typeof window === 'undefined') return DEFAULT_APP_PREFERENCES;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.APP_PREFERENCES);
    return stored
      ? { ...DEFAULT_APP_PREFERENCES, ...JSON.parse(stored) }
      : DEFAULT_APP_PREFERENCES;
  } catch {
    return DEFAULT_APP_PREFERENCES;
  }
}

export function writeAppPreferences(prefs: AppPreferences): void {
  localStorage.setItem(STORAGE_KEYS.APP_PREFERENCES, JSON.stringify(prefs));
}

export function resolveTheme(theme: AppTheme): 'light' | 'dark' {
  if (theme === 'auto') {
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
}

export function applyDocumentTheme(resolved: 'light' | 'dark'): void {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', resolved === 'dark');
  document.documentElement.setAttribute('data-ecoquest-theme', resolved);
}
