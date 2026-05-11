import React, { useMemo } from 'react';
import { SpreadsheetData } from '../types';
import { evaluateFormula } from '../lib/excelEngine';

interface ExcelGridProps {
  data: SpreadsheetData;
  targetCell: string;
  onCellChange: (cell: string, value: string) => void;
  userValue: string;
  feedback?: {
    isCorrect: boolean;
    error: string | null;
  };
}

export const ExcelGrid: React.FC<ExcelGridProps> = ({ 
  data, 
  targetCell, 
  onCellChange, 
  userValue,
  feedback 
}) => {
  const rows = 10;
  const cols = 5; // A to E

  const getColLetter = (index: number) => String.fromCharCode(65 + index);

  // Evaluate user result live
  const userResult = useMemo(() => {
    if (!userValue) return '';
    const { value, error } = evaluateFormula(userValue, data);
    return error ? '#ERROR!' : value;
  }, [userValue, data]);

  return (
    <div className="flex-1 bg-white rounded-2xl shadow-2xl border-4 border-slate-900 flex flex-col overflow-hidden font-mono text-sm" id="excel-grid">
      <div className="bg-slate-100 border-b border-slate-300 h-10 flex items-center px-4 gap-4 shrink-0">
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest italic">fx</span>
        <div className="bg-white flex-1 h-7 border border-slate-300 rounded px-3 flex items-center text-sm font-mono text-slate-700">
          {userValue.startsWith('=') ? (
            <span className="text-blue-600 font-bold">{userValue}</span>
          ) : (
            userValue
          )}
          {targetCell && <span className="w-0.5 h-4 bg-blue-500 animate-pulse ml-0.5" />}
        </div>
      </div>
      
      <div className="flex-1 overflow-auto bg-white">
        <table className="w-full border-collapse table-fixed min-w-[500px]">
          <thead>
            <tr className="bg-slate-50 sticky top-0 z-10">
              <th className="w-10 border-b border-r border-slate-200 p-1"></th>
              {Array.from({ length: cols }).map((_, i) => (
                <th key={i} className="border-b border-r border-slate-200 p-1 text-slate-500 font-bold text-center uppercase tracking-wider text-xs">
                  {getColLetter(i)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, r) => {
              const rowNum = r + 1;
              return (
                <tr key={r}>
                  <td className="bg-slate-50 border-b border-r border-slate-200 text-center text-slate-400 p-1 text-xs font-bold">
                    {rowNum}
                  </td>
                  {Array.from({ length: cols }).map((_, c) => {
                    const colLetter = getColLetter(c);
                    const cellId = `${colLetter}${rowNum}`;
                    const isTarget = cellId === targetCell;
                    const value = isTarget ? userResult : data[cellId] ?? '';

                    return (
                      <td 
                        key={c} 
                        className={`border-b border-r border-slate-100 p-0 h-8 relative transition-all duration-200 ${isTarget ? 'bg-excel/5' : ''}`}
                      >
                        {isTarget ? (
                          <div className="relative h-full flex items-center">
                            <input
                              id={`cell-${cellId}`}
                              type="text"
                              value={userValue}
                              onChange={(e) => onCellChange(cellId, e.target.value)}
                              className={`w-full h-full px-2 outline-none border-2 font-bold transition-all ${
                                feedback?.isCorrect 
                                  ? 'border-excel bg-excel/10 text-excel' 
                                  : feedback?.error 
                                    ? 'border-red-500 bg-red-50 text-red-600' 
                                    : 'border-blue-500 ring-4 ring-blue-500/20'
                              }`}
                              autoFocus
                              placeholder="..."
                            />
                            {/* Live result preview */}
                            {userValue.startsWith('=') && !feedback?.isCorrect && !feedback?.error && (
                              <div className="absolute left-0 -bottom-6 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded shadow-lg z-20 whitespace-nowrap animate-in fade-in slide-in-from-top-1">
                                Result: <span className="text-excel font-bold">{userResult}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className={`px-2 truncate ${typeof value === 'number' ? 'text-right' : 'text-left'} text-slate-700`}>
                            {value}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
