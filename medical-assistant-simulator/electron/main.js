const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 680,
    title: '医助跟台培训模拟器',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.setMenuBarVisibility(false);
}

const dataDir = path.join(app.getPath('userData'), 'data');
const studentsFile = path.join(dataDir, 'students.json');
const recordsFile = path.join(dataDir, 'records.json');
const assignmentsFile = path.join(dataDir, 'assignments.json');

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(studentsFile)) {
    fs.writeFileSync(studentsFile, JSON.stringify([]));
  }
  if (!fs.existsSync(recordsFile)) {
    fs.writeFileSync(recordsFile, JSON.stringify([]));
  }
  if (!fs.existsSync(assignmentsFile)) {
    fs.writeFileSync(assignmentsFile, JSON.stringify([]));
  }
}

app.whenReady().then(() => {
  ensureDataDir();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('get-students', () => {
  try {
    return JSON.parse(fs.readFileSync(studentsFile, 'utf-8'));
  } catch {
    return [];
  }
});

ipcMain.handle('save-student', (_, student) => {
  const students = JSON.parse(fs.readFileSync(studentsFile, 'utf-8'));
  const existing = students.findIndex(s => s.id === student.id);
  if (existing >= 0) {
    students[existing] = student;
  } else {
    students.push(student);
  }
  fs.writeFileSync(studentsFile, JSON.stringify(students, null, 2));
  return students;
});

ipcMain.handle('delete-student', (_, id) => {
  const students = JSON.parse(fs.readFileSync(studentsFile, 'utf-8'));
  const filtered = students.filter(s => s.id !== id);
  fs.writeFileSync(studentsFile, JSON.stringify(filtered, null, 2));
  return filtered;
});

ipcMain.handle('get-records', () => {
  try {
    return JSON.parse(fs.readFileSync(recordsFile, 'utf-8'));
  } catch {
    return [];
  }
});

ipcMain.handle('save-record', (_, record) => {
  const records = JSON.parse(fs.readFileSync(recordsFile, 'utf-8'));
  records.push(record);
  fs.writeFileSync(recordsFile, JSON.stringify(records, null, 2));
  return records;
});

ipcMain.handle('get-assignments', () => {
  try {
    return JSON.parse(fs.readFileSync(assignmentsFile, 'utf-8'));
  } catch {
    return [];
  }
});

ipcMain.handle('save-assignment', (_, assignment) => {
  const assignments = JSON.parse(fs.readFileSync(assignmentsFile, 'utf-8'));
  assignments.push(assignment);
  fs.writeFileSync(assignmentsFile, JSON.stringify(assignments, null, 2));
  return assignments;
});

ipcMain.handle('update-assignment', (_, id, updates) => {
  const assignments = JSON.parse(fs.readFileSync(assignmentsFile, 'utf-8'));
  const index = assignments.findIndex(a => a.id === id);
  if (index >= 0) {
    assignments[index] = { ...assignments[index], ...updates };
  }
  fs.writeFileSync(assignmentsFile, JSON.stringify(assignments, null, 2));
  return assignments;
});
