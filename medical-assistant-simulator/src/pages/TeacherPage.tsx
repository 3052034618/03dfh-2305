import { useState } from 'react';
import { Users, UserPlus, Award, FileText, Send, AlertTriangle, CheckCircle, Trash2, Plus, X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { cases } from '../data/cases';
import { Assignment, Student } from '../types';

export function TeacherPage() {
  const { students, records, assignments, saveAssignment, currentStudent } = useAppStore();
  const [activeTab, setActiveTab] = useState<'students' | 'assign'>('students');
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAssignTraining, setShowAssignTraining] = useState(false);
  const [selectedStudentForAssign, setSelectedStudentForAssign] = useState<Student | null>(null);
  
  const [newStudent, setNewStudent] = useState({
    name: '',
    studentId: '',
    role: 'student' as 'student' | 'intern',
    department: '整形外科'
  });

  const [newAssignment, setNewAssignment] = useState({
    caseId: '',
    reason: '',
    weakPoints: [] as string[],
    dueDate: ''
  });

  const [newWeakPoint, setNewWeakPoint] = useState('');

  const traineeStudents = students.filter(s => s.role !== 'teacher');

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.studentId) return;
    
    const student: Student = {
      id: `s-${Date.now()}`,
      ...newStudent,
      joinDate: new Date().toISOString().split('T')[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newStudent.studentId}`
    };

    if (window.electronAPI) {
      window.electronAPI.saveStudent(student);
    }

    setShowAddStudent(false);
    setNewStudent({ name: '', studentId: '', role: 'student', department: '整形外科' });
  };

  const handleAssignTraining = () => {
    if (!selectedStudentForAssign || !newAssignment.caseId || !newAssignment.dueDate) return;

    const caseItem = cases.find(c => c.id === newAssignment.caseId);
    
    const assignment: Assignment = {
      id: `a-${Date.now()}`,
      studentId: selectedStudentForAssign.id,
      studentName: selectedStudentForAssign.name,
      teacherId: currentStudent?.id || 't1',
      teacherName: currentStudent?.name || '老师',
      caseId: newAssignment.caseId,
      caseName: caseItem?.name || '',
      reason: newAssignment.reason,
      weakPoints: newAssignment.weakPoints,
      dueDate: newAssignment.dueDate,
      status: 'pending',
      createdAt: new Date().toLocaleString('zh-CN')
    };

    saveAssignment(assignment);
    
    if (window.electronAPI) {
      window.electronAPI.saveAssignment(assignment);
    }

    setShowAssignTraining(false);
    setSelectedStudentForAssign(null);
    setNewAssignment({ caseId: '', reason: '', weakPoints: [], dueDate: '' });
  };

  const openAssignModal = (student: Student) => {
    setSelectedStudentForAssign(student);
    const studentRecords = records.filter(r => r.studentId === student.id);
    const weakPoints = [...new Set(studentRecords.flatMap(r => r.weakPoints))];
    setNewAssignment(prev => ({ ...prev, weakPoints: weakPoints.slice(0, 3) }));
    setShowAssignTraining(true);
  };

  const addWeakPoint = () => {
    if (newWeakPoint.trim() && !newAssignment.weakPoints.includes(newWeakPoint.trim())) {
      setNewAssignment(prev => ({
        ...prev,
        weakPoints: [...prev.weakPoints, newWeakPoint.trim()]
      }));
      setNewWeakPoint('');
    }
  };

  const removeWeakPoint = (point: string) => {
    setNewAssignment(prev => ({
      ...prev,
      weakPoints: prev.weakPoints.filter(p => p !== point)
    }));
  };

  const getStudentStats = (studentId: string) => {
    const studentRecords = records.filter(r => r.studentId === studentId);
    return {
      totalTrainings: studentRecords.length,
      avgScore: studentRecords.length > 0
        ? Math.round(studentRecords.reduce((s, r) => s + r.totalScore, 0) / studentRecords.length)
        : 0,
      weakPoints: [...new Set(studentRecords.flatMap(r => r.weakPoints))].slice(0, 3),
      recentRecord: studentRecords[studentRecords.length - 1]
    };
  };

  const pendingAssignments = assignments.filter(a => a.status === 'pending');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">老师管理端</h2>
          <p className="text-gray-500 mt-1">学员管理与训练任务布置</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'students'
                ? 'bg-medical-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            学员管理
          </button>
          <button
            onClick={() => setActiveTab('assign')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'assign'
                ? 'bg-medical-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            训练任务
            {pendingAssignments.length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {pendingAssignments.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === 'students' && (
        <>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">学员列表</h3>
            <button
              onClick={() => setShowAddStudent(true)}
              className="btn-primary flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              添加学员
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {traineeStudents.map(student => {
              const stats = getStudentStats(student.id);
              return (
                <div key={student.id} className="card-hover">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={student.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.id}`}
                        alt={student.name}
                        className="w-14 h-14 rounded-xl border-2 border-medical-100"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-800">{student.name}</h4>
                        <p className="text-sm text-gray-500">{student.studentId}</p>
                        <span className={`badge text-xs mt-1 ${
                          student.role === 'intern' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {student.role === 'intern' ? '实习生' : '学员'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-xl font-bold text-medical-600">{stats.totalTrainings}</p>
                      <p className="text-xs text-gray-500">训练次数</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className={`text-xl font-bold ${
                        stats.avgScore >= 80 ? 'text-green-600' :
                        stats.avgScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {stats.avgScore}
                      </p>
                      <p className="text-xs text-gray-500">平均分</p>
                    </div>
                  </div>

                  {stats.weakPoints.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">薄弱环节</p>
                      <div className="flex flex-wrap gap-1">
                        {stats.weakPoints.map((wp, i) => (
                          <span key={i} className="badge bg-red-100 text-red-700 text-xs">
                            {wp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {stats.recentRecord && (
                    <div className="bg-medical-50 rounded-lg p-3 mb-4">
                      <p className="text-xs text-gray-500 mb-1">最近训练</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{stats.recentRecord.caseName}</span>
                        <span className={`font-bold ${
                          stats.recentRecord.totalScore >= 80 ? 'text-green-600' :
                          stats.recentRecord.totalScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {stats.recentRecord.totalScore}分
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => openAssignModal(student)}
                      className="flex-1 btn-secondary text-sm flex items-center justify-center gap-1"
                    >
                      <Send className="w-4 h-4" />
                      布置训练
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="删除学员"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {activeTab === 'assign' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">训练任务列表</h3>
          
          {assignments.length === 0 ? (
            <div className="card text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">暂无训练任务</p>
              <p className="text-gray-400 text-sm mt-2">选择学员布置强化训练任务</p>
            </div>
          ) : (
            assignments.slice().reverse().map(assignment => (
              <div key={assignment.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${assignment.studentId}`}
                        alt={assignment.studentName}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-800">{assignment.studentName}</h4>
                          <span className={`badge ${
                            assignment.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : assignment.status === 'overdue'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {assignment.status === 'completed' ? '已完成' : 
                             assignment.status === 'overdue' ? '已逾期' : '待完成'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          布置老师：{assignment.teacherName} · {assignment.createdAt}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">训练项目</p>
                        <p className="font-medium text-gray-800">{assignment.caseName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">截止日期</p>
                        <p className="font-medium text-gray-800">{assignment.dueDate}</p>
                      </div>
                      {assignment.completedAt && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">完成时间</p>
                          <p className="font-medium text-green-600">{assignment.completedAt}</p>
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700 mb-2">
                        <span className="font-medium">任务原因：</span>{assignment.reason}
                      </p>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">重点强化：</p>
                        <div className="flex flex-wrap gap-2">
                          {assignment.weakPoints.map((wp, i) => (
                            <span key={i} className="badge bg-orange-100 text-orange-700">
                              {wp}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showAddStudent && (
        <div className="modal-backdrop" onClick={() => setShowAddStudent(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">添加新学员</h3>
                <button onClick={() => setShowAddStudent(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                  <input
                    type="text"
                    value={newStudent.name}
                    onChange={e => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
                    className="input-field"
                    placeholder="请输入学员姓名"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">学号/工号</label>
                  <input
                    type="text"
                    value={newStudent.studentId}
                    onChange={e => setNewStudent(prev => ({ ...prev, studentId: e.target.value }))}
                    className="input-field"
                    placeholder="请输入学号或工号"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">身份</label>
                    <select
                      value={newStudent.role}
                      onChange={e => setNewStudent(prev => ({ ...prev, role: e.target.value as 'student' | 'intern' }))}
                      className="select-field"
                    >
                      <option value="student">学员</option>
                      <option value="intern">实习生</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">科室</label>
                    <select
                      value={newStudent.department}
                      onChange={e => setNewStudent(prev => ({ ...prev, department: e.target.value }))}
                      className="select-field"
                    >
                      <option value="整形外科">整形外科</option>
                      <option value="美容皮肤科">美容皮肤科</option>
                      <option value="注射科">注射科</option>
                      <option value="光电科">光电科</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setShowAddStudent(false)} className="flex-1 btn-secondary">
                  取消
                </button>
                <button onClick={handleAddStudent} className="flex-1 btn-primary">
                  确认添加
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAssignTraining && selectedStudentForAssign && (
        <div className="modal-backdrop" onClick={() => setShowAssignTraining(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">布置强化训练</h3>
                <button onClick={() => setShowAssignTraining(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 mb-6">
                <img
                  src={selectedStudentForAssign.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedStudentForAssign.id}`}
                  alt={selectedStudentForAssign.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">{selectedStudentForAssign.name}</h4>
                  <p className="text-sm text-gray-500">{selectedStudentForAssign.department}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">训练项目</label>
                  <select
                    value={newAssignment.caseId}
                    onChange={e => setNewAssignment(prev => ({ ...prev, caseId: e.target.value }))}
                    className="select-field"
                  >
                    <option value="">请选择训练项目</option>
                    {cases.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">任务原因</label>
                  <textarea
                    value={newAssignment.reason}
                    onChange={e => setNewAssignment(prev => ({ ...prev, reason: e.target.value }))}
                    className="input-field h-24 resize-none"
                    placeholder="请说明布置本次强化训练的原因..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">重点强化环节</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newAssignment.weakPoints.map((wp, i) => (
                      <span
                        key={i}
                        className="badge bg-orange-100 text-orange-700 px-3 py-1 flex items-center gap-1"
                      >
                        {wp}
                        <button onClick={() => removeWeakPoint(wp)} className="hover:text-red-600">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newWeakPoint}
                      onChange={e => setNewWeakPoint(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && addWeakPoint()}
                      className="flex-1 input-field"
                      placeholder="添加薄弱环节..."
                    />
                    <button onClick={addWeakPoint} className="btn-secondary px-4">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">截止日期</label>
                  <input
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={e => setNewAssignment(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => {
                  setShowAssignTraining(false);
                  setSelectedStudentForAssign(null);
                  setNewAssignment({ caseId: '', reason: '', weakPoints: [], dueDate: '' });
                }} className="flex-1 btn-secondary">
                  取消
                </button>
                <button onClick={handleAssignTraining} className="flex-1 btn-primary">
                  确认布置
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
