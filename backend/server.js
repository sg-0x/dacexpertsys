import express from 'express';
import cors from 'cors';
import pool from './config/db.js';
import usersRoutes from './routes/users.routes.js';
import casesRoutes from './routes/cases.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.status(200).json({ now: result.rows[0].now });
  } catch (error) {
    console.error('Test route DB error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.use('/users', usersRoutes);
app.use('/cases', casesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/cases', casesRoutes);

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
