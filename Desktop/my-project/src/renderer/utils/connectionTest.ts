export interface ConnectionStatus {
  backend: boolean;
  database: boolean;
  elasticsearch: boolean;
  message: string;
}

export const testBackendConnection = async (): Promise<ConnectionStatus> => {
  try {
    const response = await fetch('http://localhost:3001/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return {
        backend: true,
        database: true, // health 체크가 성공하면 DB도 연결된 것으로 간주
        elasticsearch: true, // 기본값
        message: '백엔드 연결 성공'
      };
    } else {
      return {
        backend: false,
        database: false,
        elasticsearch: false,
        message: `백엔드 응답 오류: ${response.status}`
      };
    }
  } catch (error) {
    console.error('백엔드 연결 테스트 실패:', error);
    return {
      backend: false,
      database: false,
      elasticsearch: false,
      message: `백엔드 연결 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
    };
  }
};

export const testApiEndpoint = async (endpoint: string): Promise<boolean> => {
  try {
    const response = await fetch(`http://localhost:3001${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.ok;
  } catch (error) {
    console.error(`API 엔드포인트 테스트 실패 (${endpoint}):`, error);
    return false;
  }
};

export const logConnectionStatus = (status: ConnectionStatus) => {
  console.log('🔗 연결 상태:', status);
  if (!status.backend) {
    console.error('❌ 백엔드 서버에 연결할 수 없습니다.');
    console.log('💡 해결 방법:');
    console.log('   1. npm run dev:backend 실행');
    console.log('   2. 포트 3000이 사용 가능한지 확인');
    console.log('   3. 방화벽 설정 확인');
  }
}; 