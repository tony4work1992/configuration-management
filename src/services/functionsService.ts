import { FunctionSpec } from '../types';

const STORAGE_KEY = 'ai_config_functions';

const INITIAL_FUNCTIONS: FunctionSpec[] = [
  { id: '1', code: 'FUNC_WEATHER', name: 'get_weather', description: 'Retrieves the current weather for a given location.', parameters: '{\n  "location": "string",\n  "unit": "celsius"\n}' },
  { id: '2', code: 'FUNC_EMAIL', name: 'send_email', description: 'Sends an email to a recipient.', parameters: '{\n  "to": "string",\n  "subject": "string",\n  "body": "string"\n}' },
];

export const functionsService = {
  getList: async (): Promise<FunctionSpec[]> => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return INITIAL_FUNCTIONS;
  },
  save: async (data: FunctionSpec[]): Promise<void> => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    await new Promise(resolve => setTimeout(resolve, 500));
  }
};
