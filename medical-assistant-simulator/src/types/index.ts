export interface Student {
  id: string;
  name: string;
  studentId: string;
  role: 'student' | 'teacher' | 'intern';
  department: string;
  joinDate: string;
  avatar?: string;
}

export interface Case {
  id: string;
  name: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;
  description: string;
  icon: string;
  steps: ProcedureStep[];
  commands: DoctorCommand[];
  risks: RiskWarning[];
}

export interface ProcedureStep {
  id: string;
  order: number;
  name: string;
  description: string;
  category: 'identity' | 'preparation' | 'asepsis' | 'delivery' | 'recording' | 'education';
  duration: number;
  requiredItems?: string[];
  keyInputs?: KeyInput[];
  commands?: string[];
  riskPoints?: string[];
  correctActions: string[];
  wrongActions: WrongAction[];
}

export interface KeyInput {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date';
  placeholder?: string;
  options?: string[];
  required: boolean;
  validator?: {
    pattern?: string;
    message: string;
  };
}

export interface DoctorCommand {
  id: string;
  stepId: string;
  content: string;
  timeLimit: number;
  correctAction: string;
  options: CommandOption[];
  riskLevel: 'low' | 'medium' | 'high';
}

export interface CommandOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
  risk?: string;
}

export interface WrongAction {
  id: string;
  action: string;
  risk: string;
  riskLevel: 'low' | 'medium' | 'high';
  deduction: number;
}

export interface RiskWarning {
  id: string;
  type: 'missing_check' | 'wrong_item' | 'incomplete_record' | 'timing_error';
  message: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  relatedStep: string;
}

export interface TrainingRecord {
  id: string;
  studentId: string;
  studentName: string;
  caseId: string;
  caseName: string;
  startTime: string;
  endTime: string;
  totalScore: number;
  scores: ScoreBreakdown;
  errors: TrainingError[];
  keyInputs: Record<string, string>;
  commandResponses: CommandResponse[];
  weakPoints: string[];
  completed: boolean;
}

export interface ScoreBreakdown {
  procedureFamiliarity: number;
  reactionSpeed: number;
  riskAwareness: number;
  communicationEtiquette: number;
}

export interface TrainingError {
  id: string;
  stepId: string;
  stepName: string;
  errorType: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  deduction: number;
  timestamp: number;
  userAction?: string;
  correctAction?: string;
}

export interface CommandResponse {
  commandId: string;
  commandContent: string;
  selectedOption: string;
  isCorrect: boolean;
  reactionTime: number;
  timeLimit: number;
}

export interface Assignment {
  id: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  caseId: string;
  caseName: string;
  reason: string;
  weakPoints: string[];
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  createdAt: string;
  completedAt?: string;
}

export type AppView = 'home' | 'case-select' | 'training' | 'replay' | 'records' | 'teacher';
export type TrainingPhase = 'preparing' | 'running' | 'paused' | 'completed';

export interface AppState {
  currentView: AppView;
  currentStudent: Student | null;
  selectedCase: Case | null;
  trainingPhase: TrainingPhase;
  currentStepIndex: number;
  showCommand: boolean;
  currentCommand: DoctorCommand | null;
  trainingErrors: TrainingError[];
  keyInputValues: Record<string, string>;
  commandResponses: CommandResponse[];
  startTime: number;
  commandStartTime: number;
}
