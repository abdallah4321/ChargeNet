import mongoose from 'mongoose';
import dotenv from 'dotenv';
import APIError from '../utils/apiError.js';

dotenv.config();

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new APIError('MONGODB_URI not set');

    await mongoose.connect(uri);

    console.log(' DB connected successfully');
  } catch (err) {
    console.log(err);
  }
};
