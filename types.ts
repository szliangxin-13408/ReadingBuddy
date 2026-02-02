
export interface ReadingEntry {
  minutes: number;
  books: string[];
}

export interface MonthData {
  [date: string]: ReadingEntry; // key: YYYY-MM-DD
}

export enum RewardLevel {
  NOOB = 'Noob',
  PRO = 'Pro',
  HACKER = 'Hacker',
  GOD = 'God'
}

export interface LevelThresholds {
  [RewardLevel.NOOB]: number;
  [RewardLevel.PRO]: number;
  [RewardLevel.HACKER]: number;
  [RewardLevel.GOD]: number;
}

export interface AppSettings {
  thresholds: LevelThresholds;
  weeklyGoal: number;
  studentName: string;
}
