
import React from 'react';
import { RewardLevel, LevelThresholds } from '../types';
import { LEVEL_COLORS, LEVEL_ICONS, TRACKER_CARD_COLORS } from '../constants';

interface RewardTrackerProps {
  totalMinutes: number;
  averageMinutes: number;
  thresholds: LevelThresholds;
  daysInMonth: number;
}

const RewardTracker: React.FC<RewardTrackerProps> = ({ 
  totalMinutes, 
  averageMinutes, 
  thresholds,
  daysInMonth
}) => {
  const levels = [RewardLevel.NOOB, RewardLevel.PRO, RewardLevel.HACKER, RewardLevel.GOD];
  
  // Calculate the current rank based on active daily average vs daily thresholds
  const currentLevel = levels.reduce((prev, curr) => {
    const dailyThreshold = thresholds[curr] / daysInMonth;
    if (averageMinutes >= dailyThreshold) return curr;
    return prev;
  }, RewardLevel.NOOB);

  const nextLevel = levels[levels.indexOf(currentLevel) + 1] || null;
  
  // Calculate progress towards next rank's daily average threshold
  let progressPercent = 0;
  if (nextLevel) {
    const nextDailyThreshold = thresholds[nextLevel] / daysInMonth;
    const currentDailyThreshold = thresholds[currentLevel] / daysInMonth;
    const range = nextDailyThreshold - currentDailyThreshold;
    progressPercent = range > 0 
      ? Math.min(100, ((averageMinutes - currentDailyThreshold) / range) * 100)
      : 100;
  } else {
    progressPercent = 100;
  }

  // Ensure the background color strictly follows the user's request:
  // Noob (Grey), Pro (Green), Hacker (Red), God (Gold)
  const getRankBgColor = (level: RewardLevel) => {
    switch (level) {
      case RewardLevel.NOOB: return 'bg-slate-100 border-slate-200'; // Grey-ish
      case RewardLevel.PRO: return 'bg-green-50 border-green-200'; // Green
      case RewardLevel.HACKER: return 'bg-red-50 border-red-200'; // Red
      case RewardLevel.GOD: return 'bg-amber-50 border-amber-200'; // Gold
      default: return 'bg-white';
    }
  };

  return (
    <div className={`p-6 rounded-3xl shadow-lg border-2 transition-all duration-500 ${getRankBgColor(currentLevel)}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-5xl drop-shadow-sm transition-transform duration-500 hover:scale-110">
              {LEVEL_ICONS[currentLevel]}
            </span>
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Current Rank</p>
              <h3 className={`text-2xl font-black Fredoka px-3 py-1 rounded-xl border-2 transition-all duration-500 ${LEVEL_COLORS[currentLevel]}`}>
                {currentLevel}
              </h3>
            </div>
          </div>
        </div>

        <div className="flex gap-8 bg-white/40 p-4 rounded-2xl backdrop-blur-sm border border-white/60">
          <div className="text-center">
            <p className="text-gray-500 text-[10px] font-black uppercase">Active Daily Avg</p>
            <p className="text-3xl font-black text-sky-600">{averageMinutes.toFixed(1)} <span className="text-sm font-medium">min/day</span></p>
          </div>
          <div className="w-px h-10 bg-gray-200 self-center"></div>
          <div className="text-center">
            <p className="text-gray-500 text-[10px] font-black uppercase">Month Total</p>
            <p className="text-3xl font-black text-sky-600">{totalMinutes} <span className="text-sm font-medium">min</span></p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm font-bold">
          <span className="text-sky-700">Daily Average Rank Progress</span>
          {nextLevel ? (
            <span className="text-gray-400 font-medium italic">
              Need {(thresholds[nextLevel] / daysInMonth).toFixed(1)} min/day avg for {nextLevel}
            </span>
          ) : (
            <span className="text-yellow-600 animate-pulse font-black">ULTIMATE GOD STATUS! 👑🌟</span>
          )}
        </div>
        
        <div className="relative h-10 w-full bg-white/60 rounded-2xl overflow-hidden border-2 border-white p-1 shadow-inner">
          <div 
            className={`h-full bg-gradient-to-r rounded-xl transition-all duration-1000 ease-out shadow-sm ${
              currentLevel === RewardLevel.GOD ? 'from-yellow-400 to-amber-500' : 'from-sky-400 to-indigo-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
          
          {levels.map(level => {
            const pos = (thresholds[level] / thresholds[RewardLevel.GOD]) * 100;
            return (
              <div 
                key={level}
                className="absolute top-0 bottom-0 border-r-2 border-white/40"
                style={{ left: `${pos}%` }}
              >
                <span className="absolute -bottom-1 left-1 transform -translate-x-1/2 text-[8px] text-gray-400 font-black uppercase whitespace-nowrap">
                  {level}
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-[10px] text-gray-400 italic text-center">
          * Ranks are calculated by comparing your active daily reading average to the target monthly goals divided by {daysInMonth} days.
        </p>
      </div>
    </div>
  );
};

export default RewardTracker;
