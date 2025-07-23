import express from 'express';
import passport from './infrastructure/security/passport';
import authController from './domains/users/controllers/authController';
import testCaseController from './domains/testcases/controllers/testCaseController';
import releaseController from './domains/releases/controllers/releaseController';
import executionController from './domains/executions/controllers/executionController';

const app = express();

app.use(express.json());
app.use(passport.initialize());

app.use('/api/auth', authController);
app.use('/api/testcases', testCaseController);
app.use('/api/releases', releaseController);
app.use('/api/executions', executionController);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

export default app; 