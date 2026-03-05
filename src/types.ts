export interface Criterion {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'Evaluation' | 'Generation' | 'Safety';
}

export interface Prompt {
  id: string;
  code: string;
  identifier: string;
  content: string;
  version: string;
}

export interface Column {
  id: string;
  label: string;
  name: string;
  type: string;
  description: string;
  isLocked?: boolean;
}

export interface Specification {
  id: string;
  code: string;
  name: string;
  themeColor: string;
  columns: Column[];
}
