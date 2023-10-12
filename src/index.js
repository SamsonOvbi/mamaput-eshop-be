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
const payRouter = require('./routers/pay.routes');
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
app.get('/api/pay', payRouter);

app.get('/', (req, res) =>
  res.send({Message: 'Welcome to express ts server'})
);

app.use((err, req, res , next) => {
  res.status(500).send({ message_i: err.message });
  next();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
