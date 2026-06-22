import { useState } from 'react';
import { RotateCcw, Play, Clock, AlertTriangle, CheckCircle, XCircle, FileText, Eye, User, Calendar } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { cases } from '../data/cases';

export function ReplayPage() {
  const { records, assignments, currentStudent, setSelectedCase, setView, updateAssignment } = useAppStore();
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'assignments' | 'errors'>('assignments');

  const isTeacher = currentStudent?.role === 'teacher';
  
  const myRecords = isTeacher ? records : records.filter(r => r.studentId === currentStudent?.id);
  const myAssignments = isTeacher 
    ? assignments 
    : assignments.filter(a => a.studentId === currentStudent?.id);

  const recordsWithErrors = myRecords.filter(r => r.errors.length > 0);

  const handleReplay = (caseId: string, assignmentId?: string) => {
    const caseItem = cases.find(c => c.id === caseId);
    if (caseItem) {
      setSelectedCase(caseItem);
      setView('training');
      
      if (assignmentId && !isTeacher) {
        updateAssignment(assignmentId, { status: 'completed', completedAt: new Date().toLocaleString('zh-CN') });
        if (window.electronAPI) {
          window.electronAPI.updateAssignment(assignmentId, { 
            status: 'completed', 
            completedAt: new Date().toLocaleString('zh-CN') 
          });
        }
      }
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">错误回放</h2>
          <p className="text-gray-500 mt-1">回顾错误，强化薄弱环节</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'assignments'
                ? 'bg-medical-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            强化训练任务
          </button>
          <button
            onClick={() => setActiveTab('errors')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'errors'
                ? 'bg-medical-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            历史错误记录
          </button>
        </div>
      </div>

      {activeTab === 'assignments' && (
        <div className="space-y-4">
          {myAssignments.length === 0 ? (
            <div className="card text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">暂无强化训练任务</p>
              <p className="text-gray-400 text-sm mt-2">继续保持，认真完成每一次训练</p>
            </div>
          ) : (
            myAssignments.map(assignment => (
              <div key={assignment.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {assignment.caseName}
                      </h3>
                      <span className={`badge ${
                        assignment.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : assignment.status === 'overdue'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {assignment.status === 'completed' ? '已完成' : assignment.status === 'overdue' ? '已逾期' : '待完成'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="w-4 h-4" />
                        学员：{assignment.studentName}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="w-4 h-4" />
                        布置老师：{assignment.teacherName}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        截止日期：{assignment.dueDate}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-700 mb-2">
                        <span className="font-medium">任务原因：</span>
                        {assignment.reason}
                      </p>
                      <div>
                        <span className="text-sm font-medium text-gray-700">薄弱环节：</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {assignment.weakPoints.map((wp, i) => (
                            <span key={i} className="badge bg-red-100 text-red-700">
                              {wp}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="ml-6">
                    {assignment.status !== 'completed' && !isTeacher && (
                      <button
                        onClick={() => handleReplay(assignment.caseId, assignment.id)}
                        className="btn-primary flex items-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        开始强化训练
                      </button>
                    )}
                    {assignment.status === 'completed' && (
                      <div className="text-center">
                        <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-1" />
                        <p className="text-xs text-gray-500">已完成</p>
                        <p className="text-xs text-gray-400">{assignment.completedAt}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'errors' && (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-5">
            <div className="card p-4">
              <h3 className="font-semibold text-gray-800 mb-4">训练记录列表</h3>
              {recordsWithErrors.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
                  <p className="text-gray-500">暂无错误记录</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {recordsWithErrors.map(record => (
                    <button
                      key={record.id}
                      onClick={() => setSelectedRecord(record)}
                      className={`w-full text-left p-4 rounded-xl transition-all ${
                        selectedRecord?.id === record.id
                          ? 'bg-medical-50 border-2 border-medical-300'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">{record.caseName}</h4>
                        <span className={`text-xl font-bold ${
                          record.totalScore >= 80 ? 'text-green-600' : record.totalScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {record.totalScore}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{record.endTime}</span>
                        <span className="flex items-center gap-1 text-red-500">
                          <AlertTriangle className="w-3 h-3" />
                          {record.errors.length}个错误
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="col-span-7">
            {selectedRecord ? (
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{selectedRecord.caseName}</h3>
                    <p className="text-sm text-gray-500">完成时间：{selectedRecord.endTime}</p>
                  </div>
                  <button
                    onClick={() => handleReplay(selectedRecord.caseId)}
                    className="btn-primary flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    重新训练
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">{selectedRecord.scores.procedureFamiliarity}</p>
                    <p className="text-xs text-gray-500">流程熟悉度</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">{selectedRecord.scores.reactionSpeed}</p>
                    <p className="text-xs text-gray-500">反应速度</p>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-yellow-600">{selectedRecord.scores.riskAwareness}</p>
                    <p className="text-xs text-gray-500">风险意识</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-purple-600">{selectedRecord.scores.communicationEtiquette}</p>
                    <p className="text-xs text-gray-500">沟通礼仪</p>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  错误详情
                </h4>

                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {selectedRecord.errors.map((error: any, index: number) => (
                    <div key={error.id} className="border-l-4 border-red-400 bg-red-50 rounded-r-xl p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="badge bg-red-100 text-red-700 mr-2">
                            {error.riskLevel === 'high' ? '高风险' : error.riskLevel === 'medium' ? '中风险' : '低风险'}
                          </span>
                          <span className="text-sm font-medium text-gray-700">{error.stepName}</span>
                        </div>
                        <div className="flex items-center gap-1 text-red-500 text-sm">
                          <XCircle className="w-4 h-4" />
                          -{error.deduction}分
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{error.description}</p>
                      {error.userAction && (
                        <div className="text-xs space-y-1">
                          <p className="text-red-600">
                            <span className="font-medium">你的操作：</span>{error.userAction}
                          </p>
                          <p className="text-green-600">
                            <span className="font-medium">正确操作：</span>{error.correctAction}
                          </p>
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        发生时间：{Math.floor(error.timestamp / 60)}分{error.timestamp % 60}秒
                      </div>
                    </div>
                  ))}
                </div>

                {selectedRecord.commandResponses && selectedRecord.commandResponses.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h4 className="font-semibold text-gray-800 mb-3">口令响应记录</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 px-2 font-semibold text-gray-600">口令内容</th>
                            <th className="text-left py-2 px-2 font-semibold text-gray-600">你的选择</th>
                            <th className="text-center py-2 px-2 font-semibold text-gray-600">结果</th>
                            <th className="text-center py-2 px-2 font-semibold text-gray-600">反应时间</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedRecord.commandResponses.map((resp: any, idx: number) => (
                            <tr key={idx} className="border-b border-gray-100">
                              <td className="py-2 px-2 text-gray-800">{resp.commandContent}</td>
                              <td className="py-2 px-2 text-gray-700">{resp.selectedOption}</td>
                              <td className="py-2 px-2 text-center">
                                {resp.isCorrect ? (
                                  <span className="inline-flex items-center gap-1 text-green-600">
                                    <CheckCircle className="w-3 h-3" />正确
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-red-600">
                                    <XCircle className="w-3 h-3" />错误
                                  </span>
                                )}
                              </td>
                              <td className="py-2 px-2 text-center font-mono">
                                <span className={resp.reactionTime > resp.timeLimit * 0.8 ? 'text-orange-600' : 'text-gray-700'}>
                                  {resp.reactionTime.toFixed(1)}s
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {selectedRecord.weakPoints.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h4 className="font-semibold text-gray-800 mb-3">薄弱环节分析</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRecord.weakPoints.map((wp: string, i: number) => (
                        <span key={i} className="badge bg-orange-100 text-orange-700 px-3 py-1">
                          {wp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedRecord.commandResponses.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h4 className="font-semibold text-gray-800 mb-3">口令响应记录</h4>
                    <div className="space-y-2">
                      {selectedRecord.commandResponses.map((resp: any, i: number) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          {resp.isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">
                              医生："{resp.commandContent}"
                            </p>
                            <p className="text-xs text-gray-500">
                              你的响应：{resp.selectedOption}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-medium ${
                              resp.reactionTime <= resp.timeLimit * 0.5 ? 'text-green-600' :
                              resp.reactionTime <= resp.timeLimit ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {resp.reactionTime.toFixed(1)}s
                            </p>
                            <p className="text-xs text-gray-400">/ {resp.timeLimit}s</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="card text-center py-20">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400">选择一条记录查看错误详情</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
