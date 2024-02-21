const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://sebasfads:ZXCasdqwe123@ecommerce.rvp0qsu.mongodb.net/ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB conectado');
  } catch (err) {
    console.error('MongoDB error de conexion:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
