const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// 루트 경로 핸들러 추가
app.get('/', (req, res) => {
  res.json({ 
    message: 'ITMS Desktop API Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      test: '/api/test'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint working' });
});

app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
}); 