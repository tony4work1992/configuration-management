import { Criterion } from '../types';

const STORAGE_KEY = 'ai_config_criteria';

const INITIAL_CRITERIA: Criterion[] = [
  { id: '1', code: 'CRIT_ACC', name: 'Accuracy Check', description: 'Ensures the model output is factually correct and grounded.', type: 'Evaluation' },
  { id: '2', code: 'CRIT_TONE', name: 'Tone Consistency', description: 'Verifies that the response maintains a professional and helpful tone.', type: 'Generation' },
  { id: '3', code: 'CRIT_SAFE', name: 'Safety Filter', description: 'Checks for harmful or inappropriate content.', type: 'Safety' },
];

export const criteriaService = {
  getList: async (): Promise<Criterion[]> => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return INITIAL_CRITERIA;
  },
  save: async (data: Criterion[]): Promise<void> => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
  }
};
