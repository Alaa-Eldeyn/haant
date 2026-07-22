'use client';

import Header from './components/Header';
import MainCard from './components/MainCard';
import { useCountdown } from './hooks/useCountdown';
import InfoCards from './components/InfoCards';

export default function Page() {
  const { remainingDays, progress } = useCountdown()
  return <main className='mx-auto max-w-lg p-5'>
    <Header />
    <MainCard
      remainingDays={remainingDays}
      progress={progress}
    />
    <InfoCards />
  </main>;
}