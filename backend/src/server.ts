import app from './app';
import connectDB from './config/db';
import { autoSeed } from './utils/autoSeeder';

const PORT = process.env.PORT || 5000;

(async () => {
    try {
        // Only connect to DB if MONGO_URI exists (mock-data safe)
        if (process.env.MONGO_URI) {
            await connectDB();

            // Auto-seed ONLY in development
            if (process.env.NODE_ENV !== 'production') {
                await autoSeed();
            }
        } else {
            console.log('⚠️ MONGO_URI not set. Running in mock-data mode.');
        }

        app.listen(PORT, () => {
            console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Server failed to start:', error);
        process.exit(1);
    }
})();
