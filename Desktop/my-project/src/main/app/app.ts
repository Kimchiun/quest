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

const app = express();

app.use(express.json());
app.use(cors());
app.use(passport.initialize());

app.use('/api/auth', authController);
app.use('/api/testcases', testCaseController);
app.use('/api/releases', releaseController);
app.use('/api/executions', executionController);
app.use('/api/integrations', integrationController);
app.use('/api/dashboard', dashboardController);
app.use('/api/comments', commentController);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

export default app; 