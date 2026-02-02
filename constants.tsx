
import { RewardLevel, LevelThresholds } from './types';

export const DEFAULT_THRESHOLDS: LevelThresholds = {
  [RewardLevel.NOOB]: 300,
  [RewardLevel.PRO]: 400,
  [RewardLevel.HACKER]: 450,
  [RewardLevel.GOD]: 500,
};

export const LEVEL_COLORS = {
  [RewardLevel.NOOB]: 'bg-slate-200 text-slate-700 border-slate-300',
  [RewardLevel.PRO]: 'bg-green-200 text-green-800 border-green-300',
  [RewardLevel.HACKER]: 'bg-red-200 text-red-800 border-red-300',
  [RewardLevel.GOD]: 'bg-amber-400 text-amber-900 border-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.5)]',
};

export const TRACKER_CARD_COLORS = {
  [RewardLevel.NOOB]: 'bg-slate-50 border-slate-100',
  [RewardLevel.PRO]: 'bg-green-50 border-green-100',
  [RewardLevel.HACKER]: 'bg-red-50 border-red-100',
  [RewardLevel.GOD]: 'bg-amber-50 border-amber-200',
};

export const LEVEL_ICONS = {
  [RewardLevel.NOOB]: '🌱',
  [RewardLevel.PRO]: '📖',
  [RewardLevel.HACKER]: '🚀',
  [RewardLevel.GOD]: '👑',
};
