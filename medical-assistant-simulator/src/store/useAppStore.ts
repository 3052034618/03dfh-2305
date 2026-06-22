import { create } from 'zustand';
import { AppState, AppView, Student, Case, DoctorCommand, TrainingError, CommandResponse, TrainingRecord, ScoreBreakdown, Assignment } from '../types';
import { mockStudents, mockRecords, mockAssignments } from '../data/mockData';
import { cases } from '../data/cases';

interface AppStore extends AppState {
  setView: (view: AppView) => void;
  setCurrentStudent: (student: Student | null) => void;
  setSelectedCase: (caseItem: Case | null) => void;
  setTrainingPhase: (phase: AppState['trainingPhase']) => void;
  setCurrentStepIndex: (index: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  showCommandModal: (command: DoctorCommand) => void;
  hideCommandModal: () => void;
  setCommandStartTime: (time: number) => void;
  addTrainingError: (error: TrainingError) => void;
  setKeyInputValue: (key: string, value: string) => void;
  addCommandResponse: (response: CommandResponse) => void;
  setStartTime: (time: number) => void;
  resetTraining: () => void;
  generateRecord: () => TrainingRecord;
  students: Student[];
  records: TrainingRecord[];
  assignments: Assignment[];
  saveRecord: (record: TrainingRecord) => void;
  saveAssignment: (assignment: Assignment) => void;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  loadData: () => Promise<void>;
}

const calculateScore = (errors: TrainingError[], responses: CommandResponse[], steps: any[], inputs: Record<string, string>): ScoreBreakdown => {
  const totalPossible = 100;
  let procedureDeductions = 0;
  let reactionDeductions = 0;
  let riskDeductions = 0;
  let communicationDeductions = 0;

  errors.forEach(err => {
    if (err.errorType === 'missing_check' || err.errorType === 'incomplete_record') {
      procedureDeductions += err.deduction;
    }
    if (err.errorType === 'timing_error') {
      reactionDeductions += err.deduction;
    }
    if (err.riskLevel === 'high') {
      riskDeductions += err.deduction;
    } else if (err.riskLevel === 'medium') {
      riskDeductions += err.deduction * 0.6;
    }
    communicationDeductions += err.deduction * 0.3;
  });

  responses.forEach(resp => {
    if (!resp.isCorrect) {
      procedureDeductions += 3;
      riskDeductions += 2;
    }
    if (resp.reactionTime > resp.timeLimit * 0.8) {
      reactionDeductions += 2;
    }
  });

  let inputDeductions = 0;
  steps.forEach(step => {
    step.keyInputs?.forEach((input: any) => {
      if (input.required && !inputs[input.id]) {
        inputDeductions += 5;
        procedureDeductions += 5;
      }
    });
  });

  const procedureFamiliarity = Math.max(0, 100 - procedureDeductions);
  const reactionSpeed = Math.max(0, 100 - reactionDeductions);
  const riskAwareness = Math.max(0, 100 - riskDeductions);
  const communicationEtiquette = Math.max(0, 100 - communicationDeductions - inputDeductions * 0.5);

  return {
    procedureFamiliarity: Math.round(procedureFamiliarity),
    reactionSpeed: Math.round(reactionSpeed),
    riskAwareness: Math.round(riskAwareness),
    communicationEtiquette: Math.round(communicationEtiquette)
  };
};

const findWeakPoints = (errors: TrainingError[], scores: ScoreBreakdown): string[] => {
  const weakPoints: string[] = [];
  
  if (scores.procedureFamiliarity < 70) {
    weakPoints.push('流程熟悉度');
  }
  if (scores.reactionSpeed < 70) {
    weakPoints.push('反应速度');
  }
  if (scores.riskAwareness < 70) {
    weakPoints.push('风险意识');
  }
  if (scores.communicationEtiquette < 70) {
    weakPoints.push('沟通礼仪');
  }

  const errorTypes = new Set(errors.map(e => e.stepName));
  errorTypes.forEach(type => {
    const stepErrors = errors.filter(e => e.stepName === type);
    if (stepErrors.length >= 2 || stepErrors.some(e => e.riskLevel === 'high')) {
      weakPoints.push(type);
    }
  });

  return weakPoints;
};

export const useAppStore = create<AppStore>((set, get) => ({
  currentView: 'home',
  currentStudent: mockStudents[0],
  selectedCase: null,
  trainingPhase: 'preparing',
  currentStepIndex: 0,
  showCommand: false,
  currentCommand: null,
  trainingErrors: [],
  keyInputValues: {},
  commandResponses: [],
  startTime: 0,
  commandStartTime: 0,
  students: mockStudents,
  records: mockRecords,
  assignments: mockAssignments,

  setView: (view) => set({ currentView: view }),
  setCurrentStudent: (student) => set({ currentStudent: student }),
  setSelectedCase: (caseItem) => set({ selectedCase: caseItem, currentStepIndex: 0 }),
  setTrainingPhase: (phase) => set({ trainingPhase: phase }),
  setCurrentStepIndex: (index) => set({ currentStepIndex: index }),
  
  nextStep: () => set(state => {
    const maxIndex = state.selectedCase?.steps.length || 0;
    const nextIndex = Math.min(state.currentStepIndex + 1, maxIndex - 1);
    return { currentStepIndex: nextIndex };
  }),
  
  prevStep: () => set(state => ({
    currentStepIndex: Math.max(state.currentStepIndex - 1, 0)
  })),

  showCommandModal: (command) => set({
    showCommand: true,
    currentCommand: command,
    commandStartTime: Date.now()
  }),
  
  hideCommandModal: () => set({
    showCommand: false,
    currentCommand: null
  }),

  setCommandStartTime: (time) => set({ commandStartTime: time }),
  
  addTrainingError: (error) => set(state => ({
    trainingErrors: [...state.trainingErrors, error]
  })),
  
  setKeyInputValue: (key, value) => set(state => ({
    keyInputValues: { ...state.keyInputValues, [key]: value }
  })),
  
  addCommandResponse: (response) => set(state => ({
    commandResponses: [...state.commandResponses, response]
  })),
  
  setStartTime: (time) => set({ startTime: time }),
  
  resetTraining: () => set({
    trainingPhase: 'preparing',
    currentStepIndex: 0,
    showCommand: false,
    currentCommand: null,
    trainingErrors: [],
    keyInputValues: {},
    commandResponses: [],
    startTime: 0,
    commandStartTime: 0
  }),

  generateRecord: () => {
    const state = get();
    const student = state.currentStudent;
    const caseItem = state.selectedCase;
    
    if (!student || !caseItem) {
      throw new Error('Missing student or case data');
    }

    const scores = calculateScore(
      state.trainingErrors,
      state.commandResponses,
      caseItem.steps,
      state.keyInputValues
    );

    const totalScore = Math.round(
      scores.procedureFamiliarity * 0.35 +
      scores.reactionSpeed * 0.25 +
      scores.riskAwareness * 0.25 +
      scores.communicationEtiquette * 0.15
    );

    const weakPoints = findWeakPoints(state.trainingErrors, scores);

    const record: TrainingRecord = {
      id: `r-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      caseId: caseItem.id,
      caseName: caseItem.name,
      startTime: new Date(state.startTime).toLocaleString('zh-CN'),
      endTime: new Date().toLocaleString('zh-CN'),
      totalScore,
      scores,
      errors: state.trainingErrors,
      keyInputs: state.keyInputValues,
      commandResponses: state.commandResponses,
      weakPoints,
      completed: true
    };

    return record;
  },

  saveRecord: (record) => set(state => ({
    records: [...state.records, record]
  })),

  saveAssignment: (assignment) => set(state => ({
    assignments: [...state.assignments, assignment]
  })),

  updateAssignment: (id, updates) => set(state => ({
    assignments: state.assignments.map(a => 
      a.id === id ? { ...a, ...updates } : a
    )
  })),

  loadData: async () => {
    try {
      if (window.electronAPI) {
        const [students, records, assignments] = await Promise.all([
          window.electronAPI.getStudents(),
          window.electronAPI.getRecords(),
          window.electronAPI.getAssignments()
        ]);
        set({
          students: students.length > 0 ? students : mockStudents,
          records: records.length > 0 ? records : mockRecords,
          assignments: assignments.length > 0 ? assignments : mockAssignments
        });
      }
    } catch (error) {
      console.log('Using mock data due to:', error);
    }
  }
}));
