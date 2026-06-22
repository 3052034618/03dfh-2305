import { Student, TrainingRecord, Assignment } from '../types';

export const mockStudents: Student[] = [
  {
    id: 's1',
    name: '张小明',
    studentId: 'MA2024001',
    role: 'intern',
    department: '整形外科',
    joinDate: '2024-01-15',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
  },
  {
    id: 's2',
    name: '李小红',
    studentId: 'MA2024002',
    role: 'student',
    department: '美容皮肤科',
    joinDate: '2024-02-20',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka'
  },
  {
    id: 's3',
    name: '王大力',
    studentId: 'MA2024003',
    role: 'student',
    department: '整形外科',
    joinDate: '2024-03-01',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob'
  },
  {
    id: 't1',
    name: '陈主任',
    studentId: 'T001',
    role: 'teacher',
    department: '整形外科',
    joinDate: '2020-01-01',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charles'
  }
];

export const mockRecords: TrainingRecord[] = [
  {
    id: 'r1',
    studentId: 's1',
    studentName: '张小明',
    caseId: 'double-eyelid',
    caseName: '双眼皮成形术',
    startTime: '2024-06-15 09:00:00',
    endTime: '2024-06-15 09:48:30',
    totalScore: 78,
    scores: {
      procedureFamiliarity: 85,
      reactionSpeed: 72,
      riskAwareness: 75,
      communicationEtiquette: 80
    },
    errors: [
      {
        id: 'e1',
        stepId: 'de-2',
        stepName: '物品摆台准备',
        errorType: 'wrong_item',
        description: '未检查无菌包有效期',
        riskLevel: 'high',
        deduction: 15,
        timestamp: 180
      },
      {
        id: 'e2',
        stepId: 'de-4',
        stepName: '器械传递配合',
        errorType: 'timing_error',
        description: '传递15号刀片（应为11号）',
        riskLevel: 'medium',
        deduction: 10,
        timestamp: 620
      }
    ],
    keyInputs: {
      'de-1-name': '王美丽',
      'de-1-id': 'A123456',
      'de-2-lot': '20240101',
      'de-5-medicine': '2%利多卡因2ml',
      'de-5-bleeding': '5',
      'de-6-observation': '30',
      'de-6-followup': '2024-06-22'
    },
    commandResponses: [
      {
        commandId: 'de-c-1',
        commandContent: '来一把11号刀片',
        selectedOption: '传递15号刀片',
        isCorrect: false,
        reactionTime: 4.2,
        timeLimit: 5
      },
      {
        commandId: 'de-c-2',
        commandContent: '止血',
        selectedOption: '立即传递止血钳和肾上腺素棉球',
        isCorrect: true,
        reactionTime: 1.8,
        timeLimit: 3
      }
    ],
    weakPoints: ['器械识别', '无菌操作细节'],
    completed: true
  },
  {
    id: 'r2',
    studentId: 's1',
    studentName: '张小明',
    caseId: 'hyaluronic-acid',
    caseName: '玻尿酸注射',
    startTime: '2024-06-16 14:00:00',
    endTime: '2024-06-16 14:24:15',
    totalScore: 85,
    scores: {
      procedureFamiliarity: 88,
      reactionSpeed: 82,
      riskAwareness: 85,
      communicationEtiquette: 85
    },
    errors: [
      {
        id: 'e3',
        stepId: 'ha-1',
        stepName: '顾客身份确认',
        errorType: 'missing_check',
        description: '未询问近期服药史',
        riskLevel: 'medium',
        deduction: 10,
        timestamp: 90
      }
    ],
    keyInputs: {
      'ha-1-name': '刘女士',
      'ha-1-site': '鼻梁',
      'ha-2-brand': '乔雅登',
      'ha-2-lot': 'J20240512',
      'ha-2-dose': '1.0',
      'ha-5-needle': '27G锐针',
      'ha-5-points': '3',
      'ha-6-observation': '20',
      'ha-6-followup': '2024-06-23'
    },
    commandResponses: [],
    weakPoints: ['禁忌症排查'],
    completed: true
  },
  {
    id: 'r3',
    studentId: 's2',
    studentName: '李小红',
    caseId: 'rhinoplasty',
    caseName: '隆鼻术',
    startTime: '2024-06-15 10:30:00',
    endTime: '2024-06-15 11:32:00',
    totalScore: 65,
    scores: {
      procedureFamiliarity: 70,
      reactionSpeed: 60,
      riskAwareness: 62,
      communicationEtiquette: 68
    },
    errors: [
      {
        id: 'e4',
        stepId: 'rp-1',
        stepName: '顾客身份确认',
        errorType: 'missing_check',
        description: '未确认假体型号',
        riskLevel: 'high',
        deduction: 15,
        timestamp: 120
      },
      {
        id: 'e5',
        stepId: 'rp-4',
        stepName: '假体雕刻配合',
        errorType: 'wrong_item',
        description: '假体雕刻后未清洗',
        riskLevel: 'high',
        deduction: 15,
        timestamp: 800
      },
      {
        id: 'e6',
        stepId: 'rp-6',
        stepName: '手术记录',
        errorType: 'incomplete_record',
        description: '未粘贴假体条形码',
        riskLevel: 'high',
        deduction: 15,
        timestamp: 2400
      }
    ],
    keyInputs: {},
    commandResponses: [],
    weakPoints: ['术前核对流程', '无菌观念', '医疗文书记录'],
    completed: true
  }
];

export const mockAssignments: Assignment[] = [
  {
    id: 'a1',
    studentId: 's2',
    studentName: '李小红',
    teacherId: 't1',
    teacherName: '陈主任',
    caseId: 'rhinoplasty',
    caseName: '隆鼻术',
    reason: '术前核对不规范，假体处理流程错误，医疗文书缺失关键信息',
    weakPoints: ['术前核对流程', '无菌观念', '医疗文书记录'],
    dueDate: '2024-06-20',
    status: 'pending',
    createdAt: '2024-06-16 12:00:00'
  },
  {
    id: 'a2',
    studentId: 's1',
    studentName: '张小明',
    teacherId: 't1',
    teacherName: '陈主任',
    caseId: 'double-eyelid',
    caseName: '双眼皮成形术',
    reason: '器械识别错误，无菌操作细节需要加强',
    weakPoints: ['器械识别', '无菌操作细节'],
    dueDate: '2024-06-18',
    status: 'completed',
    createdAt: '2024-06-15 10:00:00',
    completedAt: '2024-06-17 09:30:00'
  }
];
