import { Prompt } from '../types';

const STORAGE_KEY = 'ai_config_prompts';

const INITIAL_PROMPTS: Prompt[] = [
  { id: '1', code: 'PRMPT_SYS', identifier: 'sys_prompt_v1', content: 'You are a helpful assistant. Always answer in Markdown format.', version: 'v1.0.0' },
  { id: '2', code: 'PRMPT_CODE', identifier: 'code_gen_v1', content: 'You are an expert software engineer. Write clean, efficient code.', version: 'v1.1.0' },
];

export const promptsService = {
  getList: async (): Promise<Prompt[]> => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return INITIAL_PROMPTS;
  },
  save: async (data: Prompt[]): Promise<void> => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    await new Promise(resolve => setTimeout(resolve, 500));
  }
};
