import app from './app/app';
import { testPgConnection } from './app/infrastructure/database/pgClient';
import { testEsConnection } from './app/infrastructure/elasticsearch/esClient';

const PORT = process.env.BACKEND_PORT || 3000;

app.listen(PORT, async () => {
    console.log(`Express 서버가 포트 ${PORT}에서 실행 중입니다.`);
    const pgOk = await testPgConnection();
    const esOk = await testEsConnection();
    console.log(`PostgreSQL 연결: ${pgOk ? '성공' : '실패'}`);
    console.log(`Elasticsearch 연결: ${esOk ? '성공' : '실패'}`);
}); 