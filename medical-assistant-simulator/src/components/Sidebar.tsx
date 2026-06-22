import { Home, BookOpen, Play, RotateCcw, FileText, Users, ChevronRight } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const navItems = [
  { id: 'home', label: '首页', icon: Home },
  { id: 'case-select', label: '案例选择', icon: BookOpen },
  { id: 'training', label: '流程演练', icon: Play },
  { id: 'replay', label: '错误回放', icon: RotateCcw },
  { id: 'records', label: '成绩档案', icon: FileText },
  { id: 'teacher', label: '老师端', icon: Users, teacherOnly: true },
];

export function Sidebar() {
  const { currentView, setView, currentStudent } = useAppStore();

  const isTeacher = currentStudent?.role === 'teacher';

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col">
      <nav className="flex-1 p-4 space-y-1">
        {navItems
          .filter(item => !item.teacherOnly || isTeacher)
          .map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-medical-600 text-white shadow-lg shadow-medical-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-medical-600'}`} />
                <span className="font-medium">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>
            );
          })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="bg-gradient-to-br from-medical-50 to-blue-50 rounded-xl p-4">
          <p className="text-sm font-medium text-gray-700 mb-1">训练进度</p>
          <div className="h-2 bg-white rounded-full overflow-hidden mb-2">
            <div className="h-full bg-medical-500 rounded-full" style={{ width: '65%' }}></div>
          </div>
          <p className="text-xs text-gray-500">已完成 13/20 个案例</p>
        </div>
      </div>
    </aside>
  );
}
