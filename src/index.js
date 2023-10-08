"use strict";

const cors = require('cors');
// const path = require('path');
const dotenv = require('dotenv');
const express = require('express');
const connectDB = require('./db/connection');
const userRouter = require('./routers/user.routes');
const orderRouter = require('./routers/order.routes');
const productRouter = require('./routers/product.routes');
const uploadRouter = require('./routers/upload.routes');
// const log = require('console');

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
app.get('/api/config/paypal', (req, res) => {
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

app.use((err, req, res , next) => {
  res.status(500).send({ message: err.message });
  next();
});

const PORT = parseInt((process.env.PORT || '3000'), 10);
app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
