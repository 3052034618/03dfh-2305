const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getStudents: () => ipcRenderer.invoke('get-students'),
  saveStudent: (student) => ipcRenderer.invoke('save-student', student),
  deleteStudent: (id) => ipcRenderer.invoke('delete-student', id),
  getRecords: () => ipcRenderer.invoke('get-records'),
  saveRecord: (record) => ipcRenderer.invoke('save-record', record),
  getAssignments: () => ipcRenderer.invoke('get-assignments'),
  saveAssignment: (assignment) => ipcRenderer.invoke('save-assignment', assignment),
  updateAssignment: (id, updates) => ipcRenderer.invoke('update-assignment', id, updates)
});
