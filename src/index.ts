import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { connectDB } from './db/models/connection-'
import { userRouter } from './routers/user.routes';
import { orderRouter } from './routers/order.routes';
import { productRouter } from './routers/product.routes';
import { uploadRouter } from './routers/upload.routes';
import { log } from 'console';

dotenv.config();

const app = express();
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:4200'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connectDB()

app.use('/api/uploads', uploadRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.get('/api/config/paypal', (req: Request, res: Response) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID || 'sb' });
});

// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, './frontend/dist/frontend')));
/*
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, './frontend/dist/frontend/index.html'))
);
*/

app.get('/', (req, res) =>
  res.send({Message: 'Welcome to express ts server'})
);

app.use((err: Error, req: Request, res: Response, next: Function) => {
  res.status(500).send({ message: err.message });
});

const PORT: number = parseInt((process.env.PORT || '3000') as string, 10);
app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
