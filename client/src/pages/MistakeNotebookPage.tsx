import { BookMarked, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MistakeNotebookPage() {
  return (
    <div className="p-8 h-full flex flex-col bg-slate-50">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center"><BookMarked className="w-6 h-6 mr-3 text-primary" /> Mistake Notebook</h1>
          <p className="text-slate-600 mt-1">Review your past errors to build strong concepts</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input type="text" placeholder="Search mistakes..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary text-sm w-64" />
          </div>
          <Button variant="outline" size="icon"><Filter className="w-4 h-4" /></Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pb-8">
        <MistakeCard
          subject="Pathology"
          topic="Cellular Adaptations"
          question="Which adaptation is seen in the respiratory tract of a chronic smoker?"
          wrongAnswer="Hypertrophy"
          correctAnswer="Metaplasia"
          userNote="Squamous metaplasia replaces ciliated columnar epithelium to withstand stress."
          date="2 days ago"
        />
        <MistakeCard
          subject="Microbiology"
          topic="Gram Positive Cocci"
          question="Which test differentiates Staphylococcus from Streptococcus?"
          wrongAnswer="Coagulase test"
          correctAnswer="Catalase test"
          userNote="Staph = Catalase Positive. Staph aureus = Coagulase Positive."
          date="1 week ago"
        />
      </div>
    </div>
  );
}

function MistakeCard({ subject, topic, question, wrongAnswer, correctAnswer, userNote, date }: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded">{subject}</span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs font-medium text-slate-500">{topic}</span>
        </div>
        <span className="text-xs text-slate-400">{date}</span>
      </div>

      <p className="font-medium text-slate-800 mb-4">{question}</p>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="bg-red-50 text-red-900 p-3 rounded-lg border border-red-100">
          <div className="text-xs text-red-500 font-bold mb-1 uppercase tracking-wider">You Answered</div>
          {wrongAnswer}
        </div>
        <div className="bg-green-50 text-green-900 p-3 rounded-lg border border-green-100">
          <div className="text-xs text-green-600 font-bold mb-1 uppercase tracking-wider">Correct Answer</div>
          {correctAnswer}
        </div>
      </div>

      <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 mt-4 text-sm">
        <div className="font-bold text-amber-800 mb-1">My Note / Memory Hook</div>
        <p className="text-amber-900/80">{userNote}</p>
      </div>
    </div>
  );
}
