import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings2, Save, Database, Cpu } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="p-8 max-w-4xl mx-auto h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center"><Settings2 className="w-6 h-6 mr-3 text-primary" /> Settings</h1>
        <p className="text-slate-600 mt-1">Configure your local AI models and study preferences</p>
      </div>

      <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1">
        <div className="w-64 border-r border-slate-200 bg-slate-50 p-4 space-y-2">
          <button onClick={() => setActiveTab('general')} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'general' ? 'bg-white shadow-sm border border-slate-200 text-slate-900' : 'text-slate-600 hover:bg-slate-100'}`}>Study Profile</button>
          <button onClick={() => setActiveTab('ai')} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'ai' ? 'bg-white shadow-sm border border-slate-200 text-slate-900' : 'text-slate-600 hover:bg-slate-100'}`}>
            <span className="flex items-center"><Cpu className="w-4 h-4 mr-2" /> Local AI</span>
          </button>
          <button onClick={() => setActiveTab('data')} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'data' ? 'bg-white shadow-sm border border-slate-200 text-slate-900' : 'text-slate-600 hover:bg-slate-100'}`}>
            <span className="flex items-center"><Database className="w-4 h-4 mr-2" /> Storage</span>
          </button>
        </div>

        <div className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold border-b border-slate-200 pb-2">Study Profile</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Target Exam</label>
                <input type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary" defaultValue="NEET-PG 2026" />
              </div>
              <div className="pt-4"><Button><Save className="w-4 h-4 mr-2" /> Save Profile</Button></div>
            </div>
          )}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold border-b border-slate-200 pb-2 flex items-center">Local AI Configuration</h2>
              <p className="text-sm text-slate-600 bg-blue-50 p-4 rounded-lg border border-blue-100">RecallPG uses your local hardware. Ensure Ollama is running.</p>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Ollama Base URL</label>
                <input type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary" defaultValue="http://localhost:11434" />
              </div>
              <div className="pt-4"><Button><Save className="w-4 h-4 mr-2" /> Save AI Settings</Button></div>
            </div>
          )}
          {activeTab === 'data' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold border-b border-slate-200 pb-2">Data & Storage</h2>
              <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 flex justify-between items-center">
                <div><h4 className="font-medium text-slate-800">Local Vector DB</h4><p className="text-sm text-slate-500 mt-1">ChromaDB Managed locally.</p></div>
                <Button variant="outline">Clear Vectors</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
