
import React, { useState } from 'react';
import { X, Save, RotateCcw, User } from 'lucide-react';
import { AppSettings, RewardLevel } from '../types';
import { DEFAULT_THRESHOLDS } from '../constants';

interface SettingsPanelProps {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSave, onClose }) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);

  const handleThresholdChange = (level: RewardLevel, value: string) => {
    const val = parseInt(value) || 0;
    setLocalSettings(prev => ({
      ...prev,
      thresholds: {
        ...prev.thresholds,
        [level]: val
      }
    }));
  };

  const handleReset = () => {
    setLocalSettings({ 
      thresholds: DEFAULT_THRESHOLDS, 
      weeklyGoal: 100, 
      studentName: ''
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl border-4 border-gray-100 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-gray-800 Fredoka">App Settings</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <section>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Student Info</h3>
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-2xl border border-purple-100">
              <User className="w-5 h-5 text-purple-500" />
              <input 
                type="text"
                placeholder="Student's Name"
                value={localSettings.studentName}
                onChange={(e) => setLocalSettings({...localSettings, studentName: e.target.value})}
                className="flex-1 px-3 py-2 bg-white rounded-xl border border-purple-200 font-bold text-purple-600 outline-none focus:ring-2 ring-purple-300"
              />
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Reading Goal</h3>
            <div className="flex items-center justify-between p-4 bg-sky-50 rounded-2xl border border-sky-100">
              <span className="font-bold text-sky-800">Weekly Goal (min)</span>
              <input 
                type="number"
                value={localSettings.weeklyGoal}
                onChange={(e) => setLocalSettings({...localSettings, weeklyGoal: parseInt(e.target.value) || 0})}
                className="w-20 px-3 py-2 bg-white rounded-xl border border-sky-200 text-center font-black text-sky-600 outline-none"
              />
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Level Thresholds (min)</h3>
            <div className="space-y-3">
              {(Object.keys(RewardLevel) as Array<keyof typeof RewardLevel>).map((key) => {
                const level = RewardLevel[key];
                return (
                  <div key={level} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
                    <span className="font-bold text-gray-700">{level}</span>
                    <input 
                      type="number"
                      value={localSettings.thresholds[level]}
                      onChange={(e) => handleThresholdChange(level, e.target.value)}
                      className="w-20 px-3 py-2 bg-white rounded-xl border border-gray-200 text-center font-black text-gray-600 outline-none"
                    />
                  </div>
                );
              })}
            </div>
          </section>

          <div className="flex gap-3 pt-6">
            <button 
              onClick={() => {
                onSave(localSettings);
                onClose();
              }}
              className="flex-1 py-4 bg-sky-500 text-white rounded-2xl font-black shadow-lg hover:bg-sky-600 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" /> Save Settings
            </button>
            <button 
              onClick={handleReset}
              title="Reset to Defaults"
              className="p-4 bg-gray-100 text-gray-500 rounded-2xl hover:bg-gray-200 transition-all"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
