// components/InfoCards.tsx
"use client";

import { useCountdown } from "../hooks/useCountdown";
import { InfoCard } from "./InfoCard";
// import { VacationCard } from "./VacationCard";

// دي بيانات تجريبية — هتيجي من useCountdown بعدين
const mockData = {
  weeksLeft: 31,
  currentCycle: 12,
  totalCycles: 6,
  monthsLeft: 7,
  daysToVacation: 21,
  vacationDaysLeft: 70,
  serviceDaysLeft: 147,
  vacationProgress: 65,
  nextVacationDate: "١٢ أغسطس",
};

const InfoCards = () => {
  const d = mockData;
  const {remainingWeeks,remainingMonths}= useCountdown();
  return (
    <section className="flex flex-col gap-3 w-full">
      {/* Title */}
      <p className="text-center text-content3 text-sm tracking-widest mb-1 mt-3">
        إحصائياتك
      </p>

      {/* Row 1 — 3 cards */}
      <div className="grid grid-cols-3 gap-2">
        <InfoCard
          icon="📅"
          value={remainingWeeks}
          label="أسبوع متبقي"
          color="purple"
          progress={60}
        />
        <InfoCard
          icon="🔄"
          value={`${d.totalCycles} / ${d.currentCycle}`}
          label="العمالة الحالية / الكاملة"
          color="blue"
          progress={50}
        />
        <InfoCard
          icon="🗓️"
          value={remainingMonths}
          label="شهر متبقي"
          color="green"
          progress={40}
        />
      </div>

      {/* Row 2 — 3 cards */}
      <div className="grid grid-cols-3 gap-2">
        <InfoCard
          icon="🎉"
          value={d.daysToVacation}
          label="يوم على إجازتك الجاية"
          color="green"
          progress={30}
        />
        <InfoCard
          icon="🏖️"
          value={d.vacationDaysLeft}
          label="يوم إجازة متبقي"
          color="orange"
          progress={70}
        />
        <InfoCard
          icon="⚔️"
          value={d.serviceDaysLeft}
          label="خدمة متبقية"
          color="purple"
          progress={55}
        />
      </div>

      {/* Vacation status card */}
      {/* <VacationCard
        daysLeft={d.daysToVacation}
        nextVacationDate={d.nextVacationDate}
        isOnVacation={false}
        progress={d.vacationProgress}
      /> */}
    </section>
  );
};

export default InfoCards;