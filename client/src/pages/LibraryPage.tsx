import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Upload, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import api from '@/services/api';

export default function LibraryPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const fetchDocuments = async () => {
    try {
      const res = await api.get('/documents');
      setDocuments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDocuments();
    const interval = setInterval(fetchDocuments, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name);

    try {
      await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchDocuments();
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload document");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleOpenWorkspace = (doc: any) => {
     if (doc.processingStatus.toLowerCase() !== 'ready' && doc.processingStatus.toLowerCase() !== 'completed') {
         alert("Please wait for processing to complete before opening.");
         return;
     }
     navigate('/workspace', { state: { document: doc } });
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Library</h1>
          <p className="text-slate-600">Manage your NEET-PG study materials</p>
        </div>
        <div className="flex gap-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            className="hidden"
            accept="application/pdf"
          />
          <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            <Upload className="w-4 h-4 mr-2"/>
            {isUploading ? 'Uploading...' : 'Upload PDF'}
          </Button>
        </div>
      </div>

      <h2 className="text-xl font-bold mt-12 mb-4">Your Documents</h2>
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-500">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {documents.length === 0 ? (
              <tr><td colSpan={3} className="p-8 text-center text-slate-500">No documents yet. Upload a PDF to begin.</td></tr>
            ) : (
              documents.map(doc => (
                <DocumentRow key={doc._id} doc={doc} onClick={() => handleOpenWorkspace(doc)} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DocumentRow({ doc, onClick }: { doc: any, onClick: () => void }) {
  const getStatusIcon = (s: string) => {
    switch(s.toLowerCase()) {
      case 'ready':
      case 'completed':
        return <span className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium"><CheckCircle2 className="w-3 h-3 mr-1"/> Ready</span>;
      case 'uploaded':
      case 'processing':
      case 'started':
        return <span className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-xs font-medium"><Clock className="w-3 h-3 mr-1 animate-pulse"/> Processing</span>;
      case 'needs review':
      case 'failed':
        return <span className="flex items-center text-orange-600 bg-orange-50 px-2 py-1 rounded-full text-xs font-medium"><AlertCircle className="w-3 h-3 mr-1"/> {s}</span>;
      default:
        return <span className="flex items-center text-slate-600 bg-slate-50 px-2 py-1 rounded-full text-xs font-medium"><Clock className="w-3 h-3 mr-1"/> {s}</span>;
    }
  }

  return (
    <tr className="hover:bg-slate-50 cursor-pointer transition-colors" onClick={onClick}>
      <td className="p-4 font-medium flex items-center"><FileText className="w-4 h-4 text-primary mr-3"/> {doc.title}</td>
      <td className="p-4">{getStatusIcon(doc.processingStatus)}</td>
      <td className="p-4 text-slate-500">{new Date(doc.createdAt).toLocaleDateString()}</td>
    </tr>
  );
}
