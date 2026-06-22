import { Eye, Nose, Syringe, Zap, TrendingUp, Award, Clock, AlertTriangle, ChevronRight } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { cases } from '../data/cases';

export function HomePage() {
  const { setView, currentStudent, records, assignments, setSelectedCase } = useAppStore();
  
  const myRecords = records.filter(r => r.studentId === currentStudent?.id);
  const myAssignments = assignments.filter(a => a.studentId === currentStudent?.id && a.status === 'pending');
  
  const avgScore = myRecords.length > 0 
    ? Math.round(myRecords.reduce((sum, r) => sum + r.totalScore, 0) / myRecords.length)
    : 0;

  const recentRecord = myRecords[myRecords.length - 1];

  const quickCases = cases.slice(0, 4);
  const iconMap: Record<string, any> = { Eye, Nose, Syringe, Zap };

  const difficultyColors: Record<string, string> = {
    easy: 'badge-easy',
    medium: 'badge-medium',
    hard: 'badge-hard'
  };

  const difficultyLabels: Record<string, string> = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  };

  const handleStartCase = (caseItem: any) => {
    setSelectedCase(caseItem);
    setView('training');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-medical-600 to-blue-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">欢迎回来，{currentStudent?.name}！</h2>
          <p className="text-white/80 mb-6">今天也要努力练习，成为一名优秀的医助</p>
          
          {myAssignments.length > 0 && (
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4 inline-flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-300" />
              <span>您有 {myAssignments.length} 个待完成的强化训练任务</span>
              <button 
                onClick={() => setView('replay')}
                className="ml-2 bg-white text-medical-600 px-3 py-1 rounded-lg text-sm font-medium hover:bg-medical-50 transition-colors"
              >
                立即查看
              </button>
            </div>
          )}

          <div className="flex gap-4">
            <button 
              onClick={() => setView('case-select')}
              className="bg-white text-medical-600 px-6 py-3 rounded-xl font-semibold hover:bg-medical-50 transition-all shadow-lg"
            >
              开始训练
            </button>
            <button 
              onClick={() => setView('records')}
              className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all border border-white/30"
            >
              查看成绩
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{myRecords.length}</p>
              <p className="text-sm text-gray-500">完成训练</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-medical-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-medical-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{avgScore}</p>
              <p className="text-sm text-gray-500">平均分数</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{myRecords.reduce((s, r) => s + (cases.find(c => c.id === r.caseId)?.duration || 0), 0)}</p>
              <p className="text-sm text-gray-500">训练时长(分钟)</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {myRecords.reduce((s, r) => s + r.errors.length, 0)}
              </p>
              <p className="text-sm text-gray-500">累计错误</p>
            </div>
          </div>
        </div>
      </div>

      {recentRecord && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">最近训练</h3>
            <button onClick={() => setView('records')} className="text-medical-600 text-sm hover:underline flex items-center gap-1">
              查看全部 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-6 bg-gradient-to-r from-gray-50 to-medical-50 rounded-xl p-4">
            <div className="w-20 h-20 rounded-2xl bg-white shadow-md flex items-center justify-center">
              <span className="text-3xl font-bold text-medical-600">{recentRecord.totalScore}</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 mb-1">{recentRecord.caseName}</h4>
              <p className="text-sm text-gray-500 mb-2">{recentRecord.endTime}</p>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(recentRecord.scores).map(([key, value]) => (
                  <span key={key} className="text-xs bg-white px-2 py-1 rounded-full text-gray-600">
                    {key === 'procedureFamiliarity' && '流程'}
                    {key === 'reactionSpeed' && '反应'}
                    {key === 'riskAwareness' && '风险'}
                    {key === 'communicationEtiquette' && '沟通'}
                    : {value}分
                  </span>
                ))}
              </div>
            </div>
            {recentRecord.weakPoints.length > 0 && (
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">薄弱环节</p>
                <div className="flex flex-col gap-1">
                  {recentRecord.weakPoints.slice(0, 2).map((wp, i) => (
                    <span key={i} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full">
                      {wp}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">快速开始</h3>
          <button onClick={() => setView('case-select')} className="text-medical-600 text-sm hover:underline flex items-center gap-1">
            查看全部 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {quickCases.map(caseItem => {
            const Icon = iconMap[caseItem.icon] || Eye;
            return (
              <div 
                key={caseItem.id}
                onClick={() => handleStartCase(caseItem)}
                className="card-hover group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-medical-100 group-hover:bg-medical-500 transition-colors flex items-center justify-center">
                    <Icon className="w-6 h-6 text-medical-600 group-hover:text-white transition-colors" />
                  </div>
                  <span className={`badge ${difficultyColors[caseItem.difficulty]}`}>
                    {difficultyLabels[caseItem.difficulty]}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">{caseItem.name}</h4>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{caseItem.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {caseItem.duration}分钟
                  </span>
                  <span>{caseItem.steps.length}个步骤</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
