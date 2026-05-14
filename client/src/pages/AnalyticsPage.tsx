import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BrainCircuit, Target, BookOpen, AlertTriangle } from 'lucide-react';

const accuracyData = [
  { name: 'Pathology', accuracy: 82 },
  { name: 'Anatomy', accuracy: 65 },
  { name: 'Pharma', accuracy: 78 },
  { name: 'Microbio', accuracy: 54 },
  { name: 'Physio', accuracy: 88 },
];

export default function AnalyticsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Analytics & Progress</h1>
        <p className="text-slate-600">Track your NEET-PG preparation over time</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<Target />} title="Overall Accuracy" value="74%" trend="+2% this week" trendColor="text-green-600" />
        <StatCard icon={<BrainCircuit />} title="Questions Attempted" value="1,245" trend="Top 10% of users" trendColor="text-primary" />
        <StatCard icon={<BookOpen />} title="Topics Mastered" value="42" trend="+5 this week" trendColor="text-green-600" />
        <StatCard icon={<AlertTriangle />} title="Weakest Subject" value="Microbiology" trend="54% accuracy" trendColor="text-orange-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-6">Accuracy by Subject</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={accuracyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="accuracy" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-lg mb-4 text-red-600 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" /> Action Required
          </h3>
          <p className="text-sm text-slate-500 mb-4">Focus your revision on these high-yield weak areas:</p>

          <div className="space-y-4 flex-1 overflow-y-auto">
            <WeakTopicItem subject="Microbiology" topic="Gram-positive Bacteria" accuracy="45%" />
            <WeakTopicItem subject="Anatomy" topic="Brachial Plexus" accuracy="50%" />
            <WeakTopicItem subject="Pathology" topic="Amyloidosis" accuracy="55%" />
            <WeakTopicItem subject="Pharmacology" topic="Anti-arrhythmics" accuracy="60%" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, trend, trendColor }: any) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <h4 className="text-3xl font-bold mt-1 mb-2">{value}</h4>
      <p className={`text-sm font-medium ${trendColor}`}>{trend}</p>
    </div>
  );
}

function WeakTopicItem({ subject, topic, accuracy }: { subject: string, topic: string, accuracy: string }) {
  return (
    <div className="p-3 bg-red-50/50 border border-red-100 rounded-lg flex justify-between items-center cursor-pointer hover:bg-red-50 transition-colors">
      <div>
        <h5 className="font-semibold text-slate-800 text-sm">{topic}</h5>
        <span className="text-xs text-slate-500">{subject}</span>
      </div>
      <div className="text-right">
        <span className="text-xs font-bold text-red-600 block">{accuracy}</span>
        <span className="text-[10px] text-slate-500 uppercase tracking-wider">Accuracy</span>
      </div>
    </div>
  );
}
