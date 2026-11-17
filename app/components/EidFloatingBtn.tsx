'use client';

import { useState, useMemo } from 'react';
import { calcEidStatus, EidMatch, EidEntry, EidPastItem } from '../lib/stats';
import { useSettings } from '../hooks/useSettings';

function fmtDate(d: Date) {
  return d.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function EidFloatingBtn() {
  const { settings } = useSettings();
  const [open, setOpen] = useState(false);
  const [showPast, setShowPast] = useState(false);

  const result = useMemo(() => calcEidStatus(settings), [settings]);
  const hasMatch = result.matches.length > 0;

  return (
    <>
      {/* ── Floating trigger button ── */}
      <button
        id="eid-float-btn"
        onClick={() => setOpen(true)}
        title="هل هحضر عيد قادم في الإجازة؟"
        style={{
          position: 'fixed',
          bottom: 24,
          left: 20,
          zIndex: 40,
          width: 56,
          height: 56,
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          background: hasMatch
            ? 'linear-gradient(135deg,#B8860B,#FFD700,#ffe066)'
            : 'linear-gradient(135deg,#1a2e1a,#2d4a2d)',
          boxShadow: hasMatch
            ? '0 0 0 3px rgba(255,215,0,0.35), 0 6px 24px rgba(255,215,0,0.45)'
            : '0 0 0 2px rgba(255,215,0,0.12), 0 4px 16px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 26,
          animation: hasMatch ? 'eidPulse 2.4s ease-in-out infinite' : undefined,
          transition: 'transform 0.15s',
        }}
      >
        {hasMatch ? '🎉' : '🌙'}
      </button>

      {/* ── Modal ── */}
      {open && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          style={{
            position: 'fixed', inset: 0, zIndex: 60,
            background: 'rgba(0,0,0,0.78)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            style={{
              width: '100%', maxWidth: 420,
              background: 'var(--c-army2)',
              border: `1px solid ${hasMatch ? 'rgba(255,215,0,0.4)' : 'rgba(255,215,0,0.15)'}`,
              borderRadius: 22,
              padding: '28px 20px 22px',
              position: 'relative',
              animation: 'modalPop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
              maxHeight: '82vh',
              overflowY: 'auto',
            }}
          >
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              style={{
                position: 'absolute', top: 12, left: 12,
                background: 'rgba(255,255,255,0.07)', border: 'none',
                borderRadius: 8, color: 'var(--c-text3)',
                fontSize: 16, width: 30, height: 30,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >✕</button>

            {/* Header */}
            <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--c-text3)', marginBottom: 4, letterSpacing: 0.5 }}>
              فيما تبقى من فترة خدمتك
            </p>
            <h2 style={{ textAlign: 'center', fontSize: 17, fontWeight: 800, color: '#FFD700', marginBottom: 18 }}>
              🌙 هل هتحضر عيد قادم في الإجازة؟
            </h2>

            {/* Result summary */}
            <div
              style={{
                borderRadius: 16,
                padding: '18px 16px',
                marginBottom: 20,
                background: hasMatch
                  ? 'linear-gradient(135deg,rgba(255,215,0,0.12),rgba(255,215,0,0.04))'
                  : 'rgba(255,255,255,0.04)',
                border: `1px solid ${hasMatch ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.08)'}`,
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: 44, display: 'block', marginBottom: 8 }}>
                {!result.hasUpcomingEids ? '⏳' : hasMatch ? '🎊' : '😔'}
              </span>

              {!result.hasUpcomingEids ? (
                <>
                  <p style={{ fontSize: 15, fontWeight: 800, color: '#FFD700', lineHeight: 1.5, marginBottom: 4 }}>
                    مفيش أعياد قادمة في المتبقي من خدمتك!
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--c-text3)', lineHeight: 1.6 }}>
                    تاريخ تسليمك وشهادة خروجك قبل أي عيد قادم.. هانت وخلاص ع وشك الحرية! 🏁
                  </p>
                </>
              ) : hasMatch ? (
                <>
                  <p style={{ fontSize: 16, fontWeight: 800, color: '#FFD700', lineHeight: 1.6 }}>
                    أيوه! هتحضر {result.matches.length === 1 ? 'عيد قادم' : `${result.matches.length} أعياد قادمة`} في الإجازة 🎉
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--c-text3)', marginTop: 4 }}>
                    مبروك! الإجازة متوافقة مع أيام العيد.
                  </p>
                </>
              ) : (
                <>
                  <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--c-text2)', lineHeight: 1.6 }}>
                    للأسف مفيش عيد قادم هيقع في إجازتك 😮‍💨
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--c-text3)', marginTop: 4 }}>
                    الأعياد القادمة هتكون في أيام خدمتك بالوحدة، لكن الصبر قرب ينتهي وهانت!
                  </p>
                </>
              )}
            </div>

            {/* Upcoming Matches */}
            {result.matches.length > 0 && (
              <Section title="الأعياد القادمة اللي هتحضرها 🎉" color="#FFD700">
                {result.matches.map((m: EidMatch, i: number) => (
                  <EidRow
                    key={i}
                    emoji={m.eid.emoji}
                    name={m.eid.name}
                    detail={`${fmtDate(new Date(m.eid.start))} — ${fmtDate(new Date(m.eid.end))}`}
                    sub={`وقت إجازتك: ${fmtDate(m.vacStart)} → ${fmtDate(m.vacEnd)}`}
                    tag="في الإجازة 🎉"
                    highlight
                  />
                ))}
              </Section>
            )}

            {/* Upcoming Missed */}
            {result.missed.length > 0 && (
              <Section title="أعياد قادمة هتكون في الخدمة 🪖" color="var(--c-text3)">
                {result.missed.map((e: EidEntry, i: number) => (
                  <EidRow
                    key={i}
                    emoji={e.emoji}
                    name={e.name}
                    detail={`${fmtDate(new Date(e.start))} — ${fmtDate(new Date(e.end))}`}
                    tag="في الخدمة"
                    highlight={false}
                  />
                ))}
              </Section>
            )}

            {/* Past Eids Section (Collapsible) */}
            {result.past.length > 0 && (
              <div style={{ marginTop: 14, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setShowPast((p) => !p)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--c-text3)',
                    fontSize: 12,
                    cursor: 'pointer',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 4px',
                    fontFamily: 'inherit',
                  }}
                >
                  <span>⏳ أعياد فاتت بالفعل خلال مدة خدمتك ({result.past.length})</span>
                  <span>{showPast ? '▲' : '▼'}</span>
                </button>

                {showPast && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                    {result.past.map((p: EidPastItem, idx: number) => (
                      <div
                        key={idx}
                        style={{
                          borderRadius: 10,
                          padding: '10px 12px',
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid rgba(255,255,255,0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          opacity: 0.75,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 18 }}>{p.eid.emoji}</span>
                          <div>
                            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-text2)' }}>
                              {p.eid.name}
                            </p>
                            <p style={{ fontSize: 10, color: 'var(--c-text3)' }}>
                              {fmtDate(new Date(p.eid.start))}
                            </p>
                          </div>
                        </div>
                        <span
                          style={{
                            fontSize: 11,
                            padding: '3px 8px',
                            borderRadius: 6,
                            background: p.wasOnVac ? 'rgba(255,215,0,0.12)' : 'rgba(255,255,255,0.06)',
                            color: p.wasOnVac ? '#FFD700' : 'var(--c-text3)',
                          }}
                        >
                          {p.wasOnVac ? 'قضيته إجازة ✅' : 'كنت في الخدمة 🪖'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <p style={{ fontSize: 10, color: 'rgba(255,215,0,0.3)', textAlign: 'center', marginTop: 14, lineHeight: 1.6 }}>
              * الحساب يراعي فقط الأعياد القادمة من تاريخ اليوم حتى تاريخ خروجك • التواريخ وفق التقويم الهجري المتوقع
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes eidPulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(255,215,0,0.35), 0 6px 24px rgba(255,215,0,0.45); transform: scale(1); }
          50%       { box-shadow: 0 0 0 7px rgba(255,215,0,0.15), 0 8px 32px rgba(255,215,0,0.6); transform: scale(1.07); }
        }
      `}</style>
    </>
  );
}

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <p style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 8 }}>{title}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>
    </div>
  );
}

function EidRow({
  emoji, name, detail, sub, tag, highlight,
}: {
  emoji: string; name: string; detail: string; sub?: string; tag: string; highlight: boolean;
}) {
  return (
    <div
      style={{
        borderRadius: 12,
        padding: '12px 14px',
        background: highlight ? 'rgba(255,215,0,0.07)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${highlight ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.06)'}`,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <span style={{ fontSize: 22, flexShrink: 0 }}>{emoji}</span>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: highlight ? '#FFD700' : 'var(--c-text2)', marginBottom: 3 }}>
            {name}
          </p>
          <p style={{ fontSize: 11, color: 'var(--c-text3)' }}>{detail}</p>
          {sub && <p style={{ fontSize: 10, color: 'rgba(255,215,0,0.5)', marginTop: 4 }}>{sub}</p>}
        </div>
      </div>
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          padding: '3px 8px',
          borderRadius: 6,
          flexShrink: 0,
          background: highlight ? 'rgba(255,215,0,0.18)' : 'rgba(255,255,255,0.06)',
          color: highlight ? '#FFD700' : 'var(--c-text3)',
        }}
      >
        {tag}
      </span>
    </div>
  );
}
