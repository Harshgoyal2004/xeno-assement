import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ingestRoutes from './routes/ingest';
import analyticsRoutes from './routes/analytics';
import authRoutes from './routes/auth';
import webhookRoutes from './routes/webhooks';
import eventRoutes from './routes/events';
import { startScheduler } from './services/scheduler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/ingest', ingestRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/events', eventRoutes);

app.get('/', (req, res) => {
    res.send('Xeno FDE Internship Assignment API');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    startScheduler();
});
