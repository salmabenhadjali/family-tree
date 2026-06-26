import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import authRoutes from './routes/auth.routes';
import personRoutes from './routes/person.routes';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3030' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/people', personRoutes);

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3035;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
