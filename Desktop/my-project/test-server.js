const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.get('/api/defects', (req, res) => {
  res.json([
    {
      id: 1,
      title: '테스트 결함 1',
      status: 'Open',
      severity: 'High',
      createdBy: 'tester1',
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 2,
      title: '테스트 결함 2',
      status: 'In Progress',
      severity: 'Medium',
      createdBy: 'tester2',
      createdAt: '2024-01-16T14:30:00Z'
    }
  ]);
});

app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
}); 