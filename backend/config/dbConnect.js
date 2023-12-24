import mongoose from 'mongoose';

const dbConnect = () => {
  try {
    const conn = mongoose.connect(process.env.MONGODB_URI);
    console.log('database connected');
  } catch (error) {
    console.log('database error');
  }
};
export default dbConnect;
