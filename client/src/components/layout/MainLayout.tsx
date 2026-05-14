import { Outlet, Link } from 'react-router-dom';
import { Home, Library, BrainCircuit } from 'lucide-react';

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <BrainCircuit className="w-6 h-6 text-primary mr-2" />
          <span className="text-lg font-bold">RecallPG</span>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <SidebarItem to="/dashboard" icon={<Home className="w-5 h-5" />} label="Dashboard" />
          <SidebarItem to="/library" icon={<Library className="w-5 h-5" />} label="Library" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

function SidebarItem({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) {
  return (
    <Link to={to} className="flex items-center px-3 py-2.5 rounded-md hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors">
      <span className="mr-3">{icon}</span>
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );
}
