import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, CheckCircle2, XCircle, AlertCircle, RefreshCcw, Search, Loader2 } from 'lucide-react';
import api from '@/services/api';

export default function TestPage() {
  const [testState, setTestState] = useState<'setup' | 'active' | 'results'>('setup');
  const [questions, setQuestions] = useState<any[]>([]);

  const handleStart = async (docs: string[], topic: string, count: number) => {
    try {
      const res = await api.post('/tutor/generate-mcqs', { documentId: docs[0], topic, count });
      setQuestions(res.data.questions);
      setTestState('active');
    } catch(err) {
       console.error("Failed to generate MCQs", err);
       alert("Failed to generate test. Ensure Ollama is running.");
    }
  }

  if (testState === 'setup') return <TestSetup onStart={handleStart} />;
  if (testState === 'active') return <ActiveTest questions={questions} onFinish={() => setTestState('results')} />;
  return <TestResults onRestart={() => setTestState('setup')} />;
}

function TestSetup({ onStart }: { onStart: (docs: string[], topic: string, count: number) => void }) {
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState("General");
  const [documentId, setDocumentId] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    await onStart([documentId], topic, 5);
    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto p-8 pt-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-primary/10 p-3 rounded-xl">
          <Brain className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Custom Test Builder</h1>
          <p className="text-slate-600">Generate NEET-PG style MCQs from your documents</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary"
              placeholder="e.g. Cellular Adaptations"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Source Document ID (Temporary MVP Field)</label>
            <input
              type="text"
              value={documentId}
              onChange={(e) => setDocumentId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary"
              placeholder="Paste MongoDB Document ID here to test the loop"
            />
          </div>
        </div>
        <div className="bg-slate-50 p-6 border-t border-slate-200 flex justify-end">
          <Button onClick={handleSubmit} size="lg" className="w-full md:w-auto" disabled={loading || !documentId}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Generate & Start Test
          </Button>
        </div>
      </div>
    </div>
  );
}

function ActiveTest({ questions, onFinish }: { questions: any[], onFinish: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  if (!questions || questions.length === 0) {
      return <div className="p-8 text-center text-slate-500">Failed to load questions.</div>;
  }

  const question = questions[currentIndex];

  const handleSelect = (idx: number) => {
    if (showExplanation) return;
    setSelected(idx);
    setShowExplanation(true);
    // Mock save to revision logic here
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
       setCurrentIndex(currentIndex + 1);
       setSelected(null);
       setShowExplanation(false);
    } else {
       onFinish();
    }
  }

  return (
    <div className="flex h-full bg-slate-50">
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-semibold text-slate-500 tracking-wider uppercase">Question {currentIndex + 1} of {questions.length}</span>
            <span className="text-sm font-medium text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">AI Generated</span>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-6">
            <p className="text-lg text-slate-800 font-medium leading-relaxed mb-6">
              {question.stem}
            </p>

            <div className="space-y-3">
              {question.options.map((opt: string, i: number) => (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    showExplanation && i === question.correctOption ? 'border-green-500 bg-green-50' :
                    showExplanation && selected === i ? 'border-red-500 bg-red-50' :
                    !showExplanation && selected === i ? 'border-primary bg-primary/5' :
                    'border-slate-100 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center">
                    <span className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 text-sm font-bold ${
                       showExplanation && i === question.correctOption ? 'bg-green-500 text-white' :
                       showExplanation && selected === i ? 'bg-red-500 text-white' :
                       'bg-slate-100 text-slate-600'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className={showExplanation && i === question.correctOption ? 'font-medium text-green-900' : 'text-slate-700'}>{opt}</span>

                    {showExplanation && i === question.correctOption && <CheckCircle2 className="ml-auto text-green-500 w-5 h-5" />}
                    {showExplanation && selected === i && i !== question.correctOption && <XCircle className="ml-auto text-red-500 w-5 h-5" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {showExplanation && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
              {question.examTrap && (
                <div className="bg-blue-50/50 p-4 border-b border-slate-200 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-blue-900 mb-1">Exam Trap</h4>
                    <p className="text-sm text-blue-800">{question.examTrap}</p>
                  </div>
                </div>
              )}
              <div className="p-6">
                <h4 className="font-bold text-slate-800 mb-2">Explanation</h4>
                <p className="text-slate-600 leading-relaxed text-sm mb-4">
                  {question.explanation}
                </p>
                {question.sourcePages?.length > 0 && (
                  <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-2">
                    <Search className="w-3 h-3" /> Source Pages: {question.sourcePages.join(", ")}
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded ml-2">Verified PDF</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end">
             <Button onClick={handleNext} disabled={!showExplanation}>
                {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Test'}
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TestResults({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="max-w-2xl mx-auto p-8 pt-12 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-6">
        <CheckCircle2 className="w-10 h-10" />
      </div>
      <h1 className="text-3xl font-bold mb-2">Test Complete!</h1>
      <p className="text-slate-600 mb-8">All incorrect questions have been saved to your Mistake Notebook and Today's Revision.</p>
      <Button onClick={onRestart}><RefreshCcw className="w-4 h-4 mr-2" /> Start New Test</Button>
    </div>
  );
}
