import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config();

const connectDB = async () => {
    try {
        let dbUrl = process.env.MONGO_URI;

        if (!dbUrl || dbUrl.includes('localhost')) {
            console.log('Attemping to connect to local MongoDB...');
            try {
                // Try connecting to local MongoDB first
                const conn = await mongoose.connect(dbUrl || 'mongodb://127.0.0.1:27017/ecommerce', {
                    serverSelectionTimeoutMS: 2000,
                });
                console.log(`MongoDB Connected: ${conn.connection.host}`);
                return;
            } catch (err) {
                console.log('Local MongoDB not found. Starting MongoDB Memory Server for development...');
                const mongoServer = await MongoMemoryServer.create();
                dbUrl = mongoServer.getUri();
            }
        }

        const conn = await mongoose.connect(dbUrl);
        console.log(`MongoDB Connected (Memory/Cloud): ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        process.exit(1);
    }
};

export default connectDB;
