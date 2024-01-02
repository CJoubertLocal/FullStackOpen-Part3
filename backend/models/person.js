const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;
console.log('connecting to database...');

mongoose.set('strictQuery', false);
mongoose
  .connect(url)
  .then(() => {
    console.log('connected');
  })
  .catch((error) => {
    console.log('failed to connect to database:', error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator(v) {
        return /^\d{2}-\d+$|^\d{3}-\d+$/.test(v);
      },
      message: () => 'Phone numbers should have the format xx-xxxxxxx or xxx-xxxxxx',
    },
  },
  auditNumber: {
    type: Number,
    required: true,
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
  // eslint-disable-next-line no-underscore-dangle, no-param-reassign
    returnedObject.id = returnedObject._id.toString();
    // eslint-disable-next-line no-underscore-dangle, no-param-reassign
    delete returnedObject._id;
    // eslint-disable-next-line no-underscore-dangle, no-param-reassign
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
