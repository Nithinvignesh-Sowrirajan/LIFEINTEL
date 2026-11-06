const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

let mainWindow = null;
let pythonProcess = null;

const isDev = process.env.NODE_ENV !== 'production' && !app.isPackaged;

function checkBackendRunning(cb) {
  const req = http.get('http://127.0.0.1:8000/api/health', (res) => {
    cb(res.statusCode === 200);
  });
  req.on('error', () => {
    cb(false);
  });
  req.setTimeout(1500, () => {
    req.destroy();
    cb(false);
  });
}

function startPythonBackend() {
  checkBackendRunning((isRunning) => {
    if (isRunning) {
      console.log('[LIFEINTEL] Python backend already active on port 8000, skipping spawn.');
      return;
    }
    const backendDir = path.join(__dirname, '..', 'backend');
    console.log('[LIFEINTEL] Spawning Python FastAPI backend in:', backendDir);

    pythonProcess = spawn('python', ['-m', 'uvicorn', 'main:app', '--host', '0.0.0.0', '--port', '8000'], {
      cwd: backendDir,
      stdio: 'inherit',
      shell: true,
    });

    pythonProcess.on('error', (err) => {
      console.error('[LIFEINTEL] Failed to start Python backend:', err);
    });

    pythonProcess.on('exit', (code, signal) => {
      console.log(`[LIFEINTEL] Python backend exited with code ${code} and signal ${signal}`);
    });
  });
}

function stopPythonBackend() {
  if (pythonProcess) {
    console.log('[LIFEINTEL] Terminating Python backend...');
    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', pythonProcess.pid, '/f', '/t']);
    } else {
      pythonProcess.kill('SIGTERM');
    }
    pythonProcess = null;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    backgroundColor: '#FBF9F5', // Warm Minimal Ivory background
    title: 'LIFEINTEL — Universal Personal Intelligence System',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
    show: false,
  });

  // Load URL
  if (isDev) {
    mainWindow.loadURL('http://127.0.0.1:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links safely
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// Window IPC handlers
ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('window-close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.on('open-external', (_event, url) => {
  shell.openExternal(url);
});

ipcMain.on('open-path', (_event, filePath) => {
  if (filePath) shell.openPath(filePath);
});

// App Lifecycle
app.whenReady().then(() => {
  startPythonBackend();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  stopPythonBackend();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  stopPythonBackend();
});

