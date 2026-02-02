
import React, { useState, useEffect, useMemo } from 'react';
import { 
  format, 
  addMonths, 
  endOfMonth, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay 
} from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight, 
  Printer, 
  Settings as SettingsIcon, 
  Timer, 
  Trophy,
  User
} from 'lucide-react';
import { MonthData, AppSettings } from './types';
import { DEFAULT_THRESHOLDS } from './constants';
import ReadingTimer from './components/ReadingTimer';
import RewardTracker from './components/RewardTracker';
import SettingsPanel from './components/SettingsPanel';
import DayModal from './components/DayModal';

const App: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [readingData, setReadingData] = useState<MonthData>(() => {
    const saved = localStorage.getItem('reading_buddy_data');
    return saved ? JSON.parse(saved) : {};
  });
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('reading_buddy_settings');
    return saved ? JSON.parse(saved) : { 
      thresholds: DEFAULT_THRESHOLDS, 
      weeklyGoal: 100, 
      studentName: ''
    };
  });

  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  useEffect(() => {
    localStorage.setItem('reading_buddy_data', JSON.stringify(readingData));
  }, [readingData]);

  useEffect(() => {
    localStorage.setItem('reading_buddy_settings', JSON.stringify(settings));
  }, [settings]);

  const handlePrevMonth = () => setCurrentMonth(addMonths(currentMonth, -1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handleGoToToday = () => setCurrentMonth(new Date());

  const handleUpdateEntry = (date: string, minutes: number, books: string[]) => {
    setReadingData(prev => ({
      ...prev,
      [date]: { minutes, books }
    }));
  };

  const handleDeleteEntry = (date: string) => {
    setReadingData(prev => {
      const newData = { ...prev };
      delete newData[date];
      return newData;
    });
  };

  const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const monthEnd = endOfMonth(monthStart);
  
  const getCalendarStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = (day === 0 ? 6 : day - 1);
    d.setDate(d.getDate() - diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };
  
  const calendarStart = getCalendarStart(monthStart);
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const monthlyStats = useMemo(() => {
    let totalMinutes = 0;
    let daysWithReading = 0;
    const daysInMonthInterval = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    daysInMonthInterval.forEach(day => {
      const key = format(day, 'yyyy-MM-dd');
      if (readingData[key] && readingData[key].minutes > 0) {
        totalMinutes += readingData[key].minutes;
        daysWithReading++;
      }
    });

    const averagePerDay = daysWithReading > 0 ? totalMinutes / daysWithReading : 0;
    return { 
      totalMinutes, 
      averagePerDay, 
      daysInMonthCount: daysInMonthInterval.length 
    };
  }, [readingData, monthStart, monthEnd]);

  return (
    <div className="min-h-screen pb-32 relative bg-sky-50">
      <header className="bg-white/80 backdrop-blur-md border-b-2 border-sky-100 p-4 sticky top-0 z-30 no-print flex items-center justify-between shadow-sm safe-top">
        <div className="flex items-center gap-3">
          <div className="bg-sky-500 p-2 rounded-xl shadow-lg">
            <Trophy className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-sky-900 leading-tight Fredoka">Reading Buddy</h1>
            {settings.studentName && (
              <div className="flex items-center gap-1 text-xs sm:text-sm font-bold text-purple-600">
                <User className="w-3 h-3" />
                <span>{settings.studentName}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleGoToToday}
            className="px-3 sm:px-4 py-2 bg-sky-100 text-sky-700 rounded-full font-semibold hover:bg-sky-200 transition-colors text-sm"
          >
            Today
          </button>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
          >
            <SettingsIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button 
            onClick={() => window.print()}
            className="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors shadow-lg"
          >
            <Printer className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 mb-8 no-print">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <button onClick={handlePrevMonth} className="p-3 bg-white rounded-full border shadow-sm hover:bg-sky-50 transition-colors active:bg-sky-100">
                  <ChevronLeft />
                </button>
                <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-widest Fredoka text-sky-800 text-center min-w-[200px]">
                  {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <button onClick={handleNextMonth} className="p-3 bg-white rounded-full border shadow-sm hover:bg-sky-50 transition-colors active:bg-sky-100">
                  <ChevronRight />
                </button>
              </div>
              <div className="hidden sm:block text-sky-600 font-bold bg-white/50 px-3 py-1 rounded-full text-sm">
                Weekly Goal: {settings.weeklyGoal} min
              </div>
            </div>
            
            <RewardTracker 
              totalMinutes={monthlyStats.totalMinutes} 
              averageMinutes={monthlyStats.averagePerDay}
              thresholds={settings.thresholds}
              daysInMonth={monthlyStats.daysInMonthCount}
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-sky-100 print:border-0 print:shadow-none">
          <div className="p-8 flex flex-col items-center justify-center relative border-b-4 border-dashed border-sky-100 print:bg-transparent bg-sky-100/50">
             <div className="absolute top-4 left-4 text-4xl opacity-20 hidden sm:block select-none animate-pulse">
               📖 📚
             </div>
             <div className="absolute top-4 right-4 text-4xl opacity-20 hidden sm:block select-none animate-pulse" style={{ animationDelay: '1s' }}>
               ✏️ ✨
             </div>
             
             <h2 className="text-4xl sm:text-6xl font-black tracking-[0.2em] uppercase Fredoka mb-2 drop-shadow-sm text-sky-600 text-center">
               {format(currentMonth, 'MMMM')}
             </h2>
             <p className="text-sky-700 font-bold italic no-print text-center text-sm sm:text-base">
               Time to track your reading journey!
             </p>
             <p className="text-sky-700 text-sm hidden print:block mt-2">Please record minutes read aloud each day!</p>
          </div>

          <div className="grid grid-cols-7 border-b border-sky-100">
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
              <div key={day} className="py-4 text-center text-sky-600 font-black text-[10px] sm:text-xs border-r last:border-r-0 border-sky-100 bg-sky-50/30 uppercase tracking-tighter">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {days.map((day, idx) => {
              const dateKey = format(day, 'yyyy-MM-dd');
              const entry = readingData[dateKey];
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, new Date());

              return (
                <div 
                  key={idx}
                  onClick={() => isCurrentMonth && setSelectedDay(day)}
                  className={`
                    min-h-[100px] sm:min-h-[140px] p-1 sm:p-2 border-r border-b border-sky-100 cursor-pointer transition-all duration-200
                    ${!isCurrentMonth ? 'bg-gray-50/50 text-gray-300 pointer-events-none' : 'hover:bg-sky-50/50'}
                    ${isToday ? 'bg-sky-100/30 ring-4 ring-inset ring-sky-200/50' : ''}
                    flex flex-col relative print:min-h-[90px] print:border-gray-200
                  `}
                >
                  <span className={`text-xs sm:text-sm font-black ${isCurrentMonth ? 'text-sky-600' : 'text-gray-300'}`}>
                    {format(day, 'd')}
                  </span>
                  
                  {entry && (
                    <div className="mt-auto flex flex-col items-center justify-center flex-1">
                      <div className="text-3xl sm:text-5xl handwritten font-bold text-sky-900 drop-shadow-sm transform hover:scale-110 transition-transform">
                        {entry.minutes}
                      </div>
                      {entry.books && entry.books.length > 0 && (
                        <div className="text-[8px] sm:text-[10px] text-sky-400 line-clamp-1 max-w-full text-center px-1 font-black mt-1 bg-white/60 rounded px-1">
                           {entry.books[0]}
                        </div>
                      )}
                    </div>
                  )}

                  {(idx + 1) % 7 === 0 && (
                    <div className="hidden print:block absolute -right-0 top-0 h-full w-24 bg-gray-50/50 border-l border-gray-200 flex items-center justify-center p-1 text-[8px] text-center font-bold">
                       WEEKLY TOTAL:
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="hidden print:block border-t-4 border-double border-sky-200 p-8 bg-sky-50/20">
            <div className="grid grid-cols-2 gap-y-10 gap-x-12 text-sky-900 font-black text-xl">
              <div className="border-b-2 border-dashed border-sky-300 pb-2">
                Student: <span className="handwritten text-3xl ml-3 text-purple-600">{settings.studentName || '____________________'}</span>
              </div>
              <div className="border-b-2 border-dashed border-sky-300 pb-2">
                Total {format(currentMonth, 'MMMM')} Minutes: <span className="handwritten text-3xl ml-3 text-orange-600">{monthlyStats.totalMinutes}</span>
              </div>
              <div className="border-b-2 border-dashed border-sky-300 pb-2">
                Parent Signature: <span className="text-gray-200 font-light">____________________</span>
              </div>
              <div className="border-b-2 border-dashed border-sky-300 pb-2">
                Date Submitted: <span className="text-gray-200 font-light">____________________</span>
              </div>
            </div>
            <div className="mt-8 text-center text-sky-400 text-xs font-bold uppercase tracking-widest italic">
              ✨ Great job reading this month! ✨
            </div>
          </div>
        </div>
      </main>

      <button 
        onClick={() => setIsTimerOpen(true)}
        className="fixed bottom-6 right-6 no-print bg-sky-500 text-white p-4 sm:p-5 rounded-3xl shadow-2xl hover:bg-sky-600 transform transition-all active:scale-95 flex items-center gap-3 z-40 border-4 border-white safe-bottom"
      >
        <Timer className="w-7 h-7 sm:w-8 sm:h-8" />
        <span className="font-black text-lg sm:text-xl uppercase Fredoka">Log Time</span>
      </button>

      {isTimerOpen && (
        <ReadingTimer 
          onClose={() => setIsTimerOpen(false)}
          onSave={(minutes) => {
            const todayKey = format(new Date(), 'yyyy-MM-dd');
            const currentEntry = readingData[todayKey] || { minutes: 0, books: [] };
            handleUpdateEntry(todayKey, currentEntry.minutes + minutes, currentEntry.books);
            setIsTimerOpen(false);
          }}
        />
      )}

      {selectedDay && (
        <DayModal 
          date={selectedDay}
          entry={readingData[format(selectedDay, 'yyyy-MM-dd')]}
          onClose={() => setSelectedDay(null)}
          onUpdate={(minutes, books) => {
            handleUpdateEntry(format(selectedDay, 'yyyy-MM-dd'), minutes, books);
            setSelectedDay(null);
          }}
          onDelete={() => {
            handleDeleteEntry(format(selectedDay, 'yyyy-MM-dd'));
            setSelectedDay(null);
          }}
        />
      )}

      {isSettingsOpen && (
        <SettingsPanel 
          settings={settings}
          onSave={setSettings}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
