import express from 'express';
import authRoutes from './routes/auth.route.js'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRoute from './routes/user.route.js';
import questionRoute from './routes/question.route.js';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import {registerSocketRoutes} from './socket/index.js'
import commentRoute from './routes/comment.route.js';

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ["GET", "POST"]
  }
});

app.set('io', io);

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth',authRoutes);
app.use("/api/users",userRoute);
app.use("/api/question", questionRoute)
app.use("/api/comment", commentRoute);


registerSocketRoutes(io);

export {app, server, io}