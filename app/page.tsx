'use client';

import { useState } from 'react';
import Header from './components/Header';
import MainCard from './components/MainCard';
import InfoCards from './components/InfoCards';
import VacationCard from './components/VacationCard';
import { useDailyMessage } from './components/DailyMessage';
import SettingsModal from './components/SettingsModal';
import TodayMsgModal from './components/TodayMsgModal';
import CelebrationOverlay from './components/CelebrationOverlay';
import { useStats } from './hooks/useStats';
import { arabicDate } from './lib/stats';

export default function Page() {
  const stats = useStats();
  const { msg, next } = useDailyMessage();

  const [showSettings, setShowSettings] = useState(false);
  const [showTodayMsg, setShowTodayMsg] = useState(false);

  const isFinished = stats !== null && stats.remainDays <= 0;

  if (isFinished) return <CelebrationOverlay />;

  return (
    <main
      style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: 480,
        margin: '0 auto',
        padding: '24px 16px',
      }}
    >
      {/* ── Header ── */}
      <Header />

      {/* ── Main Days Card ── */}
      <MainCard />

      {/* ── Info Cards (stats grid) ── */}
      <InfoCards />

      {/* ── Vacation Detail Card ── */}
      <div style={{ marginTop: 10 }}>
        <VacationCard />
      </div>

      {/* ── Fix-vac helper link ── */}
      <div style={{ textAlign: 'center', marginBottom: 10 }}>
        <span
          onClick={() => setShowSettings(true)}
          style={{ fontSize: 12, color: 'var(--c-text3)', textDecoration: 'underline', cursor: 'pointer' }}
        >
          يوم إجازتك غلط؟ صححه من هنا
        </span>
      </div>

      {/* ── Daily Message Card ── */}
      <div
        style={{
          position: 'relative',
          borderRadius: 18,
          padding: 2,
          marginBottom: 16,
          background: 'conic-gradient(from 0deg,#FFD700,#4a7c4a,#FFD700,#1a4a1a,#FFD700)',
          animation: 'rotateBorder 6s linear infinite',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(145deg,#060e14,#0e1a1e)',
            borderRadius: 16,
            padding: 20,
          }}
        >
          <div className="flex items-center gap-2.5 mb-3.5">
            <span style={{ fontSize: 28, display: 'inline-block', animation: 'bounce 2s ease-in-out infinite' }}>
              {msg.icon}
            </span>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#FFD700' }}>رسالة اليوم</p>
              <p style={{ fontSize: 11, color: 'var(--c-text3)', marginTop: 2 }}>{arabicDate()}</p>
            </div>
          </div>

          <p
            style={{
              background: 'rgba(255,215,0,0.06)',
              border: '1px solid rgba(255,215,0,0.15)',
              borderRadius: 10,
              padding: 14,
              fontSize: 15,
              lineHeight: 1.7,
              color: 'var(--c-text)',
            }}
          >
            {msg.text}
          </p>
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-2.5 mb-4 flex-wrap">
          <button className="haant-btn haant-btn-gold" onClick={() => setShowTodayMsg(true)}>
            🔔 رسالة النهارده
          </button>
          <button className="haant-btn haant-btn-outline" onClick={next}>
            ✨ غير الرسالة
          </button>
        </div>
        <div className="flex gap-2.5 my-4">
          <button className="haant-btn haant-btn-outline w-full" onClick={() => setShowSettings(true)}>
            ⚙️ الإعدادات
          </button>
        </div>
      </div>

      {/* ── Modals ── */}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onSave={() => setShowSettings(false)}
        />
      )}

      {showTodayMsg && <TodayMsgModal onClose={() => setShowTodayMsg(false)} />}
    </main>
  );
}