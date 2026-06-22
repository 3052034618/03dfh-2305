/// <reference types="vite/client" />

interface ElectronAPI {
  getStudents: () => Promise<any[]>;
  saveStudent: (student: any) => Promise<any[]>;
  deleteStudent: (id: string) => Promise<any[]>;
  getRecords: () => Promise<any[]>;
  saveRecord: (record: any) => Promise<any[]>;
  getAssignments: () => Promise<any[]>;
  saveAssignment: (assignment: any) => Promise<any[]>;
  updateAssignment: (id: string, updates: any) => Promise<any[]>;
}

interface Window {
  electronAPI: ElectronAPI;
}
