import { Specification } from '../types';

const STORAGE_KEY = 'ai_config_specifications';

const INITIAL_SPECS: Specification[] = [
  { 
    id: '1', 
    code: 'SPEC-001', 
    name: 'Form Fields', 
    themeColor: '#00C48C',
    columns: [
      { id: 'c1', label: 'No', name: 'no', type: 'Number', description: 'increment from 1', isLocked: true },
      { id: 'c2', label: 'Code', name: 'code', type: 'Text', description: 'Unique identifier for the UI element (e.g., UI-01)', isLocked: true },
      { id: 'c3', label: 'Field Name', name: 'field_name', type: 'Text', description: 'Label of the field shown to the user' },
      { id: 'c4', label: 'Type', name: 'type', type: 'Select', description: 'Type of input control' },
      { id: 'c5', label: 'Required', name: 'required', type: 'Select', description: 'Is this field mandatory?' },
      { id: 'c6', label: 'Description', name: 'description', type: 'Text', description: 'Detailed description of the field\'s purpose' },
    ]
  },
];

export const specificationsService = {
  getList: async (): Promise<Specification[]> => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return INITIAL_SPECS;
  },
  save: async (data: Specification[]): Promise<void> => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    await new Promise(resolve => setTimeout(resolve, 500));
  }
};
