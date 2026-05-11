import React, { useState, useEffect } from 'react';
import { Lesson } from '../types';
import { ExcelGrid } from './ExcelGrid';
import { evaluateFormula } from '../lib/excelEngine';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Lightbulb, CheckCircle2, AlertCircle } from 'lucide-react';

interface LessonViewProps {
  lesson: Lesson;
  onComplete: () => void;
  onBack: () => void;
}

export const LessonView: React.FC<LessonViewProps> = ({ lesson, onComplete, onBack }) => {
  const [userValue, setUserValue] = useState('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; error: string | null }>({ isCorrect: false, error: null });
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);

  useEffect(() => {
    if (!userValue) {
      setFeedback({ isCorrect: false, error: null });
      return;
    }

    const { value, error } = evaluateFormula(userValue, lesson.initialData);
    
    if (error) {
      setFeedback({ isCorrect: false, error: error });
    } else {
        const v1 = String(value).trim().toLowerCase();
        const v2 = String(lesson.expectedResult).trim().toLowerCase();

        if (lesson.type === 'formula' && !userValue.startsWith('=')) {
             setFeedback({ isCorrect: false, error: "Missing '='" });
        } else if (v1 === v2) {
            setFeedback({ isCorrect: true, error: null });
        } else {
            setFeedback({ isCorrect: false, error: null });
        }
    }
  }, [userValue, lesson]);

  const handleHint = () => {
    setShowHint(true);
    setHintIndex((prev) => (prev + 1) % lesson.hints.length);
  };

  const handleShowSolution = () => {
    if (lesson.correctFormula) {
      setUserValue(lesson.correctFormula);
    } else {
      const formulaHint = lesson.hints.find(h => h.includes('='));
      if (formulaHint) {
        const match = formulaHint.match(/=[A-Z0-9().:," ]+/i);
        if (match) setUserValue(match[0]);
      }
    }
  };

  const gridProps = {
    onCellChange(cell: string, value: string) {
      setUserValue(value);
    },
    onKeyDown(e: React.KeyboardEvent) {
      if (e.key === 'Enter' && feedback.isCorrect) {
        onComplete();
      }
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden" id="lesson-view" onKeyDown={gridProps.onKeyDown}>
      {/* Central Content Area */}
      <section className="flex-1 bg-slate-100 p-8 flex flex-col gap-6 overflow-y-auto">
        <motion.div 
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-5xl font-black leading-none tracking-tighter uppercase">
              MISSION: <span className="text-excel italic">{lesson.title.split(' ').pop()}</span>
            </h2>
            <button 
                onClick={onBack}
                className="flex items-center text-slate-400 hover:text-slate-800 transition-colors font-black text-xs uppercase tracking-widest"
            >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Abort
            </button>
          </div>
          <p className="text-slate-500 font-bold max-w-2xl italic leading-relaxed text-lg">
            {lesson.instructions.split(' ').map((word, i) => (
                <span key={i} className={word.includes(lesson.targetCell) ? "bg-yellow-100 px-1 border-b-2 border-yellow-400 text-slate-800 not-italic" : ""}>
                    {word}{' '}
                </span>
            ))}
          </p>
        </motion.div>

        <ExcelGrid 
            data={lesson.initialData}
            targetCell={lesson.targetCell}
            userValue={userValue}
            onCellChange={gridProps.onCellChange}
            feedback={feedback}
        />
      </section>

      {/* Right Sidebar: Intelligence & Feedback */}
      <aside className="w-80 border-l-2 border-slate-200 bg-white p-8 flex flex-col gap-8 shrink-0">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Live Intelligence</h3>
          <AnimatePresence mode="wait">
            {feedback.isCorrect ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-excel text-white rounded-xl border-2 border-excel shadow-lg"
              >
                <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-black uppercase">Mission Success</span>
                </div>
                <p className="text-xs font-bold italic leading-relaxed">
                    {lesson.explanation}
                </p>
              </motion.div>
            ) : feedback.error ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-red-50 rounded-xl border-2 border-red-100"
              >
                <p className="text-sm font-black text-red-600 italic">"{feedback.error}"</p>
                <p className="text-[10px] mt-2 text-red-400 font-bold uppercase">Correction Required</p>
              </motion.div>
            ) : userValue.startsWith('=') ? (
              <motion.div 
                key="thinking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-blue-50 rounded-xl border-2 border-blue-100"
              >
                <p className="text-sm font-black text-blue-600 italic">"Checking your logic... Keep going!"</p>
              </motion.div>
            ) : (
              <motion.div 
                key="neutral"
                className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100"
              >
                <p className="text-sm font-bold text-slate-400 italic">"Waiting for your formula in {lesson.targetCell}..."</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Lesson Goals</h3>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-1 bg-excel/10 text-excel rounded font-black uppercase">{lesson.type}</span>
            <span className="px-2 py-1 bg-slate-100 text-slate-400 rounded font-black uppercase italic">XP: +10</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
             <button 
                onClick={handleHint}
                className="flex items-center text-amber-600 hover:text-amber-700 text-xs font-black uppercase tracking-widest transition-colors mb-2"
            >
                <Lightbulb className={`w-4 h-4 mr-2 ${showHint ? 'fill-amber-400' : ''}`} />
                {showHint ? "Next Hint" : "Get Advice"}
            </button>
            <AnimatePresence>
                {showHint && (
                <motion.div
                    initial={{ opacity: 0, h: 0 }}
                    animate={{ opacity: 1, h: 'auto' }}
                    className="p-3 bg-amber-50 rounded-lg border border-amber-100"
                >
                    <p className="text-[10px] font-bold text-amber-900 leading-relaxed italic">{lesson.hints[hintIndex]}</p>
                    <button 
                        onClick={handleShowSolution}
                        className="mt-2 text-[10px] font-black uppercase text-excel hover:opacity-80 underline block"
                    >
                        Show Solution
                    </button>
                </motion.div>
                )}
            </AnimatePresence>
        </div>

        <div className="mt-auto space-y-4">
          <AnimatePresence>
            {feedback.isCorrect && (
              <motion.button 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={onComplete}
                className="w-full py-4 bg-excel text-white rounded-xl font-black uppercase tracking-tighter shadow-xl shadow-excel/20 hover:bg-excel-dark border-b-4 border-excel-dark hover:translate-y-0.5 active:translate-y-1 transition-all"
              >
                Continue Mission
              </motion.button>
            )}
          </AnimatePresence>
          <p className="text-[9px] text-center text-slate-300 uppercase font-bold tracking-widest">
            {feedback.isCorrect ? "MISSION SUCCESS" : "Awaiting user input"}
          </p>
        </div>
      </aside>
    </div>
  );
};
