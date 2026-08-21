'use client';

import { useState } from 'react';
import { useSettings } from '../hooks/useSettings';
import { Settings } from '../lib/stats';

interface Props {
  onClose: () => void;
  onSave: () => void;
}

export default function SettingsModal({ onClose, onSave }: Props) {
  const { settings, updateSettings } = useSettings();

  const [form, setForm] = useState<Settings>({ ...settings });
  const [showFixVac, setShowFixVac] = useState(false);
  const [fixVacDate, setFixVacDate] = useState(settings.nextVacDate || '');

  function set<K extends keyof Settings>(key: K, value: Settings[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    updateSettings(form);
    onSave();
    onClose();
  }

  function applyFixVac() {
    if (!fixVacDate) { showToast('اختار تاريخ الأول!'); return; }
    setForm((prev) => ({ ...prev, nextVacDate: fixVacDate }));
    setShowFixVac(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      style={{ background: 'rgba(0,0,0,0.75)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="modal-box"
        style={{
          background: 'var(--c-army2)',
          border: '1px solid rgba(255,215,0,0.25)',
          borderRadius: 20,
          padding: '24px 20px 20px',
          width: '100%',
          maxWidth: 420,
          maxHeight: '85vh',
          overflowY: 'auto',
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

        <h2 className="text-center font-bold mb-5" style={{ fontSize: 15, color: '#FFD700' }}>
          ⚙️ ضبط بياناتك
        </h2>

        <Field label="📅 أول يوم تجنيد">
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => set('startDate', e.target.value)}
          />
        </Field>

        <Field label="🏁 تاريخ الحرية">
          <input
            type="date"
            value={form.endDate}
            onChange={(e) => set('endDate', e.target.value)}
          />
        </Field>

        <Field label="⏱️ مدة العمالة (أيام)">
          <input
            type="number"
            min={1} max={60}
            value={form.amalahDays}
            onChange={(e) => set('amalahDays', parseInt(e.target.value) || 20)}
          />
        </Field>

        <Field label="🏖️ مدة الإجازة (أيام)">
          <input
            type="number"
            min={1} max={30}
            value={form.vacDays}
            onChange={(e) => set('vacDays', parseInt(e.target.value) || 10)}
          />
        </Field>

        <Field label="🔢 دورك في الإجازة">
          <select
            value={form.vacTurn}
            onChange={(e) => set('vacTurn', parseInt(e.target.value) as 1 | 2 | 3)}
          >
            <option value={1}>الدور الأول</option>
            <option value={2}>الدور التاني</option>
            <option value={3}>الدور التالت</option>
          </select>
        </Field>

        {/* Fix-vac panel */}
        <div style={{ marginBottom: 16 }}>
          <span
            onClick={() => setShowFixVac((p) => !p)}
            style={{ fontSize: 12, color: 'var(--c-text3)', textDecoration: 'underline', cursor: 'pointer' }}
          >
            يوم إجازتك غلط؟ صححه من هنا
          </span>
          {showFixVac && (
            <div style={{ marginTop: 10 }}>
              <input
                type="date"
                value={fixVacDate}
                onChange={(e) => setFixVacDate(e.target.value)}
                style={inputStyle}
              />
              <button onClick={applyFixVac} style={fixBtnStyle}>
                ✅ تطبيق
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleSave}
          style={{
            width: '100%', padding: 12,
            background: 'linear-gradient(135deg,#B8860B,#FFD700)',
            border: 'none', borderRadius: 10,
            color: '#0a1a0a', fontFamily: 'Cairo,sans-serif',
            fontSize: 14, fontWeight: 700, cursor: 'pointer',
          }}
        >
          💾 حفظ الإعدادات
        </button>
      </div>
    </div>
  );
}

/* ── small helper components ── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 12, color: 'var(--c-text3)', marginBottom: 6 }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--c-bg3)',
  border: '1px solid rgba(255,215,0,0.15)',
  borderRadius: 8,
  padding: '10px 12px',
  color: 'var(--c-text)',
  fontFamily: 'Cairo,sans-serif',
  fontSize: 14,
  outline: 'none',
};

const fixBtnStyle: React.CSSProperties = {
  marginTop: 8,
  width: '100%',
  padding: 10,
  background: 'rgba(255,215,0,0.12)',
  border: '1px solid rgba(255,215,0,0.25)',
  borderRadius: 8,
  color: '#FFD700',
  fontFamily: 'Cairo,sans-serif',
  fontSize: 13,
  fontWeight: 700,
  cursor: 'pointer',
};

/* ── global input styles injected via globals.css ── */
function showToast(msg: string) {
  if (typeof window === 'undefined') return;
  const t = document.createElement('div');
  t.textContent = msg;
  Object.assign(t.style, {
    position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
    background: 'rgba(255,215,0,0.9)', color: '#0a1a0a', padding: '10px 20px',
    borderRadius: '20px', fontFamily: 'Cairo', fontWeight: '700', fontSize: '14px',
    zIndex: '9999', transition: 'opacity 0.5s',
  });
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 500); }, 2000);
}