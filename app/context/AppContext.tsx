'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { Settings, DEFAULT_SETTINGS, calcStats, Stats } from '../lib/stats';
import { useNotifications } from '../hooks/useNotifications';

const STORAGE_KEY = 'haant_settings';

// ── Types ──────────────────────────────────────────────────────────────────
interface AppContextValue {
  settings: Settings;
  updateSettings: (next: Settings) => void;
  stats: Stats | null;
}

// ── Context ────────────────────────────────────────────────────────────────
const AppContext = createContext<AppContextValue | null>(null);

// ── Provider ───────────────────────────────────────────────────────────────
export function AppProvider({ children }: { children: ReactNode }) {
  const isFirstRender = useRef(true);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [stats, setStats] = useState<Stats | null>(null);

  // Load from localStorage once on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<Settings>;
        setSettings((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Persist to localStorage whenever settings change (skip initial default)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* ignore */
    }
  }, [settings]);

  // Recompute stats whenever settings change
  useEffect(() => {
    setStats(calcStats(settings));
    const id = setInterval(() => setStats(calcStats(settings)), 60_000);
    return () => clearInterval(id);
  }, [settings]);

  const updateSettings = (next: Settings) => setSettings(next);

  // Schedule end-of-day notifications based on current settings
  useNotifications(settings);

  return (
    <AppContext.Provider value={{ settings, updateSettings, stats }}>
      {children}
    </AppContext.Provider>
  );
}

// ── Hooks ──────────────────────────────────────────────────────────────────
export function useSettings() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useSettings must be used inside AppProvider');
  return { settings: ctx.settings, updateSettings: ctx.updateSettings };
}

export function useStats(): Stats | null {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useStats must be used inside AppProvider');
  return ctx.stats;
}
