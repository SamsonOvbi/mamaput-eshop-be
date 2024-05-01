"use strict";

const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const express = require('express');
dotenv.config();
const connectDB = require('./db/connection');
// const runDbConnect = require('./db/dbConnect');

const dBaseSeed = require('./db/seeder');
const uploadRoute = require('./routers/upload.routes');

const userRoute = require('./routers/user.routes');
const productRoute = require('./routers/product.routes');
const orderRoute = require('./routers/order.routes');
const paymentRoute = require('./routers/payment.routes');
const cartRoute = require('./routers/cart.routes');
const authRoute = require('./routers/auth.routes');
const mapRoute = require('./routers/map.routes');
const rateLimiter = require('./middleware/rateLimiter');
const helmet = require('helmet'); 
const morgan = require('morgan');

const app = express();

orderRoute.use(rateLimiter); // Apply rate limiter middleware
orderRoute.use(helmet());
// Use Morgan middleware for logging HTTP requests
orderRoute.use(morgan('combined'));
app.use(
  cors({
    credentials: true, 
    origin: [
      'http://localhost:4200', 'http://localhost:4204', 'http://localhost:4000', 
      'http://localhost:4205'
    ],
  })
);

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
 
connectDB();
// runDbConnect().catch(console.dir);

app.use('/api/seeder', dBaseSeed);
app.use('/api/uploads', uploadRoute);
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/carts', cartRoute);
app.use('/api/orders', orderRoute);
app.use('/api/payment', paymentRoute);
app.use('/api/config', mapRoute);

app.get('/', (req, res) =>
  res.send({ message: 'Welcome to Mama Blog express server' })
);
 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});

app.use((err, req, res, next) => {
  let message;
  console.error(err);
  if (process.env.NODE_ENV === 'production') {
    message = 'Internal Server Error';    
    console.log({ message: message })
    res.status(500).send({ message: message });
  } else {
    console.log({ message: err.message })
    res.status(500).send({ message: err.message });
  }
  next();
});