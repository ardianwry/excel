import React from 'react';
import { motion } from 'motion/react';
import { Module } from '../types';
import { Check, Lock, Play } from 'lucide-react';

interface LevelMapProps {
  modules: Module[];
  completedLessons: string[];
  onSelectLesson: (lessonId: string) => void;
}

export const LevelMap: React.FC<LevelMapProps> = ({ modules, completedLessons, onSelectLesson }) => {
  return (
    <div className="w-24 border-r-2 border-slate-200 bg-white flex flex-col items-center py-8 gap-6 overflow-y-auto h-full shrink-0" id="level-map">
      {modules.map((module) => (
        <React.Fragment key={module.id}>
          <div className="w-full px-2 mb-2">
            <p className="text-[10px] font-black uppercase text-slate-400 text-center leading-tight tracking-widest">{module.title}</p>
          </div>
          
          {module.lessons.map((lesson, lessonIdx) => {
            const isCompleted = completedLessons.includes(lesson.id);
            
            // Unlocked if it's the first lesson EVER, or if the previous lesson in the module was completed.
            // Also check if the previous module's last lesson was completed.
            const moduleIdx = modules.findIndex(m => m.id === module.id);
            let isUnlocked = false;
            
            if (moduleIdx === 0 && lessonIdx === 0) {
              isUnlocked = true;
            } else if (lessonIdx > 0) {
              isUnlocked = completedLessons.includes(module.lessons[lessonIdx - 1].id);
            } else if (moduleIdx > 0) {
              const prevModule = modules[moduleIdx - 1];
              const lastLessonOfPrevModule = prevModule.lessons[prevModule.lessons.length - 1];
              isUnlocked = completedLessons.includes(lastLessonOfPrevModule.id);
            }

            const isCurrent = !isCompleted && isUnlocked;

            return (
              <motion.button
                key={lesson.id}
                id={`lesson-${lesson.id}`}
                whileHover={isUnlocked ? { scale: 1.1 } : {}}
                whileTap={isUnlocked ? { scale: 0.9 } : {}}
                onClick={() => isUnlocked && onSelectLesson(lesson.id)}
                className={`
                  group relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                  ${isCompleted ? 'bg-excel text-white shadow-lg ring-4 ring-excel/20' : ''}
                  ${isCurrent ? 'bg-white border-4 border-excel text-excel font-black scale-110 shadow-xl' : ''}
                  ${!isUnlocked ? 'bg-slate-100 border-2 border-dashed border-slate-300 text-slate-400 cursor-not-allowed' : ''}
                  ${isUnlocked && !isCompleted && !isCurrent ? 'bg-slate-50 border-2 border-slate-200 text-slate-400 hover:border-excel hover:text-excel' : ''}
                `}
              >
                {isCompleted ? (
                    <Check className="w-6 h-6 stroke-[3]" />
                ) : !isUnlocked ? (
                    <Lock className="w-4 h-4" />
                ) : (
                    <span className="text-sm font-black">{lessonIdx + 1}</span>
                )}
                
                <div className="absolute left-full ml-4 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded shadow-2xl z-50 pointer-events-none whitespace-nowrap">
                  {lesson.title}
                  {!isUnlocked && " (LOCKED)"}
                </div>
              </motion.button>
            );
          })}
          <div className="w-8 h-1 bg-slate-100 rounded-full my-4" />
        </React.Fragment>
      ))}
    </div>
  );
};
