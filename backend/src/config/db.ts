import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config();

const connectDB = async () => {
    try {
        const dbUrl = process.env.MONGO_URI;

        if (!dbUrl) {
            console.log('⚠️ MONGO_URI not found. Running in MOCK MODE (data will not persist).');
            return;
        }

        const conn = await mongoose.connect(dbUrl);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Database Connection Error: ${(error as Error).message}`);
        // In serverless environments, we let the app continue so controllers can handle mock data
    }
};

export default connectDB;
