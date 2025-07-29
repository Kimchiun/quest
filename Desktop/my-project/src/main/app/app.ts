import express from 'express';
import cors from 'cors';
import passport from './infrastructure/security/passport';
import authController from './domains/users/controllers/authController';
import testCaseController from './domains/testcases/controllers/testCaseController';
import releaseController from './domains/releases/controllers/releaseController';
import executionController from './domains/executions/controllers/executionController';
import integrationController from './domains/executions/controllers/integrationController';
import dashboardController from './controllers/dashboardController';
import commentController from './domains/comments/controllers/commentController';
import folderController from './domains/folders/controllers/folderController';
import { bulkMove, bulkCopy, bulkDelete, bulkUpdateStatus } from './controllers/bulkController';

const app = express();

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:4000', 'http://127.0.0.1:4000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(passport.initialize());

app.use('/api/auth', authController);
app.use('/api/testcases', testCaseController);
app.use('/api/releases', releaseController);
app.use('/api/executions', executionController);
app.use('/api/integrations', integrationController);
app.use('/api/dashboard', dashboardController);
app.use('/api/comments', commentController);
app.use('/api/folders', folderController);

// 일괄 작업 API 라우트
app.post('/api/bulk/move', bulkMove);
app.post('/api/bulk/copy', bulkCopy);
app.delete('/api/bulk', bulkDelete);
app.patch('/api/bulk/status', bulkUpdateStatus);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

export default app; 