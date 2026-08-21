'use client';

import { useState } from 'react';
import { messages, getDayOfYear, getTodayMessage } from '../lib/messages';
import { arabicDate } from '../lib/stats';

export default function DailyMessage() {
  const [idx, setIdx] = useState<number>(getDayOfYear() % messages.length);
  const msg = messages[idx];

  const nextMsg = () => setIdx((prev) => (prev + 1) % messages.length);

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 18,
        padding: 2,
        marginBottom: 16,
        background: 'conic-gradient(from var(--msg-angle,0deg), #FFD700, #4a7c4a, #FFD700, #1a4a1a, #FFD700)',
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
          <span style={{ fontSize: 28, animation: 'bounce 2s ease-in-out infinite', display: 'inline-block' }}>
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

      {/* next-message button layered here for layout simplicity */}
      <button
        onClick={nextMsg}
        style={{ display: 'none' }}
        id="next-msg-trigger"
      />
    </div>
  );
}

// Expose nextMsg via a ref approach — parent will use the exported hook instead
export function useDailyMessage() {
  const [idx, setIdx] = useState<number>(getDayOfYear() % messages.length);
  const next = () => setIdx((p) => (p + 1) % messages.length);
  const today = getTodayMessage();
  return { msg: messages[idx], today, next };
}