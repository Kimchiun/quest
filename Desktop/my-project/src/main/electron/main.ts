import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';

function createWindow() {
    const win = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });
    win.loadFile(path.join(__dirname, '../../renderer/app/index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// 파일 저장 IPC 핸들러
ipcMain.handle('save-file', async (event, { name, buffer }) => {
    const saveDir = path.join(process.env.ITMS_FILE_DIR || __dirname, 'uploads');
    if (!fs.existsSync(saveDir)) fs.mkdirSync(saveDir, { recursive: true });
    const savePath = path.join(saveDir, `${Date.now()}_${name}`);
    await fs.promises.writeFile(savePath, Buffer.from(buffer));
    return savePath;
}); 