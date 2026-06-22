import { useState } from 'react';
import { FileText, TrendingUp, Award, Calendar, Download, Filter, Eye, AlertTriangle, CheckCircle, XCircle, Clock, User } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { cases } from '../data/cases';

export function RecordsPage() {
  const { records, currentStudent, students } = useAppStore();
  const [selectedStudent, setSelectedStudent] = useState<string>(currentStudent?.id || 'all');
  const [selectedCase, setSelectedCase] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'analysis'>('list');
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);

  const isTeacher = currentStudent?.role === 'teacher';
  
  const filteredRecords = records.filter(r => {
    const studentMatch = isTeacher 
      ? (selectedStudent === 'all' || r.studentId === selectedStudent)
      : r.studentId === currentStudent?.id;
    const caseMatch = selectedCase === 'all' || r.caseId === selectedCase;
    return studentMatch && caseMatch;
  });

  const overallStats = {
    totalTrainings: filteredRecords.length,
    avgScore: filteredRecords.length > 0 
      ? Math.round(filteredRecords.reduce((s, r) => s + r.totalScore, 0) / filteredRecords.length)
      : 0,
    totalErrors: filteredRecords.reduce((s, r) => s + r.errors.length, 0),
    passRate: filteredRecords.length > 0
      ? Math.round((filteredRecords.filter(r => r.totalScore >= 60).length / filteredRecords.length) * 100)
      : 0
  };

  const scoreDistribution = {
    excellent: filteredRecords.filter(r => r.totalScore >= 90).length,
    good: filteredRecords.filter(r => r.totalScore >= 80 && r.totalScore < 90).length,
    pass: filteredRecords.filter(r => r.totalScore >= 60 && r.totalScore < 80).length,
    fail: filteredRecords.filter(r => r.totalScore < 60).length
  };

  const dimensionScores = filteredRecords.length > 0 ? {
    procedureFamiliarity: Math.round(filteredRecords.reduce((s, r) => s + r.scores.procedureFamiliarity, 0) / filteredRecords.length),
    reactionSpeed: Math.round(filteredRecords.reduce((s, r) => s + r.scores.reactionSpeed, 0) / filteredRecords.length),
    riskAwareness: Math.round(filteredRecords.reduce((s, r) => s + r.scores.riskAwareness, 0) / filteredRecords.length),
    communicationEtiquette: Math.round(filteredRecords.reduce((s, r) => s + r.scores.communicationEtiquette, 0) / filteredRecords.length)
  } : { procedureFamiliarity: 0, reactionSpeed: 0, riskAwareness: 0, communicationEtiquette: 0 };

  const studentList = isTeacher ? students.filter(s => s.role !== 'teacher') : [currentStudent!];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-50';
    if (score >= 80) return 'bg-blue-50';
    if (score >= 60) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">成绩档案</h2>
          <p className="text-gray-500 mt-1">查看训练成绩和能力分析</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-medical-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            成绩列表
          </button>
          <button
            onClick={() => setViewMode('analysis')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'analysis'
                ? 'bg-medical-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            能力分析
          </button>
          {isTeacher && (
            <button className="btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" />
              导出报表
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          {isTeacher && (
            <select
              value={selectedStudent}
              onChange={e => setSelectedStudent(e.target.value)}
              className="select-field w-40 py-1"
            >
              <option value="all">全部学员</option>
              {studentList.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          )}
          <select
            value={selectedCase}
            onChange={e => setSelectedCase(e.target.value)}
            className="select-field w-40 py-1"
          >
            <option value="all">全部案例</option>
            {cases.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800">{overallStats.totalTrainings}</p>
              <p className="text-sm text-gray-500">训练次数</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-medical-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-medical-600" />
            </div>
            <div>
              <p className={`text-3xl font-bold ${getScoreColor(overallStats.avgScore)}`}>
                {overallStats.avgScore}
              </p>
              <p className="text-sm text-gray-500">平均分数</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">{overallStats.passRate}%</p>
              <p className="text-sm text-gray-500">通过率</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-red-600">{overallStats.totalErrors}</p>
              <p className="text-sm text-gray-500">累计错误</p>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'list' && (
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">训练记录列表</h3>
          {filteredRecords.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">暂无训练记录</p>
              <p className="text-gray-400 text-sm mt-2">开始训练后成绩将显示在这里</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    {isTeacher && <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">学员</th>}
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">项目</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">完成时间</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">总分</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">流程</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">反应</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">风险</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">沟通</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">错误</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.slice().reverse().map(record => (
                    <>
                      <tr 
                        key={record.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        {isTeacher && (
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${record.studentId}`}
                                alt={record.studentName}
                                className="w-7 h-7 rounded-full"
                              />
                              <span className="text-sm text-gray-800">{record.studentName}</span>
                            </div>
                          </td>
                        )}
                        <td className="py-3 px-4">
                          <span className="text-sm font-medium text-gray-800">{record.caseName}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600">{record.endTime}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center justify-center w-12 h-8 rounded-lg font-bold ${getScoreBg(record.totalScore)} ${getScoreColor(record.totalScore)}`}>
                            {record.totalScore}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-sm font-medium ${getScoreColor(record.scores.procedureFamiliarity)}`}>
                            {record.scores.procedureFamiliarity}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-sm font-medium ${getScoreColor(record.scores.reactionSpeed)}`}>
                            {record.scores.reactionSpeed}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-sm font-medium ${getScoreColor(record.scores.riskAwareness)}`}>
                            {record.scores.riskAwareness}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-sm font-medium ${getScoreColor(record.scores.communicationEtiquette)}`}>
                            {record.scores.communicationEtiquette}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-sm font-medium ${
                            record.errors.length === 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {record.errors.length}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => setExpandedRecord(expandedRecord === record.id ? null : record.id)}
                            className="text-medical-600 hover:text-medical-700 text-sm font-medium flex items-center gap-1 mx-auto"
                          >
                            <Eye className="w-4 h-4" />
                            详情
                          </button>
                        </td>
                      </tr>
                      {expandedRecord === record.id && (
                        <tr>
                          <td colSpan={isTeacher ? 10 : 9} className="bg-gray-50 p-4">
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-semibold text-gray-800 mb-3">关键信息录入</h4>
                                <div className="grid grid-cols-2 gap-2">
                                  {Object.entries(record.keyInputs).map(([key, value]) => {
                                    const inputLabel = cases
                                      .find(c => c.id === record.caseId)
                                      ?.steps.flatMap(s => s.keyInputs || [])
                                      .find(k => k.id === key)?.label || key;
                                    return (
                                      <div key={key} className="bg-white rounded-lg p-2">
                                        <p className="text-xs text-gray-500">{inputLabel}</p>
                                        <p className="text-sm font-medium text-gray-800">{value as string}</p>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-800 mb-3">错误记录</h4>
                                {record.errors.length === 0 ? (
                                  <p className="text-sm text-green-600 flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" />
                                    本次训练无错误，表现优秀！
                                  </p>
                                ) : (
                                  <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {record.errors.slice(0, 3).map((error: any) => (
                                      <div key={error.id} className="bg-white rounded-lg p-2 border-l-2 border-red-400">
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm text-gray-800">{error.description}</span>
                                          <span className={`badge badge-risk-${error.riskLevel}`}>
                                            {error.riskLevel === 'high' ? '高' : '中'}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            {record.weakPoints.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <h4 className="font-semibold text-gray-800 mb-2">薄弱环节</h4>
                                <div className="flex flex-wrap gap-2">
                                  {record.weakPoints.map((wp: string, i: number) => (
                                    <span key={i} className="badge bg-orange-100 text-orange-700 px-3 py-1">
                                      {wp}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {viewMode === 'analysis' && (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-5">
            <div className="card">
              <h3 className="font-semibold text-gray-800 mb-6">四维能力评估</h3>
              <div className="space-y-6">
                {[
                  { key: 'procedureFamiliarity', label: '流程熟悉度', color: 'blue', desc: '对手术流程、步骤顺序的掌握程度' },
                  { key: 'reactionSpeed', label: '反应速度', color: 'green', desc: '对医生指令的响应速度和准确性' },
                  { key: 'riskAwareness', label: '风险意识', color: 'yellow', desc: '对潜在风险的识别和规避能力' },
                  { key: 'communicationEtiquette', label: '沟通礼仪', color: 'purple', desc: '与医患沟通的专业度和规范性' }
                ].map(item => {
                  const score = dimensionScores[item.key as keyof typeof dimensionScores];
                  const colorClass = item.color;
                  return (
                    <div key={item.key}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium text-gray-800">{item.label}</span>
                          <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                        <span className={`text-2xl font-bold text-${colorClass}-600`}>{score}</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-${colorClass}-500 rounded-full transition-all duration-1000`}
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <h4 className="font-semibold text-gray-800 mb-4">综合评价</h4>
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${
                    overallStats.avgScore >= 80 ? 'bg-green-100' : overallStats.avgScore >= 60 ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    <span className={`text-5xl font-bold ${getScoreColor(overallStats.avgScore)}`}>
                      {overallStats.avgScore}
                    </span>
                  </div>
                  <p className="mt-3 text-lg font-medium text-gray-800">
                    {overallStats.avgScore >= 90 ? '优秀' : 
                     overallStats.avgScore >= 80 ? '良好' : 
                     overallStats.avgScore >= 60 ? '及格' : '待提升'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-7 space-y-6">
            <div className="card">
              <h3 className="font-semibold text-gray-800 mb-4">分数分布</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-green-600">{scoreDistribution.excellent}</p>
                  <p className="text-sm text-gray-600">优秀 (≥90)</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-blue-600">{scoreDistribution.good}</p>
                  <p className="text-sm text-gray-600">良好 (80-89)</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-yellow-600">{scoreDistribution.pass}</p>
                  <p className="text-sm text-gray-600">及格 (60-79)</p>
                </div>
                <div className="bg-red-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-red-600">{scoreDistribution.fail}</p>
                  <p className="text-sm text-gray-600">不及格 {'(<60)'}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold text-gray-800 mb-4">薄弱环节分析</h3>
              {filteredRecords.length === 0 ? (
                <p className="text-gray-500 text-center py-8">暂无数据</p>
              ) : (
                <div>
                  {isTeacher ? (
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-3">学员薄弱环节统计</h4>
                      <div className="space-y-3">
                        {studentList.map(student => {
                          const studentRecords = records.filter(r => r.studentId === student.id);
                          const weakPoints = studentRecords.flatMap(r => r.weakPoints);
                          const pointCounts: Record<string, number> = {};
                          weakPoints.forEach(p => {
                            pointCounts[p] = (pointCounts[p] || 0) + 1;
                          });
                          const topPoints = Object.entries(pointCounts)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 3);
                          
                          return (
                            <div key={student.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                              <img
                                src={student.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.id}`}
                                alt={student.name}
                                className="w-10 h-10 rounded-full"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-gray-800">{student.name}</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {topPoints.length > 0 ? topPoints.map(([point, count]) => (
                                    <span key={point} className="badge bg-red-100 text-red-700">
                                      {point} ({count}次)
                                    </span>
                                  )) : (
                                    <span className="text-sm text-green-600 flex items-center gap-1">
                                      <CheckCircle className="w-4 h-4" />
                                      暂无明显薄弱环节
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-3">个人薄弱环节汇总</h4>
                      {(() => {
                        const allWeakPoints = filteredRecords.flatMap(r => r.weakPoints);
                        const pointCounts: Record<string, number> = {};
                        allWeakPoints.forEach(p => {
                          pointCounts[p] = (pointCounts[p] || 0) + 1;
                        });
                        const sortedPoints = Object.entries(pointCounts).sort((a, b) => b[1] - a[1]);
                        
                        return sortedPoints.length > 0 ? (
                          <div className="space-y-2">
                            {sortedPoints.map(([point, count]) => (
                              <div key={point} className="flex items-center gap-3">
                                <span className="flex-1 text-sm text-gray-700">{point}</span>
                                <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-red-500 rounded-full"
                                    style={{ width: `${(count / filteredRecords.length) * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-500 w-12 text-right">{count}次</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center text-green-600 py-4 flex items-center justify-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            暂无明显薄弱环节，继续保持！
                          </p>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="card">
              <h3 className="font-semibold text-gray-800 mb-4">常见错误类型</h3>
              {filteredRecords.length === 0 ? (
                <p className="text-gray-500 text-center py-8">暂无数据</p>
              ) : (
                <div>
                  {(() => {
                    const allErrors = filteredRecords.flatMap(r => r.errors);
                    const typeCounts: Record<string, number> = {};
                    allErrors.forEach(e => {
                      typeCounts[e.errorType] = (typeCounts[e.errorType] || 0) + 1;
                    });
                    
                    const typeLabels: Record<string, string> = {
                      missing_check: '漏核对',
                      wrong_item: '递错物',
                      incomplete_record: '记录不完整',
                      timing_error: '时机错误'
                    };

                    return Object.entries(typeCounts)
                      .sort((a, b) => b[1] - a[1])
                      .map(([type, count]) => (
                        <div key={type} className="flex items-center gap-3 mb-3 last:mb-0">
                          <span className="w-24 text-sm text-gray-600">{typeLabels[type] || type}</span>
                          <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
                              style={{ width: `${(count / allErrors.length) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-700 w-12">{count}次</span>
                        </div>
                      ));
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
