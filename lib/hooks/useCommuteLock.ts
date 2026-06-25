'use client';

import { useState, useCallback } from 'react';
import {
  STORAGE_KEYS,
  DEFAULT_COMMUTE_LOCK,
  CommuteLockData,
} from '@/lib/constants';

function readCommuteLock(): CommuteLockData {
  if (typeof window === 'undefined') return DEFAULT_COMMUTE_LOCK;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.COMMUTE_LOCK);
    return stored ? { ...DEFAULT_COMMUTE_LOCK, ...JSON.parse(stored) } : DEFAULT_COMMUTE_LOCK;
  } catch {
    return DEFAULT_COMMUTE_LOCK;
  }
}

export function useCommuteLock() {
  const [data, setData] = useState<CommuteLockData>(() => readCommuteLock());

  const persist = useCallback((next: CommuteLockData) => {
    setData(next);
    localStorage.setItem(STORAGE_KEYS.COMMUTE_LOCK, JSON.stringify(next));
  }, []);

  const startCommute = useCallback(
    (destination?: string, etaMinutes?: number) => {
      persist({
        state: 'in_transit',
        destination: destination ?? DEFAULT_COMMUTE_LOCK.destination,
        etaMinutes: etaMinutes ?? DEFAULT_COMMUTE_LOCK.etaMinutes,
      });
    },
    [persist]
  );

  const fastForward = useCallback(() => {
    setData((prev) => {
      const next = { ...prev, state: 'complete' as const };
      localStorage.setItem(STORAGE_KEYS.COMMUTE_LOCK, JSON.stringify(next));
      return next;
    });
  }, []);

  const claimRewards = useCallback(() => {
    persist(DEFAULT_COMMUTE_LOCK);
  }, [persist]);

  return {
    ...data,
    startCommute,
    fastForward,
    claimRewards,
    isInTransit: data.state === 'in_transit',
    isComplete: data.state === 'complete',
  };
}
