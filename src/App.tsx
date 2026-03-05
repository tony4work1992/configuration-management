import { useState, useEffect } from 'react';
import { CheckSquare, Terminal, Code, Settings, Plus, X, Edit2, Trash2, Save, ChevronDown } from 'lucide-react';
import { Criterion, Prompt, Specification, Column } from './types';
import { criteriaService } from './services/criteriaService';
import { promptsService } from './services/promptsService';
import { specificationsService } from './services/specificationsService';

type Tab = 'criteria' | 'prompts' | 'specifications';

const PROJECTS = [
  { id: 'proj_alpha', name: 'Project Alpha' },
  { id: 'proj_beta', name: 'Project Beta' },
  { id: 'proj_gamma', name: 'Project Gamma' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('criteria');
  const [selectedProject, setSelectedProject] = useState(PROJECTS[0].id);
  
  // Data State
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [specifications, setSpecifications] = useState<Specification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [c, p, s] = await Promise.all([
          criteriaService.getList(),
          promptsService.getList(),
          specificationsService.getList()
        ]);
        setCriteria(c);
        setPrompts(p);
        setSpecifications(s);
      } catch (error) {
        console.error('Failed to load data', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Add/Update Handlers
  const handleAddCriterion = () => {
    const newItem: Criterion = {
      id: Date.now().toString(),
      code: `CRIT-${Date.now().toString().slice(-4)}`,
      name: 'New Criterion',
      description: '',
      type: 'Evaluation'
    };
    setCriteria([...criteria, newItem]);
    return newItem;
  };

  const handleUpdateCriterion = (updated: Criterion) => {
    setCriteria(criteria.map(c => c.id === updated.id ? updated : c));
  };

  const handleAddPrompt = () => {
    const newItem: Prompt = {
      id: Date.now().toString(),
      code: `PRMT-${Date.now().toString().slice(-4)}`,
      identifier: 'new-prompt',
      content: '',
      version: '1.0'
    };
    setPrompts([...prompts, newItem]);
    return newItem;
  };

  const handleUpdatePrompt = (updated: Prompt) => {
    setPrompts(prompts.map(p => p.id === updated.id ? updated : p));
  };

  const handleAddSpecification = () => {
    const newItem: Specification = {
      id: Date.now().toString(),
      code: `SPEC-${Date.now().toString().slice(-4)}`,
      name: 'New Specification',
      themeColor: '#00C48C',
      columns: [
        { id: Date.now().toString() + '-1', label: 'No', name: 'no', type: 'Number', description: 'increment from 1', isLocked: true },
        { id: Date.now().toString() + '-2', label: 'Code', name: 'code', type: 'Text', description: 'Unique identifier', isLocked: true }
      ]
    };
    setSpecifications([...specifications, newItem]);
    return newItem;
  };

  const handleUpdateSpecification = (updated: Specification) => {
    setSpecifications(specifications.map(s => s.id === updated.id ? updated : s));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      if (activeTab === 'criteria') {
        await criteriaService.save(criteria);
      } else if (activeTab === 'prompts') {
        await promptsService.save(prompts);
      } else if (activeTab === 'specifications') {
        await specificationsService.save(specifications);
      }
      alert('Data saved successfully!');
    } catch (error) {
      console.error('Failed to save data', error);
      alert('Failed to save data.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      if (activeTab === 'criteria') setCriteria(criteria.filter(c => c.id !== id));
      if (activeTab === 'prompts') setPrompts(prompts.filter(p => p.id !== id));
      if (activeTab === 'specifications') setSpecifications(specifications.filter(s => s.id !== id));
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-600" />
          <h1 className="font-semibold text-lg tracking-tight">AI Config Manager</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="pl-3 pr-10 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64 appearance-none bg-white cursor-pointer"
            >
              {PROJECTS.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-slate-200 px-8 pt-2 shrink-0">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('criteria')}
            className={`flex items-center gap-2 pb-3 border-b-2 text-sm font-medium transition-colors ${
              activeTab === 'criteria'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            Criteria
          </button>
          <button
            onClick={() => setActiveTab('prompts')}
            className={`flex items-center gap-2 pb-3 border-b-2 text-sm font-medium transition-colors ${
              activeTab === 'prompts'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Terminal className="w-4 h-4" />
            System Prompts
          </button>
          <button
            onClick={() => setActiveTab('specifications')}
            className={`flex items-center gap-2 pb-3 border-b-2 text-sm font-medium transition-colors ${
              activeTab === 'specifications'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Code className="w-4 h-4" />
            Specifications
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden p-8">
        <div className="h-full flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="flex-1 overflow-hidden h-full">
            {isLoading ? (
              <div className="flex items-center justify-center h-full text-slate-500">Loading...</div>
            ) : (
              <>
                {activeTab === 'criteria' && (
                  <CriteriaTab 
                    data={criteria} 
                    onUpdate={handleUpdateCriterion} 
                    onDelete={handleDelete}
                    onSave={handleSaveAll}
                    onAdd={handleAddCriterion}
                    isSaving={isSaving}
                  />
                )}
                {activeTab === 'prompts' && (
                  <PromptsTab 
                    data={prompts} 
                    onUpdate={handleUpdatePrompt} 
                    onDelete={handleDelete}
                    onSave={handleSaveAll}
                    onAdd={handleAddPrompt}
                    isSaving={isSaving}
                  />
                )}
                {activeTab === 'specifications' && (
                  <SpecificationsTab 
                    data={specifications} 
                    onUpdate={handleUpdateSpecification} 
                    onDelete={handleDelete}
                    onSave={handleSaveAll}
                    onAdd={handleAddSpecification}
                    isSaving={isSaving}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function CriteriaTab({ data, onUpdate, onDelete, onSave, onAdd, isSaving }: { data: Criterion[], onUpdate: (item: Criterion) => void, onDelete: (id: string) => void, onSave: () => void, onAdd: () => Criterion, isSaving: boolean }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedItem = data.find(item => item.id === selectedId);

  const handleAdd = () => {
    const newItem = onAdd();
    setSelectedId(newItem.id);
  };

  return (
    <div className="flex h-full">
      {/* Sidebar List */}
      <div className="w-1/3 border-r border-slate-200 flex flex-col bg-slate-50">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white sticky top-0 z-10">
          <h3 className="font-semibold text-slate-700">Criteria List</h3>
          <button 
            onClick={handleAdd}
            className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-3 h-3" />
            New
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-2 space-y-2">
          {data.length === 0 ? (
            <div className="p-4 text-center text-slate-500 text-sm">No items.</div>
          ) : (
            data.map((item) => (
              <div 
                key={item.id} 
                onClick={() => setSelectedId(item.id)}
                className={`p-3 rounded-md cursor-pointer transition-colors border ${
                  selectedId === item.id 
                    ? 'bg-white border-indigo-500 shadow-sm ring-1 ring-indigo-500' 
                    : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-mono text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{item.code}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(item.id); if(selectedId === item.id) setSelectedId(null); }}
                    className="text-slate-400 hover:text-red-600 p-1 -mr-1 -mt-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <div className="font-medium text-sm text-slate-900 truncate">{item.name || 'Untitled'}</div>
                <div className="text-xs text-slate-500 mt-1 truncate">{item.description || 'No description'}</div>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${
                    item.type === 'Evaluation' ? 'bg-blue-100 text-blue-800' :
                    item.type === 'Generation' ? 'bg-green-100 text-green-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {item.type}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail View */}
      <div className="w-2/3 flex flex-col bg-white">
        {selectedItem ? (
          <>
            <div className="p-4 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="font-semibold text-slate-900">Edit Criterion</h3>
              <button 
                onClick={onSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 shadow-sm"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Code</label>
                  <input
                    type="text"
                    value={selectedItem.code}
                    disabled
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm bg-slate-100 text-slate-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={selectedItem.name}
                    onChange={(e) => onUpdate({...selectedItem, name: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select
                    value={selectedItem.type}
                    onChange={(e) => onUpdate({...selectedItem, type: e.target.value as any})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Evaluation">Evaluation</option>
                    <option value="Generation">Generation</option>
                    <option value="Safety">Safety</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea
                    value={selectedItem.description}
                    onChange={(e) => onUpdate({...selectedItem, description: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
            Select an item from the list to view details
          </div>
        )}
      </div>
    </div>
  );
}

function PromptsTab({ data, onUpdate, onDelete, onSave, onAdd, isSaving }: { data: Prompt[], onUpdate: (item: Prompt) => void, onDelete: (id: string) => void, onSave: () => void, onAdd: () => Prompt, isSaving: boolean }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedItem = data.find(item => item.id === selectedId);

  const handleAdd = () => {
    const newItem = onAdd();
    setSelectedId(newItem.id);
  };

  return (
    <div className="flex h-full">
      {/* Sidebar List */}
      <div className="w-1/3 border-r border-slate-200 flex flex-col bg-slate-50">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white sticky top-0 z-10">
          <h3 className="font-semibold text-slate-700">Prompts List</h3>
          <button 
            onClick={handleAdd}
            className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-3 h-3" />
            New
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-2 space-y-2">
          {data.length === 0 ? (
            <div className="p-4 text-center text-slate-500 text-sm">No items.</div>
          ) : (
            data.map((item) => (
              <div 
                key={item.id} 
                onClick={() => setSelectedId(item.id)}
                className={`p-3 rounded-md cursor-pointer transition-colors border ${
                  selectedId === item.id 
                    ? 'bg-white border-indigo-500 shadow-sm ring-1 ring-indigo-500' 
                    : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-mono text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{item.code}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(item.id); if(selectedId === item.id) setSelectedId(null); }}
                    className="text-slate-400 hover:text-red-600 p-1 -mr-1 -mt-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <div className="font-medium text-sm text-slate-900 truncate">{item.identifier || 'Untitled'}</div>
                <div className="text-xs text-slate-500 mt-1 truncate">{item.content || 'No content'}</div>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                    v{item.version}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail View */}
      <div className="w-2/3 flex flex-col bg-white">
        {selectedItem ? (
          <>
            <div className="p-4 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="font-semibold text-slate-900">Edit Prompt</h3>
              <button 
                onClick={onSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 shadow-sm"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Code</label>
                  <input
                    type="text"
                    value={selectedItem.code}
                    disabled
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm bg-slate-100 text-slate-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Identifier</label>
                  <input
                    type="text"
                    value={selectedItem.identifier}
                    onChange={(e) => onUpdate({...selectedItem, identifier: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Version</label>
                  <input
                    type="text"
                    value={selectedItem.version}
                    onChange={(e) => onUpdate({...selectedItem, version: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                  <textarea
                    value={selectedItem.content}
                    onChange={(e) => onUpdate({...selectedItem, content: e.target.value})}
                    rows={12}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
            Select an item from the list to view details
          </div>
        )}
      </div>
    </div>
  );
}

function SpecificationsTab({ data, onUpdate, onDelete, onSave, onAdd, isSaving }: { data: Specification[], onUpdate: (item: Specification) => void, onDelete: (id: string) => void, onSave: () => void, onAdd: () => Specification, isSaving: boolean }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedItem = data.find(item => item.id === selectedId);

  const handleAdd = () => {
    const newItem = onAdd();
    setSelectedId(newItem.id);
  };

  const handleAddColumn = () => {
    if (!selectedItem) return;
    const newColumn: Column = {
      id: Date.now().toString(),
      label: '',
      name: '',
      type: 'Text',
      description: ''
    };
    onUpdate({
      ...selectedItem,
      columns: [...selectedItem.columns, newColumn]
    });
  };

  const handleUpdateColumn = (colId: string, updates: Partial<Column>) => {
    if (!selectedItem) return;
    onUpdate({
      ...selectedItem,
      columns: selectedItem.columns.map(col => col.id === colId ? { ...col, ...updates } : col)
    });
  };

  const THEME_COLORS = ['#00C48C', '#4D8AF0', '#FFB900', '#FF6B6B', '#A284FF', '#8E9297'];

  return (
    <div className="flex h-full">
      {/* Sidebar List */}
      <div className="w-1/3 border-r border-slate-200 flex flex-col bg-slate-50">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white sticky top-0 z-10">
          <h3 className="font-semibold text-slate-700">Specifications</h3>
          <button 
            onClick={handleAdd}
            className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-3 h-3" />
            New
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-2 space-y-2">
          {data.length === 0 ? (
            <div className="p-4 text-center text-slate-500 text-sm">No items.</div>
          ) : (
            data.map((item) => (
              <div 
                key={item.id} 
                onClick={() => setSelectedId(item.id)}
                className={`p-3 rounded-md cursor-pointer transition-colors border ${
                  selectedId === item.id 
                    ? 'bg-white border-indigo-500 shadow-sm ring-1 ring-indigo-500' 
                    : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-mono text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{item.code}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(item.id); if(selectedId === item.id) setSelectedId(null); }}
                    className="text-slate-400 hover:text-red-600 p-1 -mr-1 -mt-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <div className="font-medium text-sm text-slate-900 truncate">{item.name || 'Untitled'}</div>
                <div className="text-xs text-slate-500 mt-1 truncate">{item.columns.length} columns</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail View */}
      <div className="w-2/3 flex flex-col bg-white">
        {selectedItem ? (
          <>
            <div className="p-4 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="font-semibold text-slate-900">Edit Table Structure</h3>
              <button 
                onClick={onSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-sm"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-8">
                {/* Panel Title */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Panel Title</label>
                  <input
                    type="text"
                    value={selectedItem.name}
                    onChange={(e) => onUpdate({...selectedItem, name: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                    placeholder="Enter panel title"
                  />
                </div>

                {/* Table Theme */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Table Theme</label>
                  <div className="flex gap-3">
                    {THEME_COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => onUpdate({...selectedItem, themeColor: color})}
                        className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                          selectedItem.themeColor === color ? 'border-slate-900 scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Columns */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Columns</label>
                  <div className="space-y-3">
                    {selectedItem.columns.map((col) => (
                      <div key={col.id} className="flex items-center gap-3">
                        <div className="text-slate-300">
                          {col.isLocked ? <Settings className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 opacity-50" />}
                        </div>
                        <div className="flex-1 grid grid-cols-4 gap-2">
                          <input
                            type="text"
                            value={col.label}
                            onChange={(e) => handleUpdateColumn(col.id, { label: e.target.value })}
                            className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="Label"
                          />
                          <input
                            type="text"
                            value={col.name}
                            onChange={(e) => handleUpdateColumn(col.id, { name: e.target.value })}
                            className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                            placeholder="name"
                          />
                          <select
                            value={col.type}
                            onChange={(e) => handleUpdateColumn(col.id, { type: e.target.value })}
                            className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                          >
                            <option value="Text">Text</option>
                            <option value="Number">Number</option>
                            <option value="Select">Select</option>
                            <option value="Date">Date</option>
                          </select>
                          <input
                            type="text"
                            value={col.description}
                            onChange={(e) => handleUpdateColumn(col.id, { description: e.target.value })}
                            className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="Description"
                          />
                        </div>
                        {!col.isLocked && (
                          <button 
                            onClick={() => onUpdate({
                              ...selectedItem,
                              columns: selectedItem.columns.filter(c => c.id !== col.id)
                            })}
                            className="text-slate-300 hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    
                    <button 
                      onClick={handleAddColumn}
                      className="w-full py-3 border-2 border-dashed border-slate-200 rounded-md text-indigo-600 text-sm font-medium hover:border-indigo-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Column
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
            Select an item from the list to view details
          </div>
        )}
      </div>
    </div>
  );
}
