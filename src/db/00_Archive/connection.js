'use strict';

const mongoose = require('mongoose');
const config = require('../config/config');

mongoose.set('strictQuery', true);
mongoose.Promise = global.Promise;
const options = {useNewUrlParser: true, useUnifiedTopology: true }

const connectDB = () => {
  mongoose.connect(config.MONGO_URI, options)
    .then(() => console.log('MongoDB connected at: ' + config.MONGO_URI))
    .catch(err => {
      console.log(`error connecting to mongodb at: ` + config.MONGO_URI);
      console.log(err);
    });
}

module.exports = connectDB
