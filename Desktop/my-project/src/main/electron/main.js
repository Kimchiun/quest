const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

console.log('🚀 Electron 시작 중...');
console.log('개발 모드:', isDev);

let mainWindow;
let retryCount = 0;
const MAX_RETRIES = 3;

function createWindow() {
  console.log('📱 브라우저 창 생성 중...');
  
  // 플랫폼별 아이콘 설정
  let iconPath;
  if (process.platform === 'darwin') {
    // macOS
    iconPath = path.join(__dirname, 'assets', 'quest-icon.icns');
  } else if (process.platform === 'win32') {
    // Windows
    iconPath = path.join(__dirname, 'assets', 'quest-icon.ico');
  } else {
    // Linux
    iconPath = path.join(__dirname, 'assets', 'quest-icon.png');
  }
  
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: false,
      preload: path.join(__dirname, 'preload.js')
    },
    show: false,
    icon: iconPath,
    titleBarStyle: 'default',
    autoHideMenuBar: true,
    backgroundColor: '#282c34'
  });

  const loadURL = isDev ? 'http://localhost:4000' : `file://${path.join(__dirname, '../renderer/app/index.html')}`;

  console.log('📡 로드할 URL:', loadURL);

  // React 개발 서버가 준비될 때까지 대기
  const loadApp = async () => {
    try {
      await mainWindow.loadURL(loadURL);
      console.log('✅ React 앱 로드 완료');
      retryCount = 0; // 성공 시 재시도 카운트 리셋
    } catch (error) {
      console.error('❌ React 앱 로드 실패:', error.message);
      
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        console.log(`⏳ React 서버 대기 중... (${retryCount}/${MAX_RETRIES})`);
        setTimeout(loadApp, 5000); // 5초 후 재시도
      } else {
        console.log('⚠️ 최대 재시도 횟수 도달, 폴백 모드로 전환');
        // 폴백: 로컬 HTML 파일 로드
        const fallbackPath = path.join(__dirname, '../renderer/app/index.html');
        try {
          await mainWindow.loadFile(fallbackPath);
          console.log('✅ 폴백 HTML 로드 완료');
        } catch (fallbackError) {
          console.error('❌ 폴백 로드도 실패:', fallbackError.message);
          // 최종 폴백: 빈 HTML
          await mainWindow.loadURL('data:text/html;charset=utf-8,<html><body style="background-color:#282c34;color:white;display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;"><div><h1>Quest 로딩 중...</h1><p>React 서버에 연결할 수 없습니다.</p><p>잠시 후 다시 시도해주세요.</p></div></body></html>');
        }
      }
    }
  };

  // 창이 준비되면 표시
  mainWindow.once('ready-to-show', () => {
    console.log('🎯 창 준비 완료, 표시 중...');
    mainWindow.show();
    mainWindow.focus();
  });

  // 개발 환경에서 DevTools 열기
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // 창이 닫힐 때 앱 종료
  mainWindow.on('closed', () => {
    console.log('🔒 창이 닫힘');
    mainWindow = null;
  });

  // 앱 활성화 이벤트
  app.on('activate', () => {
    console.log('🔄 앱 활성화됨');
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  // 개발 모드에서 즉시 로드 시도
  loadApp();
}

// 앱이 준비되면 창 생성
app.whenReady().then(() => {
  console.log('🎉 Electron 앱 준비 완료');
  createWindow();
});

// 모든 창이 닫히면 앱 종료 (macOS 제외)
app.on('window-all-closed', () => {
  console.log('🔚 모든 창이 닫힘');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC 핸들러들
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('get-app-name', () => {
  return app.getName();
}); 