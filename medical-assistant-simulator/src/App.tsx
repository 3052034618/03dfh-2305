import { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import { HomePage } from './pages/HomePage';
import { CaseSelectPage } from './pages/CaseSelectPage';
import { TrainingPage } from './pages/TrainingPage';
import { ReplayPage } from './pages/ReplayPage';
import { RecordsPage } from './pages/RecordsPage';
import { TeacherPage } from './pages/TeacherPage';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';

function App() {
  const { currentView, loadData, currentStudent } = useAppStore();

  useEffect(() => {
    loadData();
  }, [loadData]);

  const renderPage = () => {
    switch (currentView) {
      case 'home':
        return <HomePage />;
      case 'case-select':
        return <CaseSelectPage />;
      case 'training':
        return <TrainingPage />;
      case 'replay':
        return <ReplayPage />;
      case 'records':
        return <RecordsPage />;
      case 'teacher':
        return <TeacherPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {currentStudent && <Sidebar />}
        <main className="flex-1 overflow-auto p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
