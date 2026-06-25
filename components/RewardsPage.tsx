'use client';

import { useState } from 'react';

// ── Mock Data ────────────────────────────────────────────────────────────────
const BADGES = [
  { icon: 'park', label: 'TREE PLANTER', earned: true, color: 'var(--eco-tertiary)', bgColor: 'var(--eco-tertiary-container)' },
  { icon: 'pedal_bike', label: 'PEDAL POWER', earned: true, color: 'var(--eco-secondary)', bgColor: 'var(--eco-secondary-fixed-dim)' },
  { icon: 'bolt', label: 'GRID SAVER', earned: false, color: 'var(--eco-outline)', bgColor: 'var(--eco-surface-container)' },
  { icon: 'directions_transit', label: 'MRT MASTER', earned: true, color: 'var(--eco-primary)', bgColor: 'var(--eco-success-mint-bg)' },
  { icon: 'groups', label: 'CARPOOL HERO', earned: false, color: 'var(--eco-outline)', bgColor: 'var(--eco-surface-container)' },
  { icon: 'add', label: '', earned: false, color: 'var(--eco-outline)', bgColor: 'transparent' },
];

const REWARDS = [
  {
    icon: 'credit_card',
    title: '$5 EZ-Link Top-up',
    desc: 'Direct credit to your transit card.',
    points: 500,
    tag: 'SAVER',
    bgColorClass: 'pattern-dots-blue',
    iconColor: '#3C3489',
    locked: false,
  },
  {
    icon: 'local_cafe',
    title: 'Eco-Cafe Voucher',
    desc: 'Buy 1 Get 1 Free coffee/tea.',
    points: 350,
    tag: null,
    bgColorClass: 'pattern-dots-peach',
    iconColor: '#812800',
    locked: false,
  },
  {
    icon: 'attractions',
    title: 'Gardens by the Bay Entry',
    desc: 'Single entry ticket for Cloud Forest.',
    points: 2500,
    tag: null,
    bgColorClass: 'pattern-dots-mint',
    iconColor: '#085041',
    locked: false,
  },
  {
    icon: 'mystery',
    title: 'Mystery Box',
    desc: 'Unlocked at Level 15',
    points: 0,
    tag: null,
    bgColorClass: 'pattern-dots-grey',
    iconColor: '#727969',
    locked: true,
  },
];

const ACTIVITY = [
  {
    icon: 'add_circle',
    iconBg: '#E1F5EE',
    iconColor: '#085041',
    title: 'Milestone: 5,000 Daily Steps',
    date: 'Today, 2:14 PM',
    points: '+50 Green Points',
    pointsColor: '#085041',
  },
  {
    icon: 'redeem',
    iconBg: '#FAEEDA',
    iconColor: '#633806',
    title: 'Reward Redemption: $5 EZ-Link',
    date: 'Yesterday, 6:45 PM',
    points: '-500 Green Points',
    pointsColor: '#ba1a1a',
  },
  {
    icon: 'eco',
    iconBg: '#E1F5EE',
    iconColor: '#085041',
    title: 'Public Transport Bonus: MRT Trip',
    date: '12 Oct 2023, 8:30 AM',
    points: '+12 Green Points',
    pointsColor: '#085041',
  },
];

// ── Component ────────────────────────────────────────────────────────────────
export default function RewardsPage() {
  const [rewardFilter, setRewardFilter] = useState<'ALL' | 'TRANSIT' | 'LIFESTYLE'>('ALL');

  // Mock values
  const totalPoints = 12480;
  const currentLevel = 'Oak Tier';
  const dailySteps = 7420;
  const dailyStepGoal = 10000;
  const stepsToBonus = 2580;

  return (
    <div className="w-full">
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-headline-lg" style={{ color: 'var(--eco-on-surface)' }}>
            Rewards &amp; Milestones
          </h1>
          <p className="text-body-md mt-1" style={{ color: 'var(--eco-on-surface-variant)' }}>
            Good morning! Start your day with some green miles.
          </p>
        </div>

        {/* Points & Level Badge */}
        <div
          className="flex items-center gap-4 rounded-xl px-5 py-3 shrink-0"
          style={{ background: 'var(--eco-primary-container)' }}
        >
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-[28px]"
              style={{ color: 'var(--eco-on-primary-container)', fontVariationSettings: "'FILL' 1" }}
            >
              stars
            </span>
            <div>
              <div className="text-label-caps text-[9px]" style={{ color: 'var(--eco-on-primary-container)', opacity: 0.8 }}>
                TOTAL GREEN POINTS
              </div>
              <div className="text-[24px] font-bold font-heading" style={{ color: 'var(--eco-on-primary-container)' }}>
                {totalPoints.toLocaleString()}
              </div>
            </div>
          </div>
          <div
            className="h-10 w-px"
            style={{ background: 'var(--eco-on-primary-container)', opacity: 0.2 }}
          />
          <div>
            <div className="text-label-caps text-[9px]" style={{ color: 'var(--eco-on-primary-container)', opacity: 0.8 }}>
              LEVEL
            </div>
            <div className="text-[18px] font-bold font-heading" style={{ color: 'var(--eco-on-primary-container)' }}>
              {currentLevel}
            </div>
          </div>
        </div>
      </div>

      {/* ── Daily Steps + Badges Row ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Daily Step Milestones */}
        <div className="lg:col-span-2 eco-card flex flex-col justify-between">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-[16px] font-semibold font-heading" style={{ color: 'var(--eco-on-surface)' }}>
                Daily Step Milestones
              </h3>
              <p className="text-body-md mt-0.5" style={{ color: 'var(--eco-on-surface-variant)' }}>
                Keep walking to earn extra Green Points today.
              </p>
            </div>
            <div className="text-right">
              <span className="text-[24px] font-bold font-heading" style={{ color: 'var(--eco-on-surface)' }}>
                {dailySteps.toLocaleString()}
              </span>
              <span className="text-body-md ml-1" style={{ color: 'var(--eco-on-surface-variant)' }}>
                / {dailyStepGoal.toLocaleString()} steps
              </span>
            </div>
          </div>

          {/* Progress bar container */}
          <div className="relative mb-6 pt-6 pb-4">
            {/* Progress track */}
            <div
              className="w-full h-2 rounded-full relative"
              style={{ background: 'var(--eco-surface-container-highest)' }}
            >
              {/* Fill */}
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(100, (dailySteps / dailyStepGoal) * 100)}%`,
                  background: 'var(--eco-primary)',
                }}
              />

              {/* Dot marker for 5,000 steps (50%) */}
              <div
                className="absolute top-1/2 left-[50%] -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 bg-white flex items-center justify-center transition-colors"
                style={{
                  borderColor: dailySteps >= 5000 ? 'var(--eco-primary)' : 'var(--eco-outline-variant)',
                }}
              >
                <div 
                  className="w-1.5 h-1.5 rounded-full" 
                  style={{ background: dailySteps >= 5000 ? 'var(--eco-primary)' : 'var(--eco-outline-variant)' }}
                />
              </div>

              {/* Dot marker for 10,000 steps (100%) */}
              <div
                className="absolute top-1/2 left-[100%] -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 bg-white flex items-center justify-center transition-colors"
                style={{
                  borderColor: dailySteps >= 10000 ? 'var(--eco-primary)' : 'var(--eco-outline-variant)',
                }}
              >
                <div 
                  className="w-1.5 h-1.5 rounded-full" 
                  style={{ background: dailySteps >= 10000 ? 'var(--eco-primary)' : 'var(--eco-outline-variant)' }}
                />
              </div>
            </div>

            {/* Labels under the bar */}
            <div className="flex justify-between mt-3 text-[11px] relative">
              <span className="text-label-caps text-[9px] font-bold" style={{ color: 'var(--eco-on-surface-variant)' }}>
                START
              </span>
              
              {/* 5,000 steps label (centered) */}
              <div className="text-center absolute left-[50%] -translate-x-1/2 flex flex-col items-center">
                <span className="text-label-caps text-[9px] font-bold" style={{ color: 'var(--eco-on-surface)' }}>
                  5,000 STEPS
                </span>
                <span className="text-[9px] font-semibold mt-0.5" style={{ color: 'var(--eco-primary)' }}>
                  +50 PTS
                </span>
                {dailySteps >= 5000 && (
                  <span className="material-symbols-outlined text-[14px] mt-0.5" style={{ color: 'var(--eco-primary)', fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                )}
              </div>

              {/* 10,000 steps label (right aligned) */}
              <div className="text-right flex flex-col items-end">
                <span className="text-label-caps text-[9px] font-bold" style={{ color: 'var(--eco-on-surface-variant)' }}>
                  10,000 STEPS
                </span>
                <span className="text-[9px] font-semibold mt-0.5" style={{ color: 'var(--eco-primary)' }}>
                  +150 PTS
                </span>
              </div>
            </div>
          </div>

          {/* Info banner */}
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-2 mt-auto"
            style={{ background: 'var(--eco-info-blue-bg)' }}
          >
            <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--eco-info-blue-text)' }}>
              info
            </span>
            <span className="text-[12px]" style={{ color: 'var(--eco-info-blue-text)' }}>
              You are {stepsToBonus.toLocaleString()} steps away from your next 150 Green Points bonus!
            </span>
          </div>
        </div>

        {/* Earned Badges */}
        <div className="lg:col-span-1 eco-card">
          <h3 className="text-[16px] font-semibold font-heading mb-4" style={{ color: 'var(--eco-on-surface)' }}>
            Earned Badges
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {BADGES.map((badge, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-1.5 transition-all"
                  style={{
                    background: badge.bgColor,
                    border: badge.icon === 'add' ? '1.5px dashed var(--eco-outline-variant)' : 'none',
                  }}
                >
                  <span
                    className="material-symbols-outlined text-[24px]"
                    style={{
                      color: badge.color,
                      fontVariationSettings: badge.earned ? "'FILL' 1" : "'FILL' 0",
                    }}
                  >
                    {badge.icon}
                  </span>
                </div>
                {badge.label && (
                  <span className="text-label-caps text-[8px] font-bold mt-1" style={{ color: 'var(--eco-on-surface-variant)' }}>
                    {badge.label}
                  </span>
                )}
              </div>
            ))}
          </div>
          <button
            className="w-full mt-4 text-label-caps text-[10px] flex items-center justify-center gap-1 py-2 rounded-lg transition-colors font-bold"
            style={{ color: 'var(--eco-primary)' }}
          >
            VIEW ALL ACHIEVEMENTS
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* ── Featured Rewards ─────────────────────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-headline-sm" style={{ color: 'var(--eco-on-surface)' }}>
            Featured Rewards
          </h2>
          <div className="flex gap-1">
            {(['ALL', 'TRANSIT', 'LIFESTYLE'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setRewardFilter(filter)}
                className="px-3 py-1.5 rounded-lg text-label-caps text-[10px] transition-all duration-200 font-bold"
                style={{
                  background: rewardFilter === filter ? 'var(--eco-on-surface)' : 'transparent',
                  color: rewardFilter === filter ? 'var(--eco-surface)' : 'var(--eco-on-surface-variant)',
                  border: rewardFilter === filter ? 'none' : '0.5px solid var(--eco-outline-variant)',
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {REWARDS.map((reward, i) => (
            <div
              key={i}
              className="eco-card overflow-hidden flex flex-col"
              style={{ padding: 0 }}
            >
              {/* Colored header area */}
              <div
                className={`relative flex items-center justify-center py-8 ${reward.bgColorClass}`}
              >
                <span
                  className="material-symbols-outlined text-[40px]"
                  style={{ color: reward.iconColor, opacity: reward.locked ? 0.4 : 0.7 }}
                >
                  {reward.icon === 'mystery' ? 'help' : reward.icon}
                </span>
                {reward.tag && (
                  <span
                    className="absolute bottom-2 right-2 text-label-caps text-[9px] px-2 py-0.5 rounded font-bold"
                    style={{
                      background: 'var(--eco-primary)',
                      color: 'var(--eco-on-primary)',
                    }}
                  >
                    {reward.tag}
                  </span>
                )}
              </div>
              {/* Details */}
              <div className="p-4 flex flex-col flex-1">
                <h4
                  className="text-[14px] font-semibold font-heading mb-0.5"
                  style={{ color: 'var(--eco-on-surface)' }}
                >
                  {reward.title}
                </h4>
                <p className="text-[11px] mb-3 flex-1" style={{ color: 'var(--eco-on-surface-variant)' }}>
                  {reward.desc}
                </p>
                <div className="flex items-center justify-between">
                  {!reward.locked && (
                    <span className="text-data-value text-[13px]" style={{ color: 'var(--eco-primary)' }}>
                      {reward.points.toLocaleString()} pts
                    </span>
                  )}
                  <button
                    className="text-label-caps text-[10px] px-3 py-1.5 rounded-lg transition-all duration-200 font-bold"
                    style={{
                      background: reward.locked ? 'var(--eco-surface-container)' : 'var(--eco-primary)',
                      color: reward.locked ? 'var(--eco-on-surface-variant)' : 'var(--eco-on-primary)',
                      cursor: reward.locked ? 'not-allowed' : 'pointer',
                      marginLeft: reward.locked ? 'auto' : '0',
                    }}
                    disabled={reward.locked}
                  >
                    {reward.locked ? 'LOCKED' : 'REDEEM'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recent Activity ──────────────────────────────────────────── */}
      <div className="eco-card">
        <h3 className="text-[16px] font-semibold font-heading mb-4" style={{ color: 'var(--eco-on-surface)' }}>
          Recent Activity
        </h3>
        <div className="space-y-1">
          {ACTIVITY.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-3 px-3 rounded-xl"
              style={{
                borderBottom: i < ACTIVITY.length - 1 ? '0.5px solid var(--eco-outline-variant)' : 'none',
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: item.iconBg }}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ color: item.iconColor }}
                >
                  {item.icon}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-data-value text-[13px]" style={{ color: 'var(--eco-on-surface)' }}>
                  {item.title}
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: 'var(--eco-on-surface-variant)' }}>
                  {item.date}
                </div>
              </div>
              <span
                className="text-data-value text-[12px] shrink-0"
                style={{ color: item.pointsColor }}
              >
                {item.points}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
