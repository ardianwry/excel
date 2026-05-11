export type CellCoord = {
  row: number;
  col: number;
};

export type SpreadsheetData = {
  [key: string]: string | number;
};

export interface Lesson {
  id: string;
  title: string;
  description: string;
  instructions: string;
  initialData: SpreadsheetData;
  targetCell: string;
  expectedResult: number | string;
  correctFormula?: string;
  hints: string[];
  explanation: string;
  type: 'formula' | 'shortcut' | 'data-entry';
  successMessage: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  unlocked: boolean;
  difficulty: Difficulty;
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert';

export type UserProgress = {
  completedLessons: string[];
  currentModuleId: string;
  difficulty: Difficulty;
};
