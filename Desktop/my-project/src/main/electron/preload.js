const { contextBridge, ipcRenderer } = require('electron');

// 보안을 위해 필요한 API만 노출
contextBridge.exposeInMainWorld('electronAPI', {
    // 파일 저장 API
    saveFile: (name, buffer) => ipcRenderer.invoke('save-file', { name, buffer }),
    
    // 앱 정보
    getAppVersion: () => process.versions.electron,
    
    // 플랫폼 정보
    getPlatform: () => process.platform
});

// 콘솔 경고 제거
window.addEventListener('DOMContentLoaded', () => {
    // 보안 경고 숨기기
    const originalWarn = console.warn;
    console.warn = (...args) => {
        if (args[0] && typeof args[0] === 'string' && args[0].includes('Electron Security Warning')) {
            return;
        }
        originalWarn.apply(console, args);
    };
}); 