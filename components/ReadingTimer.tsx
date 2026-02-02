
import React, { useState, useEffect, useCallback } from 'react';
import { X, Play, Pause, StopCircle, RotateCcw } from 'lucide-react';

interface ReadingTimerProps {
  onClose: () => void;
  onSave: (minutes: number) => void;
}

const ReadingTimer: React.FC<ReadingTimerProps> = ({ onClose, onSave }) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: number | undefined;
    if (isActive) {
      interval = window.setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinish = () => {
    const mins = Math.ceil(seconds / 60);
    onSave(mins);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl border-4 border-sky-400">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-sky-800 Fredoka">Reading Timer</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-7xl font-mono font-black text-sky-600 bg-sky-50 px-8 py-6 rounded-3xl mb-8 border-4 border-sky-100">
            {formatTime(seconds)}
          </div>

          <div className="flex gap-4 mb-8">
            <button 
              onClick={() => setIsActive(!isActive)}
              className={`p-6 rounded-full text-white shadow-lg transition-transform active:scale-95 ${isActive ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'}`}
            >
              {isActive ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current" />}
            </button>
            <button 
              onClick={() => setSeconds(0)}
              className="p-6 bg-gray-200 text-gray-600 rounded-full shadow-md hover:bg-gray-300 transition-transform active:scale-95"
            >
              <RotateCcw className="w-10 h-10" />
            </button>
          </div>

          <button 
            onClick={handleFinish}
            disabled={seconds === 0}
            className={`w-full py-4 rounded-2xl font-black text-xl text-white shadow-xl transition-all ${seconds === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-sky-500 hover:bg-sky-600 active:scale-95'}`}
          >
            Finish & Log Time ({Math.ceil(seconds / 60)} min)
          </button>
          <p className="mt-4 text-gray-500 text-sm italic">Timer rounds up to the nearest minute</p>
        </div>
      </div>
    </div>
  );
};

export default ReadingTimer;
