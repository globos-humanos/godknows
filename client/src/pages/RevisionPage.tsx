import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

export default function RevisionPage() {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-white border-b border-slate-200 p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center"><BookOpen className="w-6 h-6 mr-3 text-primary" /> Today's Revision</h1>
          <p className="text-slate-500 text-sm mt-1">45 items due today (Spaced Repetition)</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-[300px] flex flex-col">
            <div className="p-8 flex-1 flex items-center justify-center text-center border-b border-slate-100">
              <h2 className="text-2xl font-medium text-slate-800 leading-snug">
                Which type of necrosis is characteristic of tuberculosis infection?
              </h2>
            </div>

            {isRevealed ? (
              <div className="p-8 bg-slate-50/50 rounded-b-2xl">
                <div className="text-center mb-8">
                  <span className="text-green-600 font-bold text-xl">Caseous Necrosis</span>
                  <p className="text-slate-500 text-sm mt-4 max-w-md mx-auto">
                    It is a combination of coagulative and liquefactive necrosis. Macroscopically, it appears cheese-like.
                  </p>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <Button variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700 flex flex-col h-auto py-3" onClick={() => setIsRevealed(false)}>
                    <span className="font-bold">Again</span>
                    <span className="text-xs font-normal opacity-70">1 min</span>
                  </Button>
                  <Button variant="outline" className="text-orange-600 hover:bg-orange-50 hover:text-orange-700 flex flex-col h-auto py-3" onClick={() => setIsRevealed(false)}>
                    <span className="font-bold">Hard</span>
                    <span className="text-xs font-normal opacity-70">1 day</span>
                  </Button>
                  <Button variant="outline" className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 flex flex-col h-auto py-3" onClick={() => setIsRevealed(false)}>
                    <span className="font-bold">Good</span>
                    <span className="text-xs font-normal opacity-70">3 days</span>
                  </Button>
                  <Button variant="outline" className="text-green-600 hover:bg-green-50 hover:text-green-700 flex flex-col h-auto py-3" onClick={() => setIsRevealed(false)}>
                    <span className="font-bold">Easy</span>
                    <span className="text-xs font-normal opacity-70">7 days</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-6 flex justify-center">
                <Button size="lg" onClick={() => setIsRevealed(true)} className="px-12 text-lg h-14 rounded-xl shadow-md">
                  Reveal Answer
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
