import {
    differenceInDays,
    differenceInMonths,
    differenceInWeeks,
    isBefore,
} from "date-fns";
import { useSettings } from "./useSettings";

export const useCountdown = () => {

    const { settings } = useSettings();
    const today = new Date();
    const startDate = new Date(settings.startDate);
    const endDate = new Date(settings.endDate);
    // حساب نسبة التقدم
    const totalDays = differenceInDays(endDate, startDate);
    const elapsedDays = isBefore(today, startDate)
        ? 0
        : differenceInDays(today, startDate);

    const remainingDays = Math.max(
        differenceInDays(endDate, today),
        0
    );
    const remainingWeeks = differenceInWeeks(endDate, today);
    const remainingMonths = differenceInMonths(endDate, today);
    const progress =
        totalDays === 0
            ? 0
            : Number(((elapsedDays / totalDays) * 100).toFixed(1));

    const cycle = settings.serviceDays + settings.vacationDays;
    
    return {
        totalDays,
        elapsedDays,
        remainingDays,
        progress,
        remainingWeeks,
        remainingMonths
    };
}