const path = require('path');
const fs = require('fs');

async function startElectron() {
    try {
        const electron = require('electron');
        const { app, BrowserWindow, ipcMain } = electron;

        function createWindow() {
            const win = new BrowserWindow({
                width: 1024,
                height: 768,
                icon: path.join(__dirname, 'assets', 'icon.ico'),
                webPreferences: {
                    preload: path.join(__dirname, 'preload.js'),
                    nodeIntegration: false,
                    contextIsolation: true,
                },
            });
            if (process.env.NODE_ENV === 'development') {
                win.loadURL('http://localhost:4000');
            } else {
                win.loadFile(path.join(__dirname, '../../renderer/app/index.html'));
            }
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
    } catch (error) {
        console.error('Electron 시작 실패:', error);
    }
}

startElectron(); 