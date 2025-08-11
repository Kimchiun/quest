import express from 'express';
import cors from 'cors';
import passport from './infrastructure/security/passport';
import authController from './domains/users/controllers/authController';
import testCaseController from './domains/testcases/controllers/testCaseController';
import executionController from './domains/executions/controllers/executionController';
import treeController from './domains/tree/controllers/treeController';
import folderRoutes from './domains/folders/routes/folderRoutes';
// import bulkController from './domains/folders/controllers/bulkController';
import releaseRoutes from './domains/releases/routes/releaseRoutes';
import { errorHandler } from './utils/errorHandler';

const app = express();

// CORS 설정 - Electron 앱을 위한 구체적인 설정
app.use(cors({
  origin: ['http://localhost:4000', 'http://localhost:3000', 'file://'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport 초기화
app.use(passport.initialize());

// 라우터 설정
app.use('/api/auth', authController);
app.use('/api/testcases', testCaseController); // 테스트케이스 API 활성화
app.use('/api/executions', executionController);
app.use('/api/tree', treeController); // 새로운 트리 API
app.use('/api/folders', folderRoutes); // 폴더 API
// app.use('/api/bulk', bulkController); // 일괄 작업 API
app.use('/api/releases', releaseRoutes); // 릴리즈 관리 API

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