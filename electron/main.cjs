const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const { shell } = require('electron');
const os = require('os');
const path = require('path');
const { startServer } = require('./server.cjs');

function createWindow() {
  const win = new BrowserWindow({
    width: 520,
    height: 760,
    resizable: false,
    fullscreenable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(__dirname, 'internal', 'index.html'));
  }
  
}

app.whenReady().then(() => {
  process.env.USER_DATA_PATH = app.getPath('userData');
  const serverUrl = startServer();
  ipcMain.handle('get-server-url', () => serverUrl)
  createWindow();
});

ipcMain.handle('open-folder', async () => {
  const folderPath = path.join(os.homedir(), 'Desktop', 'midias');
  shell.openPath(folderPath);
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
