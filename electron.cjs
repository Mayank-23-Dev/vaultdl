const { app, BrowserWindow, shell, utilityProcess, ipcMain, dialog } = require('electron')
const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')
const os = require('os')

// Prevents SmartScreen from flagging auto-launched processes
app.commandLine.appendSwitch('no-sandbox');

let backendProcess

const isDev = !app.isPackaged;
const resourcesPath = isDev ? __dirname : process.resourcesPath;

// --- IPC Handlers ---
ipcMain.handle('get-pc-name', () => {
  return os.hostname() || 'User';
});

ipcMain.handle('select-folder', async (event, defaultPath) => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    defaultPath: defaultPath || app.getPath('downloads')
  });
  if (result.canceled) return null;
  return result.filePaths[0];
});

ipcMain.handle('open-folder', async (event, folderPath) => {
  if (folderPath) {
    shell.openPath(folderPath.replace(/^~/, os.homedir()));
  }
});

function startBackend() {
  const backendScript = path.join(__dirname, 'backend/server.mjs');
  const logPath = path.join(app.getPath('userData'), 'backend.log');
  const logStream = fs.createWriteStream(logPath, { flags: 'a' });

  const env = {
    ...process.env,
    YT_DLP_PATH: path.join(resourcesPath, 'yt-dlp.exe'),
    FFMPEG_PATH: path.join(resourcesPath, 'ffmpeg.exe'),
    PORT: '3000',
  };

  logStream.write(`\n--- Backend starting at ${new Date().toISOString()} ---\n`);
  logStream.write(`Script: ${backendScript}\n`);
  logStream.write(`Resources: ${resourcesPath}\n`);

  if (utilityProcess) {
    backendProcess = utilityProcess.fork(backendScript, [], {
      env,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    backendProcess.stdout.on('data', (data) => logStream.write(data));
    backendProcess.stderr.on('data', (data) => logStream.write(data));

    backendProcess.on('spawn', () => {
      logStream.write('Backend process spawned successfully via utilityProcess\n');
    });

    backendProcess.on('exit', (code) => {
      logStream.write(`Backend process exited with code ${code}\n`);
    });
  } else {
    // Fallback for older Electron versions
    backendProcess = spawn(process.execPath, [backendScript], {
      cwd: __dirname,
      env: { ...env, ELECTRON_RUN_AS_NODE: '1' },
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    backendProcess.stdout.pipe(logStream);
    backendProcess.stderr.pipe(logStream);
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: { 
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      devTools: true,
      preload: path.join(__dirname, 'preload.cjs')
    }
  })

  // Open external links in default browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  const indexPath = path.join(__dirname, 'dist/index.html');
  
  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    if (fs.existsSync(indexPath)) {
      win.loadFile(indexPath).catch(err => {
        console.error('Failed to load index.html:', err);
      });
    } else {
      console.error('index.html not found at:', indexPath);
      win.loadURL(`data:text/html,<h1>Error: index.html not found</h1><p>Expected at: ${indexPath}</p>`);
    }
  }

  if (isDev) {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  startBackend();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('quit', () => {
  if (backendProcess) {
    backendProcess.kill()
  }
})