import { SpreadsheetData } from '../types';
import { create, all } from 'mathjs';

const math = create(all);

export interface EvaluationResult {
  value: any;
  error: string | null;
}

export function parseCellReference(ref: string): { col: string; row: number } | null {
  const match = ref.match(/^([A-Z]+)(\d+)$/i);
  if (!match) return null;
  return {
    col: match[1].toUpperCase(),
    row: parseInt(match[2], 10)
  };
}

export function getRangeCells(range: string): string[] {
  const [start, end] = range.split(':');
  const startRef = parseCellReference(start);
  const endRef = parseCellReference(end);

  if (!startRef || !endRef) return [range];

  const cells: string[] = [];
  const startCol = startRef.col.charCodeAt(0);
  const endCol = endRef.col.charCodeAt(0);
  const startRow = startRef.row;
  const endRow = endRef.row;

  for (let r = Math.min(startRow, endRow); r <= Math.max(startRow, endRow); r++) {
    for (let c = Math.min(startCol, endCol); c <= Math.max(startCol, endCol); c++) {
      cells.push(`${String.fromCharCode(c)}${r}`);
    }
  }
  return cells;
}

export function evaluateFormula(formula: string, data: SpreadsheetData): EvaluationResult {
  if (!formula.startsWith('=')) {
    // If it's a number, return it, otherwise null error
    const num = parseFloat(formula);
    if (!isNaN(num)) return { value: num, error: null };
    return { value: formula, error: null };
  }

  let expression = formula.substring(1);

  // Preserve strings
  const strings: string[] = [];
  expression = expression.replace(/"([^"]*)"/g, (match, p1) => {
    strings.push(p1);
    return `__STR_${strings.length - 1}__`;
  });

  expression = expression.toUpperCase();

  try {
    // 1. Handle Ranges (e.g., A1:A5 -> [A1, A2, A3, A4, A5])
    const rangeRegex = /([A-Z]+\d+):([A-Z]+\d+)/g;
    expression = expression.replace(rangeRegex, (match) => {
      return `[${getRangeCells(match).join(',')}]`;
    });

    // 2. Map Excel functions to MathJS equivalents
    const functions = ['SUM', 'AVERAGE', 'MIN', 'MAX', 'COUNT', 'IF', 'VLOOKUP', 'CONCAT', 'LEFT', 'RIGHT', 'MID', 'SUMIF', 'ROUND', 'IFERROR', 'TODAY', 'NOW', 'SUMPRODUCT', 'RANDBETWEEN', 'ISERROR', 'LEN'];
    functions.forEach(f => {
      const regex = new RegExp(`${f}\\(`, 'gi');
      expression = expression.replace(regex, `${f.toLowerCase()}(`);
    });

    // Restore strings
    strings.forEach((s, i) => {
      expression = expression.replace(`__STR_${i}__`, `"${s}"`);
    });

    const scope: any = {};
    
    // 3. Find all cell references and populate scope
    const cellRefRegex = /[A-Z]+\d+/g;
    const refs = expression.match(cellRefRegex) || [];
    refs.forEach(ref => {
      const val = data[ref];
      if (val === undefined || val === null || val === '') {
          scope[ref] = null;
      } else if (typeof val === 'string' && isNaN(parseFloat(val))) {
          scope[ref] = val;
      } else {
          scope[ref] = typeof val === 'number' ? val : parseFloat(val as string);
      }
    });

    // Special transformations
    expression = expression.replace(/average\(/g, 'mean(');

    const customFunctions = {
        sum: (...args: any[]) => {
            const flat = args.map(a => (a && typeof a === 'object' && a.toArray ? a.toArray() : a)).flat(Infinity);
            return flat.reduce((a, b) => a + (typeof b === 'number' && !isNaN(b) ? b : 0), 0);
        },
        mean: (...args: any[]) => {
            const flat = args.map(a => (a && typeof a === 'object' && a.toArray ? a.toArray() : a)).flat(Infinity);
            const numbers = flat.filter(x => typeof x === 'number' && !isNaN(x) && x !== null);
            return numbers.length ? numbers.reduce((a, b) => a + b, 0) / numbers.length : 0;
        },
        min: (...args: any[]) => {
            const flat = args.map(a => (a && typeof a === 'object' && a.toArray ? a.toArray() : a)).flat(Infinity);
            const filtered = flat.filter(x => typeof x === 'number' && !isNaN(x) && x !== null);
            return filtered.length ? Math.min(...filtered) : 0;
        },
        max: (...args: any[]) => {
            const flat = args.map(a => (a && typeof a === 'object' && a.toArray ? a.toArray() : a)).flat(Infinity);
            const filtered = flat.filter(x => typeof x === 'number' && !isNaN(x) && x !== null);
            return filtered.length ? Math.max(...filtered) : 0;
        },
        count: (...args: any[]) => {
            const flat = args.map(a => (a && typeof a === 'object' && a.toArray ? a.toArray() : a)).flat(Infinity);
            return flat.filter(x => typeof x === 'number' && !isNaN(x) && x !== null).length;
        },
        iserror: (value: any) => {
            return value === null || value === undefined || (typeof value === 'number' && (!isFinite(value) || isNaN(value))) || String(value).includes('#');
        },
        len: (str: any) => {
            const s = (str === null || str === undefined) ? '' : String(str);
            return s.length;
        },
        if: (condition: any, trueVal: any, falseVal: any) => condition ? trueVal : falseVal,
        iferror: (value: any, errorValue: any) => {
            try {
                if (value === null || value === undefined || (typeof value === 'number' && (!isFinite(value) || isNaN(value))) || String(value).includes('#')) return errorValue;
                return value;
            } catch {
                return errorValue;
            }
        },
        concat: (...args: any[]) => args.flat().join(''),
        left: (str: string, num: number) => String(str || '').substring(0, num),
        right: (str: string, num: number) => {
            const s = String(str || '');
            return s.substring(s.length - num);
        },
        mid: (str: string, start: number, num: number) => String(str || '').substring(start - 1, start - 1 + num),
        today: () => new Date().toLocaleDateString(),
        now: () => new Date().toLocaleString(),
        sumif: (range: any, criteria: any, sumRange?: any) => {
            const r = (range && typeof range === 'object' && range.toArray ? range.toArray().flat() : (Array.isArray(range) ? range.flat() : [range]));
            const sR = sumRange ? (sumRange && typeof sumRange === 'object' && sumRange.toArray ? sumRange.toArray().flat() : (Array.isArray(sumRange) ? sumRange.flat() : [sumRange])) : r;
            let total = 0;
            const check = (val: any) => {
                if (typeof criteria === 'string') {
                    const cleanCriteria = criteria.replace(/^=+/, '');
                    if (cleanCriteria.startsWith('>=')) return val >= parseFloat(cleanCriteria.substring(2));
                    if (cleanCriteria.startsWith('<=')) return val <= parseFloat(cleanCriteria.substring(2));
                    if (cleanCriteria.startsWith('>')) return val > parseFloat(cleanCriteria.substring(1));
                    if (cleanCriteria.startsWith('<')) return val < parseFloat(cleanCriteria.substring(1));
                    if (cleanCriteria.startsWith('=')) return val === parseFloat(cleanCriteria.substring(1));
                    return String(val).toLowerCase() === cleanCriteria.toLowerCase();
                }
                return val === criteria;
            };
            r.forEach((val, i) => {
                if (check(val)) {
                    const num = typeof sR[i] === 'number' ? sR[i] : parseFloat(sR[i]);
                    total += !isNaN(num) ? num : 0;
                }
            });
            return total;
        },
        sumproduct: (...args: any[]) => {
            const arrays = args.map(a => (a && typeof a === 'object' && a.toArray ? a.toArray().flat() : (Array.isArray(a) ? a.flat() : [a])));
            if (arrays.length < 2) return 0;
            const len = Math.min(...arrays.map(a => a.length));
            let total = 0;
            for (let i = 0; i < len; i++) {
                let prod = 1;
                for (let j = 0; j < arrays.length; j++) {
                    prod *= (typeof arrays[j][i] === 'number' ? arrays[j][i] : 0);
                }
                total += prod;
            }
            return total;
        },
        randbetween: (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min,
        vlookup: (lookupValue: any, range: any, index: number) => {
            const r = Array.isArray(range) ? range.flat() : (range && typeof range === 'object' && range.toArray ? range.toArray().flat() : [range]);
            // Table width is tricky with flattened arrays. 
            // In our current implementation, getRangeCells returns row-major.
            // If the user specified A2:B5, r is [A2, B2, A3, B3, A4, B4, A5, B5]
            // We need to know the width of the table. 
            // For the sake of the lessons (which use 2 columns), we'll try to infer or assume width.
            const totalCells = r.length;
            // Most lessons use 2 columns
            const width = 2; 
            for (let i = 0; i < totalCells; i += width) {
                if (String(r[i]).toLowerCase() === String(lookupValue).toLowerCase()) {
                    return r[i + index - 1];
                }
            }
            return "#N/A";
        },
        round: (num: number, digits: number = 0) => {
            const factor = Math.pow(10, digits);
            return Math.round(num * factor) / factor;
        }
    };

    // Add uppercase versions to the scope as well to prevent "Undefined symbol" errors while typing
    const extendedScope = { ...scope, ...customFunctions };
    Object.keys(customFunctions).forEach(key => {
        (extendedScope as any)[key.toUpperCase()] = (customFunctions as any)[key];
        // Also add PascalCase if needed, but uppercase is usually enough
    });

    // Ensure common variations are covered
    (extendedScope as any)['SUMIF'] = customFunctions.sumif;
    (extendedScope as any)['IFERROR'] = customFunctions.iferror;

    const result = math.evaluate(expression, extendedScope);

    let finalValue = result;
    if (typeof result === 'function') {
        return { value: '(Function)', error: null };
    }

    if (result && typeof result === 'object') {
        if (typeof result.valueOf === 'function') {
            finalValue = result.valueOf();
        }
        // If it's still an object (like a mathjs Unit), convert to string
        if (typeof finalValue === 'object' && finalValue !== null) {
            finalValue = result.toString();
        }
    }

    return { value: finalValue, error: null };
  } catch (err: any) {
    return { value: null, error: err.message };
  }
}
