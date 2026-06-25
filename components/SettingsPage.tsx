'use client';

import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [twoFactor, setTwoFactor] = useState(false);
  const [ecoPrecision, setEcoPrecision] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');

  // Load theme from document classList on mount
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (document.documentElement.classList.contains('dark')) {
        setTheme('dark');
      } else {
        setTheme('light');
      }
    }
  }, []);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
    setTheme(newTheme);
    if (typeof document !== 'undefined') {
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (newTheme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        // Auto: check media query
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (systemPrefersDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-headline-lg" style={{ color: 'var(--eco-on-surface)' }}>
          Settings
        </h1>
        <p className="text-body-md mt-1" style={{ color: 'var(--eco-on-surface-variant)' }}>
          Configure your personal preferences and account security.
        </p>
      </div>

      <div className="space-y-4">
        {/* ── Account Security Card ────────────────────────────────────── */}
        <div className="eco-card flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--eco-accent-indigo-bg)', color: 'var(--eco-accent-indigo-text)' }}>
              <span className="material-symbols-outlined text-[22px]">shield</span>
            </div>
            <div>
              <h3 className="text-[15px] font-bold font-heading" style={{ color: 'var(--eco-on-surface)' }}>
                Account Security
              </h3>
              <p className="text-[12px]" style={{ color: 'var(--eco-on-surface-variant)' }}>
                Protect your commuter data and credentials
              </p>
            </div>
          </div>

          <div className="space-y-3" style={{ borderTop: '0.5px solid var(--eco-outline-variant)', paddingTop: '16px' }}>
            {/* Change Password Row */}
            <div className="flex items-center justify-between p-3 rounded-xl border bg-[var(--eco-surface-container-low)]" style={{ borderColor: 'var(--eco-outline-variant)' }}>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]" style={{ color: 'var(--eco-on-surface-variant)' }}>
                  lock
                </span>
                <div>
                  <div className="text-[13px] font-semibold" style={{ color: 'var(--eco-on-surface)' }}>
                    Change Password
                  </div>
                  <div className="text-[11px] mt-0.5" style={{ color: 'var(--eco-on-surface-variant)' }}>
                    Last updated 3 months ago
                  </div>
                </div>
              </div>
              <button 
                onClick={() => alert('Password update form coming soon!')}
                className="text-label-caps text-[10px] px-4 py-2 rounded-lg font-bold transition-all"
                style={{ background: 'var(--eco-primary)', color: 'var(--eco-on-primary)' }}
              >
                UPDATE PASSWORD
              </button>
            </div>

            {/* Two Factor Row */}
            <div className="flex items-center justify-between p-3 rounded-xl border bg-[var(--eco-surface-container-low)]" style={{ borderColor: 'var(--eco-outline-variant)' }}>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]" style={{ color: 'var(--eco-on-surface-variant)' }}>
                  security_update_good
                </span>
                <div>
                  <div className="text-[13px] font-semibold" style={{ color: 'var(--eco-on-surface)' }}>
                    Two-Factor Authentication
                  </div>
                  <div className="text-[11px] mt-0.5" style={{ color: 'var(--eco-on-surface-variant)' }}>
                    Highly recommended for data security
                  </div>
                </div>
              </div>
              
              {/* Toggle Switch */}
              <button
                onClick={() => setTwoFactor(!twoFactor)}
                className="w-12 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none flex items-center"
                style={{
                  background: twoFactor ? 'var(--eco-primary)' : 'var(--eco-outline-variant)',
                  justifyContent: twoFactor ? 'flex-end' : 'flex-start',
                }}
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Appearance & Density Row (2-column layout on desktop) ───── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Column 1: Appearance */}
          <div className="eco-card flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--eco-warning-amber-bg)', color: 'var(--eco-warning-amber-text)' }}>
                <span className="material-symbols-outlined text-[22px]">palette</span>
              </div>
              <div>
                <h3 className="text-[15px] font-bold font-heading" style={{ color: 'var(--eco-on-surface)' }}>
                  Appearance
                </h3>
                <p className="text-[12px]" style={{ color: 'var(--eco-on-surface-variant)' }}>
                  Customize your visual interface
                </p>
              </div>
            </div>

            <div className="flex-1" style={{ borderTop: '0.5px solid var(--eco-outline-variant)', paddingTop: '16px' }}>
              <div className="text-label-caps text-[10px] mb-3" style={{ color: 'var(--eco-on-surface-variant)' }}>
                THEME SELECTION
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'light' as const, label: 'LIGHT', icon: 'light_mode' },
                  { key: 'dark' as const, label: 'DARK', icon: 'dark_mode' },
                  { key: 'auto' as const, label: 'AUTO', icon: 'settings_brightness' },
                ].map((t) => {
                  const isActive = theme === t.key;
                  let btnBg = 'var(--eco-surface-container-low)';
                  let btnBorder = '0.5px solid var(--eco-outline-variant)';
                  let iconColor = 'var(--eco-on-surface-variant)';
                  let textColor = 'var(--eco-on-surface-variant)';

                  if (isActive) {
                    if (t.key === 'dark') {
                      btnBg = '#30312c';
                      iconColor = '#ffffff';
                      textColor = '#ffffff';
                      btnBorder = '0.5px solid #30312c';
                    } else if (t.key === 'light') {
                      btnBg = '#ffffff';
                      iconColor = 'var(--eco-primary)';
                      textColor = 'var(--eco-on-surface)';
                      btnBorder = '1.5px solid var(--eco-primary)';
                    } else {
                      btnBg = 'var(--eco-surface-container-high)';
                      iconColor = 'var(--eco-primary)';
                      textColor = 'var(--eco-on-surface)';
                      btnBorder = '1.5px solid var(--eco-primary)';
                    }
                  }

                  return (
                    <button
                      key={t.key}
                      onClick={() => handleThemeChange(t.key)}
                      className="flex flex-col items-center justify-center py-3.5 px-2 rounded-xl transition-all border"
                      style={{
                        background: btnBg,
                        border: btnBorder,
                      }}
                    >
                      <span className="material-symbols-outlined text-[20px] mb-1.5" style={{ color: iconColor }}>
                        {t.icon}
                      </span>
                      <span className="text-label-caps text-[10px] font-bold" style={{ color: textColor }}>
                        {t.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Column 2: Display Density */}
          <div className="eco-card flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--eco-info-blue-bg)', color: 'var(--eco-info-blue-text)' }}>
                <span className="material-symbols-outlined text-[22px]">density_medium</span>
              </div>
              <div>
                <h3 className="text-[15px] font-bold font-heading" style={{ color: 'var(--eco-on-surface)' }}>
                  Display Density
                </h3>
                <p className="text-[12px]" style={{ color: 'var(--eco-on-surface-variant)' }}>
                  Optimize information layout
                </p>
              </div>
            </div>

            <div className="flex-1" style={{ borderTop: '0.5px solid var(--eco-outline-variant)', paddingTop: '16px' }}>
              <div className="text-label-caps text-[10px] mb-3" style={{ color: 'var(--eco-on-surface-variant)' }}>
                PRECISION VIEW
              </div>

              <div className="p-3.5 rounded-xl border bg-[var(--eco-surface-container-low)]" style={{ borderColor: 'var(--eco-outline-variant)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] font-bold" style={{ color: 'var(--eco-on-surface)' }}>
                    Eco-Precision Mode
                  </span>
                  
                  {/* Toggle Switch */}
                  <button
                    onClick={() => setEcoPrecision(!ecoPrecision)}
                    className="w-12 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none flex items-center"
                    style={{
                      background: ecoPrecision ? 'var(--eco-primary)' : 'var(--eco-outline-variant)',
                      justifyContent: ecoPrecision ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div className="w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200" />
                  </button>
                </div>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--eco-on-surface-variant)' }}>
                  High-density layout enabled. This optimizes route comparisons and carbon metrics for expert analysis.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Data Privacy Card ───────────────────────────────────────── */}
        <button 
          onClick={() => alert('Privacy configuration panel coming soon!')}
          className="eco-card w-full flex items-center justify-between text-left transition-all hover:bg-[var(--eco-surface-container-low)] cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--eco-success-mint-bg)', color: 'var(--eco-success-mint-text)' }}>
              <span className="material-symbols-outlined text-[22px]">visibility</span>
            </div>
            <div>
              <h3 className="text-[15px] font-bold font-heading" style={{ color: 'var(--eco-on-surface)' }}>
                Data Privacy
              </h3>
              <p className="text-[12px]" style={{ color: 'var(--eco-on-surface-variant)' }}>
                Control how your transit data is analyzed
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[22px]" style={{ color: 'var(--eco-on-surface-variant)' }}>
            chevron_right
          </span>
        </button>
      </div>

      {/* ── Settings Footer ─────────────────────────────────────────── */}
      <div className="mt-12 mb-4 pt-6 text-center" style={{ borderTop: '0.5px solid var(--eco-outline-variant)' }}>
        <div className="text-label-caps text-[9px] tracking-widest font-bold" style={{ color: 'var(--eco-outline)' }}>
          VERSION 2.4.1-STABLE
        </div>
        <div className="flex items-center justify-center gap-6 mt-4 text-[12px] font-semibold">
          <a href="#" className="hover:underline" style={{ color: 'var(--eco-secondary)' }}>Privacy Policy</a>
          <a href="#" className="hover:underline" style={{ color: 'var(--eco-secondary)' }}>Terms of Service</a>
          <a href="#" className="hover:underline" style={{ color: 'var(--eco-secondary)' }}>Carbon Methodology</a>
        </div>
      </div>
    </div>
  );
}
