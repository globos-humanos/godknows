import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FileText, MessageSquare, GraduationCap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/services/api';

export default function DocumentWorkspacePage() {
  const [activeTab, setActiveTab] = useState('tutor');
  const location = useLocation();
  const documentInfo = location.state?.document;

  if (!documentInfo) {
    return <div className="p-8 text-center text-slate-500">No document selected. Please open a document from the Library.</div>;
  }

  return (
    <div className="flex h-full bg-white">
      {/* Left Outline */}
      <div className="w-64 border-r border-slate-200 flex flex-col bg-slate-50/50">
        <div className="p-4 border-b border-slate-200">
          <h2 className="font-bold text-sm truncate" title={documentInfo.title}>{documentInfo.title}</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
           <div className="text-xs text-slate-500 italic px-2">Document workspace is ready.</div>
           {/* Future: Display extracted topics from document outline here */}
        </div>
      </div>

      {/* Center Learning Area */}
      <div className="flex-1 flex flex-col">
        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-4 pt-2">
          <TabButton active={activeTab === 'tutor'} onClick={() => setActiveTab('tutor')} icon={<GraduationCap className="w-4 h-4"/>} label="Tutor" />
          <TabButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={<MessageSquare className="w-4 h-4"/>} label="Chat" />
          <TabButton active={activeTab === 'source'} onClick={() => setActiveTab('source')} icon={<FileText className="w-4 h-4"/>} label="Source" />
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 relative">
          {activeTab === 'tutor' && <TutorView documentId={documentInfo._id} />}
          {activeTab === 'chat' && <ChatView documentId={documentInfo._id} />}
          {activeTab === 'source' && <SourceView />}
        </div>
      </div>

      {/* Right Context Panel - Placeholder for UI consistency */}
      <div className="w-80 border-l border-slate-200 p-4 bg-white flex flex-col hidden lg:flex">
        <h3 className="font-bold text-sm mb-4">Context Guidelines</h3>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm space-y-3">
          <p className="text-blue-800">Ensure your local Ollama instance is running to interact with this document.</p>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-3 border-b-2 font-medium text-sm transition-colors ${active ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  );
}

function TutorView({ documentId }: { documentId: string }) {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const handleTeach = async () => {
    if(!topic) return;
    setLoading(true);
    try {
      const res = await api.post('/tutor/teach', { documentId, topic });
      setResponse(res.data);
    } catch(err) {
      console.error(err);
      setResponse({ content: "Failed to generate tutor response. Make sure Ollama is running.", sourcePages: [] });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold mb-4">What topic should I teach you?</h2>
        <div className="flex gap-2 mb-6">
           <input
             value={topic}
             onChange={(e) => setTopic(e.target.value)}
             type="text"
             className="flex-1 p-2 border border-slate-200 rounded-lg outline-none focus:border-primary"
             placeholder="e.g. Cellular Adaptations..."
           />
           <Button onClick={handleTeach} disabled={loading || !topic}>
             {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <GraduationCap className="w-4 h-4 mr-2" />}
             Teach Me
           </Button>
        </div>

        {response && (
           <div className="space-y-4 pt-4 border-t border-slate-100">
             <div className="prose prose-sm max-w-none text-slate-700">
               {response.content.split('\n').map((line: string, i: number) => <p key={i}>{line}</p>)}
             </div>
             {response.sourcePages?.length > 0 && (
               <div className="text-xs text-slate-500 flex gap-2 items-center">
                 <span>Source Pages:</span>
                 {response.sourcePages.map((pg: number) => (
                    <span key={pg} className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">{pg}</span>
                 ))}
               </div>
             )}
           </div>
        )}
      </div>
    </div>
  );
}

function ChatView({ documentId }: { documentId: string }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  const handleSend = async () => {
    if(!query) return;
    const userMsg = { role: 'user', content: query };
    setMessages(prev => [...prev, userMsg]);
    setQuery("");
    setLoading(true);

    try {
      const res = await api.post('/tutor/chat', { documentId, query: userMsg.content });
      setMessages(prev => [...prev, { role: 'ai', content: res.data.content, sourcePages: res.data.sourcePages }]);
    } catch(err) {
      setMessages(prev => [...prev, { role: 'ai', content: "Error communicating with AI.", sourcePages: [] }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto h-full flex flex-col pb-16">
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.length === 0 && (
           <div className="text-center text-slate-400 mt-10">Ask a question about the document...</div>
        )}
        {messages.map((msg, i) => (
           <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
             <div className={`p-4 rounded-2xl max-w-[80%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-white border border-slate-200 shadow-sm rounded-tl-sm'}`}>
                <div className="prose prose-sm max-w-none whitespace-pre-wrap">{msg.content}</div>
                {msg.role === 'ai' && msg.sourcePages?.length > 0 && (
                   <div className="mt-3 pt-2 border-t border-slate-100 text-xs text-slate-500">
                     Citations: {msg.sourcePages.map((p:any) => `[Pg ${p}]`).join(", ")}
                   </div>
                )}
             </div>
           </div>
        ))}
        {loading && (
           <div className="flex justify-start">
             <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center">
               <Loader2 className="w-4 h-4 animate-spin text-primary" />
             </div>
           </div>
        )}
      </div>
      <div className="absolute bottom-4 left-4 right-4 max-w-3xl mx-auto bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask anything about this document..."
          className="flex-1 p-2 outline-none"
        />
        <Button size="sm" className="ml-2" onClick={handleSend} disabled={loading || !query}>Send</Button>
      </div>
    </div>
  );
}

function SourceView() {
  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col bg-slate-200 rounded-lg overflow-hidden border border-slate-300">
      <div className="bg-slate-100 border-b border-slate-300 p-2 flex justify-between items-center">
        <div className="text-sm font-medium px-2">Document Pages</div>
      </div>
      <div className="flex-1 p-8 flex justify-center items-center overflow-auto text-slate-500">
        (PDF Image rendering pending OCR integration phase)
      </div>
    </div>
  );
}
