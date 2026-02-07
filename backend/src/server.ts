import app from './app';
import connectDB from './config/db';
import { autoSeed } from './utils/autoSeeder';

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
    // Auto-seed data in development if DB is empty
    if (process.env.NODE_ENV !== 'production') {
        await autoSeed();
    }

    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
});
