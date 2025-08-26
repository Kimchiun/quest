import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

// 개발 환경에서만 MSW 활성화 (실제 백엔드가 실행 중일 때는 비활성화)
export const startMSW = async () => {
  // 실제 백엔드가 실행 중인지 확인
  try {
    const response = await fetch('http://localhost:3000/health');
    if (response.ok) {
      console.log('🔗 실제 백엔드가 실행 중입니다. MSW를 비활성화합니다.');
      return;
    }
  } catch (error) {
    console.log('⚠️ 백엔드 연결 실패. MSW를 활성화합니다.');
  }
  
  // 백엔드가 실행되지 않을 때만 MSW 활성화
  if (process.env.NODE_ENV === 'development') {
    console.log('🔄 MSW 시작 중...');
    await worker.start({
      onUnhandledRequest: 'bypass', // 처리되지 않은 요청은 실제 서버로 전달
    });
    console.log('✅ MSW 활성화 완료');
  }
}; 