import app from './app/app';
import { testPgConnection } from './app/infrastructure/database/pgClient';
import { testEsConnection } from './app/infrastructure/elasticsearch/esClient';
import { initializeDatabase } from './app/infrastructure/database/initDatabase';

// 개발 환경에서는 데이터베이스 연결을 건너뛰기 위한 플래그
const SKIP_DB_IN_DEV = process.env.NODE_ENV === 'development' && process.env.SKIP_DB === 'true';

const PORT = process.env.BACKEND_PORT || 3000;

app.listen(PORT, async () => {
    console.log(`Express 서버가 포트 ${PORT}에서 실행 중입니다.`);
    
    // 개발 환경에서는 데이터베이스 연결 실패해도 서버 실행
    if (SKIP_DB_IN_DEV) {
        console.log('🔧 개발 환경: 데이터베이스 연결 없이 서버 실행');
        console.log('💡 MSW를 통해 API 모킹이 제공됩니다.');
    } else {
        const pgOk = await testPgConnection();
        const esOk = await testEsConnection();
        console.log(`PostgreSQL 연결: ${pgOk ? '성공' : '실패'}`);
        console.log(`Elasticsearch 연결: ${esOk ? '성공' : '실패'}`);
        
        // 데이터베이스 초기화
        if (pgOk) {
            try {
                await initializeDatabase();
                console.log('✅ 데이터베이스 초기화 완료');
            } catch (error) {
                console.error('❌ 데이터베이스 초기화 실패:', error);
            }
        }
    }
}); 