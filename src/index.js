"use strict";

const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const express = require('express');
dotenv.config();
const connectDB = require('./db/connection');

const dBaseSeed = require('./db/seeder');
const uploadRoute = require('./routers/upload.routes');
const userRoute = require('./routers/user.routes');
const productRoute = require('./routers/product.routes');
const orderRoute = require('./routers/order.routes');
const paypalRoute = require('./routers/paypal.routes');
const stripeRoute = require('./routers/stripe.routes');
// const log = require('console');

const app = express();
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:4200', 'http://localhost:4204', 'http://localhost:4000', 'http://localhost:4205'],
  })
);

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connectDB();

app.use('/seeder', dBaseSeed);
app.use('/api/uploads', uploadRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);
app.use('/api/paypal', paypalRoute);
app.use('/api/stripe', stripeRoute);

app.get('/', (req, res) =>
  res.send({message: 'Welcome to Mama Blog express server'})
);

app.use((err, req, res , next) => {
  res.status(500).send({ err_message: err.message });
  next();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
