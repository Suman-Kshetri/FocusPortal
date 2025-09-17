import express from 'express';
import authRoutes from './routes/auth.route.js'
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth',authRoutes);

export {app}