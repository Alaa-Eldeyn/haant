import { useEffect, useRef, useState } from "react";

interface Settings {
  startDate: string;
  endDate: string;

  serviceDays: number;
  vacationDays: number;

  notificationTime: string;
  firstVacationDate: string;
  vacationRound: "first" | "second" | "third";
}

const defaultSettings: Settings = {
  startDate: '2026-02-25',
  endDate: '2027-02-25',
  serviceDays: 20,
  vacationDays: 10,
  notificationTime: '08:00',
  firstVacationDate: '2026-03-17',
  vacationRound: "second"
};

const useSettings = () => {
  const isFirstRender = useRef(true);
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // قراءة من localStorage — مرة واحدة بس
  useEffect(() => {
    const stored = localStorage.getItem('haantSettings');
    if (stored) {
      setSettings(JSON.parse(stored));
    }
  }, []);

  // حفظ في localStorage — بس مش في أول render
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    localStorage.setItem('haantSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  return { settings, updateSettings };
};

export { useSettings, defaultSettings };