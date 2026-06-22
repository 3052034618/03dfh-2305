import { Stethoscope, User, Settings, Bell, ChevronDown } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useState } from 'react';

export function Header() {
  const { currentStudent, students, setCurrentStudent } = useAppStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const roleLabels: Record<string, string> = {
    student: '学员',
    intern: '实习生',
    teacher: '培训老师'
  };

  const availableUsers = students;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-medical-500 to-medical-700 rounded-xl flex items-center justify-center">
          <Stethoscope className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">医助跟台培训模拟器</h1>
          <p className="text-xs text-gray-500">Medical Assistant Training Simulator</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
          >
            {currentStudent ? (
              <>
                <img
                  src={currentStudent.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentStudent.id}`}
                  alt={currentStudent.name}
                  className="w-8 h-8 rounded-full border-2 border-medical-200"
                />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-800">{currentStudent.name}</p>
                  <p className="text-xs text-gray-500">{roleLabels[currentStudent.role]}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </>
            ) : (
              <User className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-xs text-gray-500 mb-2">切换身份</p>
              </div>
              {availableUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => {
                    setCurrentStudent(user);
                    setShowUserMenu(false);
                  }}
                  className={`w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                    currentStudent?.id === user.id ? 'bg-medical-50' : ''
                  }`}
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">{roleLabels[user.role]} · {user.department}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
