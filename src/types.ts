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

export interface FunctionSpec {
  id: string;
  code: string;
  name: string;
  description: string;
  parameters: string;
}
