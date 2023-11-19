import express from 'express';
import productRouter from './routes/product';
import categoryRouter from './routes/category';
import authRouter from './routes/auth';
import orderRouter from './routes/order';

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import thanhtoanRouter from './routes/thanhtoan'
// config
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Router
app.use('/api', productRouter);
app.use('/api', categoryRouter);
app.use('/api', authRouter);
app.use('/api', orderRouter);
app.use('/api',thanhtoanRouter)
// connect to db
mongoose.connect('mongodb://127.0.0.1:27017/thucap_onl');

export const viteNodeApp = app;
