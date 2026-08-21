'use client';

import { arabicDate } from '../lib/stats';
import { getTodayMessage } from '../lib/messages';
import type { Message } from '../lib/messages';

interface Props {
  onClose: () => void;
}

export default function TodayMsgModal({ onClose }: Props) {
  const msg: Message = getTodayMessage();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      style={{ background: 'rgba(0,0,0,0.75)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: 'var(--c-army2)',
          border: '1px solid rgba(255,215,0,0.25)',
          borderRadius: 20,
          padding: '28px 20px 24px',
          width: '100%',
          maxWidth: 360,
          textAlign: 'center',
          position: 'relative',
          animation: 'modalPop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 14, left: 14,
            background: 'rgba(255,255,255,0.08)', border: 'none',
            borderRadius: 8, color: 'var(--c-text3)',
            fontSize: 18, width: 32, height: 32,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ✕
        </button>

        <div style={{ fontSize: 56, marginBottom: 12, animation: 'bounce 1.5s ease-in-out infinite', display: 'inline-block' }}>
          {msg.icon}
        </div>

        <p style={{ fontSize: 13, color: 'var(--c-text3)', marginBottom: 8 }}>
          {arabicDate()}
        </p>

        <p
          style={{
            background: 'rgba(255,215,0,0.06)',
            border: '1px solid rgba(255,215,0,0.15)',
            borderRadius: 12,
            padding: 16,
            fontSize: 15,
            lineHeight: 1.8,
            color: 'var(--c-text)',
          }}
        >
          {msg.text}
        </p>
      </div>
    </div>
  );
}
