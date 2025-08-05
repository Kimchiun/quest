import express from 'express';
import cors from 'cors';
import passport from './infrastructure/security/passport';
import authController from './domains/users/controllers/authController';
import testCaseController from './domains/testcases/controllers/testCaseController';
import releaseController from './domains/releases/controllers/releaseController';
import executionController from './domains/executions/controllers/executionController';
import treeController from './domains/tree/controllers/treeController';
import folderController from './domains/folders/controllers/folderController';
import bulkController from './domains/folders/controllers/bulkController';
import { errorHandler } from './utils/errorHandler';

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport 초기화
app.use(passport.initialize());

// 라우터 설정
app.use('/api/auth', authController);
app.use('/api/testcases', testCaseController); // 테스트케이스 API 활성화
app.use('/api/releases', releaseController);
app.use('/api/executions', executionController);
app.use('/api/tree', treeController); // 새로운 트리 API
app.use('/api/folders', folderController); // 폴더 API
app.use('/api/bulk', bulkController); // 일괄 작업 API

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: 'Quest Desktop App API' });
});

// 헬스 체크 엔드포인트
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Quest Desktop App API is running'
  });
});

// 404 핸들러
app.use('*', (req, res) => {
  res.status(404).json({ message: '요청한 리소스를 찾을 수 없습니다.' });
});

// 에러 핸들러
app.use(errorHandler);

export default app; 