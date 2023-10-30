const mongoose = require('mongoose');
const dotenv =  require('dotenv');

dotenv.config();
mongoose.set('strictQuery', true);
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/ts-backend';
mongoose.Promise = global.Promise;
const options = {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
  useUnifiedTopology: true
};
const connectDB = () => {
  mongoose.connect(mongoUri, options)
    .then(() => {
      console.log(`connected to mongodb at: ` + mongoUri);
    })
    .catch((err) => {
      console.log(`error connecting to mongodb at: ` + mongoUri);
      console.error(err);
    });
}

module.exports = connectDB;
