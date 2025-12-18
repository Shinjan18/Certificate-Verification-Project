const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use MongoDB Atlas connection string from environment variables
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error('MongoDB connection string not found in environment variables');
    }

    console.log('🔌 Connecting to MongoDB...');

    const options = {
      dbName: 'certificate_verification',
      serverSelectionTimeoutMS: 5000,
      // New MongoDB driver options
      maxPoolSize: 10,
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      }
    };

    const conn = await mongoose.connect(uri, options);

    console.log(`✅ MongoDB connected to: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);

    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('Connection string:', process.env.MONGO_URI ? 'Using MONGO_URI from .env' : 'No connection string found');
    throw error; // Re-throw to be caught by server.js
  }
};

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('ℹ️ MongoDB disconnected');
});

// Close the Mongoose connection when the Node process ends
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});

module.exports = connectDB;

