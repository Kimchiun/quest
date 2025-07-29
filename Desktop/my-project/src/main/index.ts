import app from './app/app';
import { testPgConnection } from './app/infrastructure/database/pgClient';
import { testEsConnection } from './app/infrastructure/elasticsearch/esClient';
import { initializeDatabase } from './app/infrastructure/database/initDatabase';

const PORT = process.env.BACKEND_PORT || 3000;

app.listen(PORT, async () => {
    console.log(`Express 서버가 포트 ${PORT}에서 실행 중입니다.`);
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
}); 