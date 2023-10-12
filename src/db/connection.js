const mongoose = require('mongoose');

const connectDB = () => {
  mongoose.set('strictQuery', true);
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/ts-backend';
  mongoose.connect(mongoUri)
    .then(() => {
      console.log(`connected to mongodb at: ` + mongoUri);
    })
    .catch((err) => {
      console.log(`error connecting to mongodb at: ` + mongoUri);
      console.error(err);
    });
}

module.exports = connectDB;
