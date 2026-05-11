import { useState, useEffect } from 'react';
import { MODULES } from './data/lessons';
import { LevelMap } from './components/LevelMap';
import { LessonView } from './components/LessonView';
import { UserProgress } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, User, Flame, Play } from 'lucide-react';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('excel-lingo-progress');
    return saved ? JSON.parse(saved) : { completedLessons: [], currentModuleId: 'basics', difficulty: 'Easy' };
  });

  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('excel-lingo-progress', JSON.stringify(progress));
  }, [progress]);

  const handleLessonSelect = (id: string) => {
    setActiveLessonId(id);
  };

  const handleLessonComplete = () => {
    if (activeLessonId && !progress.completedLessons.includes(activeLessonId)) {
      setProgress(prev => ({
        ...prev,
        completedLessons: [...prev.completedLessons, activeLessonId]
      }));
    }
    setActiveLessonId(null);
  };

  const currentLesson = activeLessonId ? 
    MODULES.flatMap(m => m.lessons).find(l => l.id === activeLessonId) : 
    null;

  const filteredModules = MODULES.filter(m => m.difficulty === progress.difficulty);
  const totalLessons = filteredModules.flatMap(m => m.lessons).length;
  const completedInDifficulty = filteredModules.flatMap(m => m.lessons)
    .filter(l => progress.completedLessons.includes(l.id)).length;
    
  const progressPercent = totalLessons > 0 ? (completedInDifficulty / totalLessons) * 100 : 0;

  return (
    <div className="h-screen bg-slate-50 text-slate-900 font-sans flex flex-col overflow-hidden">
      {/* Header Section */}
      <header className="h-20 border-b-4 border-excel bg-white flex items-center justify-between px-8 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-excel rounded-lg flex items-center justify-center text-white font-black text-2xl shadow-lg ring-4 ring-excel/10">X</div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight leading-none italic">Excel-Lingo <span className="text-excel not-italic">PRO</span></h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
              {currentLesson ? `Active Mission: ${currentLesson.title}` : `Global Rank: Data Disciple`}
            </p>
          </div>
        </div>

        {/* Difficulty Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            {(['Easy', 'Medium', 'Hard', 'Expert'] as const).map((d) => (
                <button
                    key={d}
                    onClick={() => setProgress(prev => ({ ...prev, difficulty: d }))}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                        progress.difficulty === d 
                            ? 'bg-white text-excel shadow-sm ring-1 ring-slate-200' 
                            : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                    {d}
                </button>
            ))}
        </div>
        
        <div className="flex items-center gap-8">
          <div className="hidden lg:flex flex-col items-end gap-1">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{progress.difficulty} Progress</span>
            <div className="w-48 h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                className="h-full bg-excel" 
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <Flame className="w-5 h-5 text-amber-500 fill-current" />
              <span className="text-[10px] font-black">12 D</span>
            </div>
            <div className="flex flex-col items-center">
              <Trophy className="w-5 h-5 text-blue-500 fill-current" />
              <span className="text-[10px] font-black">{progress.completedLessons.length * 10}</span>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-slate-200 bg-slate-50 flex items-center justify-center font-black text-slate-400 shadow-sm">
              <User className="w-5 h-5" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* Left Rail: Level Map always visible or replaced by active lesson view */}
        <LevelMap 
          modules={filteredModules} 
          completedLessons={progress.completedLessons}
          onSelectLesson={handleLessonSelect}
        />

        <section className="flex-1 bg-slate-100 flex flex-col overflow-hidden relative">
          <AnimatePresence mode="wait">
            {currentLesson ? (
              <motion.div
                key="lesson"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="h-full"
              >
                <LessonView 
                    lesson={currentLesson} 
                    onComplete={handleLessonComplete}
                    onBack={() => setActiveLessonId(null)}
                />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center p-12 text-center"
              >
                <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-xl">
                    <Play className="w-10 h-10 text-slate-400 fill-current translate-x-1" />
                </div>
                <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Select Your Next <span className="text-excel">{progress.difficulty} Mission</span></h2>
                <p className="text-slate-500 font-bold italic max-w-md">Click a node on the left progress rail to begin your Excel training journey.</p>
                <div className="mt-8 flex gap-4">
                    <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-black uppercase tracking-widest text-slate-400 shadow-sm">{progress.difficulty} Track</span>
                    <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-black uppercase tracking-widest text-slate-400 shadow-sm">{completedInDifficulty} / {totalLessons} Done</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}
