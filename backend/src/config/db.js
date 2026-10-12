import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('MONGODB_URI not found in environment. Database connection skipped.');
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      dbName: 'Kite',
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  }
};
