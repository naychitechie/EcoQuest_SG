'use client';

import { useState } from 'react';

// ── Mock Data ────────────────────────────────────────────────────────────────
const BADGES = [
  { icon: 'park', label: 'TREE PLANTER', earned: true, color: '#275300' },
  { icon: 'pedal_bike', label: 'PEDAL POWER', earned: true, color: '#275300' },
  { icon: 'bolt', label: 'GRID SAVER', earned: true, color: '#275300' },
  { icon: 'directions_transit', label: 'MRT MASTER', earned: true, color: '#275300' },
  { icon: 'groups', label: 'CARPOOL HERO', earned: true, color: '#275300' },
  { icon: 'add', label: '', earned: false, color: '' },
];

const REWARDS = [
  {
    icon: 'credit_card',
    title: '$5 EZ-Link Top-up',
    desc: 'Direct credit to your transit card.',
    points: 500,
    tag: 'SAVER',
    bgColor: '#E8D5CE',
    iconColor: '#275300',
    locked: false,
  },
  {
    icon: 'local_cafe',
    title: 'Eco-Cafe Voucher',
    desc: 'Buy 1 Get 1 Free coffee/tea.',
    points: 350,
    tag: null,
    bgColor: '#D1E8D5',
    iconColor: '#275300',
    locked: false,
  },
  {
    icon: 'attractions',
    title: 'Gardens by the Bay Entry',
    desc: 'Single entry ticket for Cloud Forest.',
    points: 2500,
    tag: null,
    bgColor: '#C5E0D8',
    iconColor: '#275300',
    locked: false,
  },
  {
    icon: 'mystery',
    title: 'Mystery Box',
    desc: 'Unlocked at Level 15',
    points: 0,
    tag: null,
    bgColor: '#E8E6E0',
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
            Good afternoon! Your carbon savings are making an impact.
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
        <div className="lg:col-span-2 eco-card">
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

          {/* Progress bar */}
          <div className="relative mb-6 pt-6">
            {/* Marker for 5000 steps */}
            <div
              className="absolute left-[50%] -top-0 flex flex-col items-center z-10"
              style={{ transform: 'translateX(-50%)' }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: 'var(--eco-mrt-teal)' }}
              />
            </div>

            <div
              className="w-full h-3 rounded-full relative overflow-hidden"
              style={{ background: 'var(--eco-surface-container-highest)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(100, (dailySteps / dailyStepGoal) * 100)}%`,
                  background: `linear-gradient(90deg, var(--eco-primary) 0%, var(--eco-mrt-teal) 100%)`,
                }}
              />
            </div>

            {/* Labels */}
            <div className="flex justify-between mt-2">
              <span className="text-label-caps text-[9px]" style={{ color: 'var(--eco-on-surface-variant)' }}>
                START
              </span>
              <div className="text-center" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                <div className="text-label-caps text-[9px] font-bold" style={{ color: 'var(--eco-on-surface)' }}>
                  5,000 STEPS
                </div>
                <div className="text-[9px]" style={{ color: 'var(--eco-mrt-teal)' }}>+50 PTS</div>
              </div>
              <div className="text-right">
                <div className="text-label-caps text-[9px]" style={{ color: 'var(--eco-on-surface-variant)' }}>
                  10,000 STEPS
                </div>
                <div className="text-[9px]" style={{ color: 'var(--eco-mrt-teal)' }}>+150 PTS</div>
              </div>
            </div>
          </div>

          {/* Info banner */}
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-2"
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
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-1.5"
                  style={{
                    background: badge.earned ? 'rgba(39, 83, 0, 0.08)' : 'var(--eco-surface-container)',
                    border: badge.earned ? 'none' : '1px dashed var(--eco-outline-variant)',
                  }}
                >
                  <span
                    className="material-symbols-outlined text-[22px]"
                    style={{
                      color: badge.earned ? badge.color : 'var(--eco-outline)',
                      fontVariationSettings: badge.earned ? "'FILL' 1" : "'FILL' 0",
                    }}
                  >
                    {badge.icon}
                  </span>
                </div>
                {badge.label && (
                  <span className="text-label-caps text-[8px]" style={{ color: 'var(--eco-on-surface-variant)' }}>
                    {badge.label}
                  </span>
                )}
              </div>
            ))}
          </div>
          <button
            className="w-full mt-4 text-label-caps text-[10px] flex items-center justify-center gap-1 py-2 rounded-lg transition-colors"
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
                className="px-3 py-1.5 rounded-lg text-label-caps text-[10px] transition-all duration-200"
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
                className="relative flex items-center justify-center py-8"
                style={{ background: reward.bgColor }}
              >
                <span
                  className="material-symbols-outlined text-[40px]"
                  style={{ color: reward.iconColor, opacity: reward.locked ? 0.4 : 0.7 }}
                >
                  {reward.icon === 'mystery' ? 'help' : reward.icon}
                </span>
                {reward.tag && (
                  <span
                    className="absolute bottom-2 right-2 text-label-caps text-[9px] px-2 py-0.5 rounded"
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
                    className="text-label-caps text-[10px] px-3 py-1.5 rounded-lg transition-all duration-200"
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
