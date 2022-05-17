import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDatabase = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URl, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log('mongo connected');
  } catch (err) {
    console.log(`Err ${err.message}`);
    process.exit(1);
  }
};

export default connectDatabase;
