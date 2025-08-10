import express from 'express';
import authRoutes from './routes/auth.route.js'

const app = express();

app.use('/api/auth',authRoutes);

app.use(express.json())

export {app}