import { connect } from 'mongoose';
export default async () => {
  await connect(process.env.MONGO_URI || 'mongodb://localhost:27017/school', {
  });
  console.log('MongoDB connected');
};