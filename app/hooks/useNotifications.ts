'use client';

import { useEffect, useRef } from 'react';
import { Settings } from '../lib/stats';
import { getTodayMessage } from '../lib/messages';

/**
 * Schedules a daily browser notification at settings.endOfDayTime.
 * - Requests notification permission if not yet granted.
 * - Fires the notification with today's motivational message.
 * - Automatically reschedules for the next day after each fire.
 * - Cleans up timers when the component unmounts or settings change.
 */
export function useNotifications(settings: Settings) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;
    if (!('Notification' in window)) return;

    const { notificationsEnabled, endOfDayTime } = settings;

    // Clear any previously scheduled timer first
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (!notificationsEnabled) return;

    function msUntilTime(hhmm: string): number {
      const [h, m] = hhmm.split(':').map(Number);
      const now = new Date();
      const target = new Date(now);
      target.setHours(h, m, 0, 0);
      // If the time has already passed today, schedule for tomorrow
      if (target.getTime() <= now.getTime()) {
        target.setDate(target.getDate() + 1);
      }
      return target.getTime() - now.getTime();
    }

    function fireNotification() {
      const msg = getTodayMessage();
      if (Notification.permission === 'granted') {
        new Notification('🌙 خلص اليوم يا بطل!', {
          body: `${msg.icon} ${msg.text}`,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          tag: 'haant-end-of-day', // collapses duplicates
          dir: 'rtl',
          lang: 'ar',
        });
      }

      // Reschedule for the same time tomorrow
      timerRef.current = setTimeout(fireNotification, msUntilTime(settings.endOfDayTime));
    }

    async function schedule() {
      if (Notification.permission === 'default') {
        const result = await Notification.requestPermission();
        if (result !== 'granted') return;
      }
      if (Notification.permission !== 'granted') return;

      timerRef.current = setTimeout(fireNotification, msUntilTime(settings.endOfDayTime));
    }

    schedule();

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.notificationsEnabled, settings.endOfDayTime]);
}
