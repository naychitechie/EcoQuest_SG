'use client';

import { useState } from 'react';
import {
  AppPreferences,
  AppTheme,
  applyDocumentTheme,
  resolveTheme,
} from '@/lib/appPreferences';

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`w-10 h-5 rounded-full p-0.5 transition-colors flex items-center shrink-0 ${
        enabled ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'
      }`}
    >
      <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
    </button>
  );
}

function SettingsRow({
  label,
  sublabel,
  children,
}: {
  label: string;
  sublabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 gap-3">
      <div className="min-w-0 flex-1">
        <div className="text-sm text-white">{label}</div>
        {sublabel && <div className="text-[11px] text-slate-400 mt-0.5">{sublabel}</div>}
      </div>
      {children}
    </div>
  );
}

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
      <div className="px-4 py-2.5 text-[10px] uppercase tracking-wider font-semibold text-slate-400 border-b border-slate-800">
        {title}
      </div>
      <div className="px-4 divide-y divide-slate-800">{children}</div>
    </div>
  );
}

interface SettingsPageProps {
  preferences: AppPreferences;
  onPreferencesChange: (next: AppPreferences) => void;
}

export default function SettingsPage({ preferences, onPreferencesChange }: SettingsPageProps) {
  const { theme, ecoPrecision } = preferences;
  const [focusHoursStart, setFocusHoursStart] = useState('23:00');
  const [focusHoursEnd, setFocusHoursEnd] = useState('07:00');
  const [ltaAlertSync, setLtaAlertSync] = useState(true);
  const [transportGoal, setTransportGoal] = useState(70);
  const [dietGoal, setDietGoal] = useState(45);
  const [energyGoal, setEnergyGoal] = useState(55);

  const handleThemeChange = (newTheme: AppTheme) => {
    const next = { ...preferences, theme: newTheme };
    onPreferencesChange(next);
    applyDocumentTheme(resolveTheme(newTheme));
  };

  const handleEcoPrecisionChange = (enabled: boolean) => {
    onPreferencesChange({ ...preferences, ecoPrecision: enabled });
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden pb-4">
      <div className="mb-4">
        <h1 className="text-base font-bold text-white">Settings</h1>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Localized sustainability preferences for EcoQuest SG.
        </p>
      </div>

      <div className="space-y-3">
        <SettingsSection title="Appearance">
          <div className="py-2.5">
            <div className="text-[11px] text-slate-400 mb-2">Theme Selection</div>
            <div className="grid grid-cols-3 gap-1.5">
              {(
                [
                  { key: 'light' as const, label: 'Light', icon: 'light_mode' },
                  { key: 'dark' as const, label: 'Dark', icon: 'dark_mode' },
                  { key: 'auto' as const, label: 'Auto', icon: 'settings_brightness' },
                ] as const
              ).map((t) => (
                <button
                  key={t.key}
                  type="button"
                  aria-pressed={theme === t.key}
                  onClick={() => handleThemeChange(t.key)}
                  className={`flex flex-col items-center py-2 rounded-lg border text-[10px] font-semibold transition-all ${
                    theme === t.key
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px] mb-0.5">{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <SettingsRow
            label="Eco-Precision Mode"
            sublabel={
              ecoPrecision
                ? 'Compact high-density layout active'
                : 'Comfortable spacing for route comparisons'
            }
          >
            <Toggle enabled={ecoPrecision} onChange={handleEcoPrecisionChange} />
          </SettingsRow>
        </SettingsSection>

        <SettingsSection title="Nudge & Agent Tuning">
          <SettingsRow label="Focus Hours" sublabel="Silence agent notifications during sleep">
            <div className="flex items-center gap-1 shrink-0">
              <input
                type="time"
                value={focusHoursStart}
                onChange={(e) => setFocusHoursStart(e.target.value)}
                className="py-1 px-1.5 text-[11px] bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
              <span className="text-slate-500 text-[10px]">–</span>
              <input
                type="time"
                value={focusHoursEnd}
                onChange={(e) => setFocusHoursEnd(e.target.value)}
                className="py-1 px-1.5 text-[11px] bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
          </SettingsRow>
          <SettingsRow
            label="LTA Service Alert Sync"
            sublabel="Allow agent to suggest alternative green routes during train delays"
          >
            <Toggle enabled={ltaAlertSync} onChange={setLtaAlertSync} />
          </SettingsRow>
        </SettingsSection>

        <SettingsSection title="Infrastructure Links">
          <div className="py-2.5">
            <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-3 min-w-0">
                <span className="material-symbols-outlined text-[20px] text-emerald-400 shrink-0">
                  contactless
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white">EZ-Link / SimplyGo Smart Sync</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Ready for Account CEPAS integration
                  </div>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Ready" />
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Eco-Goal Calibration">
          <div className="py-2.5 space-y-3">
            {[
              { label: 'Transport Share Goals', value: transportGoal, setter: setTransportGoal },
              { label: 'Dietary Carbon Reduction', value: dietGoal, setter: setDietGoal },
              { label: 'Home Energy Savings', value: energyGoal, setter: setEnergyGoal },
            ].map((slider) => (
              <div key={slider.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-white">{slider.label}</span>
                  <span className="text-xs text-emerald-400 font-semibold">{slider.value}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={slider.value}
                  onChange={(e) => slider.setter(Number(e.target.value))}
                  className="w-full h-1.5 accent-emerald-500"
                />
              </div>
            ))}
          </div>
        </SettingsSection>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800 text-center">
        <div className="text-[9px] uppercase tracking-widest font-bold text-slate-600">
          EcoQuest SG · v2.4.1
        </div>
      </div>
    </div>
  );
}
