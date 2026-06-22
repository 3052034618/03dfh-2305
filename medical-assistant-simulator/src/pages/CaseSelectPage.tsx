import { useState } from 'react';
import { Eye, Nose, Syringe, Zap, Search, Clock, Filter, Star, ChevronRight } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { cases } from '../data/cases';

export function CaseSelectPage() {
  const { setView, setSelectedCase, currentStudent, records } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

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

  const categories = ['all', ...new Set(cases.map(c => c.category))];

  const filteredCases = cases.filter(c => {
    const matchesSearch = c.name.includes(searchTerm) || c.description.includes(searchTerm);
    const matchesDifficulty = difficultyFilter === 'all' || c.difficulty === difficultyFilter;
    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const getCaseStats = (caseId: string) => {
    const caseRecords = records.filter(r => r.caseId === caseId && r.studentId === currentStudent?.id);
    const bestScore = caseRecords.length > 0 ? Math.max(...caseRecords.map(r => r.totalScore)) : null;
    return { bestScore, attempts: caseRecords.length };
  };

  const handleStartCase = (caseItem: any) => {
    setSelectedCase(caseItem);
    setView('training');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">选择训练案例</h2>
          <p className="text-gray-500 mt-1">选择一个医美项目开始跟台训练</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索案例..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-64"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">难度：</span>
          <div className="flex gap-2">
            {['all', 'easy', 'medium', 'hard'].map(diff => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  difficultyFilter === diff
                    ? 'bg-medical-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {diff === 'all' ? '全部' : difficultyLabels[diff]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">分类：</span>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="select-field w-36 py-1"
          >
            <option value="all">全部分类</option>
            {categories.filter(c => c !== 'all').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {filteredCases.map(caseItem => {
          const Icon = iconMap[caseItem.icon] || Eye;
          const stats = getCaseStats(caseItem.id);
          
          return (
            <div key={caseItem.id} className="card-hover group">
              <div className="flex gap-6">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-medical-100 to-blue-100 flex items-center justify-center group-hover:from-medical-500 group-hover:to-blue-500 transition-all">
                  <Icon className="w-12 h-12 text-medical-600 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-800">{caseItem.name}</h3>
                        <span className={`badge ${difficultyColors[caseItem.difficulty]}`}>
                          {difficultyLabels[caseItem.difficulty]}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{caseItem.category}</p>
                    </div>
                    {stats.bestScore && (
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-yellow-500" />
                        <span className="font-bold">{stats.bestScore}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{caseItem.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {caseItem.duration}分钟
                    </span>
                    <span>{caseItem.steps.length}个步骤</span>
                    <span>{caseItem.commands.length}个口令</span>
                    {stats.attempts > 0 && <span>已练习{stats.attempts}次</span>}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleStartCase(caseItem)}
                      className="btn-primary flex items-center gap-2"
                    >
                      开始训练
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-gray-400">
                      关键步骤：{caseItem.steps.filter(s => s.keyInputs?.length).length}个要点输入
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">训练步骤预览：</p>
                <div className="flex flex-wrap gap-2">
                  {caseItem.steps.slice(0, 4).map((step, i) => (
                    <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {step.name}
                    </span>
                  ))}
                  {caseItem.steps.length > 4 && (
                    <span className="text-xs text-gray-400">+{caseItem.steps.length - 4}个步骤</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
