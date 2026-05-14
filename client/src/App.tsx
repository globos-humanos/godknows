import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import LibraryPage from '@/pages/LibraryPage';
import DocumentWorkspacePage from '@/pages/DocumentWorkspacePage';
import TestPage from '@/pages/TestPage';
import RevisionPage from '@/pages/RevisionPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import MistakeNotebookPage from '@/pages/MistakeNotebookPage';
import SettingsPage from '@/pages/SettingsPage';
import MainLayout from '@/components/layout/MainLayout';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="library" element={<LibraryPage />} />
            <Route path="workspace" element={<DocumentWorkspacePage />} />
            <Route path="tests" element={<TestPage />} />
            <Route path="revision" element={<RevisionPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="mistakes" element={<MistakeNotebookPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
